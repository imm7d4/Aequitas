import React from 'react';
import { Box, Typography, IconButton, Chip, Paper, Tooltip, useTheme } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import { Instrument } from '../types/instrument.types';
import { MarketData } from '@/features/market/types/market.types';
import { InstrumentIntelligence } from '../hooks/useInstrumentIntelligence';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/shared/utils/formatters';

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

export const InstrumentHeader: React.FC<InstrumentHeaderProps> = ({
    instrument,
    marketData,
    ltp,
    tickColor,
    intelligence,
    isStarred,
    onWatchlistToggle,
    onSetAlert
}) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const tooltipSlotProps = {
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
    };

    return (
        <Box sx={{ 
            position: 'sticky', 
            top: 64, 
            zIndex: 110, 
            background: 'rgba(249, 250, 251, 0.85)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid',
            borderColor: 'divider',
            px: { xs: 2, lg: 4 },
            py: { xs: 1, md: 1.5 },
            transition: 'all 0.3s ease'
        }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'nowrap', // Force single line for Pro feel
                gap: 2
            }}>
                {/* Left: Identity */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { lg: 1, xl: 2 }, flexShrink: 0 }}>
                    <IconButton
                        size="small"
                        onClick={() => navigate(-1)}
                        sx={{ 
                            bgcolor: 'background.paper', 
                            border: '1px solid', 
                            borderColor: 'divider',
                            '&:hover': { bgcolor: 'action.hover' },
                            width: 28,
                            height: 28
                        }}
                    >
                        <ArrowBackIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <Box>
                        <Typography 
                            variant="h6" 
                            fontWeight={800} 
                            sx={{ 
                                letterSpacing: '-0.02em', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5, 
                                lineHeight: 1.1,
                                fontSize: { lg: '1rem', xl: '1.25rem' } 
                            }}
                        >
                            {instrument.symbol} <Box component="span" sx={{ color: 'text.disabled', fontWeight: 300, fontSize: '0.8em' }}>/</Box> {instrument.exchange}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            fontWeight={600} 
                            sx={{ 
                                textTransform: 'uppercase', 
                                letterSpacing: '0.05em',
                                fontSize: { lg: '0.6rem', xl: '0.7rem' },
                                display: { lg: 'none', xl: 'block' } // Hide full name on standard Large
                            }}
                        >
                            {instrument.name}
                        </Typography>
                    </Box>
                </Box>

                {/* Center: Structural Intelligence Ribbon - THE NEW WHITE SPACE FILLER */}
                <Box sx={{ 
                    display: { xs: 'none', lg: 'flex' }, 
                    alignItems: 'center', 
                    gap: { lg: 1, xl: 1.5 }, 
                    flexGrow: 1, 
                    justifyContent: 'center',
                    px: { lg: 0.5, xl: 1.5 },
                    overflow: 'hidden'
                }}>
                    {/* Sector & Industry */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                            label={instrument.sector} 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                                borderRadius: '6px', 
                                fontWeight: 700, 
                                fontSize: '0.62rem', 
                                borderColor: 'divider', 
                                bgcolor: 'rgba(0,0,0,0.02)',
                                display: { lg: 'none', xl: 'inline-flex' } // Hide on standard Large
                            }} 
                        />
                        <Chip 
                            label="LARGE CAP" 
                            size="small" 
                            variant="outlined" 
                            sx={{ 
                                borderRadius: '6px', 
                                fontWeight: 700, 
                                fontSize: '0.62rem', 
                                borderColor: 'divider', 
                                opacity: 0.7,
                                display: { lg: 'none', xl: 'none', xxl: 'inline-flex' } // Hide on standard Large and XL
                            }} 
                        />
                    </Box>
 
                    {/* Pro Intelligence Metrics - RVOL & RSI */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: { lg: 0.8, xl: 1.5 }, 
                        borderLeft: '1px solid', 
                        borderRight: '1px solid', 
                        borderColor: 'divider', 
                        px: { lg: 1, xl: 2 } 
                    }}>
                        <Tooltip title="Relative Volume - Current volume relative to the average for this time of day. Values > 1 indicate high activity." arrow slotProps={tooltipSlotProps}>
                            <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.5rem' }}>RVOL</Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem' }}>
                                    {intelligence.relativeVolume ? `${intelligence.relativeVolume.toFixed(2)}x` : '--'}
                                </Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Relative Strength Index - Measures price momentum. >70 is overbought, <30 is oversold." arrow slotProps={tooltipSlotProps}>
                            <Box sx={{ textAlign: 'center', cursor: 'help' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.5rem' }}>RSI (14)</Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem' }} color={intelligence.rsi && (intelligence.rsi > 70 || intelligence.rsi < 30) ? 'warning.main' : 'text.primary'}>
                                    {intelligence.rsi ? intelligence.rsi.toFixed(1) : '--'}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Box>
 
                    {/* Advanced Sentiment Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { lg: 0.8, xl: 1.2 } }}>
                        <Tooltip title="The calculated price direction based on short-term and long-term moving averages." arrow slotProps={tooltipSlotProps}>
                            <Box sx={{ display: { lg: 'none', xl: 'block' }, cursor: 'help' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.55rem', textAlign: 'right' }}>TREND</Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.68rem' }}>{intelligence.trend}</Typography>
                            </Box>
                        </Tooltip>
                        <Tooltip title="Aggregate market sentiment based on technical indicators and volume profile." arrow slotProps={tooltipSlotProps}>
                            <Paper elevation={0} sx={{ 
                                px: 1.2, 
                                py: 0.3, 
                                borderRadius: '20px', 
                                background: intelligence.score > 70 ? 'linear-gradient(45deg, #10b981, #059669)' : intelligence.score < 30 ? 'linear-gradient(45deg, #ef4444, #dc2626)' : 'linear-gradient(45deg, #6b7280, #4b5563)',
                                color: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                cursor: 'help'
                            }}>
                                <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: '0.02em', fontSize: '0.6rem' }}>{intelligence.sentiment}</Typography>
                            </Paper>
                        </Tooltip>
                    </Box>
                </Box>

                {/* Right: Live Price & Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, flexShrink: 0 }}>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography 
                            variant="h5" 
                            fontWeight={900} 
                            color={tickColor} 
                            sx={{ 
                                lineHeight: 1, 
                                fontFamily: '"JetBrains Mono", monospace', 
                                letterSpacing: '-0.03em',
                                fontSize: { xs: '1.25rem', md: '1.75rem' }
                            }}
                        >
                            ₹{formatCurrency(ltp, false)}
                        </Typography>
                        {marketData && (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                                <Typography 
                                    variant="caption" 
                                    fontWeight={800} 
                                    color={marketData.changePct >= 0 ? "success.main" : "error.main"}
                                    sx={{ fontSize: '0.7rem' }}
                                >
                                    {marketData.changePct >= 0 ? '+' : ''}{marketData.changePct.toFixed(2)}%
                                </Typography>
                                <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ fontSize: '0.65rem' }}>
                                    {marketData.change >= 0 ? '+' : '-'}{formatCurrency(Math.abs(marketData.change), false)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Set Price Alert" arrow slotProps={tooltipSlotProps}>
                            <IconButton 
                                onClick={onSetAlert}
                                sx={{ 
                                    border: '1px solid', 
                                    borderColor: 'divider', 
                                    borderRadius: '8px',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                <AddAlarmIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title={isStarred ? "Remove from Watchlist" : "Add to Watchlist"} arrow slotProps={tooltipSlotProps}>
                            <IconButton
                                onClick={onWatchlistToggle}
                                sx={{ 
                                    border: '1px solid', 
                                    borderColor: isStarred ? 'primary.main' : 'divider', 
                                    borderRadius: '8px',
                                    bgcolor: isStarred ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
                                    color: isStarred ? 'primary.main' : 'inherit',
                                    '&:hover': { 
                                        bgcolor: isStarred ? 'rgba(33, 150, 243, 0.12)' : 'action.hover'
                                    }
                                }}
                            >
                                {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
