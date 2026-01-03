import React from 'react';
import {
    Box,
    Autocomplete,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { SearchOption } from './SearchOption';

export const GlobalSearch: React.FC = () => {
    const {
        options,
        recentSearches,
        loading,
        inputValue,
        setInputValue,
        searchRef,
        fetchInstruments,
        handleSelect,
        addToRecentSearches,
    } = useGlobalSearch();

    return (
        <Box sx={{ flexGrow: 1, maxWidth: 640 }}>
            <Autocomplete
                size="small"
                options={options}
                loading={loading}
                getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
                filterOptions={(x) => x}
                onInputChange={(_, value) => {
                    setInputValue(value);
                    fetchInstruments(value);
                }}
                onChange={(_, value) => value && handleSelect(value)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        inputRef={searchRef}
                        placeholder="Search instruments ( / or Ctrl+K )"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                bgcolor: 'action.hover',
                                '& fieldset': { border: 'none' },
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&.Mui-focused': {
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                }
                            }
                        }}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <SearchOption
                        key={option.id}
                        props={props}
                        option={option}
                        isHistory={!inputValue && recentSearches.some(r => r.id === option.id)}
                        onQuickTrade={addToRecentSearches}
                    />
                )}
            />
        </Box>
    );
};
