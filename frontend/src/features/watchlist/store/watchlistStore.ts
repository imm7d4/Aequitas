import { create } from 'zustand';
import { Watchlist } from '../types/watchlist.types';
import { watchlistService } from '../services/watchlistService';

interface WatchlistState {
    watchlists: Watchlist[];
    activeWatchlistId: string | null;
    isLoading: boolean;
    error: string | null;

    setWatchlists: (watchlists: Watchlist[]) => void;
    setActiveWatchlistId: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;

    // Selection Dialog State
    selectionDialogOpen: boolean;
    selectedInstrument: any | null; // Instrument type but avoiding circular dependency if any
    openSelectionDialog: (instrument: any) => void;
    closeSelectionDialog: () => void;

    fetchWatchlists: () => Promise<void>;
    addInstrumentToWatchlist: (watchlistId: string, instrumentId: string) => Promise<void>;
    removeInstrumentFromWatchlist: (watchlistId: string, instrumentId: string) => Promise<void>;
    syncInstrumentInWatchlists: (instrumentId: string, selectedWatchlistIds: string[]) => Promise<void>;
    reset: () => void;
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
    watchlists: [],
    activeWatchlistId: null,
    isLoading: false,
    error: null,
    selectionDialogOpen: false,
    selectedInstrument: null,

    setWatchlists: (watchlists) => set({ watchlists }),
    setActiveWatchlistId: (activeWatchlistId) => set({ activeWatchlistId }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    openSelectionDialog: (instrument) => set({ selectionDialogOpen: true, selectedInstrument: instrument }),
    closeSelectionDialog: () => set({ selectionDialogOpen: false, selectedInstrument: null }),

    fetchWatchlists: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
            const data = await watchlistService.getWatchlists();
            set({ watchlists: data });
            if (data.length > 0 && !get().activeWatchlistId) {
                const defaultWatchlist = data.find(w => w.isDefault) || data[0];
                set({ activeWatchlistId: defaultWatchlist.id });
            }
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch watchlists' });
        } finally {
            set({ isLoading: false });
        }
    },

    addInstrumentToWatchlist: async (watchlistId, instrumentId) => {
        try {
            await watchlistService.addInstrument(watchlistId, instrumentId);
            // Re-fetch to update local state
            const data = await watchlistService.getWatchlists();
            set({ watchlists: data });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to add to watchlist';
            set({ error: message });
            throw new Error(message);
        }
    },

    removeInstrumentFromWatchlist: async (watchlistId, instrumentId) => {
        try {
            await watchlistService.removeInstrument(watchlistId, instrumentId);
            // Re-fetch to update local state
            const data = await watchlistService.getWatchlists();
            set({ watchlists: data });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to remove from watchlist';
            set({ error: message });
            throw new Error(message);
        }
    },

    syncInstrumentInWatchlists: async (instrumentId, selectedWatchlistIds) => {
        set({ isLoading: true, error: null });
        try {
            const currentWatchlists = get().watchlists;

            // For each watchlist:
            // - If it's in selectedWatchlistIds but doesn't have the instrument -> add it
            // - If it's NOT in selectedWatchlistIds but DOES have the instrument -> remove it
            const tasks = currentWatchlists.map(w => {
                const hasInstrument = w.instrumentIds.includes(instrumentId);
                const shouldHaveInstrument = selectedWatchlistIds.includes(w.id);

                if (shouldHaveInstrument && !hasInstrument) {
                    return watchlistService.addInstrument(w.id, instrumentId);
                } else if (!shouldHaveInstrument && hasInstrument) {
                    return watchlistService.removeInstrument(w.id, instrumentId);
                }
                return Promise.resolve();
            });

            await Promise.all(tasks);

            // Refresh state
            const data = await watchlistService.getWatchlists();
            set({ watchlists: data });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to sync watchlists' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({
        watchlists: [],
        activeWatchlistId: null,
        isLoading: false,
        error: null,
        selectionDialogOpen: false,
        selectedInstrument: null,
    }),
}));
