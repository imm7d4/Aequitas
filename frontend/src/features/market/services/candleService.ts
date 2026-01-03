import { api as apiClient } from '@/lib/api/apiClient';
import { Candle, CandleInterval } from '../types/market.types';

export const candleService = {
    async getHistoricalCandles(
        instrumentId: string,
        interval: CandleInterval = '1m',
        from?: Date,
        to?: Date,
        limit: number = 100
    ): Promise<Candle[]> {
        const params: any = { interval, limit };
        if (from) params.from = from.toISOString();
        if (to) params.to = to.toISOString();

        const response = await apiClient.get(`/market/candles/${instrumentId}`, { params });
        return response.data.data || [];
    }
};
