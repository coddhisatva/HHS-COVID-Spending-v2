import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TopRecipients = () => {
  // Sample data for top recipients
  const data = [
    { name: 'Genentech USA, Inc', value: 3.2, color: '#4298f5' },
    { name: 'McKesson Corporation', value: 2.9, color: '#34d399' },
    { name: 'Loyal Source Govt Services', value: 2.7, color: '#a78bfa' },
    { name: 'OptumServe Tech Services', value: 2.5, color: '#f472b6' },
    { name: 'Moderna US, Inc', value: 2.3, color: '#fbbf24' },
  ].sort((a, b) => a.value - b.value);

  const formatValue = (value: number) => `$${value.toFixed(1)}B`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Top Recipients</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={formatValue} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12 }} 
              width={100}
            />
            <Tooltip formatter={(value) => formatValue(value as number)} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopRecipients; 