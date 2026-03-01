import React from 'react';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react';
import { REVIEWS } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

export default function RedAlertFeed() {
  const criticalReviews = REVIEWS.filter(r => r.rating <= 2 && !r.isRecovered);

  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface flex items-center gap-2">
          <AlertTriangle size={20} className="text-error" />
          Red Alert Feed
        </h3>
        <span className="bg-error-container text-on-error-container text-label-small font-bold px-2 py-1 rounded-full animate-pulse">
          {criticalReviews.length} Active
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1">
        {criticalReviews.length === 0 ? (
          <div className="text-center py-8 text-on-surface-variant text-body-medium">
            No critical alerts. Good job!
          </div>
        ) : (
          criticalReviews.map((review) => (
            <div key={review.id} className="p-3 bg-surface rounded-xl border-l-4 border-error shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-label-small font-bold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-md">
                  {review.branchId}
                </span>
                <div className="flex items-center gap-1 text-error font-mono text-label-small font-bold">
                  <Clock size={12} />
                  14:32 {/* Mock countdown */}
                </div>
              </div>
              
              <p className="text-body-small text-on-surface line-clamp-2 mb-3 italic">"{review.text}"</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-label-small text-error font-medium">Urgency High</span>
                </div>
                <button className="text-label-small bg-error text-on-error px-3 py-1.5 rounded-full font-medium hover:bg-error/90 transition-colors flex items-center gap-1">
                  Escalate <ChevronRight size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
