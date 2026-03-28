import React, { useState, useEffect } from 'react';
import {
    Typography,
    Chip,
    Button,
    Box,
    alpha,
    useTheme,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Grid,
    TablePagination,
    Paper,
} from '@mui/material';
import {
    Cancel as CancelIcon,
    AccessTime as PendingIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    TrendingUp,
    TrendingDown,
} from '@mui/icons-material';
import { OrderResponse } from '../services/orderService';
import { Link } from 'react-router-dom';
import { EditOrderDialog } from './EditOrderDialog';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { OrderTypeBadge } from './OrderTypeBadge';
import { IntentBadge } from './IntentBadge';
import { Trade, tradeService } from '../services/tradeService';
import { CustomGrid } from '../../../shared/components/CustomGrid';

interface OrderListProps {
    orders: OrderResponse[];
    onCancel: (id: string) => void;
    onModify: (id: string, quantity: number, price?: number) => void;
    isLoading?: boolean;
    count?: number;
    page?: number;
    rowsPerPage?: number;
    onPageChange?: (event: unknown, newPage: number) => void;
    onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
    orders = [],
    onCancel,
    onModify,
    isLoading,
    count = 0,
    page = 0,
    rowsPerPage = 10,
    onPageChange,
    onRowsPerPageChange
}) => {
    const theme = useTheme();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [orderTrades, setOrderTrades] = useState<Record<string, Trade[]>>({});
    const [tradesLoading, setTradesLoading] = useState<Record<string, boolean>>({});

    // Fetch trades for expanded FILLED orders
    useEffect(() => {
        const fetchNewTrades = async () => {
            const filledExpandedIds = orders
                .filter(o => o.status === 'FILLED' && !orderTrades[o.id] && !tradesLoading[o.id])
                .map(o => o.id);

            for (const id of filledExpandedIds) {
                setTradesLoading(prev => ({ ...prev, [id]: true }));
                try {
                    const trades = await tradeService.getTradesByOrder(id);
                    setOrderTrades(prev => ({ ...prev, [id]: trades }));
                } catch (error) {
                    console.error('Failed to fetch trades for order:', id, error);
                } finally {
                    setTradesLoading(prev => ({ ...prev, [id]: false }));
                }
            }
        };

        fetchNewTrades();
    }, [orders, orderTrades, tradesLoading]);

    const instrumentIds = [...new Set(orders.map(order => order.instrumentId))];
    const { prices } = useMarketData(instrumentIds);

    const handleOpenCancelDialog = (id: string) => {
        setSelectedOrderId(id);
        setCancelDialogOpen(true);
    };

    const handleCloseCancelDialog = () => {
        setCancelDialogOpen(false);
        setSelectedOrderId(null);
    };

    const handleConfirmCancel = () => {
        if (selectedOrderId) {
            onCancel(selectedOrderId);
        }
        handleCloseCancelDialog();
    };

    const handleOpenEditDialog = (order: OrderResponse) => {
        setSelectedOrder(order);
        setEditDialogOpen(true);
    };

    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
        setSelectedOrder(null);
    };

    const handleConfirmEdit = (quantity: number, price?: number) => {
        if (selectedOrder) {
            onModify(selectedOrder.orderId, quantity, price);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(date);
    };

    const getStatusChip = (status: string) => {
        switch (status.toUpperCase()) {
            case 'NEW':
            case 'PENDING':
                return (
                    <Chip
                        icon={<PendingIcon sx={{ fontSize: '16px !important' }} />}
                        label="Pending"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: 'warning.main',
                            fontWeight: 700,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.warning.main, 0.2),
                        }}
                    />
                );
            case 'FILLED':
                return (
                    <Chip
                        icon={<SuccessIcon sx={{ fontSize: '16px !important' }} />}
                        label="Executed"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            color: 'success.main',
                            fontWeight: 700,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.success.main, 0.2),
                        }}
                    />
                );
            case 'CANCELLED':
                return (
                    <Chip
                        icon={<CancelIcon sx={{ fontSize: '16px !important' }} />}
                        label="Cancelled"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.text.secondary, 0.1),
                            color: 'text.secondary',
                            fontWeight: 700,
                        }}
                    />
                );
            case 'REJECTED':
                return (
                    <Chip
                        icon={<ErrorIcon sx={{ fontSize: '16px !important' }} />}
                        label="Rejected"
                        size="small"
                        sx={{
                            bgcolor: alpha(theme.palette.error.main, 0.1),
                            color: 'error.main',
                            fontWeight: 700,
                            border: '1px solid',
                            borderColor: alpha(theme.palette.error.main, 0.2),
                        }}
                    />
                );
            default:
                return <Chip label={status} size="small" />;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    No orders found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Your trading activity will appear here once you place an order.
                </Typography>
            </Paper>
        );
    }

    const columns: any[] = [
        {
            id: 'createdAt',
            label: 'Time',
            format: (value: string) => (
                <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontSize: 'inherit' }}>
                    {formatDate(value)}
                </Typography>
            )
        },
        {
            id: 'orderId',
            label: 'ID',
            format: (value: string) => (
                <Typography sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'text.primary', fontSize: '0.8125rem' }}>
                    {value.split('-')[1].slice(-8)}
                </Typography>
            )
        },
        {
            id: 'symbol',
            label: 'Instrument',
            format: (value: string, row: OrderResponse) => (
                <Typography
                    variant="body2"
                    fontWeight={600}
                    component={Link}
                    to={`/instruments/${row.instrumentId}`}
                    sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                        fontSize: '0.8125rem',
                        '&:hover': {
                            textDecoration: 'underline',
                        }
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {value}
                </Typography>
            )
        },
        {
            id: 'orderType',
            label: 'Type',
            format: (value: string) => <OrderTypeBadge orderType={value as any} />
        },
        {
            id: 'intent',
            label: 'Intent',
            format: (value: string, row: OrderResponse) => <IntentBadge intent={value} side={row.side} />
        },
        {
            id: 'quantity',
            label: 'Qty',
            align: 'right',
            format: (value: number) => (
                <Typography sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 'inherit' }}>
                    {value}
                </Typography>
            )
        },
        {
            id: 'price',
            label: 'Price',
            align: 'right',
            format: (value: number) => (
                <Typography sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 'inherit' }}>
                    {value ? `₹${value.toLocaleString('en-IN')}` : 'MARKET'}
                </Typography>
            )
        },
        {
            id: 'stopPrice',
            label: 'Stop Price',
            align: 'right',
            format: (_: any, row: OrderResponse) => {
                const stopPrice = row.currentStopPrice || row.stopPrice;
                const currentPrice = prices[row.instrumentId] || prices[row.symbol];
                if (!stopPrice) return <Typography variant="body2" color="text.disabled" fontSize="inherit">—</Typography>;
                
                return (
                    <Box>
                        <Typography variant="body2" fontWeight={600} fontFamily="monospace" color="warning.main" fontSize="inherit">
                            ₹{stopPrice.toLocaleString('en-IN')}
                        </Typography>
                        {row.orderType === 'TRAILING_STOP' && currentPrice && (
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7em' }}>
                                {row.side === 'BUY'
                                    ? `+${((stopPrice - currentPrice.lastPrice) / currentPrice.lastPrice * 100).toFixed(2)}%`
                                    : `-${((currentPrice.lastPrice - stopPrice) / currentPrice.lastPrice * 100).toFixed(2)}%`
                                }
                            </Typography>
                        )}
                    </Box>
                );
            }
        },
        {
            id: 'status',
            label: 'Status',
            align: 'center',
            format: (value: string) => getStatusChip(value)
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            format: (_: any, row: OrderResponse) => (
                (row.status === 'NEW' || row.status === 'PENDING') && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        {row.status === 'NEW' && (
                            <Button
                                size="small"
                                color="primary"
                                variant="outlined"
                                onClick={() => handleOpenEditDialog(row)}
                                sx={{
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    height: 28,
                                    fontSize: '0.75rem',
                                    minWidth: 'auto',
                                    px: 1.5
                                }}
                            >
                                Edit
                            </Button>
                        )}
                        <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => handleOpenCancelDialog(row.id)}
                            sx={{
                                borderRadius: 1.5,
                                textTransform: 'none',
                                fontWeight: 600,
                                height: 28,
                                fontSize: '0.75rem',
                                minWidth: 'auto',
                                px: 1.5
                            }}
                        >
                            Cancel
                        </Button>
                    </Box>
                )
            )
        }
    ];

    const renderExpansion = (order: OrderResponse) => {
        const currentPrice = prices[order.instrumentId] || prices[order.symbol];
        return (
            <Box sx={{ py: 3, px: 2, bgcolor: alpha(theme.palette.primary.main, 0.01) }}>
                <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                    Order Details
                </Typography>

                <Grid container spacing={3}>
                    {/* Live Price Section */}
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
                                        display: 'flex',
                                        alignItems: 'center',
                                        color: currentPrice.change >= 0 ? 'success.main' : 'error.main',
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}>
                                        {currentPrice.change >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                                        {currentPrice.changePct.toFixed(2)}%
                                    </Box>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary">Loading...</Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* Order Info */}
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

                    {/* Execution Details Section */}
                    {order.status === 'FILLED' && (
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'success.main', borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
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

                                {orderTrades[order.id] && orderTrades[order.id].length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="caption" fontWeight={700} sx={{ display: 'block', mb: 1, color: 'text.secondary', textTransform: 'uppercase' }}>
                                            Individual Trades
                                        </Typography>
                                        {orderTrades[order.id].map((trade) => (
                                            <Box key={trade.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5, borderBottom: '1px dashed', borderColor: alpha(theme.palette.divider, 0.5), '&:last-child': { borderBottom: 0 } }}>
                                                <Typography variant="caption" fontFamily="monospace">{trade.tradeId}</Typography>
                                                <Typography variant="caption" fontWeight={600}>₹{trade.price.toLocaleString('en-IN')} x {trade.quantity}</Typography>
                                                <Typography variant="caption" color="text.secondary">{trade.executedAt ? formatDate(trade.executedAt) : ''}</Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                                {tradesLoading[order.id] && (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                                        <CircularProgress size={16} />
                                    </Box>
                                )}
                            </Paper>
                        </Grid>
                    )}

                    {/* Stop Order Details */}
                    {(order.orderType === 'STOP' || order.orderType === 'STOP_LIMIT' || order.orderType === 'TRAILING_STOP') && (
                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'warning.main', borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
                                <Typography variant="subtitle2" fontWeight={700} gutterBottom>
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
                                    {order.triggerPrice && (
                                        <Grid item xs={6} sm={3}>
                                            <Typography variant="caption" color="text.secondary">Trigger Price</Typography>
                                            <Typography variant="body2" fontWeight={700}>₹{order.triggerPrice.toLocaleString('en-IN')}</Typography>
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

    const gridData = orders.map(o => ({ ...o, id: o.orderId }));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid<any>
                    columns={columns}
                    data={gridData}
                    renderExpansion={renderExpansion}
                    isLoading={isLoading}
                />
            </Box>

            <Box sx={{
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-root': {
                    minHeight: '40px'
                }
            }}>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div"
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onPageChange || (() => { })}
                    onRowsPerPageChange={onRowsPerPageChange}
                />
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={cancelDialogOpen}
                onClose={handleCloseCancelDialog}
                PaperProps={{
                    sx: { borderRadius: 3, p: 1, minWidth: 320 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
                    <WarningIcon color="warning" />
                    Confirm Cancellation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ fontWeight: 500 }}>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        onClick={handleCloseCancelDialog}
                        variant="text"
                        color="inherit"
                        sx={{ fontWeight: 600, borderRadius: 2 }}
                    >
                        No, Keep Order
                    </Button>
                    <Button
                        onClick={handleConfirmCancel}
                        variant="contained"
                        color="error"
                        sx={{ fontWeight: 700, borderRadius: 2, px: 3, boxShadow: 'none' }}
                    >
                        Yes, Cancel Order
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Order Dialog */}
            <EditOrderDialog
                open={editDialogOpen}
                order={selectedOrder}
                onClose={handleCloseEditDialog}
                onConfirm={handleConfirmEdit}
            />
        </Box>
    );
};
