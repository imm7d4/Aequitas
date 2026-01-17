import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    IconButton,
    Button,
    Paper,
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

    const isFiltered = filters.exchange !== 'ALL' || filters.type !== 'ALL' || filters.sector !== 'ALL' || searchQuery !== '';

    if (isLoading && instruments.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        );
    }

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', pt: 1, px: 2, pb: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h5" fontWeight={700}>Instruments</Typography>
            </Box>

            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={12} md={6}>
                    <InstrumentSearch />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        select
                        label="Exchange"
                        name="exchange"
                        value={filters.exchange}
                        onChange={handleFilterChange}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                        InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    >
                        <MenuItem value="ALL">All Exchanges</MenuItem>
                        <MenuItem value="NSE">NSE</MenuItem>
                        <MenuItem value="BSE">BSE</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        select
                        label="Type"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                        InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    >
                        <MenuItem value="ALL">All Types</MenuItem>
                        <MenuItem value="STOCK">STOCK</MenuItem>
                        <MenuItem value="ETF">ETF</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField
                        fullWidth
                        select
                        label="Sector"
                        name="sector"
                        value={filters.sector}
                        onChange={handleFilterChange}
                        size="small"
                        sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                        InputLabelProps={{ sx: { fontSize: '0.875rem' } }}
                    >
                        <MenuItem value="ALL">All Sectors</MenuItem>
                        {sectors.map((sector: string) => (
                            <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                {isFiltered && (
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                        <Button size="small" onClick={resetFilters}>Reset All</Button>
                    </Grid>
                )}
            </Grid>

            {displayInstruments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No instruments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your filters or search query
                    </Typography>
                </Box>
            ) : (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <TableContainer component={Paper} elevation={0} sx={{ flex: 1, overflow: 'auto', border: '1px solid', borderColor: 'divider' }}>
                        <Table
                            sx={{
                                minWidth: 650,
                                '& .MuiTableCell-root': {
                                    py: 0.75, // Slightly more breathing room than 0.5
                                    px: 2,
                                    fontSize: '0.8125rem', // 13px
                                    fontFamily: 'Inter, Roboto, sans-serif',
                                },
                                '& .MuiTableCell-head': {
                                    fontWeight: 600,
                                    backgroundColor: 'background.paper', // Solid background to prevent scroll overlap
                                    color: 'text.secondary',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontSize: '0.75rem', // 12px for headers
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                },
                                '& .MuiTableRow-root': {
                                    transition: 'background-color 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }
                            }}
                            stickyHeader
                            size="small"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sorting.column === 'symbol'}
                                            direction={sorting.column === 'symbol' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('symbol')}
                                        >
                                            Symbol
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sorting.column === 'name'}
                                            direction={sorting.column === 'name' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('name')}
                                        >
                                            Name
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={sorting.column === 'ltp'}
                                            direction={sorting.column === 'ltp' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('ltp')}
                                        >
                                            LTP
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={sorting.column === 'change'}
                                            direction={sorting.column === 'change' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('change')}
                                        >
                                            Change
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                        <TableSortLabel
                                            active={sorting.column === 'changePct'}
                                            direction={sorting.column === 'changePct' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('changePct')}
                                        >
                                            Change %
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={sorting.column === 'volume'}
                                            direction={sorting.column === 'volume' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('volume')}
                                        >
                                            Volume
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={sorting.column === 'high'}
                                            direction={sorting.column === 'high' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('high')}
                                        >
                                            High
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="right">
                                        <TableSortLabel
                                            active={sorting.column === 'low'}
                                            direction={sorting.column === 'low' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('low')}
                                        >
                                            Low
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sorting.column === 'exchange'}
                                            direction={sorting.column === 'exchange' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('exchange')}
                                        >
                                            Exchange
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={sorting.column === 'sector'}
                                            direction={sorting.column === 'sector' ? sorting.direction : 'asc'}
                                            onClick={() => handleSort('sector')}
                                        >
                                            Sector
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell align="center">Watchlist</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {displayInstruments.map((instrument: Instrument) => {
                                    const isStarred = watchlists.some(w => w.instrumentIds.includes(instrument.id));
                                    const marketData = prices[instrument.id];
                                    const isPositive = marketData ? marketData.change >= 0 : true;

                                    return (
                                        <TableRow
                                            key={instrument.id}
                                            sx={{ cursor: 'pointer' }}
                                            onClick={() => navigate(`/instruments/${instrument.id}`)}
                                        >
                                            <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {instrument.symbol}
                                                    {instrument.isShortable && (
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
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {instrument.name}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                                <TickColoredPrice marketData={marketData} />
                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                color: isPositive ? 'success.main' : 'error.main',
                                                fontWeight: 500,
                                                fontVariantNumeric: 'tabular-nums',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {marketData ? `${isPositive ? '+' : ''}${marketData.change.toFixed(2)}` : '--'}
                                            </TableCell>
                                            <TableCell align="right" sx={{
                                                color: isPositive ? 'success.main' : 'error.main',
                                                fontWeight: 500,
                                                fontVariantNumeric: 'tabular-nums',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                <Chip
                                                    label={marketData ? `${isPositive ? '+' : ''}${marketData.changePct.toFixed(2)}%` : '--'}
                                                    size="small"
                                                    color={isPositive ? 'success' : 'error'}
                                                    variant="outlined"
                                                    sx={{
                                                        height: 20,
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        border: 'none',
                                                        bgcolor: isPositive ? 'success.lighter' : 'error.lighter'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                                {marketData ? marketData.volume.toLocaleString() : '--'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                                {marketData ? marketData.high.toFixed(2) : '--'}
                                            </TableCell>
                                            <TableCell align="right" sx={{ color: 'text.secondary', fontVariantNumeric: 'tabular-nums' }}>
                                                {marketData ? marketData.low.toFixed(2) : '--'}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={instrument.exchange} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', color: 'text.secondary' }} />
                                            </TableCell>
                                            <TableCell sx={{ color: 'text.secondary' }}>{instrument.sector}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => handleWatchlistToggle(e, instrument)}
                                                    sx={{
                                                        color: isStarred ? 'warning.main' : 'action.disabled',
                                                        transition: 'transform 0.2s',
                                                        '&:hover': { transform: 'scale(1.1)', color: isStarred ? 'warning.dark' : 'warning.light' }
                                                    }}
                                                >
                                                    {isStarred ? (
                                                        <StarIcon fontSize="small" />
                                                    ) : (
                                                        <StarBorderIcon fontSize="small" />
                                                    )}
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>


                    <Box sx={{
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        '& .MuiTablePagination-root': {
                            minHeight: '32px'
                        },
                        '& .MuiTablePagination-toolbar': {
                            minHeight: '32px',
                            paddingTop: 0.5,
                            paddingBottom: 0.5,
                            paddingLeft: 1,
                            paddingRight: 1
                        }
                    }}>
                        <TablePagination
                            rowsPerPageOptions={[25, 50, 75, 100]}
                            component="div"
                            count={filteredInstruments.length}
                            rowsPerPage={pagination.rowsPerPage}
                            page={pagination.page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Box>
            )
            }
        </Box >
    );
};
