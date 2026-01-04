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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    History as OrdersIcon,
    FilterList as FilterIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { OrderList } from '@/features/trading/components/OrderList';
import { orderService, OrderResponse, OrderFilters } from '@/features/trading/services/orderService';

export function OrdersPage(): JSX.Element {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('');

    const filters: OrderFilters = {
        limit: 10,
        status: statusFilter || undefined,
    };

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const data = await orderService.getOrders({ ...filters, page });
            setOrders(data.orders || []);
            setTotalPages(data.pagination.totalPages);
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

    const handleClearFilters = () => {
        setStatusFilter('');
        setPage(1);
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

                {/* Filters */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FilterIcon color="action" />
                        <Typography variant="subtitle2" fontWeight={600} sx={{ minWidth: 60 }}>
                            Filters:
                        </Typography>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={statusFilter}
                                label="Status"
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="NEW">Pending</MenuItem>
                                <MenuItem value="FILLED">Filled</MenuItem>
                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                <MenuItem value="REJECTED">Rejected</MenuItem>
                            </Select>
                        </FormControl>

                        {statusFilter && (
                            <Button
                                size="small"
                                startIcon={<ClearIcon />}
                                onClick={handleClearFilters}
                                sx={{ textTransform: 'none', fontWeight: 600 }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Stack>
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
