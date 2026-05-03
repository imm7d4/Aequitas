import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { AccountBalanceWallet as WalletIcon, AddCircle as AddIcon } from '@mui/icons-material';
import { formatCurrency } from '../../../shared/utils/formatters';

interface AccountBalanceProps {
    balance: number;
    currency: string;
    onAddFunds: () => void;
}

export const AccountBalance: React.FC<AccountBalanceProps> = ({ balance, currency, onAddFunds }) => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WalletIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>Account Balance</Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={onAddFunds}>Add Funds</Button>
        </Box>
        <Box>
            <Typography variant="h3" fontWeight={800} color="primary.main">{formatCurrency(balance)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Available for trading • {currency}</Typography>
        </Box>
    </Paper>
);
