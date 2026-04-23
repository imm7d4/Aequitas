import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { 
    Speed as TPMIcon, 
    People as DAUIcon, 
    Power as SessionsIcon,
    Warning as AlertIcon 
} from '@mui/icons-material';
import { adminService, PlatformMetrics, AdminConfig } from '../services/adminService';
import { MetricCard, ThresholdRow } from '../components/ControlCenterMetrics';

export const ControlCenter: React.FC = () => {
    const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
    const [config, setConfig] = useState<AdminConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleMetricsUpdate = (event: any) => {
            if (event.detail.type === 'platform_metrics') {
                setMetrics(event.detail.data);
                setLoading(false);
            }
        };

        window.addEventListener('ws-platform_metrics', handleMetricsUpdate);
        
        const loadInitialData = async () => {
            try {
                const [metricsData, configData] = await Promise.all([
                    adminService.getPlatformMetrics(),
                    adminService.getAdminConfig()
                ]);
                setMetrics(metricsData);
                setConfig(configData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();

        return () => window.removeEventListener('ws-platform_metrics', handleMetricsUpdate);
    }, []);

    const updateThreshold = async (metricName: string, newValue: number) => {
        if (!config) return;
        const newThresholds = config.alertThresholds.map(t => 
            t.metricName === metricName ? { ...t, value: newValue } : t
        );
        const newConfig = { ...config, alertThresholds: newThresholds };
        
        try {
            await adminService.updateAdminConfig(newConfig);
            setConfig(newConfig);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <MetricCard 
                        title="Trades Per Minute (TPM)" 
                        value={metrics?.tpm.toFixed(2) || 0} 
                        icon={<TPMIcon />} color="#2196f3" loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MetricCard 
                        title="Daily Active Users (DAU)" 
                        value={metrics?.dau || 0} 
                        icon={<DAUIcon />} color="#4caf50" loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MetricCard 
                        title="Concurrent Sessions" 
                        value={metrics?.concurrentSessions || 0} 
                        icon={<SessionsIcon />} color="#ff9800" loading={loading}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <AlertIcon color="error" sx={{ mr: 2 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>Critical System Alerts</Typography>
                        </Box>
                        <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#fff5f5', borderRadius: '12px' }}>
                            <Typography color="error.main" sx={{ fontWeight: 500 }}>
                                No active critical alerts. System operating within normal parameters.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12}>
                    <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #eee' }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Operational Thresholds</Typography>
                        <Box sx={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden' }}>
                            {config?.alertThresholds.map(t => (
                                <ThresholdRow 
                                    key={t.metricName} 
                                    threshold={t} 
                                    onUpdate={(val) => updateThreshold(t.metricName, val)} 
                                />
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
