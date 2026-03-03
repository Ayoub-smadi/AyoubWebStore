import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Product } from '@shared/schema';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        set((state) => {
          const existing = state.items.find(item => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map(item => 
                item.product.id === product.id 
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map(item => 
            item.product.id === productId ? { ...item, quantity } : item
          )
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (Number(item.product.price) * item.quantity);
        }, 0);
      },
    }),
    {
      name: 'ayoub-cart-storage',
    }
  )
);
