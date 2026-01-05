import { useState, useEffect, useCallback, useRef } from 'react';
import { Candle, CandleInterval } from '../types/market.types';
import { candleService } from '../services/candleService';
import { websocketService } from '@/shared/services/websocketService';

// Interval durations in milliseconds
const INTERVAL_MS: Record<CandleInterval, number> = {
    '1m': 60_000,
    '5m': 5 * 60_000,
    '15m': 15 * 60_000,
    '1h': 60 * 60_000,
    '1d': 24 * 60 * 60_000,
};

// Bucket-align timestamp to interval boundary
const bucketTime = (time: string | number, interval: CandleInterval): number => {
    const ms = new Date(time).getTime();
    return Math.floor(ms / INTERVAL_MS[interval]) * INTERVAL_MS[interval];
};

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
            // Safety guard: Ignore WS candles before REST finishes
            if (prev.length === 0) return prev;

            const last = prev[prev.length - 1];

            const lastBucket = bucketTime(last.time, interval);
            const newBucket = bucketTime(newCandle.time, interval);

            // SAME candle → update
            if (newBucket === lastBucket) {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...last,
                    ...newCandle,
                    time: new Date(lastBucket).toISOString(),
                };
                candlesRef.current = updated;
                return updated;
            }

            // NEW candle → force continuity (open = previous close)
            const fixedOpen = last.close;

            // Clamp bad backend values
            const clampedHigh = Math.max(newCandle.high, fixedOpen, newCandle.close);
            const clampedLow = Math.min(newCandle.low, fixedOpen, newCandle.close);

            const updated = [
                ...prev,
                {
                    ...newCandle,
                    time: new Date(newBucket).toISOString(),
                    open: fixedOpen,
                    high: clampedHigh,
                    low: clampedLow,
                    close: newCandle.close,
                },
            ];

            // Keep only the last 500 candles to avoid memory issues
            if (updated.length > 500) updated.shift();

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
