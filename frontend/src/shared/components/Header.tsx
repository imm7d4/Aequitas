import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    Autocomplete,
    TextField,
    InputAdornment,
    Button,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
    Search as SearchIcon,
    AccountCircle,
    Logout,
    Settings,
    History as HistoryIcon,
    Bolt as BoltIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { instrumentService } from '@/features/instruments/services/instrumentService';
import { MarketStatusBadge } from '@/features/market/components/MarketStatusBadge';
import type { Instrument } from '@/features/instruments/types/instrument.types';

const RECENT_SEARCHES_KEY = 'aequitas_recent_searches';

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: any;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

export const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { toggleSidebar, notificationCount } = useLayoutStore();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [options, setOptions] = useState<Instrument[]>([]);
    const [recentSearches, setRecentSearches] = useState<Instrument[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const searchRef = useRef<HTMLInputElement>(null);

    // Initial load of recent searches
    useEffect(() => {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
            try {
                setRecentSearches(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse recent searches');
            }
        }
    }, []);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' || (e.ctrlKey && e.key === 'k')) {
                if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                    return;
                }
                e.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const addToRecentSearches = (instrument: Instrument) => {
        const filtered = recentSearches.filter(i => i.id !== instrument.id);
        const updated = [instrument, ...filtered].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    };

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logout();
    };

    const smartRank = (results: Instrument[], query: string) => {
        const q = query.toLowerCase();
        return results.sort((a, b) => {
            const aSym = a.symbol.toLowerCase();
            const bSym = b.symbol.toLowerCase();
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();

            // Exact symbol match
            if (aSym === q && bSym !== q) return -1;
            if (bSym === q && aSym !== q) return 1;

            // Starts with symbol match
            if (aSym.startsWith(q) && !bSym.startsWith(q)) return -1;
            if (bSym.startsWith(q) && !aSym.startsWith(q)) return 1;

            // Name match preference
            if (aName.includes(q) && !bName.includes(q)) return -1;
            if (bName.includes(q) && !aName.includes(q)) return 1;

            return 0;
        });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchInstruments = useCallback(
        debounce(async (query: string) => {
            if (!query) {
                setOptions(recentSearches);
                return;
            }
            setLoading(true);
            try {
                const results = await instrumentService.searchInstruments(query);
                setOptions(smartRank(results, query));
            } catch (error) {
                console.error('Global search error:', error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [recentSearches]
    );

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary', boxShadow: 1 }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick={toggleSidebar}
                >
                    <MenuIcon />
                </IconButton>

                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        color: 'primary.main',
                        letterSpacing: 1,
                        mr: 4
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    AEQUITAS
                </Typography>

                <Box sx={{ flexGrow: 1, maxWidth: 640 }}>
                    <Autocomplete
                        size="small"
                        options={inputValue ? options : recentSearches}
                        loading={loading}
                        getOptionLabel={(option) => `${option.symbol} - ${option.name}`}
                        filterOptions={(x) => x}
                        onInputChange={(_, value) => {
                            setInputValue(value);
                            fetchInstruments(value);
                        }}
                        onChange={(_, value) => {
                            if (value) {
                                addToRecentSearches(value);
                                navigate(`/instruments/${value.id}`);
                            }
                        }}
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
                        renderOption={(props, option) => {
                            const isHistory = !inputValue && recentSearches.some(r => r.id === option.id);
                            return (
                                <li {...props} key={option.id} style={{ padding: '4px 12px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', py: 0.5 }}>
                                        {isHistory ? (
                                            <HistoryIcon sx={{ mr: 2, fontSize: 20, color: 'text.disabled' }} />
                                        ) : (
                                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="subtitle2" sx={{
                                                    minWidth: 60,
                                                    fontWeight: 800,
                                                    color: 'primary.main',
                                                    bgcolor: 'rgba(25, 118, 210, 0.08)',
                                                    px: 1,
                                                    py: 0.25,
                                                    borderRadius: 1,
                                                    textAlign: 'center',
                                                    fontSize: '0.75rem'
                                                }}>
                                                    {option.symbol}
                                                </Typography>
                                            </Box>
                                        )}
                                        <Box sx={{ flexGrow: 1, ml: isHistory ? 0 : 0 }}>
                                            <Typography variant="body2" fontWeight={600} noWrap>
                                                {option.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                                {option.exchange} • {option.type}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="text"
                                                startIcon={<BoltIcon fontSize="small" />}
                                                sx={{
                                                    fontSize: '0.65rem',
                                                    color: 'success.main',
                                                    '&:hover': { bgcolor: 'rgba(46, 125, 50, 0.08)' }
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addToRecentSearches(option);
                                                    console.log('Quick Trade triggered for', option.symbol);
                                                    // This will be linked to a trade dialog later
                                                }}
                                            >
                                                Trade
                                            </Button>
                                        </Box>
                                    </Box>
                                </li>
                            );
                        }}
                    />
                </Box>

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 4, display: { xs: 'none', md: 'block' } }}>
                        <MarketStatusBadge />
                    </Box>

                    <IconButton size="large" color="inherit">
                        <Badge badgeContent={notificationCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
                        <Box sx={{ mr: 1, textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <Typography variant="body2" fontWeight="bold">
                                {user?.email.split('@')[0]}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Trader
                            </Typography>
                        </Box>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 'bold' }}>
                            {user?.email.charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: { mt: 1.5, minWidth: 180, boxShadow: 3 }
                    }}
                >
                    <MenuItem onClick={handleMenuClose}>
                        <AccountCircle sx={{ mr: 1.5 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose}>
                        <Settings sx={{ mr: 1.5 }} /> Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                        <Logout sx={{ mr: 1.5 }} /> Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};
