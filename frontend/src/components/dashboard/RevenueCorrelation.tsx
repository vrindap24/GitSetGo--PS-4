import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign } from 'lucide-react';

const DATA = [
  { month: 'Jan', sentiment: 75, revenue: 4000 },
  { month: 'Feb', sentiment: 78, revenue: 4200 },
  { month: 'Mar', sentiment: 72, revenue: 3800 },
  { month: 'Apr', sentiment: 85, revenue: 5100 },
  { month: 'May', sentiment: 88, revenue: 5400 },
  { month: 'Jun', sentiment: 92, revenue: 6000 },
];

export default function RevenueCorrelation() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface flex items-center gap-2">
          <DollarSign size={20} className="text-primary" />
          Revenue Correlation
        </h3>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} 
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }} 
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="sentiment" 
              stroke="var(--color-primary)" 
              strokeWidth={3} 
              dot={{ fill: 'var(--color-primary)', r: 4 }} 
              name="Sentiment Score"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--color-secondary)" 
              strokeWidth={3} 
              dot={{ fill: 'var(--color-secondary)', r: 4 }} 
              name="Revenue (k)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
