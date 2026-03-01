import React, { useState } from 'react';
import { MenuItem } from '../data/mock';
import { ArrowLeft, Star, Minus, Plus, ShoppingBag, Clock, Info, ChevronRight, Mic } from 'lucide-react';
import { useStore } from '../store';
import { submitReview } from '../services/api';
import { VoiceReviewAssistant } from '../components/VoiceReviewAssistant';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ItemDetailScreenProps {
  item: MenuItem;
  onBack: () => void;
}

export function ItemDetailScreen({ item, onBack }: ItemDetailScreenProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useStore(state => state.addToCart);
  const addReview = useStore(state => state.addReview);
  const addMyReview = useStore(state => state.addMyReview);
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    onBack();
  };

  const handleSubmitReview = async () => {
    if (!reviewText.trim()) return;
    setSubmitting(true);

    try {
      // Hit the live API so AI agent and WhatsApp escalations trigger
      const res = await submitReview({
        platform: 'Internal',
        branch_id: 'b4', // Fixed branch for demo
        rating: userRating,
        review_text: reviewText.trim(),
        reviewer_name: 'PWA User'
      });

      // Save to local history
      addMyReview({
        id: res.id,
        timestamp: new Date().toISOString(),
        rating: userRating,
        review_text: reviewText.trim(),
        itemName: item.name,
      });

      // Update mock view for this session
      addReview(item.id, {
        userName: 'You',
        rating: userRating,
        text: reviewText
      });

      setReviewText('');
      setShowReviewForm(false);
    } catch (error) {
      console.error(error);
      alert("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-surface flex flex-col min-h-full pb-0 relative">
      {/* Header Image */}
      <div className="relative h-80 w-full">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-surface/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-surface/30"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="px-6 py-8 -mt-10 relative bg-surface rounded-t-[32px] shadow-lg">
        {/* Title & Rating */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-on-surface flex-1 leading-tight">{item.name}</h1>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-primary">₹{item.price}</span>
            <div className="flex items-center gap-1 text-sm font-medium text-on-surface-variant">
              <Star className="w-4 h-4 fill-primary text-primary" />
              {item.rating} ({item.reviews.length})
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">

          <span className="px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface-variant">
            {item.category}
          </span>
          {item.ingredients?.slice(0, 2).map(ing => (
            <span key={ing} className="px-3 py-1 rounded-full bg-surface-container text-xs font-medium text-on-surface-variant">
              {ing}
            </span>
          ))}
        </div>

        <p className="text-on-surface-variant leading-relaxed mb-8 text-sm">
          {item.description}
        </p>

        {/* Sentiment Summary Card */}
        {item.sentimentSummary && (
          <div className="bg-secondary-container/30 rounded-2xl p-5 mb-8 border border-secondary-container">
            <h3 className="text-sm font-bold text-on-surface mb-3 flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-secondary" />
              AI Review Summary
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(item.sentimentSummary).map(([key, value]) => (
                <div key={key} className="bg-surface p-3 rounded-xl text-center shadow-sm">
                  <div className="text-xs text-on-surface-variant uppercase font-bold mb-1">{key}</div>
                  <div className={cn(
                    "text-sm font-medium",
                    value === 'positive' ? "text-google-green" : value === 'negative' ? "text-google-red" : "text-google-yellow"
                  )}>
                    {value === 'positive' ? 'Excellent' : value === 'negative' ? 'Poor' : 'Mixed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-on-surface">Reviews</h2>
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-primary font-bold text-sm bg-primary-container px-4 py-2 rounded-full hover:bg-primary-container/80 transition-colors"
            >
              Write a Review
            </button>
          </div>

          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-surface-container p-4 rounded-2xl mb-6 overflow-hidden"
            >
              <h3 className="font-medium mb-3">Add your review</h3>

              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} onClick={() => setUserRating(star)}>
                    <Star className={`w-8 h-8 ${star <= userRating ? 'fill-primary text-primary' : 'text-outline/30'}`} />
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full bg-surface p-3 rounded-xl border border-outline/20 focus:outline-none focus:border-primary min-h-[100px] text-sm pr-12"
                />
                <button
                  onClick={() => setShowVoiceAssistant(true)}
                  className="absolute bottom-3 right-3 p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
                >
                  <Mic className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="w-full mt-3 bg-primary text-on-primary py-3 rounded-xl font-medium disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </motion.div>
          )}

          {showVoiceAssistant && (
            <VoiceReviewAssistant
              onReviewGenerated={(text) => {
                setReviewText(text);
                setShowVoiceAssistant(false);
              }}
              onClose={() => setShowVoiceAssistant(false)}
            />
          )}

          <div className="space-y-4">
            {item.reviews.length > 0 ? (
              item.reviews.map(review => (
                <div key={review.id} className="bg-surface-container-low p-4 rounded-2xl border border-outline/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-on-surface text-sm">{review.userName}</span>
                    <span className="text-xs text-on-surface-variant">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-outline/30'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{review.text}</p>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant italic text-sm">No reviews yet. Be the first!</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-surface border-t border-outline/10 p-4 pb-safe z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] mt-auto">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex items-center gap-3 bg-surface-container-high px-4 py-2 rounded-full h-14">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-bold w-6 text-center text-on-surface">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-variant text-on-surface"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex-1 btn-primary-cream text-on-primary h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-primary/30 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Add ₹{item.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
