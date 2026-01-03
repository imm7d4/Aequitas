import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    Divider,
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
import type { Instrument } from '../types/instrument.types';

export function InstrumentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        watchlists,
        activeWatchlistId,
        addInstrumentToWatchlist,
        removeInstrumentFromWatchlist,
        openSelectionDialog
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

        fetchInstrument();
    }, [id]);

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
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/instruments')}
                >
                    Back to Instruments
                </Button>
            </Box>

            <Paper sx={{ p: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {instrument.symbol}
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            {instrument.name}
                        </Typography>
                    </Box>
                    <Chip
                        label={instrument.status}
                        color={getStatusColor()}
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                ISIN
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {instrument.isin}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Exchange
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {instrument.exchange}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Instrument Type
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {instrument.type}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Sector
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {instrument.sector}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Lot Size
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {instrument.lotSize}
                            </Typography>
                        </Box>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                Tick Size
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                                ₹{instrument.tickSize.toFixed(2)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                        Listed on: {new Date(instrument.listingDate).toLocaleDateString()}
                    </Typography>
                </Box>
            </Paper>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" fullWidth>
                    Buy {instrument.symbol}
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={isStarred ? <StarIcon color="primary" /> : <StarBorderIcon />}
                    onClick={handleWatchlistToggle}
                >
                    {isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
            </Box>

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
