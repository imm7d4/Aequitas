import { api } from '@/lib/api/apiClient';
import type { User, APIResponse } from '@/features/auth/types';

export interface UpdateProfileRequest {
    fullName: string;
    displayName: string;
    bio: string;
    avatar: string;
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
};
