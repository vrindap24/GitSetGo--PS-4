import React from 'react';
import { Flame, Snowflake, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import clsx from 'clsx';

const DISHES = [
  { name: 'Veg Pulao', type: 'hot', trend: 12, tags: ['Spicy', 'Flavorful'] },
  { name: 'Paneer Tikka', type: 'hot', trend: 8, tags: ['Soft', 'Fresh'] },
  { name: 'Butter Naan', type: 'cold', trend: -5, tags: ['Chewy', 'Cold'] },
  { name: 'Mango Lassi', type: 'cold', trend: -3, tags: ['Too Sweet'] },
];

export default function DishHotColdList() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <h3 className="text-title-medium font-sans text-on-surface mb-4">Dish Performance</h3>

      <div className="space-y-3 overflow-y-auto">
        {DISHES.map((dish, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-3">
              <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center",
                dish.type === 'hot' ? "bg-error-container text-on-error-container" : "bg-tertiary-container text-on-tertiary-container"
              )}>
                {dish.type === 'hot' ? <Flame size={20} /> : <Snowflake size={20} />}
              </div>
              <div>
                <p className="text-body-medium font-medium text-on-surface">{dish.name}</p>
                <div className="flex gap-1 mt-0.5">
                  {dish.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className={clsx(
              "flex items-center gap-1 text-label-medium font-bold",
              dish.type === 'hot' ? "text-success" : "text-error"
            )}>
              {dish.type === 'hot' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {Math.abs(dish.trend)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
