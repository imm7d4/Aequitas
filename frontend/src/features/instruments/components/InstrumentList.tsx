import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    TextField,
    MenuItem,
    TablePagination,
    IconButton,
    Button,
    Chip,
    Tooltip,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useInstruments } from '../hooks/useInstruments';
import { useInstrumentStore } from '../store/instrumentStore';
import { useWatchlistStore } from '@/features/watchlist/store/watchlistStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { InstrumentSearch } from './InstrumentSearch';
import { TickColoredPrice } from '@/shared/components/TickColoredPrice';
import { CustomGrid } from '@/shared/components/CustomGrid';
import type { Instrument } from '../types/instrument.types';


export const InstrumentList = () => {
    // Trigger data fetching on mount via useInstruments hook
    useInstruments();

    const {
        instruments,
        searchResults,
        isLoading,
        error,
        filters,
        searchQuery,
        pagination,
        sorting,
        setFilters,
        setSearchQuery,
        setSearchResults,
        setPagination,
        setSorting,
    } = useInstrumentStore();

    const navigate = useNavigate();

    // Sorting handlers
    type SortColumn = 'symbol' | 'name' | 'ltp' | 'change' | 'changePct' | 'volume' | 'high' | 'low' | 'exchange' | 'sector';

    const handleSort = (column: SortColumn) => {
        if (sorting.column === column) {
            setSorting({ column, direction: sorting.direction === 'asc' ? 'desc' : 'asc' });
        } else {
            setSorting({ column, direction: 'asc' });
        }
    };

    // Fetch market data for all instruments
    const instrumentIds = useMemo(() => instruments.map(i => i.id), [instruments]);
    const { prices } = useMarketData(instrumentIds);
    const {
        watchlists,
        activeWatchlistId,
        addInstrumentToWatchlist,
        removeInstrumentFromWatchlist,
        openSelectionDialog,
        fetchWatchlists
    } = useWatchlistStore();

    // Fetch watchlists on mount
    useEffect(() => {
        fetchWatchlists();
    }, [fetchWatchlists]);

    const sectors = useMemo(() => {
        const uniqueSectors = new Set(instruments.map((ins: Instrument) => ins.sector).filter(Boolean));
        return ['ALL', ...Array.from(uniqueSectors).sort()];
    }, [instruments]);

    const filteredInstruments = useMemo(() => {
        // If there's a search query, use searchResults even if empty
        const source = (searchQuery && searchQuery.trim() !== '') ? searchResults : instruments;
        return source.filter((ins: Instrument) => {
            const exchangeMatch = filters.exchange === 'ALL' || ins.exchange === filters.exchange;
            const typeMatch = filters.type === 'ALL' || ins.type === filters.type;
            const sectorMatch = filters.sector === 'ALL' || ins.sector === filters.sector;
            return exchangeMatch && typeMatch && sectorMatch;
        });
    }, [instruments, searchResults, filters, searchQuery]);

    const sortedInstruments = useMemo(() => {
        const sorted = [...filteredInstruments].sort((a, b) => {
            const aMarket = prices[a.id];
            const bMarket = prices[b.id];

            let comparison = 0;
            switch (sorting.column) {
                case 'symbol':
                    comparison = a.symbol.localeCompare(b.symbol);
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'ltp':
                    comparison = (aMarket?.lastPrice || 0) - (bMarket?.lastPrice || 0);
                    break;
                case 'change':
                    comparison = (aMarket?.change || 0) - (bMarket?.change || 0);
                    break;
                case 'changePct':
                    comparison = (aMarket?.changePct || 0) - (bMarket?.changePct || 0);
                    break;
                case 'volume':
                    comparison = (aMarket?.volume || 0) - (bMarket?.volume || 0);
                    break;
                case 'high':
                    comparison = (aMarket?.high || 0) - (bMarket?.high || 0);
                    break;
                case 'low':
                    comparison = (aMarket?.low || 0) - (bMarket?.low || 0);
                    break;
                case 'exchange':
                    comparison = a.exchange.localeCompare(b.exchange);
                    break;
                case 'sector':
                    comparison = (a.sector || '').localeCompare(b.sector || '');
                    break;
            }
            return sorting.direction === 'asc' ? comparison : -comparison;
        });
        return sorted;
    }, [filteredInstruments, sorting, prices]);

    const displayInstruments = useMemo(() => {
        const { page, rowsPerPage } = pagination;
        return sortedInstruments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedInstruments, pagination]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
        setPagination({ ...pagination, page: 0 }); // Reset to first page on filter change
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPagination({ ...pagination, page: newPage });
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPagination({
            page: 0,
            rowsPerPage: parseInt(event.target.value, 10),
        });
    };

    const resetFilters = () => {
        setFilters({ exchange: 'ALL', type: 'ALL', sector: 'ALL' });
        setSearchQuery('');
        setSearchResults([]);
        setPagination({ page: 0, rowsPerPage: 25 });
    };

    const handleWatchlistToggle = async (e: React.MouseEvent, instrument: Instrument) => {
        e.stopPropagation();

        // Check if instrument is in any watchlist
        const isInAnyWatchlist = watchlists.some(w => w.instrumentIds.includes(instrument.id));

        // If instrument is already starred and user has multiple watchlists, open dialog
        // If user has zero watchlists, open dialog to create one
        // If user has multiple watchlists but instrument not in any, open dialog to choose
        if ((isInAnyWatchlist && watchlists.length > 1) || watchlists.length === 0 || (!isInAnyWatchlist && watchlists.length > 1)) {
            openSelectionDialog(instrument);
            return;
        }

        if (!activeWatchlistId) return;

        const activeWatchlist = watchlists.find(w => w.id === activeWatchlistId);
        const inWatchlist = activeWatchlist?.instrumentIds.includes(instrument.id) || false;

        try {
            if (inWatchlist) {
                await removeInstrumentFromWatchlist(activeWatchlistId, instrument.id);
            } else {
                await addInstrumentToWatchlist(activeWatchlistId, instrument.id);
            }
        } catch (err) {
            console.error('Failed to update watchlist', err);
        }
    };



    const columns = useMemo(() => [
        {
            id: 'symbol',
            label: 'Symbol',
            sortable: true,
            format: (value: string, row: Instrument) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography fontWeight={700} color="primary.main">{value}</Typography>
                    {row.isShortable && (
                        <Tooltip title="Short Selling Available">
                            <Chip
                                label="S"
                                size="small"
                                variant="outlined"
                                sx={{
                                    height: 18,
                                    width: 18,
                                    fontSize: '0.625rem',
                                    color: 'text.secondary',
                                    borderColor: 'divider',
                                    borderRadius: '4px',
                                    '& .MuiChip-label': { px: 0 }
                                }}
                            />
                        </Tooltip>
                    )}
                </Box>
            )
        },
        {
            id: 'name',
            label: 'Name',
            sortable: true,
            format: (value: string) => (
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {value}
                </Typography>
            )
        },
        {
            id: 'ltp',
            label: 'LTP',
            align: 'right' as const,
            sortable: true,
            format: (_: any, row: Instrument) => (
                <Box sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>
                    <TickColoredPrice marketData={prices[row.id]} />
                </Box>
            )
        },
        {
            id: 'change',
            label: 'Change',
            align: 'right' as const,
            sortable: true,
            format: (_: any, row: Instrument) => {
                const md = prices[row.id];
                if (!md) return '--';
                const isPos = md.change >= 0;
                return (
                    <Typography 
                        variant="body2" 
                        fontWeight={600} 
                        sx={{ color: isPos ? 'success.main' : 'error.main', fontFamily: '"JetBrains Mono", monospace' }}
                    >
                        {isPos ? '+' : ''}{md.change.toFixed(2)}
                    </Typography>
                );
            }
        },
        {
            id: 'changePct',
            label: 'Change %',
            align: 'right' as const,
            sortable: true,
            format: (_: any, row: Instrument) => {
                const md = prices[row.id];
                if (!md) return '--';
                const isPos = md.changePct >= 0;
                return (
                    <Chip
                        label={`${isPos ? '+' : ''}${md.changePct.toFixed(2)}%`}
                        size="small"
                        sx={{
                            height: 24,
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            bgcolor: isPos ? 'success.light' : 'error.light',
                            color: isPos ? 'success.dark' : 'error.dark',
                            border: 'none',
                            borderRadius: '6px'
                        }}
                    />
                );
            }
        },
        {
            id: 'volume',
            label: 'Volume',
            align: 'right' as const,
            sortable: true,
            format: (_: any, row: Instrument) => (
                <Typography variant="caption" sx={{ fontFamily: '"JetBrains Mono", monospace', color: 'text.secondary' }}>
                    {prices[row.id]?.volume.toLocaleString() || '--'}
                </Typography>
            )
        },
        {
            id: 'exchange',
            label: 'Exch',
            format: (value: string) => (
                <Chip 
                    label={value} 
                    size="small" 
                    variant="outlined" 
                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, borderRadius: '4px', borderColor: 'divider' }} 
                />
            )
        },
        {
            id: 'sector',
            label: 'Sector',
            format: (value: string) => (
                <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary' }}>{value}</Typography>
            )
        },
        {
            id: 'watchlist',
            label: '',
            align: 'center' as const,
            format: (_: any, row: Instrument) => {
                const isStarred = watchlists.some(w => w.instrumentIds.includes(row.id));
                return (
                    <IconButton
                        size="small"
                        onClick={(e) => handleWatchlistToggle(e, row)}
                        sx={{
                            color: isStarred ? 'warning.main' : 'action.disabled',
                            '&:hover': { color: 'warning.dark' }
                        }}
                    >
                        {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                    </IconButton>
                );
            }
        }
    ], [prices, watchlists, handleWatchlistToggle]);

    const isFiltered = filters.exchange !== 'ALL' || filters.type !== 'ALL' || filters.sector !== 'ALL' || searchQuery !== '';

    if (isLoading && instruments.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress size={32} thickness={5} sx={{ color: 'primary.main' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            height: 'calc(100vh - 64px)', 
            pt: 2, px: { xs: 2, lg: 3 }, pb: 2, 
            display: 'flex', flexDirection: 'column', 
            overflow: 'hidden',
            bgcolor: 'background.default'
        }}>
            {/* Header Area */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" color="primary.main">Market Instruments</Typography>
                {isFiltered && (
                    <Button 
                        size="small" 
                        variant="text" 
                        onClick={resetFilters}
                        sx={{ borderRadius: '8px', fontWeight: 700, color: 'primary.main', py: 0 }}
                    >
                        Clear Filters
                    </Button>
                )}
            </Box>

            {/* Filter Ribbon */}
            <Box sx={{ 
                p: 1, 
                mb: 1.5, 
                display: 'flex', 
                gap: 2, 
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05)'
            }}>
                <Box sx={{ flex: 1 }}>
                    <InstrumentSearch />
                </Box>
                <TextField
                    select
                    value={filters.exchange}
                    name="exchange"
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ width: 140, '& .MuiInputBase-root': { borderRadius: '8px' } }}
                    label="Exchange"
                >
                    <MenuItem value="ALL">All Exchanges</MenuItem>
                    <MenuItem value="NSE">NSE</MenuItem>
                    <MenuItem value="BSE">BSE</MenuItem>
                </TextField>
                <TextField
                    select
                    value={filters.type}
                    name="type"
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ width: 140, '& .MuiInputBase-root': { borderRadius: '8px' } }}
                    label="Asset Type"
                >
                    <MenuItem value="ALL">All Types</MenuItem>
                    <MenuItem value="STOCK">STOCKS</MenuItem>
                    <MenuItem value="ETF">ETFS</MenuItem>
                </TextField>
                <TextField
                    select
                    value={filters.sector}
                    name="sector"
                    onChange={handleFilterChange}
                    size="small"
                    sx={{ width: 180, '& .MuiInputBase-root': { borderRadius: '8px' } }}
                    label="Sector"
                >
                    <MenuItem value="ALL">All Sectors</MenuItem>
                    {sectors.map((sector: string) => (
                        <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                    ))}
                </TextField>
            </Box>

            {/* Grid Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                {displayInstruments.length === 0 ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
                        <Typography variant="h6" fontWeight={700}>No matches found</Typography>
                        <Typography variant="body2">Try adjusting your search or filters</Typography>
                    </Box>
                ) : (
                    <>
                        <CustomGrid
                            columns={columns}
                            rows={displayInstruments}
                            onRowClick={(row: Instrument) => navigate(`/instruments/${row.id}`)}
                            sorting={sorting}
                            onSort={(col: string) => handleSort(col as SortColumn)}
                            maxHeight="100%"
                        />
                        
                        {/* Pagination Footer */}
                        <Box sx={{ 
                            mt: 1, 
                            px: 1,
                            display: 'flex', 
                            justifyContent: 'flex-end', 
                            alignItems: 'center',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '12px',
                            bgcolor: 'background.paper'
                        }}>
                            <TablePagination
                                rowsPerPageOptions={[25, 50, 100]}
                                component="div"
                                count={filteredInstruments.length}
                                rowsPerPage={pagination.rowsPerPage}
                                page={pagination.page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{ border: 'none' }}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};
