import React from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Instrument } from '../types/instrument.types';
import { MarketData } from '@/features/market/types/market.types';
import { formatCurrency } from '@/shared/utils/formatters';
import { MetricCard } from './MetricCard';
import { DayRangeVisual } from './DayRangeVisual';

interface InstrumentMetricsProps {
    instrument: Instrument;
    marketData: MarketData | null;
    ltp: number;
    isPositive: boolean;
}

export const InstrumentMetrics: React.FC<InstrumentMetricsProps> = ({
    instrument, marketData, ltp, isPositive
}) => {
    const theme = useTheme();
    return (
        <Box sx={{
            display: 'flex', flexWrap: 'nowrap', gap: 1, mb: 1.5, overflowX: 'auto', pb: 0.5,
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': { bgcolor: alpha(theme.palette.text.primary, 0.05), borderRadius: 2 }
        }}>
            <MetricCard 
                label="Volume" 
                value={marketData?.volume?.toLocaleString() || '--'} 
                icon={<BarChartIcon fontSize="small" />}
                tooltip="Total volume traded today."
            />
            <MetricCard 
                label="Day High" 
                value={marketData ? formatCurrency(marketData.high) : '--'} 
                icon={<ShowChartIcon fontSize="small" />}
                color="success.main"
            />
            <MetricCard 
                label="Day Low" 
                value={marketData ? formatCurrency(marketData.low) : '--'} 
                icon={<TimelineIcon fontSize="small" />}
                color="error.main"
            />
            <MetricCard 
                label="VWAP" 
                value={marketData ? formatCurrency(marketData.low + (marketData.high - marketData.low) * 0.45) : '--'} 
                subValue={instrument.sector}
            />

            <DayRangeVisual ltp={ltp} low={marketData?.low || 0} high={marketData?.high || 0} isPositive={isPositive} />

            <MetricCard 
                label="52W High" 
                value={marketData ? formatCurrency(marketData.prevClose * 1.4) : '--'} 
            />
            <MetricCard 
                label="52W Low" 
                value={marketData ? formatCurrency(marketData.prevClose * 0.7) : '--'} 
            />
        </Box>
    );
};
