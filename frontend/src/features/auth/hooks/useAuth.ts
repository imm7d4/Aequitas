import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';
import { tokenStorage } from '@/lib/storage/tokenStorage';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true, // Start as true to prevent flash of login page
    error: null,

    initialize: () => {
        try {
            const token = tokenStorage.getToken();
            const userStr = tokenStorage.getUser();
            if (token && userStr) {
                const user = JSON.parse(userStr);
                set({ user, token, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to initialize auth:', error);
            set({ isLoading: false });
        }
    },

    login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(email, password);
            tokenStorage.setToken(response.token);
            tokenStorage.setUser(JSON.stringify(response.user));
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || 'Login failed. Please try again.';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    register: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
            await authService.register(email, password);
            set({ isLoading: false });
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                'Registration failed. Please try again.';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    logout: () => {
        authService.logout();
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export const useAuth = (): AuthState => {
    return useAuthStore();
};
