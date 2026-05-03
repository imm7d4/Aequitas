import React from 'react';
import { Box, Typography, Tooltip, Chip, Stack, Grid, Divider, alpha } from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

export const getTransactionColumns = (trades: any, theme: any) => [
    { id: 'createdAt', label: 'Date', format: (v: string) => formatDate(v) },
    { id: 'type', label: 'Type', format: (v: string) => <Typography variant="body2" fontWeight={500}>{v}</Typography> },
    {
        id: 'reference',
        label: 'Reference',
        format: (value: string) => {
            if (value?.startsWith('TRADE_')) {
                const tradeId = value.replace('TRADE_', '');
                const trade = trades[tradeId];
                return (
                    <Tooltip
                        title={
                            <Box sx={{ p: 1, minWidth: 240 }}>
                                {trade ? (
                                    <Box>
                                        <Grid container spacing={1.5} sx={{ mb: 1 }}>
                                            <Grid item xs={6}><Typography variant="body2" fontWeight={800}>{trade.symbol}</Typography></Grid>
                                            <Grid item xs={6}><Typography variant="body2" fontWeight={800} color={trade.side === 'BUY' ? 'success.main' : 'error.main'}>{trade.side}</Typography></Grid>
                                        </Grid>
                                        <Stack spacing={0.3} sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 0.5 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="caption">Net</Typography><Typography variant="caption" fontWeight={800}>{formatCurrency(trade.netValue)}</Typography></Box>
                                        </Stack>
                                    </Box>
                                ) : 'Loading...'}
                            </Box>
                        }
                        arrow
                    >
                        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, cursor: 'help', bgcolor: alpha(theme.palette.primary.main, 0.05), px: 1, py: 0.5, borderRadius: 1 }}>
                            <Typography variant="caption" color="primary.main" fontWeight={700}>{value}</Typography>
                            <InfoIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                        </Box>
                    </Tooltip>
                );
            }
            return <Typography variant="caption" color="text.secondary">{value}</Typography>;
        }
    },
    {
        id: 'amount',
        label: 'Amount',
        align: 'right' as const,
        format: (val: number, tx: any) => {
            const isNegative = tx.amount < 0;
            return <Typography variant="body2" fontWeight={600} color={isNegative ? 'text.primary' : 'success.main'}>{isNegative ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}</Typography>;
        }
    },
    {
        id: 'status',
        label: 'Status',
        align: 'center' as const,
        format: (v: string) => <Chip label={v} size="small" color={v === 'COMPLETED' ? 'success' : 'default'} variant="outlined" />
    }
];
