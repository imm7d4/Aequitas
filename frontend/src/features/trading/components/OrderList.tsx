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
} from '@mui/material';
import {
    Cancel as CancelIcon,
    AccessTime as PendingIcon,
    CheckCircle as SuccessIcon,
    Error as ErrorIcon,
    Warning as WarningIcon,
} from '@mui/icons-material';
import { OrderResponse } from '../services/orderService';
import { useState } from 'react';
import { EditOrderDialog } from './EditOrderDialog';

interface OrderListProps {
    orders: OrderResponse[];
    onCancel: (id: string) => void;
    onModify: (id: string, quantity: number, price?: number) => void;
    isLoading?: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({ orders = [], onCancel, onModify, isLoading }) => {
    const theme = useTheme();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

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
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 700 }}>Time</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Instrument</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Side</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Qty</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            sx={{
                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.01) },
                                transition: 'background-color 0.2s',
                            }}
                        >
                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                                {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                {order.orderId.split('-')[1].slice(-8)}
                            </TableCell>
                            <TableCell>
                                <Typography variant="body2" fontWeight={700}>
                                    {order.symbol}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase' }}>
                                    {order.orderType}
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Box
                                    sx={{
                                        color: order.side === 'BUY' ? 'success.main' : 'error.main',
                                        fontWeight: 800,
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {order.side}
                                </Box>
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                {order.quantity}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>
                                {order.price ? `₹${order.price.toLocaleString()}` : 'MARKET'}
                            </TableCell>
                            <TableCell align="center">
                                {getStatusChip(order.status)}
                            </TableCell>
                            <TableCell align="right">
                                {order.status === 'NEW' && (
                                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                        <Button
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                            onClick={() => handleOpenEditDialog(order)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                height: 32,
                                                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            onClick={() => handleOpenCancelDialog(order.id)}
                                            sx={{
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                height: 32,
                                                '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) },
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

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
        </TableContainer >
    );
};
