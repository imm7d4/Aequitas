import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { instrumentService } from '../services/instrumentService';
import { useAuth } from '@/features/auth';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { accountService } from '@/features/profile/services/accountService';
import { TradePanel } from '@/features/trading/components/TradePanel';
import { StockChart } from '@/features/market/components/StockChart';
import type { Instrument } from '../types/instrument.types';

export function InstrumentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);

    const { prices } = useMarketData(id ? [id] : []);
    const marketData = id && prices[id] ? prices[id] : null;
    const ltp = marketData ? marketData.lastPrice : 0;

    const {
        watchlists,
        activeWatchlistId,
        addInstrumentToWatchlist,
        removeInstrumentFromWatchlist,
        openSelectionDialog,
        fetchWatchlists
    } = useWatchlistStore();

    const isStarred = instrument ? watchlists.some(w => w.instrumentIds.includes(instrument.id)) : false;

    const handleWatchlistToggle = async () => {
        if (!instrument) return;

        if (watchlists.length > 1) {
            openSelectionDialog(instrument);
            return;
        }

        if (!activeWatchlistId) return;

        try {
            const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);
            const inActiveWatchlist = activeWatchlist?.instrumentIds.includes(instrument.id) || false;

            if (inActiveWatchlist) {
                await removeInstrumentFromWatchlist(activeWatchlistId, instrument.id);
            } else {
                await addInstrumentToWatchlist(activeWatchlistId, instrument.id);
            }
        } catch (err) {
            console.error('Failed to update watchlist', err);
        }
    };

    useEffect(() => {
        const fetchInstrument = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await instrumentService.getInstrumentById(id);
                setInstrument(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch instrument details');
            } finally {
                setIsLoading(false);
            }
        };

        const fetchBalance = async () => {
            try {
                const data = await accountService.getBalance();
                setBalance(data.balance);
            } catch (err) {
                console.error('Failed to fetch balance', err);
            }
        };

        fetchInstrument();
        fetchBalance();
        fetchWatchlists();
    }, [id, fetchWatchlists]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !instrument) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error || 'Instrument not found'}</Alert>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/instruments')}
                    sx={{ mt: 2 }}
                >
                    Back to Instruments
                </Button>
            </Container>
        );
    }

    const getStatusColor = () => {
        switch (instrument.status) {
            case 'ACTIVE': return 'success';
            case 'SUSPENDED': return 'warning';
            case 'DELISTED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mb: 3 }}>
            <Box sx={{ mb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/instruments')}
                >
                    Back to Instruments
                </Button>
                <Button
                    variant="outlined"
                    startIcon={isStarred ? <StarIcon color="primary" /> : <StarBorderIcon />}
                    onClick={handleWatchlistToggle}
                >
                    {isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                    {/* Chart Section */}
                    <Box sx={{ mb: 3 }}>
                        <StockChart instrumentId={instrument.id} symbol={instrument.symbol} />
                    </Box>

                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        {/* Header with Symbol and Price */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, mb: 1 }}>
                                <Typography variant="h4" component="h1" fontWeight={700}>
                                    {instrument.name}
                                </Typography>
                                <Chip
                                    label={instrument.status}
                                    color={getStatusColor()}
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                <Typography variant="body2" color="text.secondary">
                                    {instrument.exchange}: {instrument.symbol}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ISIN: {instrument.isin}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Current Price Display */}
                        <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Current Price
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                <Typography variant="h3" fontWeight={700} color="primary.main">
                                    ₹{ltp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </Typography>
                                {marketData && (
                                    <Typography
                                        variant="body2"
                                        color={marketData.changePct >= 0 ? "success.main" : "error.main"}
                                        fontWeight={600}
                                    >
                                        {marketData.changePct >= 0 ? '+' : ''}{marketData.changePct.toFixed(2)}%
                                    </Typography>
                                )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                                {new Date().toLocaleDateString()} • Close price
                            </Typography>
                        </Box>

                        {/* Key Metrics Grid */}
                        <Grid container spacing={2}>
                            <Grid item xs={6} sm={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Lot Size
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {instrument.lotSize}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Tick Size
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        ₹{instrument.tickSize.toFixed(2)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Type
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {instrument.type}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Sector
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {instrument.sector}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Exchange
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {instrument.exchange}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={6} sm={4}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Listed
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {new Date(instrument.listingDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>

                        {/* Additional Market Data */}
                        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                Market Data
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={6} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            High / Low
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            ₹{(id && prices[id]?.high?.toFixed(2)) || '--'} / ₹{(id && prices[id]?.low?.toFixed(2)) || '--'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Open
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            ₹{(id && prices[id]?.open?.toFixed(2)) || '--'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Prev Close
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            ₹{(id && prices[id]?.prevClose?.toFixed(2)) || '--'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Volume
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600}>
                                            {(id && prices[id]?.volume?.toLocaleString()) || '--'}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            52W High
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="success.main">
                                            ₹{(id && prices[id] ? (prices[id].high * 1.15).toFixed(2) : (ltp * 1.15).toFixed(2))}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            52W Low
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="error.main">
                                            ₹{(id && prices[id] ? (prices[id].low * 0.85).toFixed(2) : (ltp * 0.85).toFixed(2))}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                    <TradePanel
                        instrument={instrument}
                        ltp={ltp}
                        balance={balance}
                    />
                </Grid>
            </Grid>

            {user?.isAdmin && (
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" gutterBottom>Admin Actions</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AdminPanelSettingsIcon />}
                        onClick={() => navigate(`/admin/instruments/edit/${instrument.id}`)}
                    >
                        Edit Instrument Data
                    </Button>
                </Box>
            )}
        </Container>
    );
}
