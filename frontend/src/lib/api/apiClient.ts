/// <reference types="vite/client" />
import axios from 'axios';

// Single axios instance for entire app
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: Add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Skip auto-logout for telemetry endpoint to avoid refresh loops
        const isTelemetry = error.config?.url?.includes('/telemetry');

        if (error.response?.status === 401 && !isTelemetry) {
            // Auto-logout on 401
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
