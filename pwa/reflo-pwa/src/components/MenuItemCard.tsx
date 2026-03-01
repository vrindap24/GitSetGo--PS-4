import React from 'react';
import { MenuItem } from '../data/mock';
import { Star, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuItemCardProps {
  item: MenuItem;
  onClick: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${item.id}`}
      onClick={onClick}
      className="bg-surface rounded-[2rem] p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center border border-outline/5"
    >
      <div className="w-28 h-28 relative flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover rounded-2xl"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="flex-1 flex flex-col justify-between h-28 py-1">
        <div>
          <h3 className="font-bold text-lg text-on-surface leading-tight line-clamp-1 mb-1">{item.name}</h3>
          <p className="text-on-surface-variant text-sm line-clamp-2 leading-relaxed">{item.description}</p>
        </div>

        <div className="flex justify-between items-end">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">₹{item.price}</span>
            <div className="flex items-center gap-1 text-sm font-medium text-on-surface-variant">
              <Star className="w-4 h-4 fill-google-yellow text-google-yellow" />
              {item.rating} <span className="text-outline">({item.reviews.length})</span>
            </div>
          </div>
          
          <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant px-4 py-1.5 rounded-full transition-colors flex items-center gap-1">
            <Plus className="w-4 h-4" />
            <Plus className="w-4 h-4 -ml-2" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
