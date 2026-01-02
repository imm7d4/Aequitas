import { api as apiClient } from '../../../lib/api/apiClient';
import type {
    MarketStatus,
    CreateMarketHoursRequest,
    CreateHolidayRequest,
} from '../types/market.types';

export const marketService = {
    async getMarketStatus(exchange: string): Promise<MarketStatus> {
        const response = await apiClient.get(`/market/status/${exchange}`);
        return response.data.data;
    },

    async createMarketHours(
        data: CreateMarketHoursRequest
    ): Promise<void> {
        await apiClient.post('/admin/market/hours', data);
    },

    async createHoliday(data: CreateHolidayRequest): Promise<void> {
        await apiClient.post('/admin/market/holidays', data);
    },

    async getHolidays(exchange?: string): Promise<any[]> {
        const url = exchange ? `/admin/market/holidays/${exchange}` : '/admin/market/holidays';
        const response = await apiClient.get(url);
        return response.data.data;
    },

    async deleteHoliday(id: string): Promise<void> {
        await apiClient.delete(`/admin/market/holidays/${id}`);
    },
};
