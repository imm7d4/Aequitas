import React, { useMemo } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { Instrument } from '../types/instrument.types';
import { MarketData } from '@/features/market/types/market.types';
import { InstrumentIntelligence } from '../hooks/useInstrumentIntelligence';
import { Identity } from './InstrumentHeader/Identity';
import { IntelligenceRibbon } from './InstrumentHeader/IntelligenceRibbon';
import { PriceActions } from './InstrumentHeader/PriceActions';

interface InstrumentHeaderProps {
    instrument: Instrument;
    marketData: MarketData | null;
    ltp: number;
    tickColor: string;
    intelligence: InstrumentIntelligence;
    isStarred: boolean;
    onWatchlistToggle: () => void;
    onSetAlert: () => void;
}

export const InstrumentHeader: React.FC<InstrumentHeaderProps> = (props) => {
    const theme = useTheme();

    // Memoize tooltip styles to prevent object recreation on every price tick
    const tooltipSlotProps = useMemo(() => ({
        tooltip: {
            sx: {
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: theme.shadows[16],
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                p: 1.5,
                '& .MuiTooltip-arrow': { color: 'background.paper', '&::before': { border: '1px solid', borderColor: 'divider' } },
            }
        }
    }), [theme]);

    return (
        <Box sx={{ 
            position: 'sticky', top: 64, zIndex: 110, 
            background: theme.palette.mode === 'light' ? 'rgba(249, 250, 251, 0.85)' : alpha(theme.palette.background.default, 0.95),
            backdropFilter: 'blur(20px)', borderBottom: '1px solid', borderColor: 'divider',
            px: { xs: 2, lg: 4 }, py: { xs: 1, md: 1.5 }, transition: 'all 0.3s ease'
        }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
                <Identity instrument={props.instrument} />
                <IntelligenceRibbon 
                    instrument={props.instrument} 
                    intelligence={props.intelligence} 
                    tooltipSlotProps={tooltipSlotProps} 
                />
                <PriceActions 
                    marketData={props.marketData}
                    ltp={props.ltp}
                    tickColor={props.tickColor}
                    isStarred={props.isStarred}
                    onWatchlistToggle={props.onWatchlistToggle}
                    onSetAlert={props.onSetAlert}
                    tooltipSlotProps={tooltipSlotProps} 
                />
            </Box>
        </Box>
    );
};
