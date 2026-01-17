import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Paper,
    IconButton,
    Tooltip,
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
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0); // TablePagination is 0-indexed
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState<string>('');

    // For "pending" and "executed" tabs, we need client-side filtering
    const filters: OrderFilters = {
        limit: rowsPerPage,
        status: (statusFilter === 'pending' || statusFilter === 'executed') ? undefined : (statusFilter || undefined),
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            // Backend expects 1-indexed page
            const data = await orderService.getOrders({ ...filters, page: page + 1 });
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
            // Update total count for pagination
            // If using client-side filtering, we might need a different approach for total count
            // For now assuming backend returns correct count for the query
            setTotalCount(data.pagination.total);
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

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchOrders();
    }, [page, rowsPerPage, statusFilter]);

    return (

        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', pb: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexShrink: 0 }}>
                <Box sx={{ mb: 2 }}>
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
                                <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.01em' }}>
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
                                setPage(0);
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
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <OrderList
                    orders={orders}
                    onCancel={handleCancel}
                    onModify={handleModify}
                    isLoading={isLoading}
                    count={totalCount}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Box>
        </Container>
    );


}
