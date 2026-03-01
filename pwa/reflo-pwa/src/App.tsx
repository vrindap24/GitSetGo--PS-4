import React, { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { ItemDetailScreen } from './screens/ItemDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ReviewsScreen } from './screens/ReviewsScreen';
import { SubmitReviewScreen } from './screens/SubmitReviewScreen';
import { MenuItem } from './data/mock';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from './store';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [showSubmitReview, setShowSubmitReview] = useState(false);

  const cart = useStore(state => state.cart);
  const placeOrder = useStore(state => state.placeOrder);
  const clearCart = useStore(state => state.clearCart);

  const handlePlaceOrder = () => {
    // Simulate Payment Flow
    setTimeout(() => {
      setIsPaymentSuccess(true);
      setTimeout(() => {
        placeOrder();
        setIsPaymentSuccess(false);
        setIsCartOpen(false);
        setCurrentTab('home'); // Go home after payment
      }, 2000);
    }, 1000);
  };

  const renderContent = () => {
    if (showSubmitReview) {
      return <SubmitReviewScreen onBack={() => setShowSubmitReview(false)} />;
    }

    if (selectedItem) {
      return <ItemDetailScreen item={selectedItem} onBack={() => setSelectedItem(null)} />;
    }

    switch (currentTab) {
      case 'home':
        return <HomeScreen onNavigate={setCurrentTab} onItemClick={setSelectedItem} />;
      case 'menu':
        return <MenuScreen onItemClick={setSelectedItem} />;
      case 'profile':
        return <ProfileScreen />;
      case 'reviews':
        return <ReviewsScreen onSubmitReview={() => setShowSubmitReview(true)} />;
      default:
        return <HomeScreen onNavigate={setCurrentTab} onItemClick={setSelectedItem} />;
    }
  };

  return (
    <div className="bg-background min-h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans text-on-background">
      {/* Main Content */}
      <div className="h-full overflow-y-auto scrollbar-hide">
        {renderContent()}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {!selectedItem && cart.length > 0 && !isCartOpen && (
          <motion.button
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-24 right-6 bg-tertiary text-on-tertiary w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center z-40"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-error text-on-error rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-background">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart / Payment Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-[32px] z-50 p-6 pb-safe max-h-[90vh] overflow-y-auto"
            >
              {isPaymentSuccess ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-google-green/10 rounded-full flex items-center justify-center text-google-green mb-4"
                  >
                    <CheckCircle className="w-10 h-10" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-on-surface mb-2">Payment Successful!</h2>
                  <p className="text-on-surface-variant text-center">Your order has been placed.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-on-surface">Checkout</h2>
                    <button onClick={() => setIsCartOpen(false)} className="p-2 bg-surface-variant rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center bg-surface-container p-3 rounded-2xl">
                        <img src={item.item.image} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold text-on-surface">{item.item.name}</h4>
                          <p className="text-sm text-on-surface-variant">₹{item.item.price}</p>
                        </div>
                        <div className="font-bold text-lg bg-surface px-3 py-1 rounded-lg">x{item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-outline/10 pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span>Total</span>
                      <span>₹{cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {['UPI', 'Card', 'Cash'].map(method => (
                      <button key={method} className="border border-outline/20 py-3 rounded-xl font-medium text-sm hover:bg-primary-container hover:border-primary hover:text-on-primary-container transition-colors">
                        {method}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full btn-primary-cream text-on-primary py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                  >
                    Pay & Order
                  </button>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {!selectedItem && !showSubmitReview && (
        <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
      )}
    </div>
  );
}
