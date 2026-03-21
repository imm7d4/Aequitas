import { api } from '@/lib/api/apiClient';
import type { User, APIResponse } from '@/features/auth/types';

export interface UpdateProfileRequest {
    fullName: string;
    displayName: string;
    bio: string;
    avatar: string;
    phone: string;
}

export const profileService = {
    getProfile: async (): Promise<User> => {
        const response = await api.get<APIResponse<User>>('/user/profile');
        return response.data.data;
    },

    updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
        const response = await api.put<APIResponse<User>>('/user/profile', data);
        return response.data.data;
    },

    updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.put('/user/password', { currentPassword, newPassword });
    },

    updatePreferences: async (preferences: User['preferences']): Promise<User> => {
        const response = await api.put<APIResponse<User>>('/user/preferences', preferences);
        return response.data.data;
    },

    initiateEmailUpdate: async (currentPassword: string, newEmail: string): Promise<void> => {
        await api.post('/user/email/initiate', { currentPassword, newEmail });
    },

    completeEmailUpdate: async (newEmail: string, otp: string): Promise<User> => {
        const response = await api.post<APIResponse<User>>('/user/email/complete', { newEmail, otp });
        return response.data.data;
    },
};
