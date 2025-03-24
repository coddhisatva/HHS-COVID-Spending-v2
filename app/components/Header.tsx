import React from 'react';
import HorizontalFilters from './HorizontalFilters';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 py-6 mb-6">
      <div className="container-width">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold mb-2">HHS COVID Spending Dashboard</h1>
            <p className="text-lg text-gray-600">
              Visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response
            </p>
          </div>
          <div className="mt-2">
            <HorizontalFilters />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 