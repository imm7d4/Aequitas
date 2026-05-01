import React, { useState } from 'react';
import { Typography, Button, Box, alpha, useTheme, TablePagination, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { OrderResponse } from '../services/orderService';
import { EditOrderDialog } from './EditOrderDialog';
import { useMarketData } from '@/features/market/hooks/useMarketData';
import { OrderTypeBadge } from './OrderTypeBadge';
import { IntentBadge } from './IntentBadge';
import { CustomGrid, Column } from '../../../shared/components/CustomGrid';
import { Loader } from '../../../shared/components/Loader';
import { OrderListStatusChip } from './OrderListStatusChip';
import { OrderDetailsExpansion } from './OrderDetailsExpansion';
import { CancelOrderDialog } from './CancelOrderDialog';
import { useOrderTrades } from '../hooks/useOrderTrades';

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
    orders = [], onCancel, onModify, isLoading, count = 0,
    page = 0, rowsPerPage = 10, onPageChange, onRowsPerPageChange
}) => {
    const theme = useTheme();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

    const { orderTrades, tradesLoading } = useOrderTrades(orders);
    const instrumentIds = [...new Set(orders.map(order => order.instrumentId))];
    const { prices } = useMarketData(instrumentIds);

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-IN', {
            month: 'short', day: '2-digit', hour: '2-digit',
            minute: '2-digit', second: '2-digit', hour12: false,
        }).format(new Date(dateString));
    };

    const columns: Column<OrderResponse>[] = [
        {
            id: 'createdAt', label: 'Time',
            render: (row) => <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'nowrap', fontSize: 'inherit' }}>{formatDate(row.createdAt)}</Typography>
        },
        {
            id: 'orderId', label: 'ID',
            render: (row) => <Typography sx={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.8125rem' }}>{row.orderId.split('-')[1].slice(-8)}</Typography>
        },
        {
            id: 'symbol', label: 'Instrument',
            render: (row) => (
                <Typography component={Link} to={`/instruments/${row.instrumentId}`} variant="body2" sx={{ fontWeight: 600, color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                    {row.symbol}
                </Typography>
            )
        },
        { id: 'orderType', label: 'Type', render: (row) => <OrderTypeBadge orderType={row.orderType as any} /> },
        { id: 'intent', label: 'Intent', render: (row) => <IntentBadge intent={row.intent} side={row.side} /> },
        { id: 'quantity', label: 'Qty', align: 'right', render: (row) => <Typography sx={{ fontWeight: 600 }}>{row.quantity}</Typography> },
        { id: 'price', label: 'Price', align: 'right', render: (row) => <Typography sx={{ fontWeight: 600 }}>{row.price ? `₹${row.price.toLocaleString('en-IN')}` : 'MARKET'}</Typography> },
        {
            id: 'status', label: 'Status', align: 'center',
            render: (row) => <OrderListStatusChip status={row.status} />
        },
        {
            id: 'actions', label: 'Actions', align: 'right',
            render: (row) => (
                (row.status === 'NEW' || row.status === 'PENDING') && (
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        <Button size="small" variant="outlined" color="primary" onClick={() => { setSelectedOrder(row); setEditDialogOpen(true); }}>Edit</Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => { setSelectedOrderId(row.id); setCancelDialogOpen(true); }}>Cancel</Button>
                    </Box>
                )
            )
        }
    ];

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><Loader message="Loading orders..." /></Box>;
    if (orders.length === 0) return <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider', bgcolor: 'transparent' }}><Typography variant="h6" color="text.secondary">No orders found</Typography></Paper>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid<OrderResponse>
                    columns={columns}
                    data={orders.map(o => ({ ...o, id: o.orderId }))}
                    renderExpansion={(row) => (
                        <OrderDetailsExpansion 
                            order={row}
                            currentPrice={prices[row.instrumentId] || prices[row.symbol]}
                            orderTrades={orderTrades[row.id]}
                            tradesLoading={tradesLoading[row.id]}
                            formatDate={formatDate}
                        />
                    )}
                />
            </Box>

            <Box sx={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, bgcolor: alpha(theme.palette.background.paper, 0.7), backdropFilter: 'blur(20px)', border: `1px solid ${theme.palette.divider}` }}>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    component="div" count={count} rowsPerPage={rowsPerPage} page={page}
                    onPageChange={onPageChange || (() => { })} onRowsPerPageChange={onRowsPerPageChange}
                />
            </Box>

            <CancelOrderDialog 
                open={cancelDialogOpen} 
                onClose={() => setCancelDialogOpen(false)} 
                onConfirm={() => { if (selectedOrderId) onCancel(selectedOrderId); setCancelDialogOpen(false); }}
            />

            <EditOrderDialog 
                open={editDialogOpen} order={selectedOrder} 
                onClose={() => setEditDialogOpen(false)} 
                onConfirm={(q, p) => { if (selectedOrder) onModify(selectedOrder.orderId, q, p); }}
            />
        </Box>
    );
};
