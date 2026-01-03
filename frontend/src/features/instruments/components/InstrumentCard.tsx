import { useMemo } from 'react';
import { Card, CardContent, Typography, Chip, Box, Grid, IconButton } from '@mui/material';
import { Star as StarIcon, StarBorder as StarBorderIcon } from '@mui/icons-material';
import type { Instrument } from '../types/instrument.types';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';

interface InstrumentCardProps {
    instrument: Instrument;
    onClick?: () => void;
}

export const InstrumentCard = ({ instrument, onClick }: InstrumentCardProps) => {
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
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            ISIN
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                            {instrument.isin}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                            Type
                        </Typography>
                        <Typography variant="body2">{instrument.type}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
