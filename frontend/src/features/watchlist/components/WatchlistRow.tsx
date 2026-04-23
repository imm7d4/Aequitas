import React from 'react';
import { TableRow, TableCell, Box, Typography, IconButton, Stack } from '@mui/material';
import {
    Delete as DeleteIcon,
    ShoppingCart as BuyIcon,
    TrendingDown as SellIcon,
    ShowChart as ChartIcon,
    Star as StarIcon,
    StarBorder as StarOutlineIcon,
} from '@mui/icons-material';
import { PriceCell } from './PriceCell';

interface WatchlistRowProps {
    instrument: any;
    marketData: any;
    visibleColumns: string[];
    isPinned: boolean;
    isSelected: boolean;
    isHovered: boolean;
    onSelect: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onContextMenu: (e: React.MouseEvent) => void;
    onTogglePin: () => void;
    onBuy: () => void;
    onSell: () => void;
    onChart: () => void;
    onRemove: () => void;
}

export const WatchlistRow: React.FC<WatchlistRowProps> = ({
    instrument, marketData, visibleColumns, isPinned, isSelected, isHovered,
    onSelect, onMouseEnter, onMouseLeave, onContextMenu,
    onTogglePin, onBuy, onSell, onChart, onRemove
}) => {
    return (
        <TableRow
            hover
            selected={isSelected}
            onClick={onSelect}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={onContextMenu}
            sx={{
                cursor: 'pointer',
                bgcolor: isSelected ? 'action.selected' : isPinned ? 'action.hover' : 'inherit',
            }}
        >
            {visibleColumns.includes('symbol') && (
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onTogglePin(); }} sx={{ p: 0.5 }}>
                            {isPinned ? <StarIcon fontSize="small" color="primary" /> : <StarOutlineIcon fontSize="small" />}
                        </IconButton>
                        <Box>
                            <Typography variant="body2" fontWeight={600}>{instrument.symbol}</Typography>
                            <Typography variant="caption" color="textSecondary">{instrument.exchange}</Typography>
                        </Box>
                    </Box>
                </TableCell>
            )}
            {visibleColumns.includes('name') && <TableCell>{instrument.name}</TableCell>}
            {visibleColumns.includes('lastPrice') && (
                <TableCell align="right">
                    {marketData ? <PriceCell price={marketData.lastPrice} change={marketData.change} changePct={marketData.changePct} /> : <Typography variant="caption" color="textSecondary">Fetching...</Typography>}
                </TableCell>
            )}
            {visibleColumns.includes('volume') && (
                <TableCell align="right">
                    <Typography variant="body2">{marketData?.volume?.toLocaleString() || '—'}</Typography>
                </TableCell>
            )}
            <TableCell align="right">
                {(isHovered || isSelected) ? (
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <IconButton size="small" color="success" onClick={(e) => { e.stopPropagation(); onBuy(); }} title="Buy (B)"><BuyIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); onSell(); }} title="Sell (S)"><SellIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="primary" onClick={(e) => { e.stopPropagation(); onChart(); }} title="Chart (C)"><ChartIcon fontSize="small" /></IconButton>
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Remove"><DeleteIcon fontSize="small" /></IconButton>
                    </Stack>
                ) : (
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(); }} title="Remove"><DeleteIcon fontSize="small" /></IconButton>
                )}
            </TableCell>
        </TableRow>
    );
};
