import React from 'react';
import { TrendingUp, TrendingDown, Utensils } from 'lucide-react';
import clsx from 'clsx';

const MENU_DATA = [
  { name: 'Veg Pulao', type: 'Hero', score: 98, trend: 'up', branch: 'All' },
  { name: 'Kaju Masala', type: 'Hero', score: 95, trend: 'up', branch: 'Pune' },
  { name: 'Paneer Tikka', type: 'Zero', score: 45, trend: 'down', branch: 'Powai' },
  { name: 'Butter Naan', type: 'Zero', score: 52, trend: 'down', branch: 'Virar' },
];

export default function MenuIntelligence() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface flex items-center gap-2">
          <Utensils size={20} className="text-primary" />
          Menu Intelligence
        </h3>
        <span className="bg-tertiary-container text-on-tertiary-container text-label-small px-2 py-1 rounded-full">
          Live
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {MENU_DATA.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center",
                item.type === 'Hero' ? "bg-success-container text-on-success-container" : "bg-error-container text-on-error-container"
              )}>
                {item.type === 'Hero' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              </div>
              <div>
                <p className="text-body-medium font-medium text-on-surface">{item.name}</p>
                <p className="text-label-small text-on-surface-variant">{item.branch}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={clsx(
                "text-title-small font-bold",
                item.type === 'Hero' ? "text-success" : "text-error"
              )}>
                {item.score}%
              </span>
              <p className="text-label-small text-on-surface-variant">Approval</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
