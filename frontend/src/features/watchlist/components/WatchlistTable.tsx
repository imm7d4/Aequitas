import React, { useMemo, useCallback } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useWatchlistStore } from '../store/watchlistStore';
import { useInstrumentStore } from '@/features/instruments/store/instrumentStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { PriceDisplay } from '@/shared/components/PriceDisplay';

export const WatchlistTable: React.FC = () => {
    const watchlists = useWatchlistStore(s => s.watchlists);
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const removeInstrumentFromWatchlist = useWatchlistStore(s => s.removeInstrumentFromWatchlist);

    const instruments = useInstrumentStore(s => s.instruments);
    const isLoadingInstruments = useInstrumentStore(s => s.isLoading);

    const activeWatchlist = useMemo(
        () => watchlists.find((w) => w.id === activeWatchlistId),
        [watchlists, activeWatchlistId]
    );

    const watchlistInstruments = useMemo(() => {
        if (!activeWatchlist) return [];
        return activeWatchlist.instrumentIds
            .map((id) => instruments.find((inst) => inst.id === id))
            .filter(Boolean);
    }, [activeWatchlist, instruments]);

    const instrumentIds = useMemo(
        () => watchlistInstruments.map((inst) => inst!.id),
        [watchlistInstruments]
    );

    const { prices, error: marketError } = useMarketData(instrumentIds);

    const handleRemove = useCallback(async (instrumentId: string) => {
        if (!activeWatchlistId) return;
        try {
            await removeInstrumentFromWatchlist(activeWatchlistId, instrumentId);
        } catch (err) {
            console.error('Failed to remove instrument', err);
        }
    }, [activeWatchlistId, removeInstrumentFromWatchlist]);

    if (!activeWatchlistId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">Select a watchlist to view instruments</Typography>
            </Box>
        );
    }

    if (isLoadingInstruments && watchlistInstruments.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ mb: 2 }} />
                <Typography color="textSecondary">Loading watchlist instruments...</Typography>
            </Box>
        );
    }

    if (watchlistInstruments.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">No instruments in this watchlist</Typography>
                <Typography variant="caption" display="block">Add stocks from the "View Instruments" page</Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table size="small">
                <TableHead>
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Company Name</TableCell>
                        <TableCell align="right">Last Price</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {watchlistInstruments.map((inst) => {
                        const marketData = prices[inst!.id];
                        return (
                            <TableRow key={inst!.id} hover>
                                <TableCell>
                                    <Typography variant="body2" fontWeight={600}>
                                        {inst!.symbol}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        {inst!.exchange}
                                    </Typography>
                                </TableCell>
                                <TableCell>{inst!.name}</TableCell>
                                <TableCell align="right">
                                    {marketData ? (
                                        <PriceDisplay
                                            price={marketData.lastPrice}
                                            change={marketData.change}
                                            changePct={marketData.changePct}
                                        />
                                    ) : marketError ? (
                                        <Typography variant="caption" color="error">Error</Typography>
                                    ) : (
                                        <Typography variant="caption" color="textSecondary">Fetching...</Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemove(inst!.id)}
                                        title="Remove from Watchlist"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
