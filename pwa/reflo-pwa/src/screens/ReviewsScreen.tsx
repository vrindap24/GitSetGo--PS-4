import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Camera, Filter, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { fetchReviews, ReviewResponse } from '../services/api';

export function ReviewsScreen({ onSubmitReview }: { onSubmitReview?: () => void }) {
  const [filter, setFilter] = useState('All');
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters = ['All', 'Positive', 'Critical', 'Google', 'Internal'];

  const loadReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Filter reviews based on selected filter
  const filteredReviews = reviews.filter(r => {
    if (filter === 'All') return true;
    if (filter === 'Positive') return r.rating >= 4;
    if (filter === 'Critical') return r.rating <= 2;
    if (filter === 'Google') return r.platform === 'Google';
    if (filter === 'Internal') return r.platform === 'Internal';
    return true;
  });

  // Calculate stats from real data
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';
  const ratingDistribution = [5, 4, 3, 2, 1].map(
    star => totalReviews > 0
      ? Math.round((reviews.filter(r => r.rating === star).length / totalReviews) * 100)
      : 0
  );

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <RefreshCw className="w-8 h-8 text-primary" />
        </motion.div>
        <p className="text-on-surface-variant text-sm animate-pulse">Loading reviews…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <div className="w-14 h-14 rounded-full bg-error-container flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-error" />
        </div>
        <p className="text-sm text-on-surface-variant">{error}</p>
        <button onClick={loadReviews} className="px-5 py-2 bg-primary text-on-primary rounded-full text-sm font-bold flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 bg-background min-h-screen">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Review Hub</h1>
        <p className="text-on-surface-variant text-sm">See what everyone is saying</p>
      </header>

      {/* Overall Rating Card */}
      <div className="bg-surface-container-high rounded-3xl p-6 mb-8 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-5xl font-bold text-on-surface tracking-tight">{avgRating}</div>
          <div className="flex gap-1 my-2">
            {[1, 2, 3, 4, 5].map(star => (
              <Star key={star} className={cn("w-4 h-4", Number(avgRating) >= star ? "fill-primary text-primary" : "text-outline")} />
            ))}
          </div>
          <div className="text-sm text-on-surface-variant">{totalReviews} total reviews</div>
        </div>

        <div className="flex-1 pl-8">
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div key={star} className="flex items-center gap-2 text-xs">
                <span className="w-3">{star}</span>
                <div className="flex-1 h-2 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${ratingDistribution[i]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-2 px-1">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border",
              filter === f
                ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20"
                : "bg-surface text-on-surface-variant border-outline/10 hover:bg-surface-container-high"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-on-surface-variant text-sm">
            No reviews found for this filter.
          </div>
        )}
        {filteredReviews.map((review, idx) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-surface-container p-5 rounded-2xl shadow-sm border border-outline/5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center font-bold text-sm">
                  {(review.reviewer_name || 'A').charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-on-surface text-sm">{review.reviewer_name || 'Anonymous'}</div>
                  <div className="text-xs text-on-surface-variant">{formatTime(review.timestamp)} • {review.platform}</div>
                </div>
              </div>
              <div className="bg-surface-container-highest px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-on-surface">
                <Star className="w-3 h-3 fill-primary text-primary" />
                {review.rating}
              </div>
            </div>

            <p className="text-on-surface text-sm leading-relaxed mb-3">
              {review.review_text}
            </p>

            {/* AI Sentiment Tags */}
            {review.ai_analysis && (
              <div className="flex flex-wrap gap-2 mb-3">
                {review.ai_analysis.categories?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide border bg-surface-container-high text-on-surface-variant border-outline/20"
                  >
                    {tag}
                  </span>
                ))}
                {review.ai_analysis.sentiment_label && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-1 rounded-md font-medium uppercase tracking-wide border",
                      review.ai_analysis.sentiment_label === 'Positive'
                        ? "bg-google-green/10 text-google-green border-google-green/20"
                        : review.ai_analysis.sentiment_label === 'Negative'
                          ? "bg-google-red/10 text-google-red border-google-red/20"
                          : "bg-surface-container-high text-on-surface-variant border-outline/20"
                    )}
                  >
                    {review.ai_analysis.sentiment_label}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-on-surface-variant text-xs mt-2 border-t border-outline/10 pt-3">
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <ThumbsUp className="w-4 h-4" /> Helpful
              </button>
              <button className="flex items-center gap-1 hover:text-primary transition-colors">
                <MessageSquare className="w-4 h-4" /> Reply
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAB for writing review */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSubmitReview}
        className="fixed bottom-24 right-6 btn-primary-cream text-on-primary h-14 px-6 rounded-2xl shadow-xl flex items-center gap-2 font-bold z-40"
      >
        <MessageSquare className="w-5 h-5" />
        Write Review
      </motion.button>
    </div>
  );
}

