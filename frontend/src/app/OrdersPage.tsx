import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    IconButton,
    Tooltip,
    Pagination,
    Stack,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    History as OrdersIcon,
} from '@mui/icons-material';
import { OrderList } from '@/features/trading/components/OrderList';
import { orderService, OrderResponse, OrderFilters } from '@/features/trading/services/orderService';

export function OrdersPage(): JSX.Element {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');

    // For "pending" and "executed" tabs, we need client-side filtering
    const filters: OrderFilters = {
        limit: statusFilter === 'pending' || statusFilter === 'executed' ? 100 : 10,
        status: (statusFilter === 'pending' || statusFilter === 'executed') ? undefined : (statusFilter || undefined),
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await orderService.getOrders({ ...filters, page });
            let filteredOrders = data.orders || [];

            // Client-side filter for pending tab (NEW + PENDING)
            if (statusFilter === 'pending') {
                filteredOrders = filteredOrders.filter(order =>
                    order.status === 'NEW' || order.status === 'PENDING'
                );
            }

            // Client-side filter for executed tab (TRIGGERED + FILLED)
            if (statusFilter === 'executed') {
                filteredOrders = filteredOrders.filter(order =>
                    order.status === 'TRIGGERED' || order.status === 'FILLED'
                );
            }

            setOrders(filteredOrders);
            // For pending/executed tabs with client-side filtering, hide pagination
            setTotalPages((statusFilter === 'pending' || statusFilter === 'executed') ? 1 : data.pagination.totalPages);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await orderService.cancelOrder(id);
            fetchOrders();
        } catch (error) {
            console.error('Failed to cancel order:', error);
        }
    };

    const handleModify = async (id: string, quantity: number, price?: number) => {
        try {
            await orderService.modifyOrder(id, quantity, price);
            fetchOrders();
        } catch (error) {
            console.error('Failed to modify order:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, statusFilter]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                display: 'flex',
                            }}
                        >
                            <OrdersIcon />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em' }}>
                                Order Book
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                View and manage your trade executions
                            </Typography>
                        </Box>
                    </Box>
                    <Tooltip title="Refresh Orders">
                        <IconButton
                            onClick={fetchOrders}
                            disabled={isLoading}
                            sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                '&:hover': { bgcolor: 'action.hover' },
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Status Tabs */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                    }}
                >
                    <Tabs
                        value={statusFilter || 'all'}
                        onChange={(_, value) => {
                            setStatusFilter(value === 'all' ? '' : value);
                            setPage(1);
                        }}
                        sx={{
                            borderBottom: '1px solid',
                            borderColor: 'divider',
                            '& .MuiTab-root': {
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '0.9375rem',
                                minHeight: 56,
                            },
                        }}
                    >
                        <Tab label="All Orders" value="all" />
                        <Tab label="Pending" value="pending" />
                        <Tab label="Executed" value="executed" />
                        <Tab label="Cancelled" value="CANCELLED" />
                        <Tab label="Rejected" value="REJECTED" />
                    </Tabs>
                </Paper>
            </Box>

            <Paper elevation={0} sx={{ p: 0, borderRadius: 3 }}>
                <OrderList
                    orders={orders}
                    onCancel={handleCancel}
                    onModify={handleModify}
                    isLoading={isLoading}
                />
            </Paper>

            {totalPages > 1 && (
                <Stack direction="row" justifyContent="center" sx={{ mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(_, value) => setPage(value)}
                        color="primary"
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontWeight: 600,
                                borderRadius: 2,
                            },
                        }}
                    />
                </Stack>
            )}
        </Container>
    );
}
