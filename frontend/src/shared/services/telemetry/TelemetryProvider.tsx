import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { telemetryService } from './telemetryService';

interface TelemetryContextType {
    correlationId: string;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();

    const prevLocationRef = React.useRef<string>(location.pathname);

    // Generate a new correlationId on setiap route change
    const correlationId = useMemo(() => {
        const id = `corr_${Math.random().toString(36).substring(2, 15)}`;
        telemetryService.setCorrelationId(id);
        return id;
    }, [location.pathname]);

    useEffect(() => {
        const startTime = window.performance.now();
        const currentPath = location.pathname;
        const previousPath = prevLocationRef.current;

        // Only track route change if there's an actual transition
        if (currentPath !== previousPath || !correlationId) {
            telemetryService.track({
                event_name: 'navigation.route_change',
                event_version: 'v1',
                classification: 'SYSTEM_EVENT',
                metadata: {
                    from: previousPath,
                    to: currentPath,
                }
            });
            prevLocationRef.current = currentPath;
        }

        // Simple TTI estimation: log when the effect runs after mount/update
        const tti = window.performance.now() - startTime;
        telemetryService.track({
            event_name: 'performance.tti',
            event_version: 'v1',
            classification: 'SYSTEM_EVENT',
            metadata: {
                route: currentPath,
                duration_ms: tti,
            }
        });
    }, [correlationId, location.pathname]);

    return (
        <TelemetryContext.Provider value={{ correlationId }}>
            {children}
        </TelemetryContext.Provider>
    );
};

export const useTelemetry = () => {
    const context = useContext(TelemetryContext);
    if (!context) {
        throw new Error('useTelemetry must be used within a TelemetryProvider');
    }

    return {
        track: telemetryService.track.bind(telemetryService),
        correlationId: context.correlationId,
    };
};
