import { create } from 'zustand';

interface ProductState {
  newArrivals: any | null;
  bestSellers: any | null;
  setNewArrivals: (products: any) => void;
  setBestSellers: (products: any) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  newArrivals: null,
  bestSellers: null,
  setNewArrivals: (products) => set({ newArrivals: products }),
  setBestSellers: (products) => set({ bestSellers: products }),
}));