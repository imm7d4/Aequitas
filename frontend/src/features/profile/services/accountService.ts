import api from '@/lib/api/apiClient';
import { APIResponse } from '@/features/auth/types';

export interface TradingAccount {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    accountId: string;
    userId: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRADE' | 'FEE';
    amount: number;
    currency: string;
    status: 'COMPLETED' | 'PENDING' | 'FAILED';
    reference: string;
    createdAt: string;
}

export const accountService = {
    getBalance: async (): Promise<TradingAccount> => {
        const response = await api.get<APIResponse<TradingAccount>>('/account/balance');
        return response.data.data;
    },

    fundAccount: async (amount: number): Promise<TradingAccount> => {
        const response = await api.post<APIResponse<TradingAccount>>('/account/fund', { amount });
        return response.data.data;
    },

    getTransactions: async (): Promise<Transaction[]> => {
        const response = await api.get<APIResponse<Transaction[]>>('/account/transactions');
        return response.data.data;
    },
};
