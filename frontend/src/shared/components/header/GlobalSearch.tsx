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
    } = useGlobalSearch();

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            <Autocomplete
                size="small"
                options={options}
                loading={loading}
                popupIcon={null} // Hide the dropdown arrow for a cleaner look
                sx={{
                    '& .MuiAutocomplete-endAdornment': {
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: '8px !important',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }
                }}
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
                        placeholder="Search instruments..."
                        variant="outlined"
                        aria-label="Search instruments"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: 44,
                                bgcolor: 'rgba(0, 0, 0, 0.03)',
                                borderRadius: '12px',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: '1px solid transparent',
                                px: '16px !important',
                                '& fieldset': { border: 'none' },
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.05)',
                                    border: '1px solid rgba(0, 0, 0, 0.1)',
                                },
                                '&.Mui-focused': {
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
                                    border: '1px solid rgba(25, 118, 210, 0.5)',
                                }
                            },
                        }}
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon
                                        sx={{
                                            color: 'text.disabled',
                                            fontSize: 20,
                                            mr: 0.5
                                        }}
                                    />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <React.Fragment>
                                    <Box
                                        sx={{
                                            display: { xs: 'none', md: 'flex' },
                                            alignItems: 'center',
                                            bgcolor: 'action.hover',
                                            px: 1,
                                            py: 0.25,
                                            borderRadius: '6px',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            color: 'text.secondary',
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                            ml: 1,
                                            userSelect: 'none',
                                            opacity: inputValue ? 0 : 1, // Hide when typing
                                            transition: 'opacity 0.2s',
                                        }}
                                    >
                                        Ctrl+K
                                    </Box>
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            )
                        }}
                    />
                )}
                renderOption={(props, option) => (
                    <SearchOption
                        key={option.id}
                        props={props}
                        option={option}
                        isHistory={!inputValue && recentSearches.some(r => r.id === option.id)}
                    />
                )}
            />
        </Box>
    );
};
