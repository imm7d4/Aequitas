import React, { useMemo } from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { HeatmapSector } from '../services/dashboardService';
import { HeatmapCell } from './MarketHeatmap/HeatmapCell';
import { HeatmapTooltip } from './MarketHeatmap/HeatmapTooltip';

interface MarketHeatmapProps {
    data: HeatmapSector[];
}

export function MarketHeatmap({ data }: MarketHeatmapProps): JSX.Element {
    const theme = useTheme();

    const formattedData = useMemo(() => ({
        name: 'Market',
        children: (data || []).map(sector => ({
            name: sector.name,
            children: (sector.stocks || []).map(stock => ({
                name: stock.symbol,
                fullName: stock.name,
                sector: sector.name,
                value: 1,
                changePct: stock.changePct,
                lastPrice: stock.lastPrice,
            }))
        }))
    }), [data]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : '#fff',
                backgroundImage: 'none',
            }}
        >
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h5" fontWeight={400} sx={{ letterSpacing: '-0.02em', mb: 0.5 }}>
                        Market Distribution
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Sector-wise performance of key indices
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <LegendItem color="#1b5e20" label="Positive" />
                    <LegendItem color="#b71c1c" label="Negative" />
                </Box>
            </Box>

            <Box sx={{ width: '100%', height: 600, borderRadius: 2, overflow: 'hidden' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={formattedData.children}
                        dataKey="value"
                        aspectRatio={16 / 9}
                        stroke="#fff"
                        isAnimationActive={true}
                        content={<HeatmapCell />}
                    >
                        <RechartsTooltip content={<HeatmapTooltip />} cursor={false} />
                    </Treemap>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
}

const LegendItem: React.FC<{ color: string; label: string }> = ({ color, label }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
        <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
);
