'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';

// Mock data for static rendering
const mockData = [
  { name: 'CARES Act', percentage: 45, fill: '#4285F4' },
  { name: 'American Rescue Plan', percentage: 23, fill: '#5E35B1' },
  { name: 'PPP and HCEA', percentage: 15, fill: '#3949AB' },
  { name: 'CAA 2021', percentage: 12, fill: '#039BE5' },
  { name: 'Coronavirus Prep Act', percentage: 5, fill: '#00ACC1' }
];

// More varied color palette
const COLORS = [
  '#4285F4', // Blue
  '#EA4335', // Red
  '#FBBC05', // Yellow
  '#34A853', // Green
  '#8E24AA', // Purple
  '#F6BF26', // Gold
  '#16A2D7', // Light blue
  '#FF6D00', // Orange
  '#795548', // Brown
  '#607D8B'  // Blue gray
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

// Simple static PieChart component with hover effects
const SimplePieChart = ({ data }) => {
  // Set the dimensions for the pie chart
  const size = 240;
  const center = size / 2;
  const radius = size * 0.4;
  
  const [hoveredSlice, setHoveredSlice] = useState(null);

  // Calculate the paths for the pie slices
  let startAngle = 0;
  const slices = data.map((item, index) => {
    const angle = (item.percentage / 100) * 360;
    const endAngle = startAngle + angle;
    
    // Convert angles to radians for calculations
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    // Calculate the arc path
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    
    // Determine if the arc is more than 180 degrees
    const largeArcFlag = angle > 180 ? 1 : 0;
    
    // Create the SVG path
    const pathData = `
      M ${center} ${center}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    // Calculate position for the label
    const labelRad = (startAngle + angle / 2 - 90) * Math.PI / 180;
    const labelDistance = radius * 0.7;
    const labelX = center + labelDistance * Math.cos(labelRad);
    const labelY = center + labelDistance * Math.sin(labelRad);
    
    // Save the current end angle as the next start angle
    startAngle = endAngle;
    
    return {
      path: pathData,
      fill: item.fill,
      name: item.name,
      percentage: item.percentage,
      amount: item.amount,
      count: item.count,
      labelX,
      labelY,
      midAngle: startAngle - (angle / 2)
    };
  });

  // Tooltip position and content
  const [tooltipStyle, setTooltipStyle] = useState({
    display: 'none',
    left: 0,
    top: 0
  });
  const [tooltipContent, setTooltipContent] = useState({
    name: '',
    percentage: 0,
    amount: 0,
    count: 0
  });

  // Handle mouse over slice
  const handleMouseOver = (slice, event) => {
    setHoveredSlice(slice);
    
    // Set tooltip content
    setTooltipContent({
      name: slice.name,
      percentage: slice.percentage,
      amount: slice.amount,
      count: slice.count
    });
    
    // Position tooltip near the mouse
    const bounds = event.currentTarget.getBoundingClientRect();
    setTooltipStyle({
      display: 'block',
      left: event.clientX - bounds.left + 10, 
      top: event.clientY - bounds.top + 10
    });
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    setHoveredSlice(null);
    setTooltipStyle({...tooltipStyle, display: 'none'});
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-between w-full relative">
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="relative"
      >
        {slices.map((slice, index) => (
          <path 
            key={index} 
            d={slice.path} 
            fill={slice.fill} 
            stroke="white" 
            strokeWidth="1"
            onMouseOver={(e) => handleMouseOver(slice, e)}
            onMouseMove={(e) => {
              const bounds = e.currentTarget.getBoundingClientRect();
              setTooltipStyle({
                display: 'block',
                left: e.clientX - bounds.left + 20,
                top: e.clientY - bounds.top
              });
            }}
            onMouseLeave={handleMouseLeave}
            style={{ 
              transition: 'transform 0.2s',
              transform: hoveredSlice === slice ? 'scale(1.05)' : 'scale(1)',
              transformOrigin: `${center}px ${center}px`,
              cursor: 'pointer'
            }}
          />
        ))}
        {slices.map((slice, index) => (
          <text 
            key={`label-${index}`} 
            x={slice.labelX} 
            y={slice.labelY} 
            textAnchor="middle" 
            dominantBaseline="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
            pointerEvents="none"
          >
            {slice.percentage}%
          </text>
        ))}
      </svg>
      
      {/* Tooltip */}
      {tooltipStyle.display === 'block' && (
        <div 
          className="absolute bg-white p-2 rounded shadow-md border border-gray-200 z-10 text-sm"
          style={{
            left: `${tooltipStyle.left}px`,
            top: `${tooltipStyle.top}px`,
            minWidth: '150px'
          }}
        >
          <div className="font-medium">{tooltipContent.name}</div>
          <div>Percentage: {tooltipContent.percentage}%</div>
          {tooltipContent.amount && (
            <div>Amount: {formatCurrency(tooltipContent.amount)}</div>
          )}
          {tooltipContent.count && (
            <div>Transactions: {tooltipContent.count.toLocaleString()}</div>
          )}
        </div>
      )}
      
      <div className="mt-4 md:mt-0 md:ml-6">
        <ul className="list-none pl-0">
          {data.map((item, index) => (
            <li 
              key={index} 
              className="flex items-center mb-2"
              onMouseOver={() => {
                // Find the corresponding slice
                const slice = slices[index];
                setHoveredSlice(slice);
              }}
              onMouseLeave={() => setHoveredSlice(null)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="w-4 h-4 mr-2" 
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-sm">
                {item.name} ({item.percentage}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const EmergencyFundingChart = () => {
  const { data, isLoading, error } = useData();
  const [chartData, setChartData] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [dataError, setDataError] = useState(null);
  
  useEffect(() => {
    setIsMounted(true);
    
    // Debug data loading
    console.log("Data context:", data);
    
    if (data && data.emergencyFunding && data.emergencyFunding.length > 0) {
      console.log("Emergency funding data:", data.emergencyFunding);
      
      // Process the data for our simple chart
      const processedData = data.emergencyFunding.map((item, index) => ({
        name: item.name,
        percentage: item.percentage || 0,
        fill: COLORS[index % COLORS.length],
        amount: item.amount,
        count: item.count
      }));
      setChartData(processedData);
    } else if (data && (!data.emergencyFunding || data.emergencyFunding.length === 0)) {
      setDataError("No emergency funding data available from the API");
    }
  }, [data]);
  
  // Handle loading state
  if (isLoading || !isMounted) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 h-full">
        <h2 className="text-lg font-semibold mb-3">Emergency Funding Distribution</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-gray-200 h-32 w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-24 mb-2.5"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error || dataError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-5 h-full">
        <h2 className="text-lg font-semibold mb-3">Emergency Funding Distribution</h2>
        <div className="h-64 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>Error loading emergency funding data</p>
            <p className="text-sm">{error || dataError}</p>
          </div>
        </div>
      </div>
    );
  }

  // Handle empty data state - show mockup data instead of empty state
  const displayData = chartData.length > 0 ? chartData : mockData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length]
  }));
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-full">
      <h2 className="text-lg font-semibold mb-4">Emergency Funding Distribution</h2>
      <div className="flex justify-center items-center h-64 relative">
        <SimplePieChart data={displayData} />
      </div>
      {chartData.length === 0 && (
        <div className="text-xs text-gray-500 text-center mt-2">
          (Showing mock data until real data loads)
        </div>
      )}
    </div>
  );
};

export default EmergencyFundingChart; 