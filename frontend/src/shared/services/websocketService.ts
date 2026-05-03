// WebSocket service for real-time updates

type MessageType = 'subscribe' | 'unsubscribe' | 'candle' | 'error';

interface WSMessage {
    type: MessageType;
    symbol?: string;
    data?: any;
}

import { useAuthStore } from '../../features/auth/hooks/useAuth';

class WebSocketService {
    private ws: WebSocket | null = null;
    private subscriptions = new Map<string, Set<(candle: any) => void>>();
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectDelay = 2000;
    private url: string;

    constructor() {
        // Get base URL from environment or default to localhost
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

        // Convert HTTP(S) URL to WS(S) URL
        const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
        const baseUrl = apiUrl.replace(/^https?:\/\//, '').replace(/\/api\/?$/, '');

        this.url = `${wsProtocol}://${baseUrl}/ws`;
    }

    private messageQueue: WSMessage[] = [];

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        const token = useAuthStore.getState().token;
        if (!token) {
            return;
        }

        this.ws = new WebSocket(`${this.url}?token=${token}`);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;

            // Flush message queue
            while (this.messageQueue.length > 0) {
                const msg = this.messageQueue.shift();
                if (msg) this.send(msg);
            }

            // Resubscribe to existing symbols
            this.subscriptions.forEach((_, symbol) => {
                this.send({ type: 'subscribe', symbol });
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const message: WSMessage = JSON.parse(event.data);
                if (message.type === 'candle' && message.data) {
                    const symbol = message.data.instrumentId;
                    const callbacks = this.subscriptions.get(symbol);
                    if (callbacks) {
                        callbacks.forEach((cb) => cb(message.data));
                    }
                } else if (message.type === 'error') {
                }
            } catch (err) {
            }
        };

        this.ws.onclose = () => {
            this.handleReconnect();
        };

        this.ws.onerror = () => {
        };
    }

    private handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
        }
    }

    private send(message: WSMessage) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
        }
    }

    subscribe(symbol: string, callback: (candle: any) => void) {
        let callbacks = this.subscriptions.get(symbol);
        if (!callbacks) {
            callbacks = new Set();
            this.subscriptions.set(symbol, callbacks);
            this.send({ type: 'subscribe', symbol });
        }
        callbacks.add(callback);
    }

    unsubscribe(symbol: string, callback: (candle: any) => void) {
        const callbacks = this.subscriptions.get(symbol);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.subscriptions.delete(symbol);
                this.send({ type: 'unsubscribe', symbol });
            }
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

export const websocketService = new WebSocketService();
