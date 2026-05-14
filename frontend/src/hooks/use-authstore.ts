import { create } from 'zustand';

export interface Address {
  id: number;
  user_id: number;
  address_line: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
}

interface AuthState {
  user: any;
  address: Address | null;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  setAddress: (address: Address | null) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  address: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAddress: (address) => set({ address }),
  clearAuth: () => set({ user: null, address: null, isAuthenticated: false }),
}));

export default useAuthStore;