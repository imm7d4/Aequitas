export type EventClassification = 'USER_ACTION' | 'SYSTEM_EVENT' | 'ERROR_EVENT';

export type Severity = 'warning' | 'error' | 'fatal';

export interface TelemetryEvent {
    event_name: string;
    event_version: string;
    classification: EventClassification;
    severity?: Severity;
    metadata?: Record<string, any>;
}

export interface EventEnvelope extends TelemetryEvent {
    timestamp: string; // ISO 8601
    session_id: string;
    correlation_id: string;
    route: string;
}

export interface TelemetryConfig {
    batchSize: number;
    flushInterval: number;
    maxBufferSize: number;
    enabled: boolean;
}
