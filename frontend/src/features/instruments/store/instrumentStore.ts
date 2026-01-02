import { create } from 'zustand';
import type { Instrument } from '../types/instrument.types';

interface InstrumentState {
    instruments: Instrument[];
    selectedInstrument: Instrument | null;
    searchResults: Instrument[];
    isLoading: boolean;
    error: string | null;
    viewMode: 'grid' | 'list';
    filters: {
        exchange: string;
        type: string;
        sector: string;
    };
    searchQuery: string;
    pagination: {
        page: number;
        rowsPerPage: number;
    };
    setInstruments: (instruments: Instrument[]) => void;
    setSelectedInstrument: (instrument: Instrument | null) => void;
    setSearchResults: (results: Instrument[]) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
    setViewMode: (mode: 'grid' | 'list') => void;
    setFilters: (filters: { exchange: string; type: string; sector: string }) => void;
    setSearchQuery: (query: string) => void;
    setPagination: (pagination: { page: number; rowsPerPage: number }) => void;
    reset: () => void;
}

export const useInstrumentStore = create<InstrumentState>((set) => ({
    instruments: [],
    selectedInstrument: null,
    searchResults: [],
    isLoading: false,
    error: null,
    viewMode: 'grid',
    filters: {
        exchange: 'ALL',
        type: 'ALL',
        sector: 'ALL',
    },
    searchQuery: '',
    pagination: {
        page: 0,
        rowsPerPage: 25,
    },
    setInstruments: (instruments) => set({ instruments: instruments || [] }),
    setSelectedInstrument: (instrument) => set({ selectedInstrument: instrument }),
    setSearchResults: (results) => set({ searchResults: results || [] }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
    setViewMode: (mode) => set({ viewMode: mode }),
    setFilters: (filters) => set({ filters }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setPagination: (pagination) => set({ pagination }),
    reset: () => set({
        instruments: [],
        selectedInstrument: null,
        searchResults: [],
        isLoading: false,
        error: null,
        viewMode: 'grid',
        filters: {
            exchange: 'ALL',
            type: 'ALL',
            sector: 'ALL',
        },
        searchQuery: '',
        pagination: {
            page: 0,
            rowsPerPage: 25,
        },
    }),
}));
