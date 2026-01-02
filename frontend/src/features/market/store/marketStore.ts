import { create } from 'zustand';
import type { MarketStatus } from '../types/market.types';

interface MarketState {
    marketStatus: MarketStatus | null;
    isLoading: boolean;
    error: string | null;
    setMarketStatus: (status: MarketStatus | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    marketStatus: null,
    isLoading: false,
    error: null,
    setMarketStatus: (status) => set({ marketStatus: status }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));
