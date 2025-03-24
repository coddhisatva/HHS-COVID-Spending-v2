import React from 'react';

type RadioFilterProps = {
  title: string;
  name: string;
  options: { id: string; label: string; value: string }[];
  defaultSelected?: string;
};

type CheckboxFilterProps = {
  title: string;
  name: string;
  options: { id: string; label: string; value: string }[];
};

const RadioFilterGroup = ({ title, name, options, defaultSelected }: RadioFilterProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm mb-2">{title}</h3>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="radio"
              id={option.id}
              name={name}
              value={option.value}
              defaultChecked={option.value === defaultSelected}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckboxFilterGroup = ({ title, name, options }: CheckboxFilterProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium text-sm mb-2">{title}</h3>
      <div className="space-y-1">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              type="checkbox"
              id={option.id}
              name={name}
              value={option.value}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const FilterPanel = () => {
  const financialTypeOptions = [
    { id: 'all-activity', label: 'All Activity', value: 'all' },
    { id: 'allocations', label: 'Allocations (Money Out)', value: 'allocations' },
    { id: 'deallocations', label: 'Deallocations (Money Back)', value: 'deallocations' },
  ];

  const transactionTypeOptions = [
    { id: 'all-financial', label: 'All Financial Activity', value: 'all' },
    { id: 'commitments', label: 'Commitments Only', value: 'commitments' },
    { id: 'payments', label: 'Payments Only', value: 'payments' },
  ];

  const dataSourceOptions = [
    { id: 'all-sources', label: 'All Data Sources', value: 'all' },
    { id: 'contracts', label: 'Contracts', value: 'contracts' },
    { id: 'financial-assistance', label: 'Financial Assistance', value: 'financial-assistance' },
  ];

  const emergencyFundingOptions = [
    { id: 'cares-act', label: 'CARES Act', value: 'cares-act' },
    { id: 'american-rescue-plan', label: 'American Rescue Plan', value: 'american-rescue-plan' },
    { id: 'covid-19-supplemental', label: 'COVID-19 Supplemental', value: 'covid-19-supplemental' },
    { id: 'paycheck-protection', label: 'Paycheck Protection Program', value: 'paycheck-protection' },
    { id: 'families-first', label: 'Families First Coronavirus Response Act', value: 'families-first' },
    { id: 'other-emergency', label: 'Other Emergency Funding', value: 'other-emergency' },
    { id: 'no-emergency', label: 'No Emergency Funding', value: 'no-emergency' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="container-width">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <RadioFilterGroup
              title="Financial Type"
              name="financial-type"
              options={financialTypeOptions}
              defaultSelected="all"
            />
          </div>
          <div>
            <RadioFilterGroup
              title="Transaction Type"
              name="transaction-type"
              options={transactionTypeOptions}
              defaultSelected="all"
            />
          </div>
          <div>
            <RadioFilterGroup
              title="Data Source"
              name="data-source"
              options={dataSourceOptions}
              defaultSelected="all"
            />
          </div>
          <div>
            <CheckboxFilterGroup
              title="Emergency Funding"
              name="emergency-funding"
              options={emergencyFundingOptions}
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-6 space-x-4">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded border border-gray-300">
            Clear All Filters
          </button>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 