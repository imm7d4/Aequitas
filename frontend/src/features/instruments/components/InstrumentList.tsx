import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    ToggleButton,
    ToggleButtonGroup,
    TextField,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import ListIcon from '@mui/icons-material/List';
import { useInstruments } from '../hooks/useInstruments';
import { useInstrumentStore } from '../store/instrumentStore';
import { InstrumentCard } from './InstrumentCard';
import { InstrumentSearch } from './InstrumentSearch';
import type { Instrument } from '../types/instrument.types';

export const InstrumentList = () => {
    // Trigger data fetching on mount via useInstruments hook
    useInstruments();

    const {
        instruments,
        searchResults,
        isLoading,
        error,
        viewMode,
        filters,
        searchQuery,
        pagination,
        setViewMode,
        setFilters,
        setSearchQuery,
        setSearchResults,
        setPagination
    } = useInstrumentStore();
    const navigate = useNavigate();

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

    const displayInstruments = useMemo(() => {
        const { page, rowsPerPage } = pagination;
        return filteredInstruments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredInstruments, pagination]);

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
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Instruments</Typography>
                <ToggleButtonGroup
                    value={viewMode}
                    exclusive
                    onChange={(_, mode) => mode && setViewMode(mode)}
                    size="small"
                    aria-label="view mode"
                >
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridViewIcon sx={{ mr: 1 }} /> Grid
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ListIcon sx={{ mr: 1 }} /> List
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
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
            ) : viewMode === 'grid' ? (
                <Grid container spacing={2}>
                    {displayInstruments.map((instrument: Instrument) => (
                        <Grid item xs={12} sm={6} md={4} key={instrument.id}>
                            <InstrumentCard
                                instrument={instrument}
                                onClick={() => navigate(`/instruments/${instrument.id}`)}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Exchange</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Sector</TableCell>
                                <TableCell>ISIN</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayInstruments.map((instrument: Instrument) => (
                                <TableRow
                                    key={instrument.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/instruments/${instrument.id}`)}
                                >
                                    <TableCell sx={{ fontWeight: 'bold' }}>{instrument.symbol}</TableCell>
                                    <TableCell>{instrument.name}</TableCell>
                                    <TableCell>{instrument.exchange}</TableCell>
                                    <TableCell>{instrument.type}</TableCell>
                                    <TableCell>{instrument.sector}</TableCell>
                                    <TableCell sx={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>
                                        {instrument.isin}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button size="small" variant="outlined">View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Box sx={{
                position: 'sticky',
                bottom: 0,
                bgcolor: 'background.paper',
                borderTop: '1px solid',
                borderColor: 'divider',
                zIndex: 1,
                mx: -2, // Offset container padding if necessary, or just keep it simple
                px: 2
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
    );
};
