import { useState, useEffect } from 'react';
import { Chip, Box, Typography } from '@mui/material';
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

    const getStatusColor = () => {
        switch (marketStatus.status) {
            case 'OPEN':
                return 'success';
            case 'CLOSED':
                return 'error';
            case 'PRE_MARKET':
            case 'POST_MARKET':
                return 'warning';
            default:
                return 'default';
        }
    };

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
        });
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {currentTime && (
                <Typography
                    variant="caption"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 600,
                        color: 'text.secondary',
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        fontSize: '0.75rem'
                    }}
                >
                    {formatTime(currentTime)}
                </Typography>
            )}
            <Chip
                label={`${marketStatus.exchange}: ${getStatusLabel()}`}
                color={getStatusColor()}
                size="small"
                sx={{
                    fontWeight: 'bold',
                    height: 24,
                    fontSize: '0.65rem',
                    '& .MuiChip-label': { px: 1 }
                }}
            />
        </Box>
    );
};
