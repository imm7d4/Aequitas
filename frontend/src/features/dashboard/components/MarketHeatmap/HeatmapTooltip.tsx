import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

export const HeatmapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        if (data.depth < 2) return null;

        return (
            <Paper
                elevation={8}
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    minWidth: 200,
                }}
            >
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', mb: 0.5 }}>
                    {data.sector || 'Stock Details'}
                </Typography>
                <Typography variant="subtitle1" fontWeight={800} gutterBottom>
                    {data.fullName || data.name}
                </Typography>
                <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Current Price</Typography>
                        <Typography variant="body2" fontWeight={700}>₹{data.lastPrice?.toLocaleString('en-IN')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">Daily Change</Typography>
                        <Typography
                            variant="body2"
                            fontWeight={800}
                            sx={{ color: data.changePct >= 0 ? 'success.main' : 'error.main' }}
                        >
                            {data.changePct > 0 ? '▲' : '▼'} {Math.abs(data.changePct)?.toFixed(2)}%
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        );
    }
    return null;
};
