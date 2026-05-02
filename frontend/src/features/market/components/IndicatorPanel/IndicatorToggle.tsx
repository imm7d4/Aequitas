import React from 'react';
import { Box, Typography, Switch, useTheme } from '@mui/material';

interface IndicatorToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
}

/**
 * A specialized toggle for technical indicators.
 * Optimized to be defined outside the parent to prevent unmounts.
 */
export const IndicatorToggle: React.FC<IndicatorToggleProps> = ({ 
    label, 
    description, 
    enabled, 
    onToggle 
}) => {
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 1,
            px: 0.5,
            transition: 'background-color 0.2s ease',
            '&:hover': { 
                bgcolor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)', 
                borderRadius: 2 
            }
        }}>
            <Box sx={{ mr: 2 }}>
                <Typography variant="body2" fontWeight={700} sx={{ letterSpacing: '-0.01em', color: 'text.primary' }}>
                    {label}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ display: 'block', lineHeight: 1.2 }}>
                    {description}
                </Typography>
            </Box>
            <Switch
                checked={enabled}
                onChange={onToggle}
                size="small"
                sx={SWITCH_STYLES(isLight)}
            />
        </Box>
    );
};

// Static styles extracted to avoid object recreation on every render
const SWITCH_STYLES = (isLight: boolean) => ({
    width: 32,
    height: 18,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: '2px',
        transitionDuration: '300ms',
        '&.Mui-checked': {
            transform: 'translateX(14px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                backgroundColor: 'primary.main',
                opacity: 1,
                border: 0,
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 14,
        height: 14,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    '& .MuiSwitch-track': {
        borderRadius: 9,
        backgroundColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
        opacity: 1,
    },
});
