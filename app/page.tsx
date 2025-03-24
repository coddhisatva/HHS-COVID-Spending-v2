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
    </main>
  );
}
