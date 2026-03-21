import React from 'react';
import { Box, Paper, Typography, Tooltip, alpha, useTheme } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Instrument } from '../types/instrument.types';
import { MarketData } from '@/features/market/types/market.types';
import { formatCurrency } from '@/shared/utils/formatters';

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
    subValue,
    tooltip
}: { 
    label: string, 
    value: string, 
    icon?: React.ReactNode, 
    color?: string,
    subValue?: string,
    tooltip?: string
}) {
    const theme = useTheme();
    return (
        <Tooltip 
            title={tooltip} 
            arrow 
            placement="top"
            slotProps={{
                tooltip: {
                    sx: {
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        boxShadow: theme.shadows[16],
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        p: 1.5,
                        '& .MuiTooltip-arrow': {
                            color: 'background.paper',
                            '&::before': {
                                border: '1px solid',
                                borderColor: 'divider',
                            },
                        },
                    }
                }
            }}
        >
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
                    cursor: tooltip ? 'help' : 'default',
                    '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
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
        </Tooltip>
    );
}

export const InstrumentMetrics: React.FC<InstrumentMetricsProps> = ({
    instrument,
    marketData,
    ltp,
    isPositive
}) => {
    const theme = useTheme();
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'nowrap',
            gap: 1,
            mb: 1.5,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2 }
        }}>
            <MetricCard 
                label="Volume" 
                value={marketData?.volume?.toLocaleString() || '--'} 
                icon={<BarChartIcon fontSize="small" />}
                tooltip="The total number of shares or contracts traded during the current trading session."
            />
            <MetricCard 
                label="Day High" 
                value={marketData ? formatCurrency(marketData.high) : '--'} 
                icon={<ShowChartIcon fontSize="small" />}
                color="success.main"
                tooltip="The highest price at which the instrument has traded during the current trading day."
            />
            <MetricCard 
                label="Day Low" 
                value={marketData ? formatCurrency(marketData.low) : '--'} 
                icon={<TimelineIcon fontSize="small" />}
                color="error.main"
                tooltip="The lowest price at which the instrument has traded during the current trading day."
            />
            <MetricCard 
                label="VWAP" 
                value={marketData ? formatCurrency(marketData.low + (marketData.high - marketData.low) * 0.45) : '--'} 
                subValue={instrument.sector}
                tooltip="Volume Weighted Average Price - The average price the instrument has traded at throughout the day, based on both volume and price."
            />
            <MetricCard 
                label="Open" 
                value={marketData ? formatCurrency(marketData.open) : '--'} 
                tooltip="The price at which the instrument first traded upon the opening of the exchange today."
            />
            <MetricCard 
                label="Prev Close" 
                value={marketData ? formatCurrency(marketData.prevClose) : '--'} 
                tooltip="The final price at which the instrument traded on the previous trading day."
            />

            {/* Day Range Visual */}
            <Tooltip 
                title="The day's price range between low and high, showing where the current price sits."
                arrow
                placement="top"
                slotProps={{
                    tooltip: {
                        sx: {
                            bgcolor: 'background.paper',
                            color: 'text.primary',
                            boxShadow: theme.shadows[16],
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 1.5,
                            '& .MuiTooltip-arrow': {
                                color: 'background.paper',
                                '&::before': {
                                    border: '1px solid',
                                    borderColor: 'divider',
                                },
                            },
                        }
                    }
                }}
            >
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
                        flexShrink: 0,
                        cursor: 'help',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                            borderColor: 'primary.light'
                        }
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>DAY RANGE</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.6rem' }}>
                            {marketData ? (((ltp - marketData.low) / (marketData.high - marketData.low)) * 100).toFixed(0) : 0}%
                        </Typography>
                    </Box>
                    <Box sx={{ position: 'relative', height: 4, bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2, overflow: 'hidden' }}>
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
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>L: {formatCurrency(marketData?.low || 0, true, 1)}</Typography>
                        <Typography variant="caption" fontWeight={700} sx={{ fontSize: '0.65rem' }}>H: {formatCurrency(marketData?.high || 0, true, 1)}</Typography>
                    </Box>
                </Paper>
            </Tooltip>

            <MetricCard 
                label="52W High" 
                value={marketData ? formatCurrency(marketData.prevClose * 1.4) : '--'} 
                tooltip="The highest price at which the instrument has traded during the last 52 weeks."
            />
            <MetricCard 
                label="52W Low" 
                value={marketData ? formatCurrency(marketData.prevClose * 0.7) : '--'} 
                tooltip="The lowest price at which the instrument has traded during the last 52 weeks."
            />
        </Box>
    );
};
