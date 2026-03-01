import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowLeft, Send, CheckCircle, Loader2, Tag, User, ChevronDown } from 'lucide-react';
import { submitReview } from '../services/api';
import { cn } from '../lib/utils';

const CATEGORIES = [
    'Food Quality', 'Service', 'Staff Behavior', 'Cleanliness',
    'Ambience', 'Delivery', 'Value', 'Hygiene'
];

// Default branch for PWA (Powai branch)
const DEFAULT_BRANCH_ID = 'b4';

interface Props {
    onBack: () => void;
    onSuccess?: () => void;
}

export function SubmitReviewScreen({ onBack, onSuccess }: Props) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [staffName, setStaffName] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleSubmit = async () => {
        if (rating === 0) { setError('Please select a rating'); return; }
        if (reviewText.trim().length < 5) { setError('Please write a longer review'); return; }

        setSubmitting(true);
        setError('');

        try {
            await submitReview({
                platform: 'Internal',
                branch_id: DEFAULT_BRANCH_ID,
                rating,
                review_text: reviewText.trim(),
                reviewer_name: customerName.trim() || 'PWA User',
                staff_tagged: staffName.trim() || undefined,
                categories: selectedCategories.length > 0 ? selectedCategories : undefined,
            });

            setSubmitted(true);
            setTimeout(() => {
                onSuccess?.();
                onBack();
            }, 2500);
        } catch (err: any) {
            setError(err.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-24 h-24 bg-google-green/10 rounded-full flex items-center justify-center mb-6"
                >
                    <CheckCircle className="w-12 h-12 text-google-green" />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-on-surface mb-2"
                >
                    Thank You!
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-on-surface-variant text-center"
                >
                    Your review has been submitted and is being processed by our AI agents.
                </motion.p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-outline/10 px-4 py-3">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-surface-container">
                        <ArrowLeft className="w-5 h-5 text-on-surface" />
                    </button>
                    <h1 className="text-xl font-bold text-on-surface">Share Your Experience</h1>
                </div>
            </div>

            <div className="px-5 pt-6 space-y-8">
                {/* Rating */}
                <div>
                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 block">
                        How was your experience?
                    </label>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <motion.button
                                key={star}
                                whileTap={{ scale: 0.85 }}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1"
                            >
                                <Star
                                    className={cn(
                                        "w-10 h-10 transition-all",
                                        (hoverRating || rating) >= star
                                            ? "fill-primary text-primary scale-110"
                                            : "text-outline/30"
                                    )}
                                />
                            </motion.button>
                        ))}
                    </div>
                    <p className="text-center text-sm text-on-surface-variant mt-2">
                        {rating === 0 ? 'Tap to rate' :
                            rating <= 2 ? 'We\'re sorry to hear that' :
                                rating === 3 ? 'Thanks for your honest feedback' :
                                    rating === 4 ? 'Great to hear!' : 'Excellent! 🎉'}
                    </p>
                </div>

                {/* Review Text */}
                <div>
                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 block">
                        Tell us more
                    </label>
                    <textarea
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="What did you love? What can we improve?"
                        rows={4}
                        className="w-full bg-surface-container border border-outline/10 rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <p className="text-xs text-on-surface-variant mt-1 text-right">
                        {reviewText.length} characters
                    </p>
                </div>

                {/* Categories */}
                <div>
                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                                    selectedCategories.includes(cat)
                                        ? "bg-primary text-on-primary border-primary shadow-md shadow-primary/20"
                                        : "bg-surface text-on-surface-variant border-outline/15 hover:bg-surface-container-high"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Customer Name (optional) */}
                <div>
                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" /> Your Name (optional)
                    </label>
                    <input
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Anonymous if left blank"
                        className="w-full bg-surface-container border border-outline/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>

                {/* Staff Tag (optional) */}
                <div>
                    <label className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
                        <User className="w-4 h-4" /> Staff Who Served You (optional)
                    </label>
                    <input
                        value={staffName}
                        onChange={e => setStaffName(e.target.value)}
                        placeholder="e.g. Raju, Amit"
                        className="w-full bg-surface-container border border-outline/10 rounded-xl px-4 py-3 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-google-red bg-google-red/10 px-4 py-2 rounded-xl"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full btn-primary-cream text-on-primary py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submitting to AI Pipeline...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Submit Review
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
