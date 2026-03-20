import React from 'react';
import { Box, Typography, IconButton, Chip, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import { Instrument } from '../types/instrument.types';
import { MarketData } from '@/features/market/types/market.types';
import { InstrumentIntelligence } from '../hooks/useInstrumentIntelligence';
import { useNavigate } from 'react-router-dom';

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

    return (
        <Box sx={{ 
            position: 'sticky', 
            top: 0, 
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                    <IconButton
                        size="small"
                        onClick={() => navigate(-1)}
                        sx={{ 
                            bgcolor: 'background.paper', 
                            border: '1px solid', 
                            borderColor: 'divider',
                            '&:hover': { bgcolor: 'action.hover' }
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 1, lineHeight: 1.1 }}>
                            {instrument.symbol} <Box component="span" sx={{ color: 'text.disabled', fontWeight: 300, fontSize: '0.8em' }}>/</Box> {instrument.exchange}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {instrument.name}
                        </Typography>
                    </Box>
                </Box>

                {/* Center: Structural Intelligence Ribbon - THE NEW WHITE SPACE FILLER */}
                <Box sx={{ 
                    display: { xs: 'none', lg: 'flex' }, 
                    alignItems: 'center', 
                    gap: 3, 
                    flexGrow: 1, 
                    justifyContent: 'center',
                    px: 4
                }}>
                    {/* Sector & Industry */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip 
                            label={instrument.sector} 
                            size="small" 
                            variant="outlined" 
                            sx={{ borderRadius: '6px', fontWeight: 700, fontSize: '0.65rem', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)' }} 
                        />
                        <Chip 
                            label="LARGE CAP" // Mock for now
                            size="small" 
                            variant="outlined" 
                            sx={{ borderRadius: '6px', fontWeight: 700, fontSize: '0.65rem', borderColor: 'divider', opacity: 0.7 }} 
                        />
                    </Box>

                    {/* Pro Intelligence Metrics - RVOL & RSI */}
                    <Box sx={{ display: 'flex', gap: 2, borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider', px: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.6rem' }}>RVOL</Typography>
                            <Typography variant="caption" fontWeight={800}>
                                {intelligence.relativeVolume ? `${intelligence.relativeVolume.toFixed(2)}x` : '--'}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.6rem' }}>RSI (14)</Typography>
                            <Typography variant="caption" fontWeight={800} color={intelligence.rsi && (intelligence.rsi > 70 || intelligence.rsi < 30) ? 'warning.main' : 'text.primary'}>
                                {intelligence.rsi ? intelligence.rsi.toFixed(1) : '--'}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Advanced Sentiment Badge */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', fontSize: '0.6rem', textAlign: 'right' }}>TREND</Typography>
                            <Typography variant="caption" fontWeight={800} sx={{ fontSize: '0.7rem' }}>{intelligence.trend}</Typography>
                        </Box>
                        <Paper elevation={0} sx={{ 
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: '20px', 
                            background: intelligence.score > 70 ? 'linear-gradient(45deg, #10b981, #059669)' : intelligence.score < 30 ? 'linear-gradient(45deg, #ef4444, #dc2626)' : 'linear-gradient(45deg, #6b7280, #4b5563)',
                            color: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}>
                            <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: '0.02em', fontSize: '0.65rem' }}>{intelligence.sentiment}</Typography>
                        </Paper>
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
                            ₹{ltp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                                    {marketData.change >= 0 ? '+' : '-'}₹{Math.abs(marketData.change).toFixed(2)}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                            onClick={onSetAlert}
                            sx={{ 
                                border: '1px solid', 
                                borderColor: 'divider', 
                                borderRadius: '8px',
                                '&:hover': { bgcolor: 'action.hover' }
                            }}
                            title="Set Price Alert"
                        >
                            <AddAlarmIcon fontSize="small" />
                        </IconButton>
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
                            title={isStarred ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                            {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
