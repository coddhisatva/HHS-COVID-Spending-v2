import Papa from 'papaparse';

/**
 * Loads and parses CSV data from contracts and financial assistance files
 * @returns {Object} Object containing parsed contracts and assistance data
 */
export async function loadData() {
  try {
    console.log("Starting to load CSV data...");
    
    const contractsUrl = '/data/HHS_C__Breakdown_by_Award/FY2025P01-P04_All_FA_AccountBreakdownByAward_2025-03-23_H19M55S47131691/FY2025P01-P04_All_FA_Contracts_AccountBreakdownByAward_2025-03-23_H19M55S47_1.csv';
    const assistanceUrl = '/data/HHS_C__Breakdown_by_Award/FY2025P01-P04_All_FA_AccountBreakdownByAward_2025-03-23_H19M55S47131691/FY2025P01-P04_All_FA_Assistance_AccountBreakdownByAward_2025-03-23_H19M56S43_1.csv';
    
    console.log("Attempting to fetch contracts data from:", contractsUrl);
    const contractsResponse = await fetch(contractsUrl);
    
    if (!contractsResponse.ok) {
      throw new Error(`Failed to fetch contracts data: ${contractsResponse.status} ${contractsResponse.statusText}`);
    }
    
    const contractsData = await contractsResponse.text();
    console.log("Contracts data fetched successfully, first 100 chars:", contractsData.substring(0, 100));
    
    console.log("Attempting to fetch assistance data from:", assistanceUrl);
    const assistanceResponse = await fetch(assistanceUrl);
    
    if (!assistanceResponse.ok) {
      throw new Error(`Failed to fetch assistance data: ${assistanceResponse.status} ${assistanceResponse.statusText}`);
    }
    
    const assistanceData = await assistanceResponse.text();
    console.log("Assistance data fetched successfully, first 100 chars:", assistanceData.substring(0, 100));
    
    // Parse the CSV data using Papa Parse
    console.log("Parsing contracts CSV data...");
    const contractsRaw = Papa.parse(contractsData, { 
      header: true, 
      dynamicTyping: true,
      skipEmptyLines: true 
    }).data;
    
    console.log("Parsing assistance CSV data...");
    const assistanceRaw = Papa.parse(assistanceData, { 
      header: true, 
      dynamicTyping: true,
      skipEmptyLines: true 
    }).data;
    
    console.log(`Loaded ${contractsRaw.length} raw contract records and ${assistanceRaw.length} raw assistance records`);
    
    // Log the available fields from the first record to help debug
    if (contractsRaw.length > 0) {
      console.log("Available fields in contracts data:", Object.keys(contractsRaw[0]));
    }
    
    if (assistanceRaw.length > 0) {
      console.log("Available fields in assistance data:", Object.keys(assistanceRaw[0]));
    }
    
    // Process and normalize the data from the real CSV format
    const contracts = processRawRecords(contractsRaw);
    const assistance = processRawRecords(assistanceRaw);
    
    console.log(`Processed ${contracts.length} contract records and ${assistance.length} assistance records`);
    console.log("Sample processed contract record:", contracts.length > 0 ? JSON.stringify(contracts[0]) : "No contracts");
    console.log("Sample processed assistance record:", assistance.length > 0 ? JSON.stringify(assistance[0]) : "No assistance");
    
    return { contracts, assistance };
  } catch (error) {
    console.error("Error loading data:", error);
    return { contracts: [], assistance: [] };
  }
}

/**
 * Process and normalize raw CSV records to the format expected by the application
 * @param {Array} rawRecords Raw records from CSV parsing
 * @returns {Array} Processed records with normalized field names
 */
