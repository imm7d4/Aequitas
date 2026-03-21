import React from 'react';
import {
    Box,
    Typography,
    Switch,
    Paper,
    Collapse,
    IconButton,
    Divider,
    useTheme,
    Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useIndicatorStore } from '../store/indicatorStore';
import { useNavigate } from 'react-router-dom';

interface IndicatorPanelProps {
    instrumentId: string;
}

export const IndicatorPanel: React.FC<IndicatorPanelProps> = ({ instrumentId }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [expanded, setExpanded] = React.useState(false);
    const { getIndicators, toggleIndicator } = useIndicatorStore();
    const indicators = getIndicators(instrumentId);

    const IndicatorToggle = ({ 
        label, 
        description, 
        enabled, 
        onToggle 
    }: { 
        label: string, 
        description: string, 
        enabled: boolean, 
        onToggle: () => void 
    }) => (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 1,
            px: 0.5,
            '&:hover': { bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }
        }}>
            <Box>
                <Typography variant="body2" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
                    {label}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={500}>
                    {description}
                </Typography>
            </Box>
            <Switch
                checked={enabled}
                onChange={onToggle}
                size="small"
                sx={{
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
                        borderRadius: 18 / 2,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        opacity: 1,
                        transition: theme.transitions.create(['background-color'], {
                            duration: 300,
                            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                        }),
                    },
                }}
            />
        </Box>
    );

    return (
        <Paper
            id="indicator-panel"
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(12px)',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.5,
                    py: 1, // Reduced padding
                    cursor: 'pointer',
                    '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.03)'
                    }
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <Box sx={{ 
                        display: 'flex', 
                        p: 0.6, // Smaller icon container
                        borderRadius: '6px', 
                        bgcolor: 'primary.main', 
                        color: 'white' 
                    }}>
                        <BarChartIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <Box>
                        <Typography variant="caption" fontWeight={800} sx={{ letterSpacing: '-0.01em', display: 'block', lineHeight: 1.2 }}>
                            Technical Indicators
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: '0.65rem' }}>
                            Analyze price action with pro tools
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip 
                        title="Learn more about Technical Indicators" 
                        arrow
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
                        <IconButton 
                            size="small" 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/education/indicators');
                            }}
                            sx={{ 
                                p: 0.2, 
                                bgcolor: 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                            }}
                        >
                            <InfoOutlinedIcon sx={{ fontSize: 12 }} />
                        </IconButton>
                    </Tooltip>
                    <IconButton size="small" sx={{ width: 24, height: 24, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                        {expanded ? <ExpandLessIcon sx={{ fontSize: 14 }} /> : <ExpandMoreIcon sx={{ fontSize: 14 }} />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={expanded}>
                <Divider />
                <Box sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                        <IndicatorToggle
                            label="SMA"
                            description="Simple Moving Average (20, 50, 200)"
                            enabled={indicators.sma.enabled}
                            onToggle={() => toggleIndicator(instrumentId, 'sma')}
                        />
                        <IndicatorToggle
                            label="EMA"
                            description="Exp. Moving Average (9, 21, 50)"
                            enabled={indicators.ema.enabled}
                            onToggle={() => toggleIndicator(instrumentId, 'ema')}
                        />
                        <IndicatorToggle
                            label="RSI"
                            description="Relative Strength Index (14)"
                            enabled={indicators.rsi.enabled}
                            onToggle={() => toggleIndicator(instrumentId, 'rsi')}
                        />
                        <IndicatorToggle
                            label="MACD"
                            description="Convergence Divergence (12, 26, 9)"
                            enabled={indicators.macd.enabled}
                            onToggle={() => toggleIndicator(instrumentId, 'macd')}
                        />
                        <IndicatorToggle
                            label="Bollinger Bands"
                            description="Volatility Bands (20, 2)"
                            enabled={indicators.bollingerBands.enabled}
                            onToggle={() => toggleIndicator(instrumentId, 'bollingerBands')}
                        />
                        <IndicatorToggle
                            label="VWAP"
                            description="Volume Weighted Avg Price"
                            enabled={indicators.vwap.enabled}
                            onToggle={() => toggleIndicator(instrumentId, 'vwap')}
                        />
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
};
