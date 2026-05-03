import React from 'react';
import { Box, Typography, Chip, alpha } from '@mui/material';
import { Timer as TimerIcon } from '@mui/icons-material';
import { Column } from '../../../shared/components/CustomGrid';
import { TradeResult } from '../services/analyticsService';

export const getTradeDiagnosticsColumns = (theme: any): Column<TradeResult>[] => [
    {
        id: 'symbol',
        label: 'INSTRUMENT',
        render: (row) => (
            <Typography variant="body2" fontWeight={700}>{row.symbol}</Typography>
        )
    },
    {
        id: 'side',
        label: 'SIDE',
        render: (row) => (
            <Chip
                label={row.side}
                size="small"
                variant="outlined"
                sx={{
                    height: 20,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: row.side === 'LONG' ? theme.palette.primary.main : theme.palette.secondary.main,
                    borderColor: alpha(row.side === 'LONG' ? theme.palette.primary.main : theme.palette.secondary.main, 0.4),
                    bgcolor: alpha(row.side === 'LONG' ? theme.palette.primary.main : theme.palette.secondary.main, 0.05)
                }}
            />
        )
    },
    {
        id: 'quantity',
        label: 'QTY',
        align: 'right',
        render: (row) => (
            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                {row.quantity}
            </Typography>
        )
    },
    {
        id: 'avgEntryPrice',
        label: 'AVG. ENTRY',
        align: 'right',
        render: (row) => (
            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                ₹{row.avgEntryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
        )
    },
    {
        id: 'avgExitPrice',
        label: 'AVG. EXIT',
        align: 'right',
        render: (row) => (
            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                ₹{row.avgExitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
        )
    },
    {
        id: 'grossPNL',
        label: 'GROSS P&L',
        align: 'right',
        render: (row) => (
            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace', color: row.grossPNL >= 0 ? 'success.main' : 'error.main' }}>
                {row.grossPNL >= 0 ? '+' : ''}₹{row.grossPNL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </Typography>
        )
    },
    {
        id: 'netPNL',
        label: 'NET P&L',
        align: 'right',
        render: (row) => {
            const isProfit = row.netPNL >= 0;
            const pnlColor = isProfit ? 'success.main' : 'error.main';
            return (
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: pnlColor }}>
                        {row.netPNL >= 0 ? '+' : ''}₹{row.netPNL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: -0.5, fontSize: '0.65rem', color: pnlColor }}>
                        ({row.netReturnPct.toFixed(2)}%)
                    </Typography>
                </Box>
            );
        }
    },
    {
        id: 'duration',
        label: 'DURATION',
        align: 'right',
        render: (row) => (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                <TimerIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{row.duration}</Typography>
            </Box>
        )
    }
];
