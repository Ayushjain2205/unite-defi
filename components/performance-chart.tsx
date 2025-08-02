'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  timeRange: '24h' | '7d';
  data: Array<{
    time: string;
    pnl: number;
    price?: number;
  }>;
}

const generateMockData = (timeRange: '24h' | '7d') => {
  const points = timeRange === '24h' ? 24 : 7;
  const data = [];
  let currentPnl = 0;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 20;
    currentPnl += change;
    
    data.push({
      time: timeRange === '24h' 
        ? `${i}:00`
        : `Day ${i + 1}`,
      pnl: Math.round(currentPnl * 100) / 100,
      price: 2000 + (Math.random() - 0.5) * 200
    });
  }
  
  return data;
};

export function PerformanceChart({ timeRange }: PerformanceChartProps) {
  const data = generateMockData(timeRange);
  const isPositive = data[data.length - 1]?.pnl >= 0;

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'P&L']}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="pnl" 
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isPositive ? '#10b981' : '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}