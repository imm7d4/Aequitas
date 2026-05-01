import React from 'react';
import { Box, Typography, Grid, Paper, alpha, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { OrderResponse } from '../services/orderService';
import { Trade } from '../services/tradeService';
import { Loader } from '../../../shared/components/Loader';

interface OrderDetailsExpansionProps {
    order: OrderResponse;
    currentPrice?: { lastPrice: number; change: number; changePct: number };
    orderTrades?: Trade[];
    tradesLoading?: boolean;
    formatDate: (date: string) => string;
}

export const OrderDetailsExpansion: React.FC<OrderDetailsExpansionProps> = ({
    order, currentPrice, orderTrades, tradesLoading, formatDate
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ py: 3, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                Order Details
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            Live Market Price
                        </Typography>
                        {currentPrice ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6" fontWeight={700}>
                                    ₹{currentPrice.lastPrice.toLocaleString('en-IN')}
                                </Typography>
                                <Box sx={{
                                    display: 'flex', alignItems: 'center',
                                    color: currentPrice.change >= 0 ? 'success.main' : 'error.main',
                                    fontSize: '0.875rem', fontWeight: 600
                                }}>
                                    {currentPrice.change >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                                    {currentPrice.changePct.toFixed(2)}%
                                </Box>
                            </Box>
                        ) : (
                            <Loader size="small" />
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="caption" color="text.secondary">Order ID</Typography>
                            <Typography variant="body2" fontWeight={600} fontFamily="monospace" sx={{ fontSize: '0.75rem' }}>{order.orderId}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="caption" color="text.secondary">Created At</Typography>
                            <Typography variant="body2" fontWeight={600}>{formatDate(order.createdAt)}</Typography>
                        </Grid>
                        <Grid item xs={6} sm={4}>
                            <Typography variant="caption" color="text.secondary">Validated At</Typography>
                            <Typography variant="body2" fontWeight={600}>{formatDate(order.validatedAt)}</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                {order.status === 'FILLED' && (
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
                                Execution Summary
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">Avg. Fill Price</Typography>
                                    <Typography variant="body2" fontWeight={700} color="success.main">₹{order.avgFillPrice?.toLocaleString('en-IN')}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">Filled Quantity</Typography>
                                    <Typography variant="body2" fontWeight={700}>{order.filledQuantity} / {order.quantity}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">Execution Value</Typography>
                                    <Typography variant="body2" fontWeight={700}>₹{((order.avgFillPrice || 0) * (order.filledQuantity || 0)).toLocaleString('en-IN')}</Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="caption" color="text.secondary">Filled At</Typography>
                                    <Typography variant="body2" fontWeight={700}>{order.filledAt ? formatDate(order.filledAt) : 'N/A'}</Typography>
                                </Grid>
                            </Grid>

                            {orderTrades && orderTrades.length > 0 && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1, color: 'text.secondary', textTransform: 'uppercase' }}>
                                        Individual Trades
                                    </Typography>
                                    {orderTrades.map((trade) => (
                                        <Box key={trade.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px dashed', borderColor: alpha(theme.palette.divider, 0.5), '&:last-child': { borderBottom: 0 } }}>
                                            <Typography variant="caption" fontFamily="monospace">{trade.tradeId}</Typography>
                                            <Typography variant="caption" fontWeight={600}>₹{trade.price.toLocaleString('en-IN')} x {trade.quantity}</Typography>
                                            <Typography variant="caption" color="text.secondary">{trade.executedAt ? formatDate(trade.executedAt) : ''}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                            {tradesLoading && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                    <Loader size="small" />
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                )}

                {(order.orderType === 'STOP' || order.orderType === 'STOP_LIMIT' || order.orderType === 'TRAILING_STOP') && (
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                            <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 1.5 }}>
                                Stop Order Configuration
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                {order.stopPrice && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Stop Price</Typography>
                                        <Typography variant="body2" fontWeight={700}>₹{order.stopPrice.toLocaleString('en-IN')}</Typography>
                                    </Grid>
                                )}
                                {order.limitPrice && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Limit Price</Typography>
                                        <Typography variant="body2" fontWeight={700}>₹{order.limitPrice.toLocaleString('en-IN')}</Typography>
                                    </Grid>
                                )}
                                {order.currentStopPrice && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Current Stop Price</Typography>
                                        <Typography variant="body2" fontWeight={700} color="warning.main">₹{order.currentStopPrice.toLocaleString('en-IN')}</Typography>
                                    </Grid>
                                )}
                                {order.trailAmount && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Trail Amount</Typography>
                                        <Typography variant="body2" fontWeight={700}>
                                            {order.trailType === 'PERCENTAGE' ? `${order.trailAmount}%` : `₹${order.trailAmount}`}
                                        </Typography>
                                    </Grid>
                                )}
                                {order.triggeredAt && (
                                    <Grid item xs={6} sm={3}>
                                        <Typography variant="caption" color="text.secondary">Triggered At</Typography>
                                        <Typography variant="body2" fontWeight={700}>{formatDate(order.triggeredAt)}</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};
