import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { DataProvider } from './contexts/DataContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HHS COVID Spending Dashboard 2025',
  description: 'Visualizing Department of Health and Human Services (HHS) funding data for COVID-19 response in 2025',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen">
          <DataProvider>
            {children}
          </DataProvider>
        </div>
      </body>
    </html>
  );
}
