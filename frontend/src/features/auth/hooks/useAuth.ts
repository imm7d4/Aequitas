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
    initiateRegistration: (email: string, password: string) => Promise<void>;
    completeRegistration: (email: string, password: string, otp: string) => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (data: any) => Promise<void>;
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

    initiateRegistration: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await authService.initiateRegistration(email, password);
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Registration request failed' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    completeRegistration: async (email, password, otp) => {
        set({ isLoading: true, error: null });
        try {
            const user = await authService.completeRegistration(email, password, otp);
            // We don't automatically log in here to ensure user knows their password works
            // But we could if desired. The requirement implies login after success.
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Verification failed' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            await authService.forgotPassword(email);
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to send reset email' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    resetPassword: async (data) => {
        set({ isLoading: true, error: null });
        try {
            await authService.resetPassword(data);
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Password reset failed' });
            throw err;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        await authService.logout();
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
