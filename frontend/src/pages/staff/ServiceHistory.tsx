import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Award, CheckCircle } from 'lucide-react';

const HISTORY = [
  { id: 1, date: '14 Oct', shift: '09:00 - 18:00', tables: 12, rating: 4.8, tips: '₹450', status: 'Completed' },
  { id: 2, date: '13 Oct', shift: '09:00 - 18:00', tables: 15, rating: 4.5, tips: '₹520', status: 'Completed' },
  { id: 3, date: '12 Oct', shift: '15:00 - 23:00', tables: 18, rating: 4.9, tips: '₹600', status: 'Completed' },
  { id: 4, date: '10 Oct', shift: '09:00 - 18:00', tables: 10, rating: 4.2, tips: '₹300', status: 'Completed' },
  { id: 5, date: '09 Oct', shift: 'Off', tables: 0, rating: 0, tips: '0', status: 'Off' },
];

export default function ServiceHistory() {
  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-normal text-on-surface">Service History</h2>
          <p className="text-sm text-on-surface-variant">Track your shifts and performance</p>
        </div>
        <div className="flex space-x-4 text-sm">
          <div className="text-center">
            <p className="text-on-surface-variant">Total Tips</p>
            <p className="font-bold text-primary">₹12,450</p>
          </div>
          <div className="text-center">
            <p className="text-on-surface-variant">Avg Rating</p>
            <p className="font-bold text-secondary">4.7★</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {HISTORY.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`m3-card p-4 flex items-center justify-between ${item.status === 'Off' ? 'opacity-60 bg-surface-variant/10' : ''}`}
          >
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-surface-variant/30 rounded-xl">
                <span className="text-xs font-bold text-on-surface-variant uppercase">{item.date.split(' ')[1]}</span>
                <span className="text-lg font-bold text-on-surface">{item.date.split(' ')[0]}</span>
              </div>
              
              <div>
                <div className="flex items-center text-sm text-on-surface font-medium">
                  <Clock className="w-4 h-4 mr-2 text-on-surface-variant" />
                  {item.shift}
                </div>
                <div className="flex items-center text-xs text-on-surface-variant mt-1">
                  <span className="mr-3">{item.tables > 0 ? `${item.tables} Tables Served` : 'Rest Day'}</span>
                  {item.status === 'Completed' && (
                    <span className="flex items-center text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 mr-1" /> Completed
                    </span>
                  )}
                </div>
              </div>
            </div>

            {item.status !== 'Off' && (
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant">Rating</p>
                  <div className="flex items-center font-bold text-on-surface">
                    {item.rating} <Star className="w-3 h-3 ml-1 fill-secondary text-secondary" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant">Tips</p>
                  <p className="font-bold text-primary">{item.tips}</p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
