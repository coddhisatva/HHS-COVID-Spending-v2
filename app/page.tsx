import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryMetrics from './components/SummaryMetrics';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="px-4 py-4 max-w-full mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar - 20% width */}
          <div className="w-full md:w-1/5 flex-shrink-0">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-gray-600 text-sm mb-2">Total Allocations</h3>
                <p className="text-2xl font-bold text-green-500">$548,645,361</p>
                <p className="text-sm text-gray-500">200 transactions</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-gray-600 text-sm mb-2">Total Deallocations</h3>
                <p className="text-2xl font-bold text-red-500">-$590,236,015</p>
                <p className="text-sm text-gray-500">280 transactions</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h3 className="text-gray-600 text-sm mb-2">Net Change</h3>
                <p className="text-2xl font-bold text-red-500">-$41,590,653</p>
                <p className="text-sm text-gray-500">480 total transactions</p>
              </div>
            </div>
            
            {/* Visualizations - Side by side for pie chart and geography */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Emergency Funding Visualization */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Emergency Funding Distribution</h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500 text-sm">Chart visualization will be implemented in a future update</p>
                </div>
              </div>
              
              {/* Geographic Distribution Visualization */}
              <div className="bg-white rounded-lg shadow-sm p-5">
                <h2 className="text-lg font-semibold mb-3">Geographic Distribution</h2>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500 text-sm">Map visualization will be implemented in a future update</p>
                </div>
              </div>
            </div>
            
            {/* Top Recipients Visualization - Full width */}
            <div className="bg-white rounded-lg shadow-sm p-5">
              <h2 className="text-lg font-semibold mb-3">Top Recipients</h2>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500 text-sm">Bar chart will be implemented in a future update</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
