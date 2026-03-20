import { useState, useEffect } from 'react';
import { Chip, Box, Typography, Tooltip } from '@mui/material';
import { useMarketStatus } from '../hooks/useMarketStatus';

export const MarketStatusBadge = () => {
    const { marketStatus, isLoading } = useMarketStatus('NSE');
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    // Sync with marketStatus.currentTime when it updates
    useEffect(() => {
        if (marketStatus?.currentTime) {
            setCurrentTime(new Date(marketStatus.currentTime));
        }
    }, [marketStatus?.currentTime]);

    // Local ticking clock
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime((prev) => (prev ? new Date(prev.getTime() + 1000) : null));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (isLoading || !marketStatus) {
        return <Chip label="Loading..." size="small" variant="outlined" />;
    }

    const getStatusLabel = () => {
        switch (marketStatus.status) {
            case 'OPEN':
                return 'OPEN';
            case 'CLOSED':
                return 'CLOSED';
            case 'PRE_MARKET':
                return 'PRE-OPEN';
            case 'POST_MARKET':
                return 'POST-CLOSE';
            default:
                return marketStatus.status;
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        }).toUpperCase();
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Exchange Label - Subtle and compact */}
            <Typography
                variant="caption"
                sx={{
                    fontWeight: 600,
                    color: 'text.disabled',
                    fontSize: '0.65rem',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    display: { xs: 'none', lg: 'block' }
                }}
            >
                {marketStatus.exchange}
            </Typography>

            {/* Separator - Minimalist dot */}
            <Box
                sx={{
                    width: 2,
                    height: 2,
                    borderRadius: '50%',
                    bgcolor: 'divider',
                    mx: 0.25,
                    display: { xs: 'none', lg: 'block' }
                }}
            />

            {/* Status Pill - Glassmorphism style */}
            <Tooltip title="Since this is a simulation, trading is allowed 24/7" arrow>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        bgcolor: marketStatus.status === 'OPEN' 
                            ? 'rgba(46, 125, 50, 0.08)' // Softer background
                            : 'rgba(0, 0, 0, 0.04)',
                        color: marketStatus.status === 'OPEN' ? 'success.main' : 'text.secondary',
                        px: 1,
                        py: 0.25,
                        borderRadius: '100px',
                        border: '1px solid',
                        borderColor: marketStatus.status === 'OPEN' 
                            ? 'rgba(46, 125, 50, 0.15)' 
                            : 'rgba(0, 0, 0, 0.08)',
                        backdropFilter: 'blur(4px)', // Subtle glass effect
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            bgcolor: marketStatus.status === 'OPEN' 
                                ? 'rgba(46, 125, 50, 0.12)' 
                                : 'rgba(0, 0, 0, 0.06)',
                        }
                    }}
                >
                    <Box
                        sx={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            bgcolor: marketStatus.status === 'OPEN' ? 'success.main' : 'text.disabled',
                            boxShadow: marketStatus.status === 'OPEN' 
                                ? '0 0 8px rgba(46, 125, 50, 0.4)' 
                                : 'none',
                            // Pulsing dot logic
                            animation: marketStatus.status === 'OPEN' ? 'pulse 2s infinite' : 'none',
                            '@keyframes pulse': {
                                '0%': { transform: 'scale(1)', opacity: 1 },
                                '50%': { transform: 'scale(1.3)', opacity: 0.6 },
                                '100%': { transform: 'scale(1)', opacity: 1 }
                            }
                        }}
                    />
                    <Typography
                        sx={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            lineHeight: 1
                        }}
                    >
                        {getStatusLabel()}
                    </Typography>
                </Box>
            </Tooltip>

            {/* Time Metadata - Crisp, elegant mono */}
            {currentTime && (
                <Typography
                    variant="body2"
                    sx={{
                        fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace",
                        fontWeight: 600,
                        color: 'text.primary',
                        fontSize: '0.78rem',
                        ml: 0.5,
                        display: 'block',
                        whiteSpace: 'nowrap',
                        letterSpacing: '0.03em',
                        opacity: 0.9
                    }}
                >
                    {formatTime(currentTime)}
                </Typography>
            )}
        </Box>
    );
};