function processRawRecords(rawRecords) {
  console.log("Processing raw records...");
  
  return rawRecords.map(record => {
    // Get state from either place of performance or recipient state
    let state = record.pop_state_code || 
                record.place_of_performance_state || 
                record.primary_place_of_performance_state ||
                record.recipient_state ||
                '';
                
    // If state is empty but exists in the original record's fields, try those
    if (!state && record.primary_place_of_performance_state_code) {
      state = record.primary_place_of_performance_state_code;
    }
    
    // Map fields from the real data to the expected format
    // Using optional chaining to safely access potentially undefined properties
    return {
      // Essential fields for our app functionality
      transaction_obligated_amount: parseFloat(record.transaction_obligated_amount) || 0,
      gross_outlay_amount_FYB_to_period_end: parseFloat(record.gross_outlay_amount_by_award_cpe) || 0,
      
      // Recipient information
      recipient_name: record.recipient_name || record.piid_recipient_name || record.fain_recipient_name || 'Unknown Recipient',
      
      // Geographic information
      primary_place_of_performance_state: state,
      
      // Emergency funding information
      disaster_emergency_fund_code: record.disaster_emergency_fund_code || record.defc || '',
      
      // Additional fields that might be useful
      award_id: record.award_id || record.piid || record.fain || '',
      awarding_agency_name: record.awarding_agency_name || record.funding_agency_name || '',
      program_activity_name: record.program_activity_name || '',
      
      // Store the original record for reference if needed
      _original: record
    };
  });
}

/**
 * Checks if a transaction is a commitment
 * @param {Object} item Transaction item
 * @returns {boolean} True if the item is a commitment
 */
export function isCommitment(item) {
  // A transaction is a commitment if it has a transaction_obligated_amount
  return item.transaction_obligated_amount !== null && 
         item.transaction_obligated_amount !== undefined &&
         !isNaN(item.transaction_obligated_amount);
}

/**
 * Checks if a transaction is a payment
 * @param {Object} item Transaction item
 * @returns {boolean} True if the item is a payment
 */
export function isPayment(item) {
  // A transaction is a payment if it has a gross_outlay_amount
  return item.gross_outlay_amount_FYB_to_period_end !== null && 
         item.gross_outlay_amount_FYB_to_period_end !== undefined &&
         !isNaN(item.gross_outlay_amount_FYB_to_period_end);
}

/**
 * Maps emergency fund codes to human-readable names
 * @param {string} code Emergency fund code
 * @returns {string} Human-readable emergency fund name
 */
export function getEmergencyFundName(code) {
  const fundNames = {
    'L': 'Coronavirus Preparedness Act',
    'M': 'Families First Coronavirus Response Act',
    'N': 'CARES Act',
    'O': 'Multiple COVID Acts',
    'P': 'Paycheck Protection Program and HCEA',
    'U': 'CAA 2021',
    'V': 'American Rescue Plan',
    'Other': 'Other Emergency Funding',
    '': 'No Emergency Funding'
  };
  return fundNames[code] || 'Unknown Fund';
}

/**
 * Filters data based on selected filters
 * @param {Array} data Array of transaction items
 * @param {Object} filters Object containing filter selections
 * @returns {Array} Filtered data
 */
export function filterData(data, filters) {
  return data.filter(item => {
    // Filter by financial type (positive vs negative transaction_obligated_amount)
    if (filters.financialType === 'allocations' && 
        (item.transaction_obligated_amount <= 0 || item.transaction_obligated_amount === null)) 
      return false;
      
    if (filters.financialType === 'deallocations' && 
        (item.transaction_obligated_amount >= 0 || item.transaction_obligated_amount === null)) 
      return false;
    
    // Filter by transaction type (commitments vs payments)
    if (filters.transactionType === 'commitments' && !isCommitment(item)) 
      return false;
      
    if (filters.transactionType === 'payments' && !isPayment(item)) 
      return false;
    
    // Filter by emergency funding
    if (filters.emergencyFunding.length > 0) {
      const code = item.disaster_emergency_fund_code || '';
      if (!filters.emergencyFunding.includes(code)) 
        return false;
    }
    
    // Filter by recipients
    if (filters.recipients.length > 0) {
      const recipient = item.recipient_name || '';
      if (!filters.recipients.includes(recipient)) 
        return false;
    }
    
    // Filter by geography
    if (filters.states.length > 0) {
      const state = item.primary_place_of_performance_state || '';
      if (!filters.states.includes(state)) 
        return false;
    }
    
    return true;
  });
}

/**
 * Prepares summary metrics data
 * @param {Array} filteredData Filtered transaction data
 * @returns {Object} Summary metrics
 */
