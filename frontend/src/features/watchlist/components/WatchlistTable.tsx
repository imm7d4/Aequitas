import React, { useMemo, useCallback, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Box, CircularProgress, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWatchlistStore } from '../store/watchlistStore';
import { useInstrumentStore } from '@/features/instruments/store/instrumentStore';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { ContextMenu } from './ContextMenu';
import { GroupHeader } from './GroupHeader';
import { SetAlertModal } from '@/features/alerts/components/SetAlertModal';
import { WatchlistRow } from './WatchlistRow';
import { useWatchlistPersistence } from '../hooks/useWatchlistPersistence';
import { useWatchlistKeyboardNavigation } from '../hooks/useWatchlistKeyboardNavigation';

interface WatchlistTableProps {
    filteredInstrumentIds?: string[];
    visibleColumns?: string[];
    groupBy?: 'sector' | 'exchange' | 'type' | null;
}

const DEFAULT_COLUMNS = ['symbol', 'name', 'lastPrice', 'change', 'volume'];

export const WatchlistTable: React.FC<WatchlistTableProps> = ({
    filteredInstrumentIds, visibleColumns = DEFAULT_COLUMNS, groupBy = null
}) => {
    const navigate = useNavigate();
    const activeWatchlistId = useWatchlistStore(s => s.activeWatchlistId);
    const watchlists = useWatchlistStore(s => s.watchlists);
    const removeInstrumentFromWatchlist = useWatchlistStore(s => s.removeInstrumentFromWatchlist);
    const instruments = useInstrumentStore(s => s.instruments);
    const isLoadingInstruments = useInstrumentStore(s => s.isLoading);

    const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
    const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);
    const [alertModalOpen, setAlertModalOpen] = useState(false);
    const [alertInstrumentId, setAlertInstrumentId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; instrumentId: string } | null>(null);

    const activeWatchlist = useMemo(() => watchlists.find((w) => w.id === activeWatchlistId), [watchlists, activeWatchlistId]);
    const watchlistInstruments = useMemo(() => {
        if (!activeWatchlist) return [];
        const ids = filteredInstrumentIds || activeWatchlist.instrumentIds;
        return ids.map((id) => instruments.find((inst) => inst.id === id)).filter(Boolean);
    }, [activeWatchlist, instruments, filteredInstrumentIds]);

    const { prices } = useMarketData(useMemo(() => watchlistInstruments.map(i => i!.id), [watchlistInstruments]));
    const persistence = useWatchlistPersistence(watchlistInstruments, groupBy);

    const handleBuy = useCallback((id: string) => navigate(`/instruments/${id}`, { state: { side: 'BUY' } }), [navigate]);
    const handleSell = useCallback((id: string) => navigate(`/instruments/${id}`, { state: { side: 'SELL' } }), [navigate]);
    const handleChart = useCallback((id: string) => navigate(`/instruments/${id}`), [navigate]);
    const handleRemove = useCallback(async (id: string) => {
        if (activeWatchlistId) await removeInstrumentFromWatchlist(activeWatchlistId, id);
    }, [activeWatchlistId, removeInstrumentFromWatchlist]);

    useWatchlistKeyboardNavigation(watchlistInstruments, hoveredRowId || selectedRowId, {
        onBuy: handleBuy, onSell: handleSell, onChart: handleChart,
        setSelectedRowId, setHoveredRowId
    });

    const renderRow = (inst: any, isPinned: boolean = false) => (
        <WatchlistRow 
            key={inst.id} instrument={inst} marketData={prices[inst.id]}
            visibleColumns={visibleColumns} isPinned={isPinned}
            isSelected={selectedRowId === inst.id} isHovered={hoveredRowId === inst.id}
            onSelect={() => setSelectedRowId(inst.id)}
            onMouseEnter={() => setHoveredRowId(inst.id)}
            onMouseLeave={() => setHoveredRowId(null)}
            onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, instrumentId: inst.id }); }}
            onTogglePin={() => persistence.togglePin(inst.id)}
            onBuy={() => handleBuy(inst.id)} onSell={() => handleSell(inst.id)}
            onChart={() => handleChart(inst.id)} onRemove={() => handleRemove(inst.id)}
        />
    );

    if (!activeWatchlistId) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="textSecondary">Select a watchlist</Typography></Box>;
    if (isLoadingInstruments && watchlistInstruments.length === 0) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={24} sx={{ mb: 2 }} /><Typography color="textSecondary">Loading...</Typography></Box>;
    if (watchlistInstruments.length === 0) return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="textSecondary">No instruments found</Typography></Box>;

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
                        {persistence.pinnedItems.length > 0 && (
                            <>
                                <TableRow><TableCell colSpan={visibleColumns.length + 1} sx={{ bgcolor: 'primary.50', py: 0.5 }}><Typography variant="caption" fontWeight={700} color="primary.main">⭐ Pinned</Typography></TableCell></TableRow>
                                {persistence.pinnedItems.map(inst => renderRow(inst, true))}
                                <TableRow><TableCell colSpan={visibleColumns.length + 1} sx={{ p: 0 }}><Divider /></TableCell></TableRow>
                            </>
                        )}
                        {groupBy && persistence.groupedInstruments ? Object.entries(persistence.groupedInstruments).map(([name, groupInsts]) => (
                            <React.Fragment key={name}>
                                <TableRow>
                                    <TableCell colSpan={visibleColumns.length + 1} sx={{ p: 0 }}>
                                        <GroupHeader groupName={name} count={groupInsts.length} isExpanded={persistence.expandedGroups.has(name)} onToggle={() => persistence.toggleGroup(name)} />
                                    </TableCell>
                                </TableRow>
                                {persistence.expandedGroups.has(name) && groupInsts.map(inst => renderRow(inst))}
                            </React.Fragment>
                        )) : persistence.regularItems.map(inst => renderRow(inst))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ContextMenu
                anchorPosition={contextMenu ? { top: contextMenu.y, left: contextMenu.x } : null}
                onClose={() => setContextMenu(null)}
                onBuy={() => contextMenu && handleBuy(contextMenu.instrumentId)}
                onSell={() => contextMenu && handleSell(contextMenu.instrumentId)}
                onChart={() => contextMenu && handleChart(contextMenu.instrumentId)}
                onAlert={() => { if (contextMenu) { setAlertInstrumentId(contextMenu.instrumentId); setAlertModalOpen(true); } }}
                onRemove={() => contextMenu && handleRemove(contextMenu.instrumentId)}
                onTogglePin={() => contextMenu && persistence.togglePin(contextMenu.instrumentId)}
                isPinned={contextMenu ? persistence.pinnedInstruments.includes(contextMenu.instrumentId) : false}
            />

            {alertModalOpen && alertInstrumentId && (
                <SetAlertModal open={alertModalOpen} onClose={() => setAlertModalOpen(false)} instrumentId={alertInstrumentId} symbol={instruments.find(i => i.id === alertInstrumentId)?.symbol || ''} currentPrice={prices[alertInstrumentId]?.lastPrice || 0} />
            )}
        </>
    );
};
