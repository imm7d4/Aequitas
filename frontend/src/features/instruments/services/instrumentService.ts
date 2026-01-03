import { api as apiClient } from '../../../lib/api/apiClient';
import type {
    Instrument,
    CreateInstrumentRequest,
    UpdateInstrumentRequest,
} from '../types/instrument.types';

export const instrumentService = {
    async getInstruments(): Promise<Instrument[]> {
        const response = await apiClient.get('/instruments');
        return response.data.data;
    },

    async searchInstruments(query: string): Promise<Instrument[]> {
        const startTime = window.performance.now();
        try {
            const response = await apiClient.get(`/instruments/search?q=${query}`);
            const duration = window.performance.now() - startTime;

            import('@/shared/services/telemetry/telemetryService').then(({ telemetryService }) => {
                telemetryService.track({
                    event_name: 'api.latency',
                    event_version: 'v1',
                    classification: 'SYSTEM_EVENT',
                    metadata: {
                        endpoint: '/instruments/search',
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
                        endpoint: '/instruments/search',
                        error: (error as any).message,
                        success: false
                    }
                });
            });
            throw error;
        }
    },

    async getInstrumentById(id: string): Promise<Instrument> {
        const response = await apiClient.get(`/instruments/${id}`);
        return response.data.data;
    },

    async createInstrument(
        data: CreateInstrumentRequest
    ): Promise<Instrument> {
        const response = await apiClient.post('/admin/instruments', data);
        return response.data.data;
    },

    async updateInstrument(
        id: string,
        data: UpdateInstrumentRequest
    ): Promise<Instrument> {
        const response = await apiClient.put(`/admin/instruments/${id}`, data);
        return response.data.data;
    },
};
