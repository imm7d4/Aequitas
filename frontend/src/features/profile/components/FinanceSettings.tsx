import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from '@mui/material';
import {
    AccountBalanceWallet as WalletIcon,
    History as HistoryIcon,
    AddCircle as AddIcon,
} from '@mui/icons-material';
import { accountService, TradingAccount, Transaction } from '../services/accountService';

export const FinanceSettings: React.FC = () => {
    const [account, setAccount] = useState<TradingAccount | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFunding, setIsFunding] = useState(false);
    const [fundAmount, setFundAmount] = useState('10000');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isFundingDialogOpen, setIsFundingDialogOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [acc, txs] = await Promise.all([
                accountService.getBalance(),
                accountService.getTransactions(),
            ]);
            setAccount(acc);
            setTransactions(txs);
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to load financial data' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleFund = async () => {
        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid amount' });
            return;
        }

        setIsFunding(true);
        try {
            const updatedAccount = await accountService.fundAccount(amount);
            setAccount(updatedAccount);
            const updatedTxs = await accountService.getTransactions();
            setTransactions(updatedTxs);
            setMessage({ type: 'success', text: `Successfully added ${amount} ${updatedAccount.currency} to your account` });
            setIsFundingDialogOpen(false);
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Failed to fund account' });
        } finally {
            setIsFunding(false);
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Stack spacing={4}>
            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ borderRadius: 1.5 }}>
                    {message.text}
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(25, 118, 210, 0) 100%)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WalletIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>
                            Account Balance
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsFundingDialogOpen(true)}
                    >
                        Fund Account
                    </Button>
                </Box>

                <Box>
                    <Typography variant="h3" fontWeight={800} color="primary.main">
                        {account?.balance?.toLocaleString(undefined, { style: 'currency', currency: account?.currency || 'INR' }) || '₹0.00'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Available for trading • {account?.currency}
                    </Typography>
                </Box>
            </Paper>

            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Recent Transactions
                    </Typography>
                </Box>

                <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Reference</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions && transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} hover>
                                        <TableCell>{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={500}>
                                                {tx.type}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="caption" color="text.secondary">
                                                {tx.reference}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight={600}
                                                color={tx.type === 'DEPOSIT' ? 'success.main' : 'text.primary'}
                                            >
                                                {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString(undefined, { style: 'currency', currency: tx.currency })}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={tx.status}
                                                size="small"
                                                color={tx.status === 'COMPLETED' ? 'success' : 'default'}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No transactions found
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Dialog open={isFundingDialogOpen} onClose={() => !isFunding && setIsFundingDialogOpen(false)}>
                <DialogTitle>Fund Trading Account</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Enter the amount you would like to add to your account. This is a simulated transaction for testing purposes.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Amount"
                            variant="outlined"
                            type="number"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                            }}
                        />
                        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                            {['1000', '5000', '10000', '50000'].map((amt) => (
                                <Button
                                    key={amt}
                                    size="small"
                                    variant="outlined"
                                    onClick={() => setFundAmount(amt)}
                                >
                                    ₹{amt}
                                </Button>
                            ))}
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsFundingDialogOpen(false)} disabled={isFunding}>Cancel</Button>
                    <Button
                        onClick={handleFund}
                        variant="contained"
                        disabled={isFunding}
                    >
                        {isFunding ? 'Processing...' : 'Add Funds'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
