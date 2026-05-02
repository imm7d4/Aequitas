import React from 'react';
import { Box, Typography, Chip, Tooltip, Paper } from '@mui/material';
import { Instrument } from '../../types/instrument.types';
import { InstrumentIntelligence } from '../../hooks/useInstrumentIntelligence';

interface IntelligenceRibbonProps {
    instrument: Instrument;
    intelligence: InstrumentIntelligence;
    tooltipSlotProps: any;
}

export const IntelligenceRibbon: React.FC<IntelligenceRibbonProps> = ({
    instrument, intelligence, tooltipSlotProps
}) => {
    return (
        <Box sx={{ 
            display: { xs: 'none', lg: 'flex' }, 
            alignItems: 'center', 
            gap: { lg: 1, xl: 1.5 }, 
            flexGrow: 1, 
            justifyContent: 'center',
            px: { lg: 0.5, xl: 1.5 },
            overflow: 'hidden'
        }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                    label={instrument.sector} size="small" variant="outlined" 
                    sx={{ borderRadius: '12px', fontWeight: 700, fontSize: '0.62rem', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)', display: { lg: 'none', xl: 'inline-flex' } }} 
                />
            </Box>

            <Box sx={{ display: 'flex', gap: { lg: 0.8, xl: 1.5 }, borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider', px: { lg: 1, xl: 2 } }}>
                <Tooltip title="Relative Volume" arrow slotProps={tooltipSlotProps}>
                    <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.5rem' }}>RVOL</Typography>
                        <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem' }}>
                            {intelligence.relativeVolume ? `${intelligence.relativeVolume.toFixed(2)}x` : '--'}
                        </Typography>
                    </Box>
                </Tooltip>
                <Tooltip title="Relative Strength Index" arrow slotProps={tooltipSlotProps}>
                    <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.5rem' }}>RSI (14)</Typography>
                        <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem' }} color={intelligence.rsi && (intelligence.rsi > 70 || intelligence.rsi < 30) ? 'warning.main' : 'text.primary'}>
                            {intelligence.rsi ? intelligence.rsi.toFixed(1) : '--'}
                        </Typography>
                    </Box>
                </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { lg: 0.8, xl: 1.2 } }}>
                <Tooltip title="Trend Direction" arrow slotProps={tooltipSlotProps}>
                    <Box sx={{ display: { lg: 'none', xl: 'block' }, cursor: 'help' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.55rem', textAlign: 'right' }}>TREND</Typography>
                        <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem' }}>{intelligence.trend}</Typography>
                    </Box>
                </Tooltip>
                <Tooltip title="Market Sentiment" arrow slotProps={tooltipSlotProps}>
                    <Paper elevation={0} sx={{ 
                        px: 1.2, py: 0.3, borderRadius: '20px', 
                        background: intelligence.score > 70 ? 'linear-gradient(45deg, #10b981, #059669)' : intelligence.score < 30 ? 'linear-gradient(45deg, #ef4444, #dc2626)' : 'linear-gradient(45deg, #6b7280, #4b5563)',
                        color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'help'
                    }}>
                        <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: '0.02em', fontSize: '0.6rem' }}>{intelligence.sentiment}</Typography>
                    </Paper>
                </Tooltip>
            </Box>
        </Box>
    );
};
