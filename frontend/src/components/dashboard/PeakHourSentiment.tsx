import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DATA = [
  { time: '12 PM', lunch: 65, dinner: 0 },
  { time: '1 PM', lunch: 85, dinner: 0 },
  { time: '2 PM', lunch: 92, dinner: 0 },
  { time: '3 PM', lunch: 70, dinner: 0 },
  { time: '7 PM', lunch: 0, dinner: 75 },
  { time: '8 PM', lunch: 0, dinner: 88 },
  { time: '9 PM', lunch: 0, dinner: 95 },
  { time: '10 PM', lunch: 0, dinner: 80 },
];

export default function PeakHourSentiment() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <h3 className="text-title-medium font-sans text-on-surface mb-4">Peak Hour Sentiment</h3>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-surface)', 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }} 
            />
            <Area type="monotone" dataKey="lunch" stackId="1" stroke="var(--color-secondary)" fill="var(--color-secondary)" fillOpacity={0.2} name="Lunch" />
            <Area type="monotone" dataKey="dinner" stackId="1" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} name="Dinner" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
