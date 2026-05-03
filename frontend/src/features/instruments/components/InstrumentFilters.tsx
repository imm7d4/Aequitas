import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { InstrumentSearch } from './InstrumentSearch';

interface InstrumentFiltersProps {
    filters: any;
    sectors: string[];
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InstrumentFilters: React.FC<InstrumentFiltersProps> = ({ filters, sectors, onFilterChange }) => (
    <Box sx={{ 
        p: 1, mb: 1.5, display: 'flex', gap: 2, alignItems: 'center',
        bgcolor: 'background.paper', borderRadius: '12px', border: '1px solid', borderColor: 'divider'
    }}>
        <Box sx={{ flex: 1 }}><InstrumentSearch /></Box>
        <TextField select value={filters.exchange} name="exchange" onChange={onFilterChange} size="small" sx={{ width: 140 }} label="Exchange">
            <MenuItem value="ALL">All Exchanges</MenuItem>
            <MenuItem value="NSE">NSE</MenuItem>
            <MenuItem value="BSE">BSE</MenuItem>
        </TextField>
        <TextField select value={filters.sector} name="sector" onChange={onFilterChange} size="small" sx={{ width: 180 }} label="Sector">
            <MenuItem value="ALL">All Sectors</MenuItem>
            {sectors.map((sector: string) => <MenuItem key={sector} value={sector}>{sector}</MenuItem>)}
        </TextField>
    </Box>
);
