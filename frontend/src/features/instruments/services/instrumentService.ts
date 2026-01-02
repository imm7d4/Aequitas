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
        const response = await apiClient.get(`/instruments/search?q=${query}`);
        return response.data.data;
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
