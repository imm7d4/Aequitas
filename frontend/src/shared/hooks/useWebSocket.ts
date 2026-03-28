import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../features/auth/hooks/useAuth';
import { useNotificationStore } from '../store/useNotificationStore';

interface WebSocketMessage {
    type: string;
    data: any;
    symbol?: string;
}

const getWebSocketUrl = () => {
    // Check if we are in a browser environment to avoid build errors if SSR is used (though properly not a concern here, good practice)
    if (typeof window === 'undefined') return '';

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
    const protocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    // Remove protocol and /api suffix to get the host
    const host = apiUrl.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');

    // Ensure we don't end up with double slashes if the host has one, but clean replacement above should handle it.
    // simpler: if apiUrl is full url "http://localhost:8080/api", host becomes "localhost:8080"

    return `${protocol}://${host}/ws`;
};

export const useWebSocket = (url: string = getWebSocketUrl()) => {
    const ws = useRef<WebSocket | null>(null);
    const { token, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();

    // Reconnect logic
    const reconnectTimeout = useRef<ReturnType<typeof setTimeout>>();

    const connect = useCallback(() => {
        if (!isAuthenticated || !token || !url) return;
        if (ws.current?.readyState === WebSocket.OPEN) return;

        const wsUrl = `${url}?token=${token}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('WebSocket Connected');
        };

        socket.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);

                // Handle Notifications
                if (message.type === 'notification') {
                    addNotification(message.data);
                } else if (message.type === 'candle') {
                    window.dispatchEvent(new CustomEvent('ws-candle', { detail: message }));
                } else if (message.type === 'platform_metrics') {
                    window.dispatchEvent(new CustomEvent('ws-platform_metrics', { detail: message }));
                }
            } catch (err) {
                console.error('WebSocket message parse error:', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket Disconnected');
            ws.current = null;
            // Reconnect after 3 seconds
            reconnectTimeout.current = setTimeout(() => {
                connect();
            }, 3000);
        };

        socket.onerror = (error) => {
            console.error('WebSocket Error:', error);
            socket.close();
        };

        ws.current = socket;
    }, [isAuthenticated, token, url, addNotification]);

    useEffect(() => {
        connect();

        return () => {
            if (ws.current) {
                ws.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [connect]);

    const sendMessage = useCallback((msg: any) => {
        if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify(msg));
        } else {
            console.warn('WebSocket not connected, cannot send message');
        }
    }, []);

    return { sendMessage };
};
