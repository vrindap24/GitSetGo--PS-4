import React, { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Bell, CheckCircle, Clock, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function OrdersScreen() {
  const orders = useStore(state => state.orders);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  // Simulate "Ring" when ready
  useEffect(() => {
    const checkOrders = () => {
      orders.forEach(order => {
        // Mock logic: if estimated time passed and status is preparing, mark ready
        // In a real app, this comes from backend
        const timeLeft = Math.max(0, order.estimatedTime - Date.now());
        if (timeLeft === 0 && order.status === 'preparing') {
           // Play sound
           const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
           audio.play().catch(e => console.log("Audio play failed", e));
           // Update status logic would go here in real app
        }
      });
    };
    const timer = setInterval(checkOrders, 5000);
    return () => clearInterval(timer);
  }, [orders]);

  return (
    <div className="pb-24 pt-8 px-4">
      <h1 className="text-3xl font-bold text-on-surface mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-on-surface-variant">
          <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
          <p>No active orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const timeLeftMs = Math.max(0, order.estimatedTime - now);
            const timeLeftMins = Math.ceil(timeLeftMs / 60000);
            const isReady = timeLeftMs === 0;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface-container rounded-3xl p-5 shadow-sm border border-outline/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order #{order.id}</span>
                    <div className="text-2xl font-bold text-on-surface mt-1">
                      {isReady ? 'Ready!' : `${timeLeftMins} min`}
                    </div>
                    {!isReady && <span className="text-sm text-on-surface-variant">Estimated wait time</span>}
                  </div>
                  <div className={`p-3 rounded-full ${isReady ? 'bg-google-green/10 text-google-green' : 'bg-primary-container text-on-primary-container'}`}>
                    {isReady ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6 animate-pulse" />}
                  </div>
                </div>

                <div className="border-t border-outline/10 my-4"></div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-on-surface">
                        <span className="font-bold mr-2">{item.quantity}x</span>
                        {item.item.name}
                      </span>
                      <span className="text-on-surface-variant">₹{item.item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-lg text-on-surface">Total</span>
                  <span className="font-bold text-lg text-primary">₹{order.total}</span>
                </div>
                
                {isReady && (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-4 btn-primary-cream text-on-primary py-3 rounded-xl text-center font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
                  >
                    <Bell className="w-5 h-5 animate-bounce" />
                    Order Ready for Pickup!
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
