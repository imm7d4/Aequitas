import { useMemo } from 'react';

export const useChartData = (candles: any[]) => {
    return useMemo(() => {
        if (!candles || candles.length === 0) return [];
        const now = Date.now();
        return candles
            .filter(c => {
                const candleTime = new Date(c.time).getTime();
                return candleTime <= now;
            })
            .filter(c => {
                const time = new Date(c.time).getTime();
                const isValidTime = !isNaN(time);
                const hasData = c.open !== null && c.open !== undefined &&
                    c.high !== null && c.high !== undefined &&
                    c.low !== null && c.low !== undefined &&
                    c.close !== null && c.close !== undefined;
                return isValidTime && hasData;
            })
            .map(c => ({
                time: Math.floor(new Date(c.time).getTime() / 1000) as any,
                open: Number(c.open),
                high: Number(c.high),
                low: Number(c.low),
                close: Number(c.close),
                volume: Number(c.volume || 0),
            }))
            .sort((a, b) => a.time - b.time)
            .filter((item, index, self) =>
                index === 0 || item.time !== self[index - 1].time
            );
    }, [candles]);
};
