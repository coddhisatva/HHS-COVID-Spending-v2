'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadData, filterData, prepareMetricsSummary, prepareEmergencyFundingData, prepareGeographicData, prepareTopRecipientsData } from '../utils/dataProcessor';

// Create the context
const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Default filter state
const defaultFilters = {
  financialType: 'all', // 'all', 'allocations', 'deallocations'
  transactionType: 'all', // 'all', 'commitments', 'payments'
  dataSource: 'all', // 'all', 'contracts', 'financial-assistance'
  emergencyFunding: [], // Array of emergency funding codes
  recipients: [], // Array of recipient names
  states: [], // Array of state codes
};

// Provider component
export const DataProvider = ({ children }) => {
  // State for raw data
  const [rawData, setRawData] = useState({ contracts: [], assistance: [] });
  
  // State for filters
  const [filters, setFilters] = useState(defaultFilters);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState(true);
  
  // State for error
  const [error, setError] = useState(null);
  
  // State for processed data
  const [data, setData] = useState({
    filteredData: [],
    metrics: {},
    emergencyFunding: [],
    geographic: [],
    topRecipients: []
  });

  // Load data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("DataContext: Starting to fetch data...");
        setIsLoading(true);
        const data = await loadData();
        console.log("DataContext: Data loaded successfully:", {
          contractsLength: data.contracts.length,
          assistanceLength: data.assistance.length
        });
        setRawData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('DataContext: Error loading data:', err);
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data when raw data or filters change
  useEffect(() => {
    if (isLoading) {
      console.log("DataContext: Still loading, skipping data processing...");
      return;
    }
    
    if (rawData.contracts.length === 0 && rawData.assistance.length === 0) {
      console.log("DataContext: No data available, skipping data processing...");
      return;
    }

    try {
      console.log("DataContext: Processing data with filters:", filters);
      console.log("DataContext: Raw data status:", {
        contractsLength: rawData.contracts.length,
        assistanceLength: rawData.assistance.length
      });
      
      // Combine contracts and assistance data
      const allData = [...rawData.contracts, ...rawData.assistance];
      
      // Filter data based on data source filter
      let sourceData;
      if (filters.dataSource === 'contracts') {
        sourceData = rawData.contracts;
      } else if (filters.dataSource === 'financial-assistance') {
        sourceData = rawData.assistance;
      } else {
        sourceData = allData;
      }
      
      console.log("DataContext: Selected data source length:", sourceData.length);
      
      // Apply all other filters
      const filtered = filterData(sourceData, filters);
      console.log("DataContext: After filtering, data length:", filtered.length);
      
      // Create a safe wrapper for data processing functions
      const safeProcess = (processFn, defaultValue, label) => {
        try {
          const result = processFn(filtered);
          console.log(`DataContext: ${label} processed successfully:`, result);
          return result;
        } catch (err) {
          console.error(`DataContext: Error processing ${label}:`, err);
          return defaultValue;
        }
      };
      
      // Prepare data for different visualizations using safe processing
      const metrics = safeProcess(prepareMetricsSummary, {}, "Metrics summary");
      const emergencyFunding = safeProcess(prepareEmergencyFundingData, [], "Emergency funding data");
      const geographic = safeProcess(prepareGeographicData, [], "Geographic data");
      const topRecipients = safeProcess(prepareTopRecipientsData, [], "Top recipients data");
      
      // Update state with processed data
      console.log("DataContext: Setting processed data...");
      setData({
        filteredData: filtered,
        metrics,
        emergencyFunding,
        geographic,
        topRecipients
      });
    } catch (err) {
      console.error('DataContext: Error processing data:', err);
      setError('Error processing data.');
    }
  }, [rawData, filters, isLoading]);

  // Function to update filters
  const updateFilters = (newFilters) => {
    console.log("DataContext: Updating filters:", newFilters);
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Function to reset all filters
  const resetFilters = () => {
    console.log("DataContext: Resetting filters to default");
    setFilters(defaultFilters);
  };

  // Provide the context value
  const value = {
    rawData,
    data,
    filters,
    updateFilters,
    resetFilters,
    isLoading,
    error
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext; 