import { api } from '@/lib/api/apiClient';

export interface PriceAlert {
    id: string;
    instrumentId: string;
    symbol: string;
    targetPrice: number;
    condition: 'ABOVE' | 'BELOW';
    status: 'ACTIVE' | 'TRIGGERED' | 'CANCELLED';
    createdAt: string;
    triggeredAt?: string;
}

export const alertService = {
    getAlerts: async (): Promise<PriceAlert[]> => {
        const response = await api.get('/alerts');
        return response.data;
    },

    createAlert: async (instrumentId: string, symbol: string, targetPrice: number, condition: 'ABOVE' | 'BELOW'): Promise<PriceAlert> => {
        const response = await api.post('/alerts', {
            instrumentId,
            symbol,
            targetPrice,
            condition,
        });
        return response.data;
    },

    cancelAlert: async (id: string): Promise<void> => {
        await api.delete(`/alerts/${id}`);
    },
};
