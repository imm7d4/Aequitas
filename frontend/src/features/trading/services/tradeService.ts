import apiClient from '../../../lib/api/apiClient';

export interface Trade {
    id: string;
    tradeId: string;
    orderId: string;
    userId: string;
    accountId: string;
    instrumentId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    value: number;
    commission: number;
    fees: number;
    netValue: number;
    executedAt: string;
    createdAt: string;
}

export const tradeService = {
    getTrades: async (): Promise<Trade[]> => {
        const response = await apiClient.get('/trades');
        return response.data.data;
    },

    getTradesByOrder: async (orderId: string): Promise<Trade[]> => {
        const response = await apiClient.get(`/trades/order/${orderId}`);
        return response.data.data;
    },
};
