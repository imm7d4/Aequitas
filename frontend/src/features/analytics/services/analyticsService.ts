import { api } from '@/lib/api/apiClient';

export interface TradeResult {
    id: string;
    symbol: string;
    side: 'LONG' | 'SHORT';
    quantity: number;
    avgEntryPrice: number;
    avgExitPrice: number;
    entryNotional: number;
    exitNotional: number;
    grossPNL: number;
    netPNL: number;
    totalCommissions: number;
    grossReturnPct: number;
    netReturnPct: number;
    mae: number;
    mfe: number;
    entryTime: string;
    exitTime: string;
    duration: string;
    entryOrderIds: string[];
    exitOrderIds: string[];
    calculationVersion: number;
}

export const analyticsService = {
    getTradeDiagnostics: async (): Promise<TradeResult[]> => {
        const response = await api.get<any>('/diagnostics');
        return response.data.data;
    }
};
