
import { api } from '@/lib/api/apiClient';

export const healthService = {
    /**
     * simple fire-and-forget health check to warm up the backend
     */
    checkHealth: async (): Promise<void> => {
        try {
            await api.get('/health');
        } catch (error) {
            // Silently fail - just meant for warmup
            console.debug('Health check warmup failed', error);
        }
    }
};
