import { useMemo } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    Skeleton
} from '@mui/material';
import { ArrowForward as ArrowIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWatchlistStore } from '../store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { useInstruments } from '@/features/instruments/hooks/useInstruments';

interface WatchlistPreviewProps {
    maxRows?: number;
}

export const WatchlistPreview: React.FC<WatchlistPreviewProps> = ({ maxRows = 5 }) => {
    const navigate = useNavigate();
    const watchlists = useWatchlistStore(s => s.watchlists);
    const { instruments } = useInstruments();

    // Get default watchlist
    const defaultWatchlist = useMemo(() => {
        return watchlists.find(w => w.isDefault) || watchlists[0];
    }, [watchlists]);

    // Get instrument IDs for market data
    const instrumentIds = useMemo(() => {
        if (!defaultWatchlist) return [];
        return defaultWatchlist.instrumentIds.slice(0, maxRows);
    }, [defaultWatchlist, maxRows]);

    // Fetch market data for instruments
    const { prices } = useMarketData(instrumentIds);

    // Get instrument details
    const displayInstruments = useMemo(() => {
        return instrumentIds.map(id => {
            const instrument = instruments.find(inst => inst.id === id);
            return {
                id,
                symbol: instrument?.symbol || id,
                name: instrument?.name || '',
            };
        }).filter(inst => inst.symbol);
    }, [instrumentIds, instruments]);

    // Loading state
    if (watchlists.length === 0) {
        return (
            <Box sx={{ p: 3 }}>
                <Skeleton variant="rectangular" height={200} />
            </Box>
        );
    }

    // Empty watchlist
    if (!defaultWatchlist || displayInstruments.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Your watchlist is empty
                </Typography>
                <Button
                    size="small"
                    onClick={() => navigate('/instruments')}
                    sx={{ mt: 1 }}
                >
                    Browse Instruments
                </Button>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" fontWeight={700}>
                    {defaultWatchlist.name}
                </Typography>
                <Button
                    size="small"
                    endIcon={<ArrowIcon />}
                    onClick={() => navigate('/watchlists')}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    View All
                </Button>
            </Box>

            {/* Table */}
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Symbol</TableCell>
                            <TableCell align="right">LTP</TableCell>
                            <TableCell align="right">Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayInstruments.map((inst) => {
                            const marketData = prices[inst.id];
                            const change = marketData?.change || 0;
                            const changePct = marketData?.changePct || 0;

                            return (
                                <TableRow
                                    key={inst.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/instruments/${inst.id}`)}
                                >
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>
                                            {inst.symbol}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography variant="body2">
                                            ₹{marketData?.lastPrice?.toLocaleString() || '—'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: change > 0 ? 'success.main' : change < 0 ? 'error.main' : 'text.secondary',
                                                fontWeight: 600
                                            }}
                                        >
                                            {change > 0 ? '+' : ''}{changePct.toFixed(2)}%
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
