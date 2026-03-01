import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Filter, Search, ThumbsUp, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { BRANCHES } from '../data/mockData';
import { fetchReviews } from '../services/apiService';
import { ReviewBackend } from '../types';

export default function ReviewsPage({ role }: { role: 'HQ' | 'BRANCH' }) {
  const [reviews, setReviews] = useState<ReviewBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBranchName = (branchId: string) => {
    return BRANCHES.find(b => b.id === branchId)?.name || 'Unknown Branch';
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Unknown time';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-on-surface-variant font-medium animate-pulse">Fetching insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-error-container flex items-center justify-center text-error">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-on-surface">Transmission Interrupted</h3>
          <p className="text-sm text-on-surface-variant max-w-md">{error}</p>
        </div>
        <button
          onClick={loadData}
          className="px-6 py-2 bg-primary text-on-primary rounded-full font-bold hover:bg-primary/90 transition-all flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-normal text-on-surface">{role === 'HQ' ? 'Global Reviews' : 'Branch Reviews'}</h2>
          <p className="text-sm text-on-surface-variant">Analyze customer sentiment and feedback</p>
        </div>

        <div className="flex w-full md:w-auto space-x-2">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search reviews..."
              className="w-full pl-9 pr-4 py-2 bg-surface-variant/30 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="p-2 bg-surface-variant text-on-surface-variant rounded-full hover:bg-surface-variant/80 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="m3-card p-4">
            <h3 className="text-sm font-medium text-on-surface mb-3">Filter by Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <label key={star} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-outline text-primary focus:ring-primary" />
                  <div className="flex items-center text-sm text-on-surface-variant">
                    <span className="w-4">{star}</span>
                    <Star className="w-3 h-3 fill-secondary text-secondary ml-1" />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="m3-card p-4">
            <h3 className="text-sm font-medium text-on-surface mb-3">Sentiment</h3>
            <div className="space-y-2">
              {['Positive', 'Neutral', 'Negative'].map((s) => (
                <label key={s} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-outline text-primary focus:ring-primary" />
                  <span className="text-sm text-on-surface-variant">{s}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="col-span-12 lg:col-span-9 space-y-4">
          {reviews.length === 0 && (
            <div className="m3-card p-8 text-center text-on-surface-variant">
              No reviews found matching your current filters.
            </div>
          )}
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="m3-card p-6 hover:shadow-elevation-2 transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${review.rating >= 4 ? 'bg-primary-container text-on-primary-container' :
                    review.rating >= 3 ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'
                    }`}>
                    {review.rating}★
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-on-surface">{review.reviewer_name || 'Anonymous'}</h3>
                    <p className="text-xs text-on-surface-variant">{getBranchName(review.branch_id)} • {formatTime(review.timestamp)}</p>
                  </div>
                </div>
                {review.ai_analysis && review.ai_analysis.risk_score > 50 && !review.processed && (
                  <div className="flex items-center text-error text-xs font-bold bg-error-container/50 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3 mr-1" /> Needs Attention
                  </div>
                )}
              </div>

              <p className="text-sm text-on-surface mb-4 leading-relaxed">"{review.review_text}"</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2 flex-wrap">
                  {review.ai_analysis?.categories.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 rounded-md bg-surface-variant text-on-surface-variant">
                      {tag}
                    </span>
                  ))}
                  {review.ai_analysis?.sentiment_label && (
                    <span className={`text-xs px-2 py-1 rounded-md font-medium ${review.ai_analysis.sentiment_label === 'Positive' ? 'bg-primary/20 text-primary' :
                      review.ai_analysis.sentiment_label === 'Negative' ? 'bg-error/20 text-error' : 'bg-outline/20 text-on-surface-variant'
                      }`}>
                      {review.ai_analysis.sentiment_label}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button className="text-xs font-medium text-on-surface-variant hover:text-primary flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" /> Helpful
                  </button>
                  <button className="text-xs font-medium text-primary hover:underline flex items-center">
                    <MessageSquare className="w-3 h-3 mr-1" /> Reply
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
