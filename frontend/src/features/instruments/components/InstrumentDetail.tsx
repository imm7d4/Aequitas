import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Grid,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import { instrumentService } from '../services/instrumentService';
import { SetAlertModal } from '@/features/alerts/components/SetAlertModal';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { usePrevious } from '@/shared/hooks/usePrevious';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { TradePanel } from '@/features/trading/components/TradePanel';
import { StockChart } from '@/features/market/components/StockChart';
import { IndicatorPanel } from '@/features/market/components/IndicatorPanel';
import { PositionBanner } from '@/features/portfolio/components/PositionBanner';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import type { Instrument } from '../types/instrument.types';


export function InstrumentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const { prices } = useMarketData(id ? [id] : []);
    const marketData = id && prices[id] ? prices[id] : null;
    const ltp = marketData ? marketData.lastPrice : 0;

    // Track previous price for tick-to-tick color comparison
    const previousLtp = usePrevious(ltp);
    const isPositive = marketData ? marketData.change >= 0 : true;

    // Determine color based on tick-to-tick change
    const tickColor = !previousLtp || ltp === 0
        ? (isPositive ? 'success.main' : 'error.main')  // Fallback to overall change
        : (ltp >= previousLtp ? 'success.main' : 'error.main');

    const {
        watchlists,
        activeWatchlistId,
        addInstrumentToWatchlist,
        removeInstrumentFromWatchlist,
        openSelectionDialog,
        fetchWatchlists
    } = useWatchlistStore();

    const { fetchHoldings } = usePortfolioStore();

    const isStarred = instrument ? watchlists.some(w => w.instrumentIds.includes(instrument.id)) : false;

    const handleWatchlistToggle = async () => {
        if (!instrument) return;

        // If user has many watchlists or zero watchlists, open selection dialog
        // If they have only one watchlist, we can toggle directly (current behavior)
        if (watchlists.length !== 1) {
            openSelectionDialog(instrument);
            return;
        }

        if (!activeWatchlistId) {
            // This case should ideally not happen if watchlists.length == 1
            // but we handle it just in case
            openSelectionDialog(instrument);
            return;
        }

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

    // Dynamic browser tab title
    const movementArrow = marketData && marketData.change >= 0 ? '▲' : '▼';
    const formattedPrice = ltp > 0
        ? `₹${ltp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '₹--';
    const documentTitle = instrument
        ? `${instrument.symbol} ${movementArrow} ${formattedPrice}`
        : 'Aequitas';

    useDocumentTitle(documentTitle, 'Aequitas');

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
        fetchWatchlists();
        fetchHoldings();
    }, [id, fetchWatchlists, fetchHoldings]);

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
                    onClick={() => navigate(-1)}
                    sx={{ mt: 2 }}
                >
                    Go Back
                </Button>
            </Container>
        );
    }



    function MetricRow({ label, value }: { label: string, value: string }) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</Typography>
                <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>{value}</Typography>
            </Box>
        );
    }



    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
            {/* Sticky Professional Header */}
            <Box sx={{
                position: 'sticky',
                top: 64,
                zIndex: 1100,
                bgcolor: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: { xs: 2, lg: 4 },
                py: 1.5
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button
                            variant="text"
                            size="small"
                            startIcon={<ArrowBackIcon />}
                            onClick={() => navigate(-1)}
                            sx={{ color: 'text.secondary', minWidth: 'auto', p: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
                        />
                        <Typography variant="h6" fontWeight={700} sx={{ letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: 1 }}>
                            {instrument.symbol} <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>•</Box> {instrument.exchange}
                        </Typography>

                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', mr: 2 }}>
                            <Typography variant="h5" fontWeight={800} color={tickColor} sx={{ lineHeight: 1, fontFamily: '"Outfit", sans-serif' }}>
                                ₹{ltp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                            {marketData && (
                                <Typography
                                    variant="caption"
                                    color={marketData.changePct >= 0 ? "success.main" : "error.main"}
                                    fontWeight={700}
                                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}
                                >
                                    {marketData.changePct >= 0 ? '▲' : '▼'} {marketData.changePct.toFixed(2)}% ({marketData.change >= 0 ? '+' : '-'}₹{Math.abs(marketData.change).toFixed(2)})
                                </Typography>
                            )}
                        </Box>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AddAlarmIcon />}
                            onClick={() => setIsAlertModalOpen(true)}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
                        >
                            Set Alert
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={isStarred ? <StarIcon color="primary" /> : <StarBorderIcon />}
                            onClick={handleWatchlistToggle}
                            sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, px: 2 }}
                        >
                            {isStarred ? 'Saved' : 'Watchlist'}
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Container maxWidth="xl" sx={{ mt: 3 }}>
                {/* Secondary Header Bar: Quick Metrics (Scrolling) */}
                <Box sx={{
                    display: 'flex',
                    gap: 4,
                    mb: 4,
                    px: { lg: 1 },
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'rgba(0,0,0,0.05)'
                }}>
                    {[
                        { label: 'Volume', value: marketData?.volume?.toLocaleString() || '--' },
                        { label: 'Day High/Low', value: marketData ? `₹${marketData.high.toFixed(2)} / ₹${marketData.low.toFixed(2)}` : '--' },
                        { label: 'VWAP', value: marketData ? `₹${(ltp * 0.9995).toFixed(2)}` : '--' }, // Simulated VWAP
                        { label: 'Sector', value: instrument.sector },
                    ].map(metric => (
                        <Box key={metric.label} sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={500}>{metric.label}</Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary' }}>{metric.value}</Typography>
                        </Box>
                    ))}
                </Box>

                <Grid container spacing={2.5}>
                    {/* LEFT AREA: CHART (70%) */}
                    <Grid item xs={12} lg={8.5}>
                        {/* Position Banner */}
                        <PositionBanner instrument={instrument} ltp={ltp} />

                        {/* Indicator Panel - Now above the chart */}
                        <Box sx={{ mb: 2 }}>
                            <IndicatorPanel instrumentId={instrument.id} />
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                height: { lg: 'calc(100vh - 240px)' },
                                minHeight: 480,
                                bgcolor: 'background.paper',
                                overflow: 'hidden',
                                p: 1.5,
                                display: 'flex',
                                flexDirection: 'column'
                            }}
                        >
                            <StockChart instrumentId={instrument.id} symbol={instrument.symbol} height="100%" />
                        </Paper>



                        {/* TABS SECTION: Analysis */}
                        <Box sx={{ mt: 3.5 }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2.5 }}>
                                <ToggleButtonGroup
                                    value={tabValue}
                                    exclusive
                                    onChange={(_: React.MouseEvent<HTMLElement>, v: number | null) => v !== null && setTabValue(v)}
                                    size="small"
                                    sx={{
                                        mb: -0.1,
                                        '& .MuiToggleButton-root': {
                                            border: 'none',
                                            borderRadius: 0,
                                            px: 3,
                                            py: 1.2,
                                            fontWeight: 600,
                                            color: 'text.secondary',
                                            '&.Mui-selected': {
                                                color: 'primary.main',
                                                bgcolor: 'transparent',
                                                borderBottom: '2px solid',
                                                borderColor: 'primary.main'
                                            }
                                        }
                                    }}
                                >
                                    <ToggleButton value={0}>Overview</ToggleButton>
                                    <ToggleButton value={1}>Market Depth</ToggleButton>
                                    <ToggleButton value={2}>Fundamentals</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            <Box sx={{ py: 1 }}>
                                {tabValue === 0 && (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={7}>
                                            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Business Summary</Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7, fontSize: '0.9rem' }}>
                                                {instrument.name} ({instrument.symbol}) is a leading enterprise in the {instrument.sector} space,
                                                incorporated and listed on the {instrument.exchange}. The instrument is currently {instrument.status.toLowerCase()}
                                                for market participants. Key trading parameters include a lot size of {instrument.lotSize} units
                                                and a minimum price movement (tick size) of ₹{instrument.tickSize.toFixed(2)}.
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={5}>
                                            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.01)' }}>
                                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Technical Profiling</Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                                                    <MetricRow label="ISIN Alpha-code" value={instrument.isin} />
                                                    <MetricRow label="Public Listing" value={new Date(instrument.listingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} />
                                                    <MetricRow label="Asset Classification" value={instrument.type} />
                                                    <MetricRow label="Market Segment" value="EQUITY - MAIN" />
                                                </Box>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                )}
                                {tabValue === 1 && (
                                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                                        <Typography variant="body2">Market Depth data stream is initializing...</Typography>
                                    </Box>
                                )}
                                {tabValue === 2 && (
                                    <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                                        <Typography variant="body2">Fundamental Analysis tools coming soon.</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT AREA: ORDER PANEL (30%) */}
                    <Grid item xs={12} lg={3.5}>
                        <Box sx={{ position: { lg: 'sticky' }, top: 110 }}>
                            <TradePanel
                                instrument={instrument}
                                ltp={ltp}
                                initialSide={(location.state as any)?.side}
                                initialQuantity={(location.state as any)?.quantity}
                                initialIntent={(location.state as any)?.intent}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {isAlertModalOpen && (
                <SetAlertModal
                    open={isAlertModalOpen}
                    onClose={() => setIsAlertModalOpen(false)}
                    instrumentId={instrument.id}
                    symbol={instrument.symbol}
                    currentPrice={ltp}
                />
            )}
        </Box>
    );

}
