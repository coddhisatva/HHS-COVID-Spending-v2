import React from 'react';

const Header = () => {
  return (
    <header className="py-8">
      <div className="container-width">
        <h1 className="text-3xl font-bold mb-2">HHS COVID Spending Dashboard</h1>
        <p className="text-lg text-gray-600">
          Visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response
        </p>
      </div>
    </header>
  );
};

export default Header; 