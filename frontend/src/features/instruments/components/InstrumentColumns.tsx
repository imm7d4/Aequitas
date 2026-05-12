import React from 'react';
import { Box, Typography, Tooltip, Chip, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { TickColoredPrice } from '@/shared/components/TickColoredPrice';
import type { Instrument } from '../types/instrument.types';

export const getInstrumentColumns = (prices: any, watchlists: any[], onWatchlistToggle: (e: React.MouseEvent, row: Instrument) => void) => [
    {
        id: 'symbol',
        label: 'Symbol',
        sortable: true,
        format: (value: string, row: Instrument) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography fontWeight={700} color="primary.main">{value}</Typography>
                {row.isShortable && (
                    <Tooltip title="Short Selling Available">
                        <Chip label="S" size="small" variant="outlined" sx={{ height: 18, width: 18, fontSize: '0.625rem', borderRadius: '4px' }} />
                    </Tooltip>
                )}
            </Box>
        )
    },
    {
        id: 'sector',
        label: 'Sector',
        sortable: true,
        format: (value: string) => (
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                {value}
            </Typography>
        )
    },
    {
        id: 'ltp',
        label: 'LTP',
        align: 'right' as const,
        sortable: true,
        format: (_: any, row: Instrument) => (
            <Box sx={{ fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>
                <TickColoredPrice marketData={prices[row.id]} />
            </Box>
        )
    },
    {
        id: 'change',
        label: 'Change',
        align: 'right' as const,
        sortable: true,
        format: (_: any, row: Instrument) => {
            const md = prices[row.id];
            if (!md) return '--';
            const isPos = md.change >= 0;
            return (
                <Typography
                    variant="body2"
                    fontWeight={700}
                    color={isPos ? 'success.main' : 'error.main'}
                    sx={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                    {isPos ? '+' : ''}{md.change.toFixed(2)}
                </Typography>
            );
        }
    },
    {
        id: 'changePct',
        label: 'Change %',
        align: 'right' as const,
        sortable: true,
        format: (_: any, row: Instrument) => {
            const md = prices[row.id];
            if (!md) return '--';
            const isPos = md.changePct >= 0;
            return (
                <Chip
                    label={`${isPos ? '+' : ''}${md.changePct.toFixed(2)}%`}
                    size="small"
                    sx={{
                        fontWeight: 700,
                        bgcolor: isPos ? 'success.light' : 'error.light',
                        color: isPos ? 'success.dark' : 'error.dark',
                        borderRadius: '6px'
                    }}
                />
            );
        }
    },
    {
        id: 'exchange',
        label: 'Exch',
        format: (value: string) => <Chip label={value} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem', borderRadius: '4px' }} />
    },
    {
        id: 'watchlist',
        label: '',
        align: 'center' as const,
        format: (_: any, row: Instrument) => {
            const isStarred = watchlists.some(w => w.instrumentIds.includes(row.id));
            return (
                <IconButton
                    size="small"
                    onClick={(e) => onWatchlistToggle(e, row)}
                    sx={{ color: isStarred ? 'warning.main' : 'action.disabled' }}
                >
                    {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                </IconButton>
            );
        }
    }
];
