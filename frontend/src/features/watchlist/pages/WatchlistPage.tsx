import { useState, useMemo } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { WatchlistManager } from '../components/WatchlistManager';
import { WatchlistTable } from '../components/WatchlistTable';
import { WatchlistToolbar } from '../components/WatchlistToolbar';
import { useInstruments } from '@/features/instruments/hooks/useInstruments';
import { useWatchlistStore } from '../store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';

export function WatchlistPage(): JSX.Element {
    // Fetch instruments for real-time updates
    const { instruments } = useInstruments();
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const watchlists = useWatchlistStore(s => s.watchlists);

    // Toolbar state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('symbol');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Get active watchlist
    const activeWatchlist = useMemo(() => {
        return watchlists.find(w => w.id === activeWatchlistId);
    }, [watchlists, activeWatchlistId]);

    // Get instrument IDs from active watchlist
    const instrumentIds = useMemo(() => {
        return activeWatchlist?.instrumentIds || [];
    }, [activeWatchlist]);

    // Fetch market data
    const { prices } = useMarketData(instrumentIds);

    // Filter and sort instruments
    const filteredAndSortedInstruments = useMemo(() => {
        // Get instrument details
        let displayInstruments = instrumentIds.map(id => {
            const instrument = instruments.find(inst => inst.id === id);
            const marketData = prices[id];
            return {
                id,
                symbol: instrument?.symbol || id,
                name: instrument?.name || '',
                lastPrice: marketData?.lastPrice || 0,
                change: marketData?.change || 0,
                changePct: marketData?.changePct || 0,
                volume: marketData?.volume || 0,
            };
        }).filter(inst => inst.symbol);

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            displayInstruments = displayInstruments.filter(inst =>
                inst.symbol.toLowerCase().includes(query) ||
                inst.name.toLowerCase().includes(query)
            );
        }

        // Apply sorting
        displayInstruments.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'symbol':
                    comparison = a.symbol.localeCompare(b.symbol);
                    break;
                case 'price':
                    comparison = a.lastPrice - b.lastPrice;
                    break;
                case 'change':
                    comparison = a.changePct - b.changePct;
                    break;
                case 'volume':
                    comparison = a.volume - b.volume;
                    break;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return displayInstruments;
    }, [instrumentIds, instruments, prices, searchQuery, sortBy, sortDirection]);

    return (
        <Box sx={{ py: 3, px: { xs: 1, md: 3 } }}>
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em', mb: 1 }}>
                    My Watchlists
                </Typography>
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                    Track your favorite instruments in real-time
                </Typography>
            </Box>

            {/* Watchlist Content */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                {/* Watchlist Tabs */}
                <WatchlistManager />

                {/* Toolbar */}
                <WatchlistToolbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                    sortDirection={sortDirection}
                    onSortDirectionToggle={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                />

                {/* Watchlist Table */}
                <Box sx={{ p: 2 }}>
                    {filteredAndSortedInstruments.length === 0 && searchQuery ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                No instruments found matching "{searchQuery}"
                            </Typography>
                        </Box>
                    ) : filteredAndSortedInstruments.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                This watchlist is empty
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Click "Add" to add instruments
                            </Typography>
                        </Box>
                    ) : (
                        <WatchlistTable
                            filteredInstrumentIds={filteredAndSortedInstruments.map(inst => inst.id)}
                        />
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
