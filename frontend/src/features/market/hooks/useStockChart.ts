import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, CandleInterval } from '../types/market.types';
import { candleService } from '../services/candleService';
import { websocketService } from '@/shared/services/websocketService';

export const useStockChart = (instrumentId: string, interval: CandleInterval) => {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Use ref to keep track of current candles for the WebSocket callback
    const candlesRef = useRef<Candle[]>([]);

    const fetchHistoricalData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await candleService.getHistoricalCandles(instrumentId, interval);
            setCandles(data);
            candlesRef.current = data;
        } catch (err: any) {
            console.error('Failed to fetch historical candles', err);
            setError('Failed to load chart data');
        } finally {
            setIsLoading(false);
        }
    }, [instrumentId, interval]);

    const handleNewCandle = useCallback((newCandle: Candle) => {
        if (newCandle.interval !== interval) return;

        setCandles(prev => {
            const lastCandle = prev[prev.length - 1];

            // If it's a new time slot, append it
            if (!lastCandle || newCandle.time !== lastCandle.time) {
                const updated = [...prev, newCandle];
                // Keep only the last 500 candles to avoid memory issues
                if (updated.length > 500) updated.shift();
                candlesRef.current = updated;
                return updated;
            }

            // If it's the same time slot, update the last candle
            const updated = [...prev];
            updated[updated.length - 1] = newCandle;
            candlesRef.current = updated;
            return updated;
        });
    }, [interval]);

    useEffect(() => {
        fetchHistoricalData();

        websocketService.connect();
        websocketService.subscribe(instrumentId, handleNewCandle);

        return () => {
            websocketService.unsubscribe(instrumentId, handleNewCandle);
        };
    }, [instrumentId, interval, fetchHistoricalData, handleNewCandle]);

    return { candles, isLoading, error, refresh: fetchHistoricalData };
};
