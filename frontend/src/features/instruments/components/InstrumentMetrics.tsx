import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Instrument } from '../types/instrument.types';
import { MarketData } from '@/features/market/types/market.types';

interface InstrumentMetricsProps {
    instrument: Instrument;
    marketData: MarketData | null;
    ltp: number;
    isPositive: boolean;
}

function MetricCard({ 
    label, 
    value, 
    icon, 
    color = 'text.primary',
    subValue 
}: { 
    label: string, 
    value: string, 
    icon?: React.ReactNode, 
    color?: string,
    subValue?: string
}) {
    return (
        <Paper
            elevation={0}
            sx={{
                px: 1,
                py: 0.75,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: { xs: 90, md: 110 },
                flexGrow: 1,
                flexShrink: 0, 
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.01)',
                    borderColor: 'primary.light'
                }
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.2 }}>
                {icon && <Box sx={{ color: 'text.secondary', display: 'flex', '& svg': { fontSize: 14 } }}>{icon}</Box>}
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {label}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                <Typography variant="caption" fontWeight={800} sx={{ color, fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' }}>
                    {value}
                </Typography>
                {subValue && (
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.55rem' }}>
                        {subValue}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
}

export const InstrumentMetrics: React.FC<InstrumentMetricsProps> = ({
    instrument,
    marketData,
    ltp,
    isPositive
}) => {
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 1,
            mb: 1.5,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2 }
        }}>
            <MetricCard 
                label="Volume" 
                value={marketData?.volume?.toLocaleString() || '--'} 
                icon={<BarChartIcon fontSize="small" />}
            />
            <MetricCard 
                label="Day High" 
                value={marketData ? `₹${marketData.high.toFixed(2)}` : '--'} 
                icon={<ShowChartIcon fontSize="small" />}
                color="success.main"
            />
            <MetricCard 
                label="Day Low" 
                value={marketData ? `₹${marketData.low.toFixed(2)}` : '--'} 
                icon={<TimelineIcon fontSize="small" />}
                color="error.main"
            />
            <MetricCard 
                label="VWAP" 
                value={marketData ? `₹${(marketData.low + (marketData.high - marketData.low) * 0.45).toFixed(2)}` : '--'} 
                subValue={instrument.sector}
            />
            <MetricCard 
                label="Open" 
                value={marketData ? `₹${marketData.open.toFixed(2)}` : '--'} 
            />
            <MetricCard 
                label="Prev Close" 
                value={marketData ? `₹${marketData.prevClose.toFixed(2)}` : '--'} 
            />

            {/* Day Range Visual */}
            <Paper
                elevation={0}
                sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minWidth: 160,
                    flexGrow: 1.5,
                    flexShrink: 0
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>DAY RANGE</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>
                        {marketData ? (((ltp - marketData.low) / (marketData.high - marketData.low)) * 100).toFixed(0) : 0}%
                    </Typography>
                </Box>
                <Box sx={{ position: 'relative', height: 4, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            left: 0, 
                            top: 0, 
                            height: '100%', 
                            width: marketData ? `${((ltp - marketData.low) / (marketData.high - marketData.low)) * 100}%` : '0%',
                            bgcolor: isPositive ? 'success.main' : 'error.main',
                            transition: 'width 0.5s ease'
                        }} 
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>L: {marketData?.low.toFixed(1)}</Typography>
                    <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>H: {marketData?.high.toFixed(1)}</Typography>
                </Box>
            </Paper>

            <MetricCard 
                label="52W High" 
                value={marketData ? `₹${(marketData.prevClose * 1.4).toFixed(2)}` : '--'} 
            />
            <MetricCard 
                label="52W Low" 
                value={marketData ? `₹${(marketData.prevClose * 0.7).toFixed(2)}` : '--'} 
            />
        </Box>
    );
};
