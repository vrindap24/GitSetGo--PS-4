import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BrainCircuit } from 'lucide-react';

const data = [
  { category: 'Food', positive: 85, negative: 15 },
  { category: 'Staff', positive: 92, negative: 8 },
  { category: 'Ambience', positive: 88, negative: 12 },
  { category: 'Delivery', positive: 70, negative: 30 },
  { category: 'Hygiene', positive: 95, negative: 5 },
];

export default function SentimentAnalysis() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface flex items-center gap-2">
          <BrainCircuit size={20} className="text-primary" />
          Sentiment Breakdown
        </h3>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="category" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontWeight: 500 }}
              width={70}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="positive" name="Positive" stackId="a" fill="var(--color-primary)" radius={[0, 0, 0, 0]} barSize={20} />
            <Bar dataKey="negative" name="Negative" stackId="a" fill="var(--color-error)" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
