import React from 'react';
import { 
    Box, Typography, Card, CardContent, LinearProgress
} from '@mui/material';
import { Threshold } from '../services/adminService';

export const MetricCard: React.FC<{ 
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

export const ThresholdRow: React.FC<{ threshold: Threshold; onUpdate: (val: number) => void }> = ({ threshold, onUpdate }) => (
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
