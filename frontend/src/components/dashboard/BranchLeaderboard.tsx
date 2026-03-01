import React from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { BRANCHES } from '../../data/mockData';
import clsx from 'clsx';

export default function BranchLeaderboard() {
  const sortedBranches = [...BRANCHES].sort((a, b) => b.purityScore - a.purityScore);

  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface flex items-center gap-2">
          <Trophy size={20} className="text-primary" />
          Leaderboard
        </h3>
        <button className="text-label-medium text-primary font-medium hover:bg-primary-container/20 px-2 py-1 rounded-full transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto pr-1">
        {sortedBranches.slice(0, 5).map((branch, index) => (
          <div 
            key={branch.id} 
            className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-outline-variant/20 hover:elevation-1 transition-all"
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center font-bold text-label-medium",
              index === 0 ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-high text-on-surface-variant"
            )}>
              {index + 1}
            </div>
            
            <div className="flex-1">
              <h4 className="text-body-medium font-medium text-on-surface">{branch.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={clsx("h-full rounded-full", 
                      branch.purityScore >= 90 ? "bg-primary" :
                      branch.purityScore >= 75 ? "bg-secondary" : "bg-error"
                    )}
                    style={{ width: `${branch.purityScore}%` }}
                  />
                </div>
                <span className="text-label-small text-on-surface-variant w-8 text-right">{branch.purityScore}%</span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-success text-label-small font-medium">
                <TrendingUp size={12} />
                +2.4
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
