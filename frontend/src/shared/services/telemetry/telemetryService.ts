import type { TelemetryEvent, EventEnvelope, TelemetryConfig } from './telemetry.types';
import { api as apiClient } from '../../../lib/api/apiClient';

const SESSION_ID = `sess_${Math.random().toString(36).substring(2, 15)}`;

const DEFAULT_CONFIG: TelemetryConfig = {
    batchSize: 10,
    flushInterval: 5000, // 5 seconds
    maxBufferSize: 100,
    enabled: import.meta.env.PROD,
};

class TelemetryService {
    private buffer: EventEnvelope[] = [];
    private config: TelemetryConfig;
    private correlationId: string = '';
    private flushTimer: any = null;
    private failureReported: boolean = false;
    private seenErrors: Set<string> = new Set();

    constructor(config: Partial<TelemetryConfig> = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };

        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => this.flush(true));
            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') this.flush(true);
            });
        }
    }

    public setCorrelationId(id: string) {
        this.correlationId = id;
    }

    public track(event: TelemetryEvent) {
        if (!this.config.enabled && !import.meta.env.DEV) return;

        // Deduplicate errors
        if (event.classification === 'ERROR_EVENT') {
            const errorKey = `${event.event_name}:${JSON.stringify(event.metadata)}`;
            if (this.seenErrors.has(errorKey)) return;
            this.seenErrors.add(errorKey);
        }

        try {
            const envelope: EventEnvelope = {
                ...event,
                timestamp: new Date().toISOString(),
                session_id: SESSION_ID,
                correlation_id: this.correlationId,
                route: window.location.pathname,
            };

            if (import.meta.env.DEV) {
                console.log(`[Telemetry] ${envelope.classification}: ${envelope.event_name}`, envelope);
            }

            this.addToBuffer(envelope);

            if (event.severity === 'fatal') {
                this.flush(true);
            }
        } catch (error) {
            this.reportInternalFailure();
        }
    }

    private addToBuffer(envelope: EventEnvelope) {
        if (this.buffer.length >= this.config.maxBufferSize) {
            this.buffer.shift(); // Drop oldest
        }

        this.buffer.push(envelope);

        if (this.buffer.length >= this.config.batchSize) {
            this.flush();
        } else if (!this.flushTimer) {
            this.flushTimer = setTimeout(() => this.flush(), this.config.flushInterval);
        }
    }

    private async flush(immediate: boolean = false) {
        if (this.flushTimer) {
            clearTimeout(this.flushTimer);
            this.flushTimer = null;
        }

        if (this.buffer.length === 0) return;

        const eventsToFlush = [...this.buffer];
        this.buffer = [];

        try {
            await apiClient.post('/telemetry', { events: eventsToFlush });
            if (import.meta.env.DEV) {
                console.debug(`[Telemetry] Flushed ${eventsToFlush.length} events to backend`);
            }
        } catch (error) {
            this.reportInternalFailure();
            // Put events back if not immediate (don't lose data on network failure)
            if (!immediate) {
                this.buffer = [...eventsToFlush, ...this.buffer].slice(-this.config.maxBufferSize);
            }
        }
    }

    private reportInternalFailure() {
        if (this.failureReported) return;
        this.failureReported = true;
        console.error('[Telemetry] Service failed locally');
    }
}

export const telemetryService = new TelemetryService();
