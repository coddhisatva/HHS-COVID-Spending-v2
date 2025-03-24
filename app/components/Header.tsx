import React from 'react';

type SegmentedButtonProps = {
  options: { value: string; label: string }[];
  activeValue?: string;
  name: string;
}

const SegmentedButton = ({ options, activeValue, name }: SegmentedButtonProps) => {
  return (
    <div className="inline-flex rounded-md shadow-sm">
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium 
          ${index === 0 ? 'rounded-l-md' : ''}
          ${index === options.length - 1 ? 'rounded-r-md' : ''}
          ${option.value === activeValue 
            ? 'bg-blue-500 text-white z-10' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
          }
          ${index !== 0 ? '-ml-px' : ''}
          border border-gray-300
          focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const Header = () => {
  const dataSourceOptions = [
    { value: 'contracts', label: 'Contracts' },
    { value: 'financial-assistance', label: 'Financial Assistance' },
    { value: 'combined', label: 'Combined' },
  ];

  const transactionTypeOptions = [
    { value: 'allocations', label: 'Allocations' },
    { value: 'deallocations', label: 'Deallocations' },
    { value: 'all', label: 'All' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="px-4 max-w-full mx-auto">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex-shrink-0 mr-4">
            <h1 className="text-2xl font-bold">HHS COVID Spending Dashboard 2025</h1>
            <p className="text-sm text-gray-600 hidden md:block">
              Visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response in 2025
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 mt-3 md:mt-0">
            <div className="flex flex-wrap gap-3">
              <SegmentedButton 
                options={dataSourceOptions} 
                activeValue="contracts" 
                name="data-source-segment" 
              />
              
              <SegmentedButton 
                options={transactionTypeOptions} 
                activeValue="allocations" 
                name="transaction-type-segment" 
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 