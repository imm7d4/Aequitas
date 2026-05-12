import { useMemo } from 'react';
import { Box, Typography, Alert, TablePagination, Button } from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import { useInstrumentList } from '../hooks/useInstrumentList';
import { getInstrumentColumns } from './InstrumentColumns';
import { InstrumentFilters } from './InstrumentFilters';
import { CustomGrid } from '@/shared/components/CustomGrid';
import type { Instrument } from '../types/instrument.types';

export const InstrumentList = () => {
    const {
        displayInstruments, filteredInstruments, isLoading, error, filters, searchQuery, pagination, sorting, sectors, prices, watchlists,
        handleSort, handleFilterChange, resetFilters, handleWatchlistToggle, navigate, setPagination
    } = useInstrumentList();

    const columns = useMemo(() => 
        getInstrumentColumns(prices, watchlists, handleWatchlistToggle), 
    [prices, watchlists, handleWatchlistToggle]);

    const isFiltered = filters.exchange !== 'ALL' || filters.type !== 'ALL' || filters.sector !== 'ALL' || searchQuery !== '';

    if (isLoading && displayInstruments.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Loader size="medium" />
            </Box>
        );
    }

    if (error) {
        return <Box sx={{ p: 4 }}><Alert severity="error" variant="filled">{error}</Alert></Box>;
    }

    return (
        <Box sx={{ height: 'calc(100vh - 64px)', pt: 2, px: { xs: 2, lg: 3 }, pb: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'background.default' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" color="primary.main">Market Instruments</Typography>
                {isFiltered && <Button size="small" onClick={resetFilters}>Clear Filters</Button>}
            </Box>

            <InstrumentFilters filters={filters} sectors={sectors} onFilterChange={handleFilterChange} />

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
                {displayInstruments.length === 0 ? (
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: 0.6 }}>
                        <Typography variant="h6" fontWeight={700}>No matches found</Typography>
                    </Box>
                ) : (
                    <>
                        <CustomGrid
                            columns={columns}
                            data={displayInstruments}
                            onRowClick={(row: Instrument) => navigate(`/instruments/${row.id}`)}
                            sorting={sorting}
                            onSort={handleSort}
                            maxHeight="100%"
                        />
                        <Box sx={{ mt: 1, px: 1, display: 'flex', justifyContent: 'flex-end', border: '1px solid', borderColor: 'divider', borderRadius: '12px', bgcolor: 'background.paper' }}>
                            <TablePagination
                                component="div"
                                count={filteredInstruments.length}
                                rowsPerPage={pagination.rowsPerPage}
                                page={pagination.page}
                                onPageChange={(_, page) => setPagination({ ...pagination, page })}
                                onRowsPerPageChange={(e) => setPagination({ page: 0, rowsPerPage: parseInt(e.target.value, 10) })}
                                rowsPerPageOptions={[25, 50, 100]}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};
