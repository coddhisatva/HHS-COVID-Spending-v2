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
        setIsLoading(true);
        const data = await loadData();
        setRawData(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        setIsLoading(false);
        console.error('Error loading data:', err);
      }
    };

    fetchData();
  }, []);

  // Process data when raw data or filters change
  useEffect(() => {
    if (isLoading || rawData.contracts.length === 0) return;

    try {
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
      
      // Apply all other filters
      const filtered = filterData(sourceData, filters);
      
      // Prepare data for different visualizations
      const metrics = prepareMetricsSummary(filtered);
      const emergencyFunding = prepareEmergencyFundingData(filtered);
      const geographic = prepareGeographicData(filtered);
      const topRecipients = prepareTopRecipientsData(filtered);
      
      // Update state with processed data
      setData({
        filteredData: filtered,
        metrics,
        emergencyFunding,
        geographic,
        topRecipients
      });
    } catch (err) {
      setError('Error processing data.');
      console.error('Error processing data:', err);
    }
  }, [rawData, filters, isLoading]);

  // Function to update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Function to reset all filters
  const resetFilters = () => {
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