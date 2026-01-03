import { useState, useEffect, useRef } from 'react';
import { MarketData } from '../types/market.types';
import { marketService } from '../services/marketService';

export const useMarketData = (instrumentIds: string[]) => {
    const [prices, setPrices] = useState<Record<string, MarketData>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<any>(null);

    const fetchPrices = async () => {
        if (instrumentIds.length === 0) {
            setPrices({});
            return;
        }

        try {
            const data = await marketService.getBatchPrices(instrumentIds);
            const priceMap = data.reduce((acc, curr) => {
                acc[curr.instrumentId] = curr;
                return acc;
            }, {} as Record<string, MarketData>);
            setPrices(prevPrices => ({
                ...prevPrices,
                ...priceMap
            }));
        } catch (err: any) {
            console.error('Failed to fetch market data', err);
            setError(err.response?.data?.message || 'Failed to fetch prices');
        }
    };

    useEffect(() => {
        fetchPrices();
        setIsLoading(true);

        timerRef.current = setInterval(fetchPrices, 3000);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [instrumentIds.join(',')]);

    return { prices, isLoading, error };
};
