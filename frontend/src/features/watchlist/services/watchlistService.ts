import { api } from '../../../lib/api/apiClient';
import { Watchlist, CreateWatchlistRequest } from '../types/watchlist.types';

export const watchlistService = {
    getWatchlists: async (): Promise<Watchlist[]> => {
        const response = await api.get('/watchlists');
        return response.data.data;
    },

    createWatchlist: async (data: CreateWatchlistRequest): Promise<Watchlist> => {
        const response = await api.post('/watchlists', data);
        return response.data.data;
    },

    renameWatchlist: async (id: string, name: string): Promise<void> => {
        await api.put(`/watchlists/${id}`, { name });
    },

    deleteWatchlist: async (id: string): Promise<void> => {
        await api.delete(`/watchlists/${id}`);
    },

    setDefaultWatchlist: async (id: string): Promise<void> => {
        await api.post(`/watchlists/${id}/default`);
    },

    addInstrument: async (watchlistId: string, instrumentId: string): Promise<void> => {
        await api.post(`/watchlists/${watchlistId}/instruments/${instrumentId}`);
    },

    removeInstrument: async (watchlistId: string, instrumentId: string): Promise<void> => {
        await api.delete(`/watchlists/${watchlistId}/instruments/${instrumentId}`);
    },
};
