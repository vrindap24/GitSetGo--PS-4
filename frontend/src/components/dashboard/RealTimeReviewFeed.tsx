import React from 'react';
import { Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { REVIEWS } from '../../data/mockData';
import clsx from 'clsx';

export default function RealTimeReviewFeed() {
  return (
    <div className="bg-surface-container-low p-4 rounded-[16px] h-full flex flex-col elevation-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-title-medium font-sans text-on-surface">Live Feed</h3>
        <span className="bg-primary-container text-on-primary-container text-label-small px-2 py-1 rounded-full">
          Real-time
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-1">
        {REVIEWS.slice(0, 5).map((review) => (
          <div key={review.id} className="p-3 bg-surface rounded-xl border border-outline-variant/20">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className={clsx(
                  "w-2 h-2 rounded-full",
                  review.rating >= 4 ? "bg-success" : review.rating >= 3 ? "bg-secondary" : "bg-error"
                )} />
                <span className="text-label-medium font-medium text-on-surface">{review.customerName}</span>
              </div>
              <span className="text-label-small text-on-surface-variant">2m ago</span>
            </div>
            <p className="text-body-small text-on-surface mb-2 line-clamp-2">{review.text}</p>
            <div className="flex gap-2">
              <span className="text-label-small bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant">
                {review.sentiment}
              </span>
              {review.rating <= 2 && (
                <span className="text-label-small bg-error-container text-on-error-container px-2 py-0.5 rounded flex items-center gap-1">
                  <AlertCircle size={10} /> Action Req.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
