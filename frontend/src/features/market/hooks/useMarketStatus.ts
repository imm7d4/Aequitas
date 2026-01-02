import { useEffect, useRef } from 'react';
import { marketService } from '../services/marketService';
import { useMarketStore } from '../store/marketStore';

const POLL_INTERVAL = 60000; // 60 seconds

export const useMarketStatus = (exchange: string = 'NSE') => {
    const {
        marketStatus,
        isLoading,
        error,
        setMarketStatus,
        setLoading,
        setError,
        clearError,
    } = useMarketStore();

    const intervalRef = useRef<any>(null);

    const fetchMarketStatus = async () => {
        setLoading(true);
        clearError();
        try {
            const data = await marketService.getMarketStatus(exchange);
            setMarketStatus(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch market status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch immediately
        fetchMarketStatus();

        // Set up polling
        intervalRef.current = setInterval(fetchMarketStatus, POLL_INTERVAL);

        // Cleanup
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [exchange]);

    return {
        marketStatus,
        isLoading,
        error,
        refetch: fetchMarketStatus,
        clearError,
    };
};
