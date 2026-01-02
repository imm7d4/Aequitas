import { api } from '@/lib/api/apiClient';
import { AuthResponse, User, APIResponse } from '../types';

export const authService = {
    async register(email: string, password: string): Promise<User> {
        const response = await api.post<APIResponse<User>>('/auth/register', {
            email,
            password,
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

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
