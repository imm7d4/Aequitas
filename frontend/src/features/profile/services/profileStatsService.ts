import { api } from '@/lib/api/apiClient';
import type { APIResponse } from '@/features/auth/types';

export interface ProfileStats {
    totalTrades: number;
    closedTrades: number;
    winRate: number;
    totalRealizedPL: number;
    memberSince: string;
}

export const profileStatsService = {
    getStats: async (): Promise<ProfileStats> => {
        const response = await api.get<APIResponse<ProfileStats>>('/user/profile/stats');
        return response.data.data;
    },
};
