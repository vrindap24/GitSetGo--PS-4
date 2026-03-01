import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Map } from 'lucide-react';

const DATA = [
  { region: 'Powai-Kalyan', purity: 88, csat: 4.2 },
  { region: 'Pune', purity: 92, csat: 4.5 },
  { region: 'Virar', purity: 85, csat: 4.0 },
  { region: 'Dombivli', purity: 78, csat: 3.8 },
];

export default function ClusterAnalysis() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface flex items-center gap-2">
          <Map size={20} className="text-primary" />
          Regional Clusters
        </h3>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={DATA} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="region"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12, fontWeight: 500 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-surface-container-high)', opacity: 0.5 }}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Bar dataKey="purity" name="Purity Score" fill="var(--color-primary)" radius={[0, 4, 4, 0]} barSize={12} />
            <Bar dataKey="csat" name="CSAT (x20)" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
