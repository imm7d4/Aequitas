import { useMemo } from 'react';

/**
 * Production-grade data transformation for chart candles.
 * Optimizes performance by using a single-pass reduce to avoid multiple iterations.
 */
export const useChartData = (candles: any[]) => {
    return useMemo(() => {
        if (!candles || candles.length === 0) return [];
        
        const now = Date.now();
        const processed: any[] = [];
        const seenTimes = new Set<number>();

        for (let i = 0; i < candles.length; i++) {
            const c = candles[i];
            if (!c) continue;

            const timeMs = new Date(c.time).getTime();
            
            // Validation & Filtering
            if (isNaN(timeMs) || timeMs > now) continue;
            if (c.open === null || c.open === undefined ||
                c.high === null || c.high === undefined ||
                c.low === null || c.low === undefined ||
                c.close === null || c.close === undefined) continue;

            const timeSec = Math.floor(timeMs / 1000);
            
            // Deduplication
            if (seenTimes.has(timeSec)) continue;
            seenTimes.add(timeSec);

            processed.push({
                time: timeSec as any,
                open: Number(c.open),
                high: Number(c.high),
                low: Number(c.low),
                close: Number(c.close),
                volume: Number(c.volume || 0),
            });
        }

        // Final sort is usually faster than incremental insertion for most datasets
        return processed.sort((a, b) => a.time - b.time);
    }, [candles]);
};
