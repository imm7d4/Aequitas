import React, { useMemo, useCallback, useState, useEffect } from 'react';
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
    Stack,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ShoppingCart as BuyIcon,
    TrendingDown as SellIcon,
    ShowChart as ChartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWatchlistStore } from '../store/watchlistStore';
import { useInstrumentStore } from '@/features/instruments/store/instrumentStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { PriceCell } from './PriceCell';

interface WatchlistTableProps {
    filteredInstrumentIds?: string[]; // Optional: for search/sort filtering
}

export const WatchlistTable: React.FC<WatchlistTableProps> = ({ filteredInstrumentIds }) => {
    const navigate = useNavigate();
    const watchlists = useWatchlistStore(s => s.watchlists);
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const removeInstrumentFromWatchlist = useWatchlistStore(s => s.removeInstrumentFromWatchlist);

    const instruments = useInstrumentStore(s => s.instruments);
    const isLoadingInstruments = useInstrumentStore(s => s.isLoading);

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

    const activeWatchlist = useMemo(
        () => watchlists.find((w) => w.id === activeWatchlistId),
        [watchlists, activeWatchlistId]
    );

    const watchlistInstruments = useMemo(() => {
        if (!activeWatchlist) return [];

        // Use filtered IDs if provided, otherwise use all from watchlist
        const idsToDisplay = filteredInstrumentIds || activeWatchlist.instrumentIds;

        return idsToDisplay
            .map((id) => instruments.find((inst) => inst.id === id))
            .filter(Boolean);
    }, [activeWatchlist, instruments, filteredInstrumentIds]);

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

    const handleBuy = useCallback((instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`, { state: { side: 'BUY' } });
    }, [navigate]);

    const handleSell = useCallback((instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`, { state: { side: 'SELL' } });
    }, [navigate]);

    const handleChart = useCallback((instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`);
    }, [navigate]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Use hovered row if available, otherwise use selected row
            const activeRowId = hoveredRowId || selectedRowId;
            if (!activeRowId || watchlistInstruments.length === 0) return;

            const currentIndex = watchlistInstruments.findIndex(inst => inst!.id === activeRowId);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < watchlistInstruments.length - 1) {
                        const nextId = watchlistInstruments[currentIndex + 1]!.id;
                        setSelectedRowId(nextId);
                        setHoveredRowId(nextId);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        const prevId = watchlistInstruments[currentIndex - 1]!.id;
                        setSelectedRowId(prevId);
                        setHoveredRowId(prevId);
                    }
                    break;
                case 'b':
                case 'B':
                    e.preventDefault();
                    handleBuy(activeRowId);
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    handleSell(activeRowId);
                    break;
                case 'c':
                case 'C':
                    e.preventDefault();
                    handleChart(activeRowId);
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleChart(activeRowId);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hoveredRowId, selectedRowId, watchlistInstruments, handleBuy, handleSell, handleChart]);

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
                        const isSelected = selectedRowId === inst!.id;
                        const isHovered = hoveredRowId === inst!.id;

                        return (
                            <TableRow
                                key={inst!.id}
                                hover
                                selected={isSelected}
                                onClick={() => setSelectedRowId(inst!.id)}
                                onMouseEnter={() => setHoveredRowId(inst!.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                                sx={{
                                    cursor: 'pointer',
                                    bgcolor: isSelected ? 'action.selected' : 'inherit',
                                }}
                            >
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
                                        <PriceCell
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
                                    {isHovered || isSelected ? (
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            <IconButton
                                                size="small"
                                                color="success"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleBuy(inst!.id);
                                                }}
                                                title="Buy (B)"
                                            >
                                                <BuyIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSell(inst!.id);
                                                }}
                                                title="Sell (S)"
                                            >
                                                <SellIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleChart(inst!.id);
                                                }}
                                                title="Chart (C)"
                                            >
                                                <ChartIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemove(inst!.id);
                                                }}
                                                title="Remove"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    ) : (
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemove(inst!.id);
                                            }}
                                            title="Remove from Watchlist"
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
