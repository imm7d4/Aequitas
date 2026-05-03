import React from 'react';
import { Box, Paper, Typography, Tooltip, alpha, useTheme } from '@mui/material';

interface MetricCardProps {
    label: string;
    value: string;
    icon?: React.ReactNode;
    color?: string;
    subValue?: string;
    tooltip?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ 
    label, value, icon, color = 'text.primary', subValue, tooltip 
}) => {
    const theme = useTheme();
    return (
        <Tooltip title={tooltip} arrow placement="top">
            <Paper
                elevation={0}
                sx={{
                    px: 1, py: 0.75, borderRadius: 1.5, border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper', display: 'flex', flexDirection: 'column',
                    minWidth: { xs: 90, md: 110 }, flexGrow: 1, flexShrink: 0,
                    transition: 'all 0.2s ease', cursor: tooltip ? 'help' : 'default',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: 'primary.light' }
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.2 }}>
                    {icon && <Box sx={{ color: 'text.secondary', display: 'flex', '& svg': { fontSize: 14 } }}>{icon}</Box>}
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                        {label}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                    <Typography variant="caption" fontWeight={800} sx={{ color, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' }}>
                        {value}
                    </Typography>
                    {subValue && <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.55rem' }}>{subValue}</Typography>}
                </Box>
            </Paper>
        </Tooltip>
    );
};
