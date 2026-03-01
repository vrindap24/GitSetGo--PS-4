import React, { useState } from 'react';
import { MenuItem, MOCK_MENU, CATEGORIES } from '../data/mock';
import { Search, Plus, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface MenuScreenProps {
  onItemClick: (item: MenuItem) => void;
}

export function MenuScreen({ onItemClick }: MenuScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = MOCK_MENU.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-32 pt-4 px-4 bg-background min-h-screen overflow-x-hidden">
      <header className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-on-surface mb-6 text-center tracking-tight">
          Our Menu
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-6 max-w-sm mx-auto">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/80 backdrop-blur-md rounded-full py-3.5 pl-14 pr-6 text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm border border-outline/10"
          />
        </div>

        {/* Categories */}
        <div className="flex justify-center gap-2 flex-wrap px-1">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all border",
                selectedCategory === category
                  ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20 scale-105"
                  : "bg-surface/50 text-on-surface-variant border-outline/10 hover:bg-surface hover:border-outline/30"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col gap-6 px-2">
        {filteredItems.map((item, idx) => {
          // Screenshot shows first item (Mango Lassi) has image on RIGHT.
          // So even index (0) should have image on RIGHT.
          const isImageRight = idx % 2 === 0;
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, x: isImageRight ? -20 : 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              onClick={() => onItemClick(item)}
              className="relative group cursor-pointer mb-8"
            >
              {/* Main Pill Card */}
              <div 
                className={cn(
                  "relative min-h-[160px] rounded-[40px] p-5 flex flex-col justify-center shadow-xl transition-transform duration-300 group-hover:scale-[1.02]",
                  "bg-[#5D4037] text-[#FFF8E1]", // Opaque dark brown background
                  isImageRight ? "mr-12 pl-6 pr-16 items-start text-left" : "ml-12 pr-6 pl-16 items-end text-right"
                )}
              >
                {/* Decorative Background Pattern (Dots) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-[40px]">
                   <svg width="100%" height="100%">
                     <pattern id={`pattern-${item.id}`} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                       <circle cx="2" cy="2" r="1.5" fill="currentColor" />
                     </pattern>
                     <rect width="100%" height="100%" fill={`url(#pattern-${item.id})`} />
                   </svg>
                </div>

                {/* Rating Star - Floating Pill */}
                <div className={cn(
                  "absolute top-0 mt-4 bg-[#3E2723]/40 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold z-10 border border-white/10",
                  isImageRight ? "left-6" : "right-6"
                )}>
                  <Star className="w-3.5 h-3.5 fill-[#F4B400] text-[#F4B400]" />
                  {item.rating}
                </div>

                <div className="mt-6 mb-8 w-full"> 
                  <h3 className="font-serif text-2xl font-bold leading-tight mb-2 relative z-10 text-[#FFF8E1]">
                    {item.name}
                  </h3>
                  
                  <p className="text-xs text-[#FFF8E1]/70 font-medium leading-relaxed line-clamp-2 relative z-10 max-w-[180px]">
                    {item.description}
                  </p>
                </div>

                {/* Price and Add Button Container */}
                <div className={cn(
                  "absolute bottom-4 flex items-center gap-3 z-30",
                  isImageRight ? "left-6" : "right-6 flex-row-reverse"
                )}>
                  <button 
                    className="w-10 h-10 rounded-full bg-[#D89020] text-[#3E2723] shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                  <span className="text-2xl font-bold text-[#FFF8E1]">₹{item.price}</span>
                </div>
              </div>

              {/* Circular Image - Breaking out of the container */}
              <div 
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-36 h-36 rounded-full border-4 border-[#F2AC57]/50 shadow-2xl z-20 overflow-hidden bg-surface",
                  isImageRight ? "-right-2" : "-left-2"
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
    </div>
  );
}
