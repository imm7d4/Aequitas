import { useEffect, useCallback } from 'react';
import { instrumentService } from '../services/instrumentService';
import { useInstrumentStore } from '../store/instrumentStore';

export const useInstruments = () => {
    const {
        instruments,
        selectedInstrument,
        searchResults,
        isLoading,
        error,
        setInstruments,
        setSelectedInstrument,
        setSearchResults,
        setLoading,
        setError,
        clearError,
    } = useInstrumentStore();

    const fetchInstruments = useCallback(async () => {
        setLoading(true);
        clearError();
        try {
            const data = await instrumentService.getInstruments();
            setInstruments(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch instruments');
        } finally {
            setLoading(false);
        }
    }, [setLoading, clearError, setInstruments, setError]);

    const searchInstruments = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        clearError();
        try {
            const data = await instrumentService.searchInstruments(query);
            setSearchResults(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    }, [setLoading, clearError, setSearchResults, setError]);

    const getInstrumentById = useCallback(async (id: string) => {
        setLoading(true);
        clearError();
        try {
            const data = await instrumentService.getInstrumentById(id);
            setSelectedInstrument(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch instrument');
        } finally {
            setLoading(false);
        }
    }, [setLoading, clearError, setSelectedInstrument, setError]);

    useEffect(() => {
        fetchInstruments();
    }, [fetchInstruments]);

    return {
        instruments,
        selectedInstrument,
        searchResults,
        isLoading,
        error,
        fetchInstruments,
        searchInstruments,
        getInstrumentById,
        clearError,
    };
};
