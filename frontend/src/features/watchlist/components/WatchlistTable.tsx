import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    CircularProgress,
    Stack,
    Divider,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    ShoppingCart as BuyIcon,
    TrendingDown as SellIcon,
    ShowChart as ChartIcon,
    Star as StarIcon,
    StarBorder as StarOutlineIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useWatchlistStore } from '../store/watchlistStore';
import { useInstrumentStore } from '@/features/instruments/store/instrumentStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { PriceCell } from './PriceCell';
import { ContextMenu } from './ContextMenu';
import { GroupHeader } from './GroupHeader';
import { SetAlertModal } from '@/features/alerts/components/SetAlertModal';
import { useAuth } from '@/features/auth';
import { useAuthStore } from '@/features/auth/hooks/useAuth';

interface WatchlistTableProps {
    filteredInstrumentIds?: string[];
    visibleColumns?: string[];
    groupBy?: 'sector' | 'exchange' | 'type' | null;
}

const DEFAULT_COLUMNS = ['symbol', 'name', 'lastPrice', 'change', 'volume'];

export const WatchlistTable: React.FC<WatchlistTableProps> = ({
    filteredInstrumentIds,
    visibleColumns = DEFAULT_COLUMNS,
    groupBy = null,
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const watchlists = useWatchlistStore(s => s.watchlists);
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const removeInstrumentFromWatchlist = useWatchlistStore(s => s.removeInstrumentFromWatchlist);

    const instruments = useInstrumentStore(s => s.instruments);
    const isLoadingInstruments = useInstrumentStore(s => s.isLoading);

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [alertInstrumentId, setAlertInstrumentId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; instrumentId: string } | null>(null);

    // Initialize pinned instruments from localStorage
    const [pinnedInstruments, setPinnedInstruments] = useState<string[]>(() => {
        const user = useAuthStore.getState().user;
        if (user?.email) {
            const key = `pinned_instruments_${user.email}`;
            const saved = localStorage.getItem(key);
            console.log('[WatchlistTable] Initial load of pins for', user.email, ':', saved);
            if (saved) {
                try {
                    return JSON.parse(saved);
                } catch (e) {
                    console.error('[WatchlistTable] Failed to parse saved pins:', e);
                }
            }
        }
        return [];
    });

    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const activeWatchlist = useMemo(
        () => watchlists.find((w) => w.id === activeWatchlistId),
        [watchlists, activeWatchlistId]
    );

    // Save pinned instruments to localStorage whenever they change
    useEffect(() => {
        if (user?.email) {
            const key = `pinned_instruments_${user.email}`;
            localStorage.setItem(key, JSON.stringify(pinnedInstruments));
            console.log('[WatchlistTable] Saved pins for', user.email, ':', pinnedInstruments);
        }
    }, [pinnedInstruments, user?.email]);

    // Load expanded groups from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('watchlist_expanded_groups');
        if (saved) {
            setExpandedGroups(new Set(JSON.parse(saved)));
        }
    }, []);

    // Save expanded groups to localStorage
    useEffect(() => {
        localStorage.setItem('watchlist_expanded_groups', JSON.stringify(Array.from(expandedGroups)));
    }, [expandedGroups]);

    const watchlistInstruments = useMemo(() => {
        if (!activeWatchlist) return [];

        const idsToDisplay = filteredInstrumentIds || activeWatchlist.instrumentIds;

        return idsToDisplay
            .map((id) => instruments.find((inst) => inst.id === id))
            .filter(Boolean);
    }, [activeWatchlist, instruments, filteredInstrumentIds]);

    const instrumentIds = useMemo(
        () => watchlistInstruments.map((inst) => inst!.id),
        [watchlistInstruments]
    );

    const { prices } = useMarketData(instrumentIds);

    // Group instruments
    const groupedInstruments = useMemo(() => {
        if (!groupBy) return null;

        const groups: Record<string, typeof watchlistInstruments> = {};
        watchlistInstruments.forEach(inst => {
            if (!inst) return;
            const key = inst[groupBy] || 'Other';
            if (!groups[key]) groups[key] = [];
            groups[key].push(inst);
        });

        return groups;
    }, [watchlistInstruments, groupBy]);

    // Separate pinned and regular instruments
    const { pinnedItems, regularItems } = useMemo(() => {
        const pinned = watchlistInstruments.filter(inst => pinnedInstruments.includes(inst!.id));
        const regular = watchlistInstruments.filter(inst => !pinnedInstruments.includes(inst!.id));
        return { pinnedItems: pinned, regularItems: regular };
    }, [watchlistInstruments, pinnedInstruments]);

    const handleRemove = useCallback(async (instrumentId: string) => {
        if (!activeWatchlistId) return;
        try {
            await removeInstrumentFromWatchlist(activeWatchlistId, instrumentId);
            setPinnedInstruments(prev => prev.filter(id => id !== instrumentId));
        } catch (err) {
            console.error('Failed to remove instrument', err);
        }
    }, [activeWatchlistId, removeInstrumentFromWatchlist]);

    const handleBuy = useCallback((instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`, { state: { side: 'BUY' } });
    }, [navigate]);

    const handleSell = useCallback((instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`, { state: { side: 'SELL' } });
    }, [navigate]);

    const handleChart = useCallback((instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`);
    }, [navigate]);

    const handleTogglePin = useCallback((instrumentId: string) => {
        setPinnedInstruments(prev =>
            prev.includes(instrumentId)
                ? prev.filter(id => id !== instrumentId)
                : [...prev, instrumentId]
        );
    }, []);

    const handleContextMenu = useCallback((e: React.MouseEvent, instrumentId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, instrumentId });
    }, []);

    const handleToggleGroup = useCallback((groupName: string) => {
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(groupName)) {
                next.delete(groupName);
            } else {
                next.add(groupName);
            }
            return next;
        });
    }, []);

    const handleOpenAlert = useCallback((instrumentId: string) => {
        setAlertInstrumentId(instrumentId);
        setAlertModalOpen(true);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const activeRowId = hoveredRowId || selectedRowId;
            if (!activeRowId || watchlistInstruments.length === 0) return;

            const currentIndex = watchlistInstruments.findIndex(inst => inst!.id === activeRowId);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < watchlistInstruments.length - 1) {
                        const nextId = watchlistInstruments[currentIndex + 1]!.id;
                        setSelectedRowId(nextId);
                        setHoveredRowId(nextId);
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        const prevId = watchlistInstruments[currentIndex - 1]!.id;
                        setSelectedRowId(prevId);
                        setHoveredRowId(prevId);
                    }
                    break;
                case 'b':
                case 'B':
                    e.preventDefault();
                    handleBuy(activeRowId);
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    handleSell(activeRowId);
                    break;
                case 'c':
                case 'C':
                    e.preventDefault();
                    handleChart(activeRowId);
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleChart(activeRowId);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hoveredRowId, selectedRowId, watchlistInstruments, handleBuy, handleSell, handleChart]);

    const renderTableRow = (inst: any, isPinned: boolean = false) => {
        const marketData = prices[inst.id];
        const isSelected = selectedRowId === inst.id;
        const isHovered = hoveredRowId === inst.id;

        return (
            <TableRow
                key={inst.id}
                hover
                selected={isSelected}
                onClick={() => setSelectedRowId(inst.id)}
                onMouseEnter={() => setHoveredRowId(inst.id)}
                onMouseLeave={() => setHoveredRowId(null)}
                onContextMenu={(e) => handleContextMenu(e, inst.id)}
                sx={{
                    cursor: 'pointer',
                    bgcolor: isSelected ? 'action.selected' : isPinned ? 'action.hover' : 'inherit',
                }}
            >
                {visibleColumns.includes('symbol') && (
                    <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleTogglePin(inst.id);
                                }}
                                sx={{ p: 0.5 }}
                            >
                                {pinnedInstruments.includes(inst.id) ? (
                                    <StarIcon fontSize="small" color="primary" />
                                ) : (
                                    <StarOutlineIcon fontSize="small" />
                                )}
                            </IconButton>
                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    {inst.symbol}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {inst.exchange}
                                </Typography>
                            </Box>
                        </Box>
                    </TableCell>
                )}
                {visibleColumns.includes('name') && <TableCell>{inst.name}</TableCell>}
                {visibleColumns.includes('lastPrice') && (
                    <TableCell align="right">
                        {marketData ? (
                            <PriceCell
                                price={marketData.lastPrice}
                                change={marketData.change}
                                changePct={marketData.changePct}
                            />
                        ) : (
                            <Typography variant="caption" color="textSecondary">Fetching...</Typography>
                        )}
                    </TableCell>
                )}
                {visibleColumns.includes('volume') && (
                    <TableCell align="right">
                        <Typography variant="body2">
                            {marketData?.volume?.toLocaleString() || '—'}
                        </Typography>
                    </TableCell>
                )}
                <TableCell align="right">
                    {isHovered || isSelected ? (
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            <IconButton
                                size="small"
                                color="success"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBuy(inst.id);
                                }}
                                title="Buy (B)"
                            >
                                <BuyIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSell(inst.id);
                                }}
                                title="Sell (S)"
                            >
                                <SellIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChart(inst.id);
                                }}
                                title="Chart (C)"
                            >
                                <ChartIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(inst.id);
                                }}
                                title="Remove"
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    ) : (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(inst.id);
                            }}
                            title="Remove from Watchlist"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    if (!activeWatchlistId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">Select a watchlist to view instruments</Typography>
            </Box>
        );
    }

    if (isLoadingInstruments && watchlistInstruments.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ mb: 2 }} />
                <Typography color="textSecondary">Loading watchlist instruments...</Typography>
            </Box>
        );
    }

    if (watchlistInstruments.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="textSecondary">No instruments in this watchlist</Typography>
                <Typography variant="caption" display="block">Add stocks from the "View Instruments" page</Typography>
            </Box>
        );
    }

    return (
        <>
            <TableContainer component={Paper} elevation={0} sx={{ maxHeight: 'calc(100vh - 350px)', overflow: 'auto', border: '1px solid', borderColor: 'divider' }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            {visibleColumns.includes('symbol') && <TableCell>Symbol</TableCell>}
                            {visibleColumns.includes('name') && <TableCell>Company Name</TableCell>}
                            {visibleColumns.includes('lastPrice') && <TableCell align="right">Last Price</TableCell>}
                            {visibleColumns.includes('volume') && <TableCell align="right">Volume</TableCell>}
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* Pinned Section */}
                        {pinnedItems.length > 0 && (
                            <>
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 1} sx={{ bgcolor: 'primary.50', py: 0.5 }}>
                                        <Typography variant="caption" fontWeight={700} color="primary.main">
                                            ⭐ Pinned ({pinnedItems.length})
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                                {pinnedItems.map(inst => renderTableRow(inst, true))}
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 1} sx={{ p: 0 }}>
                                        <Divider />
                                    </TableCell>
                                </TableRow>
                            </>
                        )}

                        {/* Grouped or Regular Display */}
                        {groupBy && groupedInstruments ? (
                            Object.entries(groupedInstruments).map(([groupName, groupInsts]) => {
                                const isExpanded = expandedGroups.has(groupName);
                                const groupMarketData = groupInsts.map(inst => prices[inst!.id]).filter(Boolean);
                                const avgChange = groupMarketData.length > 0
                                    ? groupMarketData.reduce((sum, md) => sum + md.changePct, 0) / groupMarketData.length
                                    : 0;
                                const totalVolume = groupMarketData.reduce((sum, md) => sum + (md.volume || 0), 0);

                                return (
                                    <React.Fragment key={groupName}>
                                        <TableRow>
                                            <TableCell colSpan={visibleColumns.length + 1} sx={{ p: 0 }}>
                                                <GroupHeader
                                                    groupName={groupName}
                                                    count={groupInsts.length}
                                                    avgChange={avgChange}
                                                    totalVolume={totalVolume}
                                                    isExpanded={isExpanded}
                                                    onToggle={() => handleToggleGroup(groupName)}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        {isExpanded && groupInsts.map(inst => renderTableRow(inst))}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            regularItems.map(inst => renderTableRow(inst))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Context Menu */}
            <ContextMenu
                anchorPosition={contextMenu ? { top: contextMenu.y, left: contextMenu.x } : null}
                onClose={() => setContextMenu(null)}
                onBuy={() => contextMenu && handleBuy(contextMenu.instrumentId)}
                onSell={() => contextMenu && handleSell(contextMenu.instrumentId)}
                onChart={() => contextMenu && handleChart(contextMenu.instrumentId)}
                onAlert={() => contextMenu && handleOpenAlert(contextMenu.instrumentId)}
                onRemove={() => contextMenu && handleRemove(contextMenu.instrumentId)}
                onTogglePin={() => contextMenu && handleTogglePin(contextMenu.instrumentId)}
                isPinned={contextMenu ? pinnedInstruments.includes(contextMenu.instrumentId) : false}
            />

            {/* Alert Modal */}
            {alertModalOpen && alertInstrumentId && (() => {
                const instrument = instruments.find(inst => inst.id === alertInstrumentId);
                const marketData = prices[alertInstrumentId];
                return instrument ? (
                    <SetAlertModal
                        open={alertModalOpen}
                        onClose={() => {
                            setAlertModalOpen(false);
                            setAlertInstrumentId(null);
                        }}
                        instrumentId={instrument.id}
                        symbol={instrument.symbol}
                        currentPrice={marketData?.lastPrice || 0}
                    />
                ) : null;
            })()}
        </>
    );
};
