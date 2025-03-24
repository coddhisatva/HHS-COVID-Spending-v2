import Papa from 'papaparse';

/**
 * Loads and parses CSV data from contracts and financial assistance files
 * @returns {Object} Object containing parsed contracts and assistance data
 */
export async function loadData() {
  try {
    const contractsResponse = await fetch('/data/HHS_C__Breakdown_by_Award/FY2025P01-P04_All_FA_AccountBreakdownByAward_2025-03-23_H19M55S47131691/FY2025P01-P04_All_FA_Contracts_AccountBreakdownByAward_2025-03-23_H19M55S47_1.csv');
    const contractsData = await contractsResponse.text();
    
    const assistanceResponse = await fetch('/data/HHS_C__Breakdown_by_Award/FY2025P01-P04_All_FA_AccountBreakdownByAward_2025-03-23_H19M55S47131691/FY2025P01-P04_All_FA_Assistance_AccountBreakdownByAward_2025-03-23_H19M56S43_1.csv');
    const assistanceData = await assistanceResponse.text();
    
    // Parse the CSV data using Papa Parse
    const contracts = Papa.parse(contractsData, { 
      header: true, 
      dynamicTyping: true,
      skipEmptyLines: true 
    }).data;
    
    const assistance = Papa.parse(assistanceData, { 
      header: true, 
      dynamicTyping: true,
      skipEmptyLines: true 
    }).data;
    
    console.log(`Loaded ${contracts.length} contract records and ${assistance.length} assistance records`);
    
    return { contracts, assistance };
  } catch (error) {
    console.error("Error loading data:", error);
    return { contracts: [], assistance: [] };
  }
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
  // Handle allocation & deallocation amounts
  const allocations = filteredData.filter(item => 
    item.transaction_obligated_amount !== null && 
    item.transaction_obligated_amount > 0
  );
  
  const deallocations = filteredData.filter(item => 
    item.transaction_obligated_amount !== null && 
    item.transaction_obligated_amount < 0
  );
  
  const totalAllocations = allocations.reduce((sum, item) => 
    sum + item.transaction_obligated_amount, 0);
    
  const totalDeallocations = Math.abs(deallocations.reduce((sum, item) => 
    sum + item.transaction_obligated_amount, 0));
    
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
  // Group by emergency funding code
  const groupedData = {};
  
  filteredData.forEach(item => {
    if (item.transaction_obligated_amount === null || isNaN(item.transaction_obligated_amount)) 
      return;
      
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
  
  // Calculate the total for percentage calculations
  const total = Object.values(groupedData).reduce((sum, g) => sum + g.amount, 0) || 1; // Avoid div by zero
  
  // Convert to array for the pie chart
  return Object.keys(groupedData).map(key => ({
    code: key,
    name: groupedData[key].name,
    amount: groupedData[key].amount,
    count: groupedData[key].count,
    percentage: Math.round((groupedData[key].amount / total) * 100)
  }))
  .sort((a, b) => b.amount - a.amount); // Sort by amount descending
}

/**
 * Prepares data for the geographic distribution map
 * @param {Array} filteredData Filtered transaction data
 * @returns {Array} Data for the geographic distribution map
 */
export function prepareGeographicData(filteredData) {
  // Group by state
  const stateData = {};
  
  filteredData.forEach(item => {
    if (item.transaction_obligated_amount === null || isNaN(item.transaction_obligated_amount)) 
      return;
      
    const state = item.primary_place_of_performance_state || 'Unknown';
    if (!stateData[state]) {
      stateData[state] = { amount: 0, count: 0 };
    }
    
    // Use absolute value for map visualization
    stateData[state].amount += Math.abs(item.transaction_obligated_amount);
    stateData[state].count++;
  });
  
  // Convert to array for the map
  return Object.keys(stateData).map(state => ({
    state,
    amount: stateData[state].amount,
    count: stateData[state].count
  }));
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