import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, TextField, InputAdornment, IconButton
} from '@mui/material';
import { Search as SearchIcon, Edit as EditIcon, History as HistoryIcon } from '@mui/icons-material';
import { CustomGrid, Column, BaseRow } from '../../../shared/components/CustomGrid';
import { WalletDetailModal } from '../components/WalletDetailModal';
import { UserTransactionHistoryModal } from '../components/UserTransactionHistoryModal';

interface TradingAccount extends BaseRow {
    userId: string;
    fullName: string;
    email: string;
    balance: number;
    freeCash: number;
    blockedMargin: number;
    status: string;
}

export const WalletManagement: React.FC = () => {
    const [accounts, setAccounts] = useState<TradingAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<TradingAccount | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/wallets`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            const mapped = (data.data || []).map((acc: any) => ({
                ...acc,
                id: acc.id || acc._id
            }));
            setAccounts(mapped);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    const columns: Column<TradingAccount>[] = [
        {
            id: 'fullName',
            label: 'User Name',
            minWidth: 250,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.fullName || 'No Name Set'}</Typography>
            )
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 350,
        },
        {
            id: 'actions',
            label: 'Actions',
            align: 'right',
            minWidth: 120,
            render: (row) => (
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <IconButton 
                        size="small" 
                        color="primary" 
                        title="Edit Wallet"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccount(row);
                            setIsDetailOpen(true);
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                        size="small" 
                        title="Transaction History"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAccount(row);
                            setIsHistoryOpen(true);
                        }}
                    >
                        <HistoryIcon fontSize="small" />
                    </IconButton>
                </Box>
            )
        }
    ];

    const filteredAccounts = accounts.filter(acc => 
        (acc.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (acc.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            px: 3,
            pt: 2
        }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: 'text.primary', letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
                    Wallet Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <TextField 
                        size="small"
                        placeholder="Search wallets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '6px', bgcolor: '#fff', width: 220 }
                        }}
                    />
                </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid
                    columns={columns}
                    data={filteredAccounts}
                    isLoading={loading}
                    maxHeight="100%"
                    pagination={{
                        page,
                        rowsPerPage,
                        totalCount: filteredAccounts.length,
                        onPageChange: setPage,
                        onRowsPerPageChange: setRowsPerPage
                    }}
                />
            </Box>

            <WalletDetailModal 
                open={isDetailOpen}
                account={selectedAccount}
                onClose={() => setIsDetailOpen(false)}
            />

            <UserTransactionHistoryModal
                open={isHistoryOpen}
                user={selectedAccount ? { id: selectedAccount.userId, fullName: selectedAccount.fullName, email: selectedAccount.email } : null}
                onClose={() => setIsHistoryOpen(false)}
            />
        </Box>
    );
};
