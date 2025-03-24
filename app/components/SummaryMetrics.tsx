'use client';

import React from 'react';
import { useData } from '../contexts/DataContext';

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  isNegative?: boolean;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(amount);
};

const MetricCard = ({ title, value, description, isNegative = false }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <h3 className="text-lg font-medium text-gray-600 mb-1">{title}</h3>
      <p className={`text-2xl font-bold mb-1 ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
        {value}
      </p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
};

const SummaryMetrics = () => {
  const { data, isLoading, error } = useData();
  
  if (isLoading) {
    return (
      <div className="mb-8">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="metric-card animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8">
        <div className="container-width">
          <div className="p-4 text-red-700 bg-red-100 rounded-md">
            Error loading metrics: {error}
          </div>
        </div>
      </div>
    );
  }

  const { metrics } = data;
  
  // Create metrics array from the data
  const metricsArray = [
    {
      id: 'total-allocations',
      title: 'Total Allocations',
      value: formatCurrency(metrics.totalAllocations || 0),
      description: `${metrics.allocationCount || 0} transactions`,
      isNegative: false,
    },
    {
      id: 'total-deallocations',
      title: 'Total Deallocations',
      value: formatCurrency(metrics.totalDeallocations || 0),
      description: `${metrics.deallocationCount || 0} transactions`,
      isNegative: true,
    },
    {
      id: 'net-change',
      title: 'Net Change',
      value: formatCurrency(metrics.netChange || 0),
      description: `${metrics.totalCount || 0} total transactions`,
      isNegative: metrics.netChange < 0,
    }
  ];

  return (
    <div className="mb-8">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsArray.map((metric) => (
            <MetricCard
              key={metric.id}
              title={metric.title}
              value={metric.value}
              description={metric.description}
              isNegative={metric.isNegative}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SummaryMetrics; 