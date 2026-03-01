import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MenuItem, Order, MOCK_MENU } from './data/mock';

interface AppState {
  cart: { item: MenuItem; quantity: number }[];
  orders: Order[];
  myReviews: any[];
  addMyReview: (review: any) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  placeOrder: () => void;
  addReview: (itemId: string, review: { userName: string; rating: number; text: string }) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      cart: [],
      orders: [],
      myReviews: [],
      addMyReview: (review) => set((state) => ({ myReviews: [review, ...state.myReviews] })),
      addToCart: (item) => set((state) => {
        const existing = state.cart.find((i) => i.item.id === item.id);
        if (existing) {
          return {
            cart: state.cart.map((i) =>
              i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          };
        }
        return { cart: [...state.cart, { item, quantity: 1 }] };
      }),
      removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((i) => i.item.id !== itemId),
      })),
      clearCart: () => set({ cart: [] }),
      placeOrder: () => {
        const { cart } = get();
        if (cart.length === 0) return;

        const totalPrepTime = Math.max(...cart.map(i => i.item.prepTime));
        const newOrder: Order = {
          id: Math.random().toString(36).substring(7),
          items: [...cart],
          status: 'preparing',
          total: cart.reduce((sum, i) => sum + i.item.price * i.quantity, 0),
          createdAt: Date.now(),
          estimatedTime: Date.now() + totalPrepTime * 60 * 1000, // minutes to ms
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: [],
        }));
      },
      addReview: (itemId, review) => {
        // In a real app, this would update the backend. 
        // Here we just update the mock data in memory (which resets on reload, but good for demo)
        const itemIndex = MOCK_MENU.findIndex(i => i.id === itemId);
        if (itemIndex > -1) {
          MOCK_MENU[itemIndex].reviews.unshift({
            id: Math.random().toString(36).substring(7),
            date: new Date().toISOString().split('T')[0],
            tags: [], // Initialize with empty tags
            ...review
          });
        }
      }
    }),
    {
      name: 'reflo-pwa-storage',
      partialize: (state) => ({ myReviews: state.myReviews, orders: state.orders }),
    }
  ));
