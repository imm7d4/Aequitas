import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
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
    Collapse,
    IconButton,
    Grid,
    TablePagination,
} from '@mui/material';
import {
    Cancel as CancelIcon,
    AccessTime as PendingIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
    KeyboardArrowDown as ExpandMoreIcon,
    KeyboardArrowUp as ExpandLessIcon,
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
import { useState, useEffect } from 'react';

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
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [orderTrades, setOrderTrades] = useState<Record<string, Trade[]>>({});
    const [tradesLoading, setTradesLoading] = useState<Record<string, boolean>>({});

    // Fetch trades for expanded FILLED orders
    useEffect(() => {
        const fetchNewTrades = async () => {
            const filledExpandedIds = orders
                .filter(o => o.status === 'FILLED' && expandedRows.has(o.id) && !orderTrades[o.id] && !tradesLoading[o.id])
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
    }, [expandedRows, orders, orderTrades, tradesLoading]);

    // Only fetch market data for expanded PENDING orders
    const expandedPendingOrders = orders.filter(order =>
        expandedRows.has(order.id)
    );
    const instrumentIds = [...new Set(expandedPendingOrders.map(order => order.instrumentId))];
    const { prices } = useMarketData(instrumentIds);

    const toggleRow = (orderId: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

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
            onModify(selectedOrder.id, quantity, price);
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

    return (
        <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <Table
                    sx={{
                        minWidth: 650,
                        '& .MuiTableCell-root': {
                            py: 0.75,
                            px: 2,
                            fontSize: '0.8125rem',
                            fontFamily: 'Inter, Roboto, sans-serif',
                        },
                        '& .MuiTableCell-head': {
                            fontWeight: 600,
                            backgroundColor: 'background.paper',
                            color: 'text.secondary',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            fontSize: '0.75rem',
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                        },
                        '& .MuiTableRow-root': {
                            transition: 'background-color 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }
                    }}
                    stickyHeader
                    size="small"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: 50 }} />
                            <TableCell>Time</TableCell>
                            <TableCell>ID</TableCell>
                            <TableCell>Instrument</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Intent</TableCell>
                            <TableCell align="right">Qty</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right">Stop Price</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => {
                            const isExpanded = expandedRows.has(order.id);
                            // Try both instrumentId and symbol for price lookup
                            const currentPrice = prices[order.instrumentId] || prices[order.symbol];

                            // Debug logging
                            if (isExpanded) {
                                console.log('Expanded order:', {
                                    id: order.id,
                                    status: order.status,
                                    statusUpper: order.status.toUpperCase(),
                                    isPending: order.status.toUpperCase() === 'PENDING',
                                    symbol: order.symbol,
                                    instrumentId: order.instrumentId,
                                    prices: prices,
                                    currentPrice: currentPrice
                                });
                            }

                            return (
                                <>
                                    <TableRow
                                        key={order.id}
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => toggleRow(order.id)}
                                    >
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                sx={{ color: 'text.secondary', padding: 0.5 }}
                                            >
                                                {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                                            {formatDate(order.createdAt)}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace', color: 'text.primary' }}>
                                            {order.orderId.split('-')[1].slice(-8)}
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                component={Link}
                                                to={`/instruments/${order.instrumentId}`}
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
                                                {order.symbol}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <OrderTypeBadge orderType={order.orderType as any} />
                                        </TableCell>
                                        <TableCell>
                                            <IntentBadge intent={order.intent} side={order.side} />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                            {order.quantity}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                            {order.price ? `₹${order.price.toLocaleString()}` : 'MARKET'}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                                            {order.stopPrice || order.currentStopPrice ? (
                                                <Box>
                                                    <Typography variant="body2" fontWeight={600} fontFamily="monospace" color="warning.main" fontSize="inherit">
                                                        ₹{(order.currentStopPrice || order.stopPrice)!.toLocaleString()}
                                                    </Typography>
                                                    {isExpanded && order.orderType === 'TRAILING_STOP' && currentPrice && (
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7em' }}>
                                                            {order.side === 'BUY'
                                                                ? `+${(((order.currentStopPrice || order.stopPrice)! - currentPrice.lastPrice) / currentPrice.lastPrice * 100).toFixed(2)}%`
                                                                : `-${((currentPrice.lastPrice - (order.currentStopPrice || order.stopPrice)!) / currentPrice.lastPrice * 100).toFixed(2)}%`
                                                            }
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled" fontSize="inherit">—</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            {getStatusChip(order.status)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {(order.status === 'NEW' || order.status === 'PENDING') && (
                                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                                                    {order.status === 'NEW' && (
                                                        <Button
                                                            size="small"
                                                            color="primary"
                                                            variant="outlined"
                                                            onClick={() => handleOpenEditDialog(order)}
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
                                                        onClick={() => handleOpenCancelDialog(order.id)}
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
                                            )}
                                        </TableCell>
                                    </TableRow>

                                    {/* Expandable Row */}
                                    <TableRow sx={{ '&:hover': { backgroundColor: 'transparent !important' } }}>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
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
                                                                            ₹{currentPrice.lastPrice.toLocaleString()}
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
                                                                    <Typography variant="body2" fontWeight={600} fontFamily="monospace">{order.orderId}</Typography>
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
                                                                            <Typography variant="body2" fontWeight={700} color="success.main">₹{order.avgFillPrice?.toLocaleString()}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={3}>
                                                                            <Typography variant="caption" color="text.secondary">Filled Quantity</Typography>
                                                                            <Typography variant="body2" fontWeight={700}>{order.filledQuantity} / {order.quantity}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} sm={3}>
                                                                            <Typography variant="caption" color="text.secondary">Execution Value</Typography>
                                                                            <Typography variant="body2" fontWeight={700}>₹{((order.avgFillPrice || 0) * (order.filledQuantity || 0)).toLocaleString()}</Typography>
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
                                                                                    <Typography variant="caption" fontWeight={600}>₹{trade.price.toLocaleString()} x {trade.quantity}</Typography>
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
                                                                                <Typography variant="body2" fontWeight={700}>₹{order.stopPrice.toLocaleString()}</Typography>
                                                                            </Grid>
                                                                        )}
                                                                        {order.limitPrice && (
                                                                            <Grid item xs={6} sm={3}>
                                                                                <Typography variant="caption" color="text.secondary">Limit Price</Typography>
                                                                                <Typography variant="body2" fontWeight={700}>₹{order.limitPrice.toLocaleString()}</Typography>
                                                                            </Grid>
                                                                        )}
                                                                        {order.currentStopPrice && (
                                                                            <Grid item xs={6} sm={3}>
                                                                                <Typography variant="caption" color="text.secondary">Current Stop Price</Typography>
                                                                                <Typography variant="body2" fontWeight={700} color="warning.main">₹{order.currentStopPrice.toLocaleString()}</Typography>
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
                                                                                <Typography variant="body2" fontWeight={700}>₹{order.triggerPrice.toLocaleString()}</Typography>
                                                                            </Grid>
                                                                        )}
                                                                    </Grid>
                                                                </Paper>
                                                            </Grid>
                                                        )}
                                                    </Grid>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                '& .MuiTablePagination-root': {
                    minHeight: '32px'
                },
                '& .MuiTablePagination-toolbar': {
                    minHeight: '32px',
                    paddingTop: 0.5,
                    paddingBottom: 0.5,
                    paddingLeft: 1,
                    paddingRight: 1
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
        </Paper >
    );
};
