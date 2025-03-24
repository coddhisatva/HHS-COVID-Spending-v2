import React from 'react';
import Header from './components/Header';
import FilterPanel from './components/FilterPanel';
import SummaryMetrics from './components/SummaryMetrics';
import EmergencyFundingChart from './components/EmergencyFundingChart';
import GeographicDistribution from './components/GeographicDistribution';
import TopRecipients from './components/TopRecipients';

export default function Home() {
  return (
    <main className="pb-12">
      <Header />
      <FilterPanel />
      <SummaryMetrics />
      
      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <EmergencyFundingChart />
          <GeographicDistribution />
        </div>
        <TopRecipients />
      </div>
    </main>
  );
}
