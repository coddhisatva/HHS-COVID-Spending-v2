import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryMetrics from './components/SummaryMetrics';

export default function Home() {
  return (
    <main className="pb-12">
      <Header />
      
      <div className="container-width">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <Sidebar />
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Summary Metrics */}
            <SummaryMetrics />
            
            {/* Visualizations */}
            <div className="grid grid-cols-1 gap-8 mb-8">
              {/* Emergency Funding Visualization */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Emergency Funding Distribution</h2>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Chart visualization will be implemented in a future update</p>
                </div>
              </div>
              
              {/* Geographic Distribution Visualization */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Geographic Distribution</h2>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Map visualization will be implemented in a future update</p>
                </div>
              </div>
              
              {/* Top Recipients Visualization */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Top Recipients</h2>
                <div className="h-80 flex items-center justify-center bg-gray-100 rounded">
                  <p className="text-gray-500">Bar chart will be implemented in a future update</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
