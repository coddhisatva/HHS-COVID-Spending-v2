import React from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import SummaryMetrics from './components/SummaryMetrics';

export default function Home() {
  return (
    <main className="pb-12">
      <Header />
      <FilterPanel />
      <SummaryMetrics />
      
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Emergency Funding Distribution</h2>
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Chart visualization will be implemented in a future update</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
            <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-500">Map visualization will be implemented in a future update</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Top Recipients</h2>
          <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Bar chart will be implemented in a future update</p>
          </div>
        </div>
      </div>
    </main>
  );
}