export function prepareMetricsSummary(filteredData) {
  console.log("prepareMetricsSummary called with", filteredData.length, "records");
  
  // Check for negative values explicitly in the data
  const negativeRecords = filteredData.filter(item => 
    item.transaction_obligated_amount !== null &&
    item.transaction_obligated_amount < 0
  );
  
  console.log(`Found ${negativeRecords.length} records with negative transaction_obligated_amount values`);
  
  if (negativeRecords.length > 0) {
    // Log a few examples of negative values
    console.log("Examples of negative values:");
    negativeRecords.slice(0, 3).forEach((record, index) => {
      console.log(`  ${index + 1}. ${record.recipient_name || 'Unknown'}: ${record.transaction_obligated_amount}`);
    });
  }
  
  // Log a sample of transaction amounts to see what's in the data
  const sampleValues = filteredData.slice(0, 10).map(item => ({
    amount: item.transaction_obligated_amount,
    isNegative: item.transaction_obligated_amount < 0
  }));
  console.log("Sample transaction amounts:", sampleValues);
  
  // Handle allocation & deallocation amounts
  const allocations = filteredData.filter(item => 
    item.transaction_obligated_amount !== null && 
    item.transaction_obligated_amount > 0
  );
  
  const deallocations = filteredData.filter(item => 
    item.transaction_obligated_amount !== null && 
    item.transaction_obligated_amount < 0
  );
  
  console.log(`Found ${allocations.length} allocations and ${deallocations.length} deallocations`);
  
  const totalAllocations = allocations.reduce((sum, item) => 
    sum + item.transaction_obligated_amount, 0);
    
  const totalDeallocations = Math.abs(deallocations.reduce((sum, item) => 
    sum + item.transaction_obligated_amount, 0));
  
  console.log("Total allocations:", totalAllocations);
  console.log("Total deallocations:", totalDeallocations);
    
  const netChange = totalAllocations - totalDeallocations;
  
  // Handle the percentage calculation safely (avoid division by zero)
  let percentOfAllocations = 0;
  if (totalAllocations > 0) {
    percentOfAllocations = (netChange / totalAllocations * 100).toFixed(1);
  }
  
  // Calculate the total emergency funding 
  const emergencyFunding = filteredData
    .filter(item => item.disaster_emergency_fund_code && item.disaster_emergency_fund_code !== '')
    .reduce((sum, item) => sum + Math.abs(item.transaction_obligated_amount || 0), 0);
  
  return {
    totalAllocations,
    totalDeallocations,
    netChange,
    percentOfAllocations,
    emergencyFunding,
    allocationCount: allocations.length,
    deallocationCount: deallocations.length,
    totalCount: filteredData.length
  };
}

/**
 * Prepares data for the emergency funding pie chart
 * @param {Array} filteredData Filtered transaction data
 * @returns {Array} Data for the emergency funding distribution chart
 */
export function prepareEmergencyFundingData(filteredData) {
  console.log("prepareEmergencyFundingData called with", filteredData.length, "records");
  
  // Log the disaster_emergency_fund_code values that exist in the data
  const codes = new Set();
  filteredData.forEach(item => {
    if (item.disaster_emergency_fund_code) {
      codes.add(item.disaster_emergency_fund_code);
    }
  });
  console.log("Emergency funding codes found in data:", Array.from(codes));
  
  // Group by emergency funding code
  const groupedData = {};
  
  // Process items with valid transaction amounts
  filteredData.forEach(item => {
    if (item.transaction_obligated_amount === null || isNaN(item.transaction_obligated_amount)) {
      return;
    }
      
    const code = item.disaster_emergency_fund_code || 'None';
    if (!groupedData[code]) {
      groupedData[code] = {
        amount: 0,
        count: 0,
        name: getEmergencyFundName(code)
      };
    }
    
    // Use absolute value for pie chart visualization
    groupedData[code].amount += Math.abs(item.transaction_obligated_amount);
    groupedData[code].count++;
  });
  
  console.log("Grouped emergency funding data:", groupedData);
  
  // If no data was grouped (e.g., all transaction amounts were null), 
  // create a default entry for 'None'
  if (Object.keys(groupedData).length === 0) {
    console.log("No valid emergency funding data found, creating default entry");
    groupedData['None'] = {
      amount: 0,
      count: 0,
      name: 'No Emergency Funding'
    };
  }
  
  // Calculate the total for percentage calculations
  const total = Object.values(groupedData).reduce((sum, g) => sum + g.amount, 0) || 1; // Avoid div by zero
  
  // Convert to array for the pie chart
  const result = Object.keys(groupedData).map(key => ({
    code: key,
    name: groupedData[key].name,
    amount: groupedData[key].amount,
    count: groupedData[key].count,
    percentage: Math.round((groupedData[key].amount / total) * 100)
  }))
  .sort((a, b) => b.amount - a.amount); // Sort by amount descending
  
  // Ensure percentages add up to 100%
  let totalPercentage = result.reduce((sum, item) => sum + item.percentage, 0);
  if (totalPercentage !== 100 && result.length > 0) {
    // Add or subtract the difference from the largest item
    result[0].percentage += (100 - totalPercentage);
  }
  
  console.log("Final emergency funding chart data:", result);
  return result;
}

/**
 * Prepares data for the geographic distribution map
 * @param {Array} filteredData Filtered transaction data
 * @returns {Array} Data for the geographic distribution map
 */
export function prepareGeographicData(filteredData) {
  console.log("prepareGeographicData: Starting with", filteredData.length, "records");
  console.log("prepareGeographicData: Sample record:", filteredData[0]);
  
  // Group by state
  const stateData = {};
  
  // Map state codes to full names
  const stateNames = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia', 'PR': 'Puerto Rico', 'VI': 'Virgin Islands', 'GU': 'Guam',
    'AS': 'American Samoa', 'MP': 'Northern Mariana Islands', 'UM': 'U.S. Minor Outlying Islands'
  };

  // Create reverse mapping for full names to codes
  const stateNameToCode = {};
  Object.entries(stateNames).forEach(([code, name]) => {
    stateNameToCode[name.toUpperCase()] = code;
  });
  
  let skippedRecords = 0;
  
  filteredData.forEach(item => {
    if (item.transaction_obligated_amount === null || isNaN(item.transaction_obligated_amount)) {
      skippedRecords++;
      return;
    }
      
    let state = item.primary_place_of_performance_state || 'Unknown';
    
    // Convert state name to proper format
    if (state.length === 2) {
      // If it's a state code, convert to full name
      state = stateNames[state] || state;
    } else {
      // If it's a full name, make sure it matches the TopoJSON format
      const stateCode = stateNameToCode[state.toUpperCase()];
      if (stateCode) {
        state = stateNames[stateCode];
      }
    }

    if (!stateData[state]) {
      stateData[state] = { 
        amount: 0, 
        count: 0,
        stateName: state,
        stateCode: stateNameToCode[state.toUpperCase()] || state
      };
    }
    
    // Use absolute value for map visualization
    stateData[state].amount += Math.abs(item.transaction_obligated_amount);
    stateData[state].count++;
  });
  
  console.log("prepareGeographicData: Skipped", skippedRecords, "records with invalid amounts");
  console.log("prepareGeographicData: State data:", stateData);
  
  // Convert to array for the map
  const result = Object.keys(stateData).map(state => ({
    state: stateData[state].stateCode,
    stateName: state,
    amount: stateData[state].amount,
    count: stateData[state].count
  }));
  
  console.log("prepareGeographicData: Final result:", result);
  return result;
}

/**
 * Prepares data for the top recipients bar chart
 * @param {Array} filteredData Filtered transaction data
 * @returns {Array} Data for the top recipients bar chart
 */
export function prepareTopRecipientsData(filteredData) {
  // Group by recipient
  const recipientData = {};
  
  filteredData.forEach(item => {
    if (item.transaction_obligated_amount === null || isNaN(item.transaction_obligated_amount)) 
      return;
      
    const recipient = item.recipient_name || 'Unknown';
    if (!recipientData[recipient]) {
      recipientData[recipient] = { amount: 0, count: 0 };
    }
    
    // Use absolute value for bar chart visualization
    recipientData[recipient].amount += Math.abs(item.transaction_obligated_amount);
    recipientData[recipient].count++;
  });
  
  // Convert to array, sort by amount, and take top 8
  return Object.keys(recipientData)
    .map(name => ({
      name,
      amount: recipientData[name].amount,
      count: recipientData[name].count
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
} 