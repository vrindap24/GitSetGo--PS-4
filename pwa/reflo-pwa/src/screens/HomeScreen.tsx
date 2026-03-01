import React, { useState } from 'react';
import { MOCK_MENU, MenuItem } from '../data/mock';
import { PenLine, Mic, Clock, ChevronRight, Star, MapPin, X, Plus } from 'lucide-react';
import { VoiceReviewAssistant } from '../components/VoiceReviewAssistant';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
  onItemClick: (item: MenuItem) => void;
}

export function HomeScreen({ onNavigate, onItemClick }: HomeScreenProps) {
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [showTextReviewModal, setShowTextReviewModal] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [selectedReviewItem, setSelectedReviewItem] = useState<string>(MOCK_MENU[0].id);
  const [rating, setRating] = useState(5);
  
  const addReview = useStore(state => state.addReview);
  const trendingItems = MOCK_MENU.slice(0, 3);

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;

    addReview(selectedReviewItem, {
      userName: 'You',
      rating: rating,
      text: reviewText
    });

    setReviewText('');
    setShowTextReviewModal(false);
    // onNavigate('reviews'); // Reviews tab removed
  };

  const handleVoiceReviewGenerated = (text: string) => {
    setReviewText(text);
    setShowVoiceAssistant(false);
    setShowTextReviewModal(true);
  };

  return (
    <div className="bg-background min-h-screen pb-28">
      {/* Header */}
      <header className="pt-12 pb-6 px-6 bg-background sticky top-0 z-10">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h1 className="text-on-surface text-[42px] leading-10 font-serif font-bold italic tracking-tight">Reflo</h1>
            <div className="flex items-center gap-1 text-on-surface-variant text-sm font-normal">
              <MapPin className="w-3.5 h-3.5" />
              <span>Connaught Place, Delhi</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center font-medium text-sm">
            RK
          </div>
        </div>
      </header>

      <main className="px-4 flex flex-col gap-6">
        {/* HERO REVIEW SECTION - Glass Card */}
        <section className="glass-card rounded-[32px] p-6">
          <h2 className="text-on-surface text-[20px] font-normal mb-6">
            Share your experience
          </h2>

          <div className="flex flex-col gap-4">
            {/* Gradient Button - Cream */}
            <button 
              onClick={() => setShowTextReviewModal(true)}
              className="w-full h-[60px] btn-primary-cream rounded-full font-medium text-[16px] tracking-wide flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
            >
              <PenLine className="w-5 h-5" />
              Write review
            </button>

            {/* Glassy/Surface Button - Updated for Spiced Theme */}
            <button 
              onClick={() => setShowVoiceAssistant(true)}
              className="w-full h-[60px] btn-secondary-glass rounded-full font-medium text-[16px] tracking-wide flex items-center justify-center gap-3 hover:bg-white/50 transition-all active:scale-[0.98]"
            >
              <Mic className="w-5 h-5 text-[#8D4004]" />
              Speak review
            </button>
          </div>

          <p className="text-on-surface-variant text-xs mt-5 text-center font-medium opacity-80">
            Tip: You can speak in Hindi or English.
          </p>
        </section>

        {/* ORDER STATUS CARD - Glass Card with Progress Ring */}
        <section className="glass-card rounded-[32px] p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">Order #2841</div>
            <h3 className="text-on-surface text-[18px] font-normal">Preparing your meal</h3>
            <p className="text-on-surface-variant text-sm mt-1">Est. time: 12 mins</p>
          </div>
          
          {/* Multi-colored Circular Progress Indicator */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Ring */}
              <path
                className="text-surface-container-high"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              {/* Colored Segments - Theme Colors */}
              <path
                stroke="var(--color-primary)"
                strokeDasharray="60, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-5 h-5 text-on-surface-variant absolute" />
          </div>
        </section>

        {/* TRENDING LIST */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-on-surface text-[18px] font-normal">Trending near you</h3>
            <button onClick={() => onNavigate('menu')} className="text-primary text-sm font-medium">View all</button>
          </div>

          <div className="flex flex-col gap-6 px-2">
            {trendingItems.map((item, idx) => {
              const isEven = idx % 2 === 0;
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  onClick={() => onItemClick(item)}
                  className="relative group cursor-pointer"
                >
                  {/* Main Pill Card */}
                  <div 
                    className={cn(
                      "relative min-h-[140px] rounded-[32px] p-4 flex flex-col justify-center shadow-xl transition-transform duration-300 group-hover:scale-[1.02]",
                      "bg-[#5D4037] text-[#FFF8E1]", // Opaque dark brown background
                      isEven ? "ml-10 pr-4 pl-14 items-end text-right" : "mr-10 pl-4 pr-14 items-start text-left"
                    )}
                  >
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-[32px]">
                       <svg width="100%" height="100%">
                         <pattern id={`pattern-${item.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                           <circle cx="2" cy="2" r="1" fill="currentColor" />
                         </pattern>
                         <rect width="100%" height="100%" fill={`url(#pattern-${item.id})`} />
                       </svg>
                    </div>

                    {/* Rating Star - Top Left of the Red Box (Card) */}
                    <div className="absolute top-3 left-4 bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold z-10">
                      <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                      {item.rating}
                    </div>

                    <div className="mb-8"> {/* Added margin bottom to separate text from price/button */}
                      <h3 className={cn(
                        "font-serif text-lg font-bold leading-tight mb-1 relative z-10",
                        isEven ? "mt-2" : "mt-6"
                      )}>
                        {item.name}
                      </h3>
                      
                      <p className="text-[10px] text-[#FFF8E1]/80 font-medium leading-relaxed line-clamp-2 mb-1 relative z-10 max-w-[160px]">
                        {item.description}
                      </p>
                    </div>

                    {/* Price and Add Button Container */}
                    <div className={cn(
                      "absolute bottom-3 flex items-center gap-2 z-30",
                      isEven ? "right-4" : "left-4"
                    )}>
                      <button 
                        className="w-7 h-7 rounded-full bg-[#D89020] text-[#4E342E] shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <span className="text-base font-bold text-[#FFF8E1]">₹{item.price}</span>
                    </div>
                  </div>

                  {/* Circular Image - Breaking out of the container */}
                  <div 
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-[#F2AC57] shadow-2xl z-20 overflow-hidden bg-surface",
                      isEven ? "-left-2" : "-right-2"
                    )}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                </motion.div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Voice Assistant Modal */}
      {showVoiceAssistant && (
        <VoiceReviewAssistant 
          onReviewGenerated={handleVoiceReviewGenerated} 
          onClose={() => setShowVoiceAssistant(false)}
        />
      )}

      {/* Text Review Modal */}
      <AnimatePresence>
        {showTextReviewModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTextReviewModal(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-[#F0EAE0] rounded-t-[32px] z-50 p-6 pb-safe max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#5D4037]">Write Review</h2>
                <button onClick={() => setShowTextReviewModal(false)} className="p-2 hover:bg-black/5 rounded-full text-[#5D4037]">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2 ml-1">Select Item</label>
                <div className="relative">
                  <select 
                    value={selectedReviewItem}
                    onChange={(e) => setSelectedReviewItem(e.target.value)}
                    className="w-full bg-[#FFF8E1] p-4 rounded-[24px] text-[#5D4037] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#8D4004]/20"
                  >
                    {MOCK_MENU.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D6E63] rotate-90 pointer-events-none" />
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2 ml-1">Rating</label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setRating(star)} className="transition-transform active:scale-90">
                      <Star className={`w-10 h-10 ${star <= rating ? 'fill-[#8D4004] text-[#8D4004]' : 'text-[#8D6E63]/30'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-[#8D6E63] mb-2 ml-1">Your Review</label>
                <div className="relative">
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full bg-[#FFF8E1] p-5 rounded-[28px] text-[#5D4037] placeholder:text-[#8D6E63]/50 focus:outline-none focus:ring-2 focus:ring-[#8D4004]/20 min-h-[140px] resize-none text-lg"
                  />
                </div>
              </div>

              <button 
                onClick={handleSubmitReview}
                className="w-full btn-primary-cream text-[#FFF8E1] py-4 rounded-[24px] font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                Send Review
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
