import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import SummaryMetrics from './components/SummaryMetrics';
import EmergencyFundingChart from './components/EmergencyFundingChart';
import GeographicDistribution from './components/GeographicDistribution';
import { DataProvider } from './contexts/DataContext';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <DataProvider>
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar with filters - 20% width */}
            <div className="w-full md:w-1/5">
              <Sidebar />
            </div>
            
            {/* Main content area - 80% width */}
            <div className="w-full md:w-4/5">
              {/* Summary metrics */}
              <div className="mb-6">
                <SummaryMetrics />
              </div>
              
              {/* Visualizations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <EmergencyFundingChart />
                <GeographicDistribution />
              </div>
              
              {/* Top Recipients visualization */}
              <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                <h2 className="text-lg font-semibold mb-3">Top Recipients</h2>
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">Top Recipients chart will be implemented soon.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DataProvider>
    </main>
  );
}
