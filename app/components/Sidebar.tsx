import React from 'react';

type CheckboxFilterProps = {
  title: string;
  name: string;
  options: { id: string; label: string; value: string }[];
};

const CheckboxFilterGroup = ({ title, name, options }: CheckboxFilterProps) => {
  return (
    <div className="mb-6">
      <h3 className="font-medium text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2">
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

const Sidebar = () => {
  const emergencyFundingOptions = [
    { id: 'cares-act', label: 'CARES Act', value: 'cares-act' },
    { id: 'american-rescue-plan', label: 'American Rescue Plan', value: 'american-rescue-plan' },
    { id: 'covid-19-supplemental', label: 'COVID-19 Supplemental', value: 'covid-19-supplemental' },
    { id: 'paycheck-protection', label: 'Paycheck Protection Program', value: 'paycheck-protection' },
    { id: 'families-first', label: 'Families First Coronavirus Response Act', value: 'families-first' },
    { id: 'other-emergency', label: 'Other Emergency Funding', value: 'other-emergency' },
    { id: 'no-emergency', label: 'No Emergency Funding', value: 'no-emergency' },
  ];

  const topRecipientsOptions = [
    { id: 'genentech', label: 'Genentech USA, Inc', value: 'genentech' },
    { id: 'mckesson', label: 'McKesson Corporation', value: 'mckesson' },
    { id: 'loyal-source', label: 'Loyal Source Govt Services', value: 'loyal-source' },
    { id: 'optumserve', label: 'OptumServe Tech Services', value: 'optumserve' },
    { id: 'moderna', label: 'Moderna US, Inc', value: 'moderna' },
  ];

  const geographyOptions = [
    { id: 'california', label: 'California', value: 'CA' },
    { id: 'new-york', label: 'New York', value: 'NY' },
    { id: 'texas', label: 'Texas', value: 'TX' },
    { id: 'florida', label: 'Florida', value: 'FL' },
    { id: 'illinois', label: 'Illinois', value: 'IL' },
    { id: 'show-more', label: 'Show More States...', value: 'show-more' },
  ];

  return (
    <aside className="w-full md:w-1/5 bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      <CheckboxFilterGroup
        title="Emergency Funding"
        name="emergency-funding"
        options={emergencyFundingOptions}
      />
      
      <CheckboxFilterGroup
        title="Top Recipients"
        name="top-recipients"
        options={topRecipientsOptions}
      />
      
      <CheckboxFilterGroup
        title="Geography"
        name="geography"
        options={geographyOptions}
      />
      
      <button className="w-full py-2 mt-4 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
        Clear All Filters
      </button>
    </aside>
  );
};

export default Sidebar; 