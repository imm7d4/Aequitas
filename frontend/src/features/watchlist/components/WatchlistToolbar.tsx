import { useState } from 'react';
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    Stack,
    InputAdornment
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Sort as SortIcon
} from '@mui/icons-material';

interface WatchlistToolbarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    sortBy: 'symbol' | 'price' | 'change' | 'volume';
    onSortChange: (sortBy: 'symbol' | 'price' | 'change' | 'volume') => void;
    sortDirection: 'asc' | 'desc';
    onSortDirectionToggle: () => void;
}

export const WatchlistToolbar: React.FC<WatchlistToolbarProps> = ({
    searchQuery,
    onSearchChange,
    sortBy,
    onSortChange,
    sortDirection,
    onSortDirectionToggle
}) => {
    return (
        <Box
            sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper'
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
            >
                {/* Search */}
                <TextField
                    size="small"
                    placeholder="Search by symbol or name..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 250 } }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Sort */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => onSortChange(e.target.value as any)}
                        startAdornment={
                            <InputAdornment position="start">
                                <SortIcon fontSize="small" />
                            </InputAdornment>
                        }
                    >
                        <MenuItem value="symbol">Symbol</MenuItem>
                        <MenuItem value="price">Price</MenuItem>
                        <MenuItem value="change">Change %</MenuItem>
                        <MenuItem value="volume">Volume</MenuItem>
                    </Select>
                </FormControl>

                {/* Sort Direction Toggle */}
                <Button
                    size="small"
                    variant="outlined"
                    onClick={onSortDirectionToggle}
                    sx={{ minWidth: 80 }}
                >
                    {sortDirection === 'asc' ? '↑ A-Z' : '↓ Z-A'}
                </Button>

                {/* Quick Add - Navigate to instruments page */}
                <Button
                    size="small"
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => window.location.href = '/instruments'}
                    sx={{ minWidth: 120 }}
                >
                    Add
                </Button>
            </Stack>
        </Box>
    );
};
