import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
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

    const getPageName = (path: string) => {
        if (path === '/') return 'Landing Page';
        if (path === '/dashboard') return 'Trading Dashboard';
        if (path === '/portfolio') return 'Portfolio View';
        if (path === '/diagnostics') return 'Trade Diagnostics';
        if (path === '/watchlists') return 'Watchlists';
        if (path === '/orders') return 'Order History';
        if (path === '/instruments') return 'Market Instruments';
        if (path === '/profile') return 'System Profile';
        if (path === '/admin') return 'Admin Portal';
        if (path === '/admin/instruments/new') return 'New Instrument Config';
        if (path === '/admin/market-hours') return 'Market Hours Mgmt';
        if (path === '/admin/manage-hours') return 'Schedule Management';
        if (path === '/admin/market-holidays') return 'Market Holidays';
        if (path === '/admin/control-center') return 'Platform Control Center';
        if (path === '/user-management') return 'User Management';
        if (path === '/wallet-management') return 'Wallet Management';
        if (path === '/admin/market') return 'Market Operations';
        if (path === '/admin/audit') return 'Forensic Audit Logs';
        if (path === '/admin/risk') return 'Risk Governance';
        if (path === '/admin/tickets') return 'Helpdesk Tickets';
        if (path === '/education') return 'Education Hub';
        
        if (path.startsWith('/instruments/')) return 'Instrument Details';
        if (path.startsWith('/education/')) return 'Education Module';
        if (path.startsWith('/admin/instruments/edit/')) return 'Edit Instrument';

        // Strip leading slash for others
        return path.startsWith('/') ? path.substring(1) : path;
    };

    useEffect(() => {
        const startTime = window.performance.now();
        const currentPath = location.pathname;
        const previousPath = prevLocationRef.current;

        // Only track route change if there's an actual transition
        if (currentPath !== previousPath || !correlationId) {
            // Skip paths that require dynamic data (will be tracked by components for specificity)
            if (currentPath.startsWith('/instruments/') && currentPath !== '/instruments') {
                prevLocationRef.current = currentPath;
                return;
            }
            if (currentPath.startsWith('/education/') && currentPath !== '/education') {
                prevLocationRef.current = currentPath;
                return;
            }

            const pageName = getPageName(currentPath);
            telemetryService.track({
                event_name: 'PAGE_VISIT',
                event_version: 'v1',
                classification: 'USER_ACTION',
                description: pageName,
                properties: {
                    from: previousPath,
                    to: currentPath,
                    page_name: pageName
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

    const track = useCallback((event: any) => {
        telemetryService.track(event);
    }, []);

    return useMemo(() => ({
        track,
        correlationId: context.correlationId,
    }), [track, context.correlationId]);
};
