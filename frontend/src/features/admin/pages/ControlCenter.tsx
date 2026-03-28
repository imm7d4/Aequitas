import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Card, CardContent, LinearProgress } from '@mui/material';
import { 
    Speed as TPMIcon, 
    People as DAUIcon, 
    Power as SessionsIcon,
    Warning as AlertIcon 
} from '@mui/icons-material';

interface PlatformMetrics {
    tpm: number;
    dau: number;
    concurrentSessions: number;
    timestamp: string;
}

const MetricCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    loading?: boolean;
}> = ({ title, value, icon, color, loading }) => (
    <Card sx={{ height: '100%', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                    p: 1.5, 
                    borderRadius: '12px', 
                    bgcolor: `${color}15`, 
                    color: color,
                    display: 'flex',
                    mr: 2
                }}>
                    {icon}
                </Box>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                    {title}
                </Typography>
            </Box>
            {loading ? (
                <LinearProgress sx={{ mt: 2, borderRadius: 2 }} />
            ) : (
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                    {value}
                </Typography>
            )}
        </CardContent>
    </Card>
);

interface Threshold {
    metricName: string;
    value: number;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    isEnabled: boolean;
}

const ThresholdRow: React.FC<{ threshold: Threshold; onUpdate: (val: number) => void }> = ({ threshold, onUpdate }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: '1px solid #eee' }}>
        <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{threshold.metricName.replace(/_/g, ' ').toUpperCase()}</Typography>
            <Typography variant="caption" color="text.secondary">Severity: {threshold.severity}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ 
                width: 8, height: 8, borderRadius: '50%', 
                bgcolor: threshold.severity === 'CRITICAL' ? 'error.main' : threshold.severity === 'WARNING' ? 'warning.main' : 'info.main',
                mr: 2
            }} />
            <input 
                type="number" 
                defaultValue={threshold.value} 
                onBlur={(e) => onUpdate(parseFloat(e.target.value))}
                style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </Box>
    </Box>
);

export const ControlCenter: React.FC = () => {
    const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
    const [config, setConfig] = useState<{ alertThresholds: Threshold[] } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleMetricsUpdate = (event: any) => {
            if (event.detail.type === 'platform_metrics') {
                setMetrics(event.detail.data);
                setLoading(false);
            }
        };

        window.addEventListener('ws-platform_metrics', handleMetricsUpdate);
        
        // Initial fetch
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('token')}` };
        
        Promise.all([
            fetch(`${import.meta.env.VITE_API_URL}/admin/platform/metrics`, { headers }).then(res => res.json()),
            fetch(`${import.meta.env.VITE_API_URL}/admin/config`, { headers }).then(res => res.json())
        ])
        .then(([metricsData, configData]) => {
            setMetrics(metricsData);
            setConfig(configData.data);
            setLoading(false);
        })
        .catch(console.error);

        return () => window.removeEventListener('ws-platform_metrics', handleMetricsUpdate);
    }, []);

    const updateThreshold = (metricName: string, newValue: number) => {
        if (!config) return;
        const newThresholds = config.alertThresholds.map(t => 
            t.metricName === metricName ? { ...t, value: newValue } : t
        );
        const newConfig = { ...config, alertThresholds: newThresholds };
        
        fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newConfig)
        })
        .then(() => setConfig(newConfig))
        .catch(console.error);
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                    Platform Control Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Real-time operational health and executive KPIs (SLA: ≤ 5s)
                </Typography>
            </Box>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <MetricCard 
                        title="Trades Per Minute (TPM)" 
                        value={metrics?.tpm.toFixed(2) || 0} 
                        icon={<TPMIcon />} 
                        color="#2196f3"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MetricCard 
                        title="Daily Active Users (DAU)" 
                        value={metrics?.dau || 0} 
                        icon={<DAUIcon />} 
                        color="#4caf50"
                        loading={loading}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MetricCard 
                        title="Concurrent Sessions" 
                        value={metrics?.concurrentSessions || 0} 
                        icon={<SessionsIcon />} 
                        color="#ff9800"
                        loading={loading}
                    />
                </Grid>

                {/* System Alerts Section Placeholder */}
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

                {/* Threshold Configuration Section */}
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
