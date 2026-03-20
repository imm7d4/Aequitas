import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Box, Button, Paper, Grid, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Services & Hooks
import { instrumentService } from '../services/instrumentService';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';
import { usePrevious } from '@/shared/hooks/usePrevious';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import { useStockChart } from '@/features/market/hooks/useStockChart';
import { useInstrumentIntelligence } from '../hooks/useInstrumentIntelligence';

// Components
import { SetAlertModal } from '@/features/alerts/components/SetAlertModal';
import { TradePanel } from '@/features/trading/components/TradePanel';
import { StockChart } from '@/features/market/components/StockChart';
import { IndicatorPanel } from '@/features/market/components/IndicatorPanel';
import { PositionBanner } from '@/features/portfolio/components/PositionBanner';
import { InstrumentHeader } from './InstrumentHeader';
import { InstrumentMetrics } from './InstrumentMetrics';
import { InstrumentAnalysis } from './InstrumentAnalysis';

// Types
import type { Instrument } from '../types/instrument.types';

export function InstrumentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [instrument, setInstrument] = useState<Instrument | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    // Market Data & Price Logic
    const { prices } = useMarketData(id ? [id] : []);
    const marketData = id && prices[id] ? prices[id] : null;
    const ltp = marketData ? marketData.lastPrice : 0;
    const previousLtp = usePrevious(ltp);
    const isPositive = marketData ? marketData.change >= 0 : true;
    const tickColor = !previousLtp || ltp === 0
        ? (isPositive ? 'success.main' : 'error.main')
        : (ltp >= previousLtp ? 'success.main' : 'error.main');

    // Intelligence Data
    const { candles: dailyCandles } = useStockChart(id || '', '1d');
    const { candles: minuteCandles } = useStockChart(id || '', '1m');
    const intelligence = useInstrumentIntelligence(id || '', minuteCandles, dailyCandles);

    // Stores
    const { watchlists, activeWatchlistId, addInstrumentToWatchlist, removeInstrumentFromWatchlist, openSelectionDialog, fetchWatchlists } = useWatchlistStore();
    const { fetchHoldings } = usePortfolioStore();
    const isStarred = instrument ? watchlists.some(w => w.instrumentIds.includes(instrument.id)) : false;

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

    // Page Title
    const movementArrow = marketData && marketData.change >= 0 ? '▲' : '▼';
    const formattedPrice = ltp > 0 ? `₹${ltp.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₹--';
    useDocumentTitle(instrument ? `${instrument.symbol} ${movementArrow} ${formattedPrice}` : 'Aequitas', 'Aequitas');

    const handleWatchlistToggle = async () => {
        if (!instrument) return;
        if (watchlists.length !== 1) { openSelectionDialog(instrument); return; }
        if (!activeWatchlistId) { openSelectionDialog(instrument); return; }
        try {
            const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);
            const inActiveWatchlist = activeWatchlist?.instrumentIds.includes(instrument.id) || false;
            if (inActiveWatchlist) await removeInstrumentFromWatchlist(activeWatchlistId, instrument.id);
            else await addInstrumentToWatchlist(activeWatchlistId, instrument.id);
        } catch (err) { console.error('Failed to update watchlist', err); }
    };

    if (isLoading) return <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}><Box sx={{ height: 64, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }} /></Box>;
    if (error || !instrument) return <Container maxWidth="md" sx={{ mt: 4 }}><Alert severity="error">{error || 'Instrument not found'}</Alert><Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button></Container>;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 8 }}>
            <InstrumentHeader 
                instrument={instrument} marketData={marketData} ltp={ltp} tickColor={tickColor}
                intelligence={intelligence} isStarred={isStarred}
                onWatchlistToggle={handleWatchlistToggle} onSetAlert={() => setIsAlertModalOpen(true)}
            />

            <Container maxWidth={false} sx={{ py: { xs: 2, lg: 3 }, px: { xs: 2, lg: 4 } }}>
                <InstrumentMetrics instrument={instrument} marketData={marketData} ltp={ltp} isPositive={isPositive} />

                <Grid container spacing={2.5}>
                    <Grid item xs={12} lg={8.5}>
                        <PositionBanner instrument={instrument} ltp={ltp} />
                        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: { lg: 'calc(100vh - 280px)' }, minHeight: 400, bgcolor: 'background.paper', overflow: 'hidden', p: 1.5, display: 'flex', flexDirection: 'column' }}>
                            <StockChart instrumentId={instrument.id} height="100%" />
                        </Paper>
                        <Box sx={{ mt: 1.5 }}><IndicatorPanel instrumentId={instrument.id} /></Box>
                        <InstrumentAnalysis instrument={instrument} />
                    </Grid>

                    <Grid item xs={12} lg={3.5}>
                        <Box sx={{ position: { lg: 'sticky' }, top: 80 }}>
                            <TradePanel instrument={instrument} ltp={ltp} initialSide={(location.state as any)?.side} initialQuantity={(location.state as any)?.quantity} initialIntent={(location.state as any)?.intent} />
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {isAlertModalOpen && <SetAlertModal open={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} instrumentId={instrument.id} symbol={instrument.symbol} currentPrice={ltp} />}
        </Box>
    );
}
