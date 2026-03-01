import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SENTIMENT_DRIVERS } from '../../data/mockData';

export default function SentimentDrivers() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald/5 h-full">
      <h3 className="text-lg font-serif font-bold text-emerald mb-6">Key Drivers</h3>

      <div className="grid grid-cols-2 gap-4 h-[200px]">
        {/* Positive Drivers */}
        <div>
          <p className="text-xs font-bold text-green-600 mb-2 uppercase tracking-wider">Positive Impact</p>
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SENTIMENT_DRIVERS.positive} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} fill="#0096BE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Negative Drivers */}
        <div>
          <p className="text-xs font-bold text-red-600 mb-2 uppercase tracking-wider">Negative Impact</p>
          <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SENTIMENT_DRIVERS.negative} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10 }} orientation="right" axisLine={false} tickLine={false} />
                <Bar dataKey="value" radius={[4, 0, 0, 4]} barSize={16} fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
