import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    Typography, Box, IconButton, alpha, useTheme
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { CustomGrid, Column, BaseRow } from '../../../shared/components/CustomGrid';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

interface Transaction extends BaseRow {
    type: string;
    amount: number;
    status: string;
    reference: string;
    createdAt: string;
}

interface WalletUser {
    id: string | number;
    fullName: string;
    email: string;
}

interface UserTransactionHistoryModalProps {
    open: boolean;
    user: WalletUser | null;
    onClose: () => void;
}

export const UserTransactionHistoryModal: React.FC<UserTransactionHistoryModalProps> = ({ open, user, onClose }) => {
    const theme = useTheme();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (open && user) {
            fetchTransactions();
        }
    }, [open, user]);

    const fetchTransactions = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/wallet/history?userId=${user?.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            const mapped = (data.data || []).map((tx: any) => ({
                ...tx,
                id: tx.id || tx._id
            }));
            setTransactions(mapped);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    };

const columns: Column<Transaction>[] = [
    {
        id: 'type',
        label: 'Type',
        minWidth: 120,
        render: (row) => (
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>{row.type}</Typography>
        )
    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 120,
        align: 'right',
        render: (row) => (
            <Typography variant="body2" sx={{ fontWeight: 700, color: row.amount < 0 ? 'error.main' : 'success.main' }}>
                {row.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(row.amount))}
            </Typography>
        )
    },
    {
        id: 'status',
        label: 'Status',
        minWidth: 120,
        render: (row) => (
            <Box sx={{ 
                px: 1, py: 0.5, borderRadius: '4px', display: 'inline-block',
                bgcolor: row.status === 'COMPLETED' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.warning.main, 0.1),
                color: row.status === 'COMPLETED' ? 'success.main' : 'warning.main',
                fontSize: '11px', fontWeight: 800
            }}>
                {row.status}
            </Box>
        )
    },
    {
        id: 'reference',
        label: 'Reference',
        minWidth: 200,
    },
    {
        id: 'createdAt',
        label: 'Date',
        minWidth: 150,
        render: (row) => (
            <Typography variant="body2" color="text.secondary">
                {formatDate(row.createdAt)}
            </Typography>
        )
    }
];

    if (!user) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px', height: '80vh' } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <Box>
                    <Typography variant="h6" fontWeight={800}>Transaction History</Typography>
                    <Typography variant="caption" color="text.secondary">{user.fullName} ({user.email})</Typography>
                </Box>
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 2, pb: 2, pt: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Box sx={{ flex: 1, minHeight: 0 }}>
                    <CustomGrid
                        columns={columns}
                        data={transactions}
                        isLoading={loading}
                        maxHeight="100%"
                        stickyPagination
                        pagination={{
                            page,
                            rowsPerPage,
                            totalCount: transactions.length,
                            onPageChange: setPage,
                            onRowsPerPageChange: setRowsPerPage
                        }}
                    />
                </Box>
            </DialogContent>
        </Dialog>
    );
};
