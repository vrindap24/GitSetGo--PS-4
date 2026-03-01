import React from 'react';
import { Home, Utensils, History, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store';
import { motion } from 'motion/react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const cart = useStore(state => state.cart);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'menu', icon: Utensils, label: 'Menu', badge: cartCount > 0 ? cartCount : undefined },
    { id: 'reviews', icon: History, label: 'History' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-[320px]">
      <div className="bg-[#3E2723] rounded-[40px] shadow-2xl border border-white/5 px-6 py-4 flex justify-between items-center relative">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center transition-all duration-300 z-10",
                isActive ? "w-14 h-14 -mt-8" : "w-10 h-10"
              )}
            >
              {isActive ? (
                <motion.div
                  layoutId="activeTab"
                  className="w-16 h-16 bg-[#FFF8E1] rounded-full flex items-center justify-center shadow-lg border-4 border-[#3E2723]"
                >
                  <Icon className="w-6 h-6 text-[#3E2723]" strokeWidth={2.5} />
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Icon className="w-6 h-6 text-[#FFF8E1]/60" strokeWidth={2} />
                  <span className="text-[10px] text-[#FFF8E1]/60 font-medium">{tab.label}</span>
                </div>
              )}

              {isActive && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-6 text-xs font-bold text-[#3E2723] bg-[#FFF8E1] px-2 py-0.5 rounded-md shadow-sm"
                >
                  {tab.label}
                </motion.span>
              )}

              {tab.badge && !isActive && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-[#D32F2F] rounded-full border border-[#3E2723]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
