import { useMemo } from 'react';
import { Card, CardContent, Typography, Chip, Box, Grid, IconButton } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon, TrendingUp, TrendingDown } from '@mui/icons-material';
import type { Instrument } from '../types/instrument.types';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { usePrevious } from '@/shared/hooks/usePrevious';
import type { MarketData } from '@/features/market/types/market.types';


interface InstrumentCardProps {
    instrument: Instrument;
    onClick?: () => void;
    marketData?: MarketData;
}

export const InstrumentCard = ({ instrument, onClick, marketData }: InstrumentCardProps) => {
    const {
        watchlists,
        activeWatchlistId,
        addInstrumentToWatchlist,
        removeInstrumentFromWatchlist,
        openSelectionDialog
    } = useWatchlistStore();

    const activeInWatchlist = useMemo(() => {
        const active = watchlists.find((w) => w.id === activeWatchlistId);
        return active?.instrumentIds.includes(instrument.id) || false;
    }, [watchlists, activeWatchlistId, instrument.id]);

    const handleWatchlistToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (watchlists.length > 1) {
            openSelectionDialog(instrument);
            return;
        }

        if (!activeWatchlistId) return;
        try {
            if (activeInWatchlist) {
                await removeInstrumentFromWatchlist(activeWatchlistId, instrument.id);
            } else {
                await addInstrumentToWatchlist(activeWatchlistId, instrument.id);
            }
        } catch (err) {
            console.error('Failed to update watchlist', err);
        }
    };

    const getStatusColor = () => {
        switch (instrument.status) {
            case 'ACTIVE':
                return 'success';
            case 'SUSPENDED':
                return 'warning';
            case 'DELISTED':
                return 'error';
            default:
                return 'default';
        }
    };

    const isStarred = useMemo(() => {
        return watchlists.some(w => w.instrumentIds.includes(instrument.id));
    }, [watchlists, instrument.id]);

    const isPositive = marketData ? marketData.change >= 0 : true;

    // Track previous price for tick-to-tick color comparison
    const currentPrice = marketData?.lastPrice;
    const previousPrice = usePrevious(currentPrice);

    // Determine color based on tick-to-tick change
    const tickColor = !previousPrice
        ? (isPositive ? 'success.main' : 'error.main')  // Fallback to overall change
        : (currentPrice && currentPrice >= previousPrice ? 'success.main' : 'error.main');

    return (
        <Card
            sx={{
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': onClick ? { boxShadow: 3 } : {},
                transition: 'box-shadow 0.2s',
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="small"
                            onClick={handleWatchlistToggle}
                            color={isStarred ? 'primary' : 'default'}
                            sx={{ mr: 1, p: 0.5 }}
                        >
                            {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                        </IconButton>
                        <Typography variant="h6" component="div">
                            {instrument.symbol}
                        </Typography>
                    </Box>
                    <Chip
                        label={instrument.status}
                        color={getStatusColor()}
                        size="small"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {instrument.name}
                </Typography>


                {/* Price Section */}
                {marketData && (
                    <Box sx={{ my: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.5 }}>
                            <Typography
                                variant="h5"
                                fontWeight={700}
                                color={tickColor}
                            >
                                ₹{marketData.lastPrice.toFixed(2)}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {isPositive ? <TrendingUp fontSize="small" color="success" /> : <TrendingDown fontSize="small" color="error" />}
                                <Typography
                                    variant="body2"
                                    fontWeight={600}
                                    color={isPositive ? 'success.main' : 'error.main'}
                                >
                                    {isPositive ? '+' : ''}{marketData.changePct.toFixed(2)}%
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            Vol: {marketData.volume.toLocaleString()} • H/L: ₹{marketData.high.toFixed(2)}/₹{marketData.low.toFixed(2)}
                        </Typography>
                    </Box>
                )}

                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            Exchange
                        </Typography>
                        <Typography variant="body2">{instrument.exchange}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            Sector
                        </Typography>
                        <Typography variant="body2">{instrument.sector}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card >
    );
};
