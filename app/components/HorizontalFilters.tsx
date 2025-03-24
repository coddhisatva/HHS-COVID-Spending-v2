import React from 'react';

type HorizontalRadioFilterProps = {
  label: string;
  name: string;
  options: { id: string; label: string; value: string }[];
  defaultSelected?: string;
};

const HorizontalRadioFilter = ({ label, name, options, defaultSelected }: HorizontalRadioFilterProps) => {
  return (
    <div className="flex items-center space-x-1 mr-2">
      <span className="text-xs font-medium text-gray-700">{label}:</span>
      <div className="flex items-center space-x-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="radio"
              id={option.id}
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultSelected}
              className="h-3 w-3 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={option.id} className="ml-1 text-xs text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const HorizontalFilters = () => {
  const financialTypeOptions = [
    { id: 'all-activity', label: 'All Activity', value: 'all' },
    { id: 'allocations', label: 'Allocations', value: 'allocations' },
    { id: 'deallocations', label: 'Deallocations', value: 'deallocations' },
  ];

  const transactionTypeOptions = [
    { id: 'all-financial', label: 'All Financial', value: 'all' },
    { id: 'commitments', label: 'Commitments', value: 'commitments' },
    { id: 'payments', label: 'Payments', value: 'payments' },
  ];

  const dataSourceOptions = [
    { id: 'all-sources', label: 'All Sources', value: 'all' },
    { id: 'contracts', label: 'Contracts', value: 'contracts' },
    { id: 'financial-assistance', label: 'Financial Assistance', value: 'financial-assistance' },
  ];

  return (
    <div className="flex flex-wrap items-center text-sm border-r pr-3 mr-3">
      <HorizontalRadioFilter
        label="Financial Type"
        name="financial-type"
        options={financialTypeOptions}
        defaultSelected="all"
      />
      <span className="mx-1 text-gray-300">|</span>
      <HorizontalRadioFilter
        label="Transaction Type"
        name="transaction-type"
        options={transactionTypeOptions}
        defaultSelected="all"
      />
      <span className="mx-1 text-gray-300">|</span>
      <HorizontalRadioFilter
        label="Data Source"
        name="data-source"
        options={dataSourceOptions}
        defaultSelected="all"
      />
    </div>
  );
};

export default HorizontalFilters; 