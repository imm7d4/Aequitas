import { api } from '@/lib/api/apiClient';

export interface Holding {
    id: string;
    instrumentId: string;
    symbol: string;
    quantity: number;
    avgEntryPrice: number;
    totalCost: number;
    realizedPL: number;
    lastUpdated: string;
    positionType: 'LONG' | 'SHORT';
    blockedMargin: number;
    initialMargin: number;
    marginStatus: 'OK' | 'CALL' | 'CRITICAL' | 'LIQUIDATED';
}

export interface ShortRiskExposure {
    currentLiability: number;
    risk5Percent: number;
    risk10Percent: number;
    marginCallTrigger: number;
    availableBuffer: number;
}

export interface PortfolioSummaryData {
    holdings: Holding[];
    realizedPL: number;
    totalEquity: number;
    cashBalance: number;
    blockedMargin: number;
    freeCash: number;
    marginCash: number;
    settlementPending: number;
    shortRiskExposure?: ShortRiskExposure;
}

export const portfolioService = {
    getHoldings: async (): Promise<Holding[]> => {
        const response = await api.get('/portfolio/holdings');
        return response.data.data;
    },

    getSummary: async (): Promise<PortfolioSummaryData> => {
        const response = await api.get('/portfolio/summary');
        return response.data.data;
    },

    captureSnapshot: async (): Promise<any> => {
        const response = await api.post('/portfolio/snapshot');
        return response.data.data;
    },

    getHistory: async (limit: number = 30): Promise<any[]> => {
        const response = await api.get(`/portfolio/history?limit=${limit}`);
        return response.data.data;
    },
};
