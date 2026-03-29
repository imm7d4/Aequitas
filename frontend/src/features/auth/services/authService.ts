import { api } from '@/lib/api/apiClient';
import { AuthResponse, User, APIResponse } from '../types';

export const authService = {
    async initiateRegistration(email: string, password: string): Promise<void> {
        await api.post<APIResponse<void>>('/auth/register', {
            email,
            password,
        });
    },

    async completeRegistration(email: string, password: string, otp: string): Promise<User> {
        const response = await api.post<APIResponse<User>>('/auth/register/complete', {
            email,
            password,
            otp,
        });
        return response.data.data;
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await api.post<APIResponse<AuthResponse>>('/auth/login', {
            email,
            password,
        });
        return response.data.data;
    },

    async logout(): Promise<void> {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout tracking failed:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    async forgotPassword(email: string): Promise<void> {
        await api.post<APIResponse<void>>('/auth/forgot-password', { email });
    },

    async resetPassword(data: any): Promise<void> {
        await api.post<APIResponse<void>>('/auth/reset-password', data);
    },
};
