import { useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '../../features/auth/hooks/useAuth';
import { useNotificationStore } from '../store/useNotificationStore';

interface WebSocketMessage {
    type: string;
    data: any;
    symbol?: string;
}

export const useWebSocket = (url: string = 'ws://localhost:8080/ws') => {
    const ws = useRef<WebSocket | null>(null);
    const { token, isAuthenticated } = useAuthStore();
    const { addNotification } = useNotificationStore();

    // Reconnect logic
    const reconnectTimeout = useRef<NodeJS.Timeout>();

    const connect = useCallback(() => {
        if (!isAuthenticated || !token) return;
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
                    // Handle candle updates - dispatch to a market store or similar?
                    // For now, consumers can listen to this if we expose a listener mechanism.
                    // But this hook seems to be the singleton manager.
                    window.dispatchEvent(new CustomEvent('ws-candle', { detail: message }));
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
