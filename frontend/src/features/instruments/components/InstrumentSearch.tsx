import { TextField, Box } from '@mui/material';
import { useInstrumentStore } from '../store/instrumentStore';
import { instrumentService } from '../services/instrumentService';

export const InstrumentSearch = () => {
    const { searchQuery, setSearchQuery, setSearchResults, setLoading, setError, clearError } = useInstrumentStore();

    const handleSearch = (value: string) => {
        setSearchQuery(value);
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        // Debounce search
        const timeoutId = setTimeout(async () => {
            setLoading(true);
            clearError();
            try {
                const data = await instrumentService.searchInstruments(value);
                setSearchResults(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Search failed');
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <TextField
                fullWidth
                label="Search Instruments"
                placeholder="Search by symbol, name, or ISIN..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </Box>
    );
};
