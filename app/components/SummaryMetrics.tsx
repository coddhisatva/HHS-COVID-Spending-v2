import React from 'react';

type MetricCardProps = {
  title: string;
  value: string;
  description: string;
  isNegative?: boolean;
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
  // Hardcoded values for now
  const metrics = [
    {
      id: 'total-allocations',
      title: 'Total Allocations',
      value: '$173,047,914,677',
      description: 'Total COVID-19 funding allocated',
      isNegative: false,
    },
    {
      id: 'total-deallocations',
      title: 'Total Deallocations',
      value: '$3,235,800,720',
      description: 'Total COVID-19 funding deallocated',
      isNegative: true,
    },
    {
      id: 'net-funding',
      title: 'Net Funding',
      value: '$169,812,113,957',
      description: '98.1% of allocations',
      isNegative: false,
    },
    {
      id: 'emergency-funding',
      title: 'Emergency Funding',
      value: '$140,000,000,000',
      description: 'COVID-19 emergency response funding',
      isNegative: false,
    },
  ];

  return (
    <div className="mb-8">
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
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