import { api as apiClient } from '../../../lib/api/apiClient';
import type {
    MarketStatus,
    CreateMarketHoursRequest,
    CreateHolidayRequest,
    MarketData,
} from '../types/market.types';

export const marketService = {
    async getMarketStatus(exchange: string): Promise<MarketStatus> {
        const startTime = window.performance.now();
        try {
            const response = await apiClient.get(`/market/status/${exchange}`);
            const duration = window.performance.now() - startTime;

            import('@/shared/services/telemetry/telemetryService').then(({ telemetryService }) => {
                telemetryService.track({
                    event_name: 'api.latency',
                    event_version: 'v1',
                    classification: 'SYSTEM_EVENT',
                    metadata: {
                        endpoint: `/market/status/${exchange}`,
                        duration_ms: duration,
                        success: true
                    }
                });
            });

            return response.data.data;
        } catch (error) {
            import('@/shared/services/telemetry/telemetryService').then(({ telemetryService }) => {
                telemetryService.track({
                    event_name: 'api.error',
                    event_version: 'v1',
                    classification: 'ERROR_EVENT',
                    severity: 'error',
                    metadata: {
                        endpoint: `/market/status/${exchange}`,
                        error: (error as any).message,
                        success: false
                    }
                });
            });
            throw error;
        }
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

    async getBatchPrices(ids: string[]): Promise<MarketData[]> {
        const response = await apiClient.get(`/market/prices?ids=${ids.join(',')}`);
        return response.data.data;
    },
};
