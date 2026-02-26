import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product } from "@/data/products";

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  variantId: string;
}

interface CartState {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  // 👇 AICI trebuia adăugată definiția
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (newItem) => {
        const currentCart = get().cart;
        const existingItemIndex = currentCart.findIndex(
          (item) => item.variantId === newItem.variantId
        );

        if (existingItemIndex > -1) {
          // Dacă produsul există deja (același ID variantă), creștem cantitatea
          const updatedCart = [...currentCart];
          updatedCart[existingItemIndex].quantity += newItem.quantity;
          set({ cart: updatedCart });
        } else {
          // Dacă e produs nou, îl adăugăm
          set({ cart: [...currentCart, newItem] });
        }
      },

      // Această implementare este corectă
      updateQuantity: (variantId: string, quantity: number) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      removeItem: (variantId) => {
        set({
          cart: get().cart.filter((item) => item.variantId !== variantId),
        });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: "guest-cart-storage", 
      storage: createJSONStorage(() => localStorage),
    }
  )
);