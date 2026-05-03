import React, { useState, useCallback } from 'react';
import {
    Box, Typography, Paper, Collapse, IconButton,
    Divider, useTheme, alpha,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    BarChart as BarChartIcon,
    InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useIndicatorStore, InstrumentIndicators } from '../store/indicatorStore';
import { IndicatorToggle } from './IndicatorPanel/IndicatorToggle';

interface IndicatorPanelProps {
    instrumentId: string;
}

// Configuration driven UI to avoid JSX bloat
const INDICATOR_METADATA: Array<{ key: keyof InstrumentIndicators; label: string; description: string }> = [
    { key: 'sma', label: 'SMA', description: 'Simple Moving Average (20, 50, 200)' },
    { key: 'ema', label: 'EMA', description: 'Exp. Moving Average (9, 21, 50)' },
    { key: 'rsi', label: 'RSI', description: 'Relative Strength Index (14)' },
    { key: 'macd', label: 'MACD', description: 'Convergence Divergence (12, 26, 9)' },
    { key: 'bollingerBands', label: 'Bollinger Bands', description: 'Volatility Bands (20, 2)' },
    { key: 'vwap', label: 'VWAP', description: 'Volume Weighted Avg Price' },
];

/**
 * Production-grade Indicator Panel.
 * Uses configuration-driven rendering and stable sub-components.
 */
export const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ instrumentId }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);
    const isLight = theme.palette.mode === 'light';
    
    // Store access
    const { getIndicators, toggleIndicator } = useIndicatorStore();
    const indicators = getIndicators(instrumentId);

    const handleToggle = useCallback((key: keyof InstrumentIndicators) => {
        toggleIndicator(instrumentId, key);
    }, [instrumentId, toggleIndicator]);

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: isLight ? 'rgba(255, 255, 255, 0.7)' : alpha(theme.palette.background.paper, 0.8),
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    px: 1.5, py: 1, cursor: 'pointer',
                    '&:hover': { bgcolor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)' }
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box sx={{ display: 'flex', p: 0.6, borderRadius: '6px', bgcolor: 'primary.main', color: 'white' }}>
                        <BarChartIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={800} sx={{ display: 'block', lineHeight: 1.2 }}>
                            Technical Indicators
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem' }}>
                            Analyze price action with pro tools
                        </Typography>
                    </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton 
                        size="small" 
                        onClick={(e) => { e.stopPropagation(); navigate('/education/indicators'); }}
                        sx={{ p: 0.2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                    >
                        <InfoIcon sx={{ fontSize: 12 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ width: 24, height: 24, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        {expanded ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                </Box>
            </Box>

            {/* Collapsible Toggles Grid */}
            <Collapse in={expanded}>
                <Divider />
                <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                        {INDICATOR_METADATA.map((meta) => (
                            <IndicatorToggle
                                key={meta.key}
                                label={meta.label}
                                description={meta.description}
                                enabled={indicators[meta.key].enabled}
                                onToggle={() => handleToggle(meta.key)}
                            />
                        ))}
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};
