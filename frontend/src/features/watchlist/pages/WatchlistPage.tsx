import { useState, useMemo, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { WatchlistManager } from '../components/WatchlistManager';
import { WatchlistTable } from '../components/WatchlistTable';
import { WatchlistToolbar } from '../components/WatchlistToolbar';
import { ColumnSettings } from '../components/ColumnSettings';
import { useInstruments } from '@/features/instruments/hooks/useInstruments';
import { useWatchlistStore } from '../store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';

const AVAILABLE_COLUMNS = [
    { id: 'symbol', label: 'Symbol', required: true },
    { id: 'name', label: 'Company Name', required: true },
    { id: 'lastPrice', label: 'Last Price & Change', required: true },
    { id: 'volume', label: 'Volume' },
];

const DEFAULT_VISIBLE_COLUMNS = ['symbol', 'name', 'lastPrice', 'volume'];

export function WatchlistPage(): JSX.Element {
    // Fetch instruments for real-time updates
    const { instruments } = useInstruments();
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const watchlists = useWatchlistStore(s => s.watchlists);

    // Toolbar state
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('symbol');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [groupBy, setGroupBy] = useState<'sector' | 'exchange' | 'type' | null>(null);

    // Column customization state
    const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);
    const [columnOrder, setColumnOrder] = useState<string[]>(DEFAULT_VISIBLE_COLUMNS);

    // Load column preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('watchlist_column_prefs');
        if (saved) {
            const prefs = JSON.parse(saved);
            setVisibleColumns(prefs.visible || DEFAULT_VISIBLE_COLUMNS);
            setColumnOrder(prefs.order || DEFAULT_VISIBLE_COLUMNS);
        }
    }, []);

    // Save column preferences to localStorage
    const handleSaveColumnSettings = (visible: string[], order: string[]) => {
        setVisibleColumns(visible);
        setColumnOrder(order);
        localStorage.setItem('watchlist_column_prefs', JSON.stringify({ visible, order }));
    };

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
        <Box sx={{ pb: 3, px: { xs: 1, md: 3 } }}>
            {/* Page Header */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.01em', mb: 0.5 }}>
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
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    onColumnSettings={() => setIsColumnSettingsOpen(true)}
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
                            visibleColumns={visibleColumns}
                            groupBy={groupBy}
                        />
                    )}
                </Box>
            </Paper>

            {/* Column Settings Dialog */}
            <ColumnSettings
                open={isColumnSettingsOpen}
                onClose={() => setIsColumnSettingsOpen(false)}
                availableColumns={AVAILABLE_COLUMNS}
                visibleColumns={visibleColumns}
                columnOrder={columnOrder}
                onSave={handleSaveColumnSettings}
            />
        </Box>
    );
}
