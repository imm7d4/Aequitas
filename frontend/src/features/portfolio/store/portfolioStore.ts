import { create } from 'zustand';
import { portfolioService, Holding } from '../services/portfolioService';

interface PortfolioState {
    holdings: Holding[];
    isLoading: boolean;
    error: string | null;
    fetchHoldings: () => Promise<void>;
    clearError: () => void;
    getPositionByInstrumentId: (instrumentId: string) => Holding | undefined;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
    holdings: [],
    isLoading: false,
    error: null,

    fetchHoldings: async () => {
        set({ isLoading: true, error: null });
        try {
            const holdings = await portfolioService.getHoldings();
            set({ holdings, isLoading: false });
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch holdings',
                isLoading: false
            });
        }
    },

    clearError: () => set({ error: null }),

    getPositionByInstrumentId: (instrumentId: string) => {
        const holdings = get().holdings || []; // Guard against null/undefined
        return holdings.find(h => h.instrumentId === instrumentId);
    }
}));
