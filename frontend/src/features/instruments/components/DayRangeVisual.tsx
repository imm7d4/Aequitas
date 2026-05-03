import React from 'react';
import { Box, Paper, Typography, Tooltip, alpha, useTheme } from '@mui/material';
import { formatCurrency } from '@/shared/utils/formatters';

interface DayRangeVisualProps {
    ltp: number;
    low: number;
    high: number;
    isPositive: boolean;
}

export const DayRangeVisual: React.FC<DayRangeVisualProps> = ({ ltp, low, high, isPositive }) => {
    const theme = useTheme();
    const range = high - low;
    const progress = range > 0 ? ((ltp - low) / range) * 100 : 0;

    return (
        <Tooltip title="Day's price range between low and high" arrow placement="top">
            <Paper
                elevation={0}
                sx={{
                    px: 1.5, py: 0.75, borderRadius: 1.5, border: '1px solid', borderColor: 'divider',
                    bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', minWidth: 160,
                    flexGrow: 1.5, flexShrink: 0, cursor: 'help',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02), borderColor: 'primary.light' }
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>DAY RANGE</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>{progress.toFixed(0)}%</Typography>
                </Box>
                <Box sx={{ position: 'relative', height: 4, bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2, overflow: 'hidden' }}>
                    <Box sx={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${progress}%`, bgcolor: isPositive ? 'success.main' : 'error.main' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>L: {formatCurrency(low, true, 1)}</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>H: {formatCurrency(high, true, 1)}</Typography>
                </Box>
            </Paper>
        </Tooltip>
    );
};
