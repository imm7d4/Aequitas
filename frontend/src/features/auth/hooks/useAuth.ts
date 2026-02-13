import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../services/authService';
import { tokenStorage } from '@/lib/storage/tokenStorage';
import { useInstrumentStore } from '@/features/instruments/store/instrumentStore';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { useNotificationStore } from '@/shared/store/useNotificationStore';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    initialize: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const getInitialAuth = () => {
    const token = tokenStorage.getToken();
    const userStr = tokenStorage.getUser();
    let user = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch (e) {
            tokenStorage.clear();
        }
    }
    return { token, user, isAuthenticated: !!(token && user) };
};

const initialAuth = getInitialAuth();

export const useAuthStore = create<AuthState>((set) => ({
    user: initialAuth.user,
    token: initialAuth.token,
    isAuthenticated: initialAuth.isAuthenticated,
    isLoading: true, // Start as true during initialization
    error: null,

    setUser: (user) => {
        if (user) {
            tokenStorage.setUser(JSON.stringify(user));
        } else {
            tokenStorage.clear();
        }
        set({ user, isAuthenticated: !!user });
    },
    setToken: (token) => set({ token }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    initialize: async () => {
        set({ isLoading: true });
        const token = tokenStorage.getToken();
        const userStr = tokenStorage.getUser();

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                set({ token, user, isAuthenticated: true });
            } catch (e) {
                tokenStorage.clear();
            }
        }
        set({ isLoading: false });
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const { token, user } = await authService.login(email, password);
            tokenStorage.setToken(token);
            tokenStorage.setUser(JSON.stringify(user));
            set({ token, user, isAuthenticated: true });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Login failed' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await authService.register(email, password);
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Registration failed' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: () => {
        authService.logout();
        // Reset feature stores
        useInstrumentStore.getState().reset();
        useWatchlistStore.getState().reset();
        useNotificationStore.getState().reset();
        useOnboardingStore.getState().reset();
        set({ user: null, token: null, isAuthenticated: false });
    },
}));

export const useAuth = () => {
    const store = useAuthStore();
    return store;
};
