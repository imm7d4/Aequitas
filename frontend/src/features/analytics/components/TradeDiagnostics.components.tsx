import React from 'react';
import { Box, Typography, Tooltip, alpha } from '@mui/material';

export const MetricRow: React.FC<{
    label: string;
    value: string;
    subValue?: string;
    color?: string;
    tooltip: string;
}> = ({ label, value, subValue, color, tooltip }) => (
    <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Tooltip title={tooltip} arrow>
                <Typography sx={{ cursor: 'help', fontSize: '0.7rem', color: 'text.disabled' }}>[?]</Typography>
            </Tooltip>
        </Box>
        <Typography variant="body2" fontWeight={700} sx={{ fontFamily: '"Roboto Mono", monospace', color: color }}>
            {value}
        </Typography>
        {subValue && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: -0.25 }}>
                {subValue}
            </Typography>
        )}
    </Box>
);

export const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mb: 1.5, 
        pb: 0.5, 
        borderBottom: '1px solid', 
        borderColor: 'divider' 
    }}>
        {icon}
        <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
        </Typography>
    </Box>
);
