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
    alpha,
    useTheme,
    CircularProgress,
    Divider,
} from '@mui/material';
import {
    AccountBalanceWallet as WalletIcon,
    History as HistoryIcon,
    AddCircle as AddIcon,
    InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { Tooltip, Grid } from '@mui/material';
import { accountService, TradingAccount, Transaction } from '../services/accountService';
import { tradeService, Trade as TradeModel } from '../../trading/services/tradeService';

export const FinanceSettings: React.FC = () => {
    const [account, setAccount] = useState<TradingAccount | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [trades, setTrades] = useState<Record<string, TradeModel>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFunding, setIsFunding] = useState(false);
    const [fundAmount, setFundAmount] = useState('10000');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isFundingDialogOpen, setIsFundingDialogOpen] = useState(false);

    const fetchData = async () => {
        try {
            const [acc, txs, userTrades] = await Promise.all([
                accountService.getBalance(),
                accountService.getTransactions(),
                tradeService.getTrades(),
            ]);
            setAccount(acc);
            setTransactions(txs);

            // Create a lookup map for trades by tradeId
            const tradeMap: Record<string, TradeModel> = {};
            userTrades.forEach(t => {
                tradeMap[t.tradeId] = t;
            });
            setTrades(tradeMap);
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
                                            {tx.reference?.startsWith('TRADE_') ? (
                                                <Tooltip
                                                    title={
                                                        <Box sx={{ p: 1, minWidth: 240 }}>
                                                            {trades[tx.reference.replace('TRADE_', '')] ? (
                                                                <Box>
                                                                    <Grid container spacing={1.5} sx={{ mb: 1 }}>
                                                                        <Grid item xs={6}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>INSTRUMENT</Typography>
                                                                            <Typography variant="body2" fontWeight={800} color="text.primary">{trades[tx.reference.replace('TRADE_', '')].symbol}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>SIDE</Typography>
                                                                            <Typography variant="body2" fontWeight={800} color={trades[tx.reference.replace('TRADE_', '')].side === 'BUY' ? 'success.main' : 'error.main'}>
                                                                                {trades[tx.reference.replace('TRADE_', '')].side}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>PRICE</Typography>
                                                                            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block' }}>₹{trades[tx.reference.replace('TRADE_', '')].price.toLocaleString()}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>QTY</Typography>
                                                                            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block' }}>{trades[tx.reference.replace('TRADE_', '')].quantity}</Typography>
                                                                        </Grid>
                                                                        <Grid item xs={12}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>{new Date(trades[tx.reference.replace('TRADE_', '')].executedAt).toLocaleString()}</Typography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Stack spacing={0.3} sx={{ p: 1, bgcolor: alpha(useTheme().palette.primary.main, 0.04), borderRadius: 0.5 }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Value</Typography>
                                                                            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.7rem' }}>₹{trades[tx.reference.replace('TRADE_', '')].value.toLocaleString()}</Typography>
                                                                        </Box>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Comm.</Typography>
                                                                            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.7rem' }}>₹{trades[tx.reference.replace('TRADE_', '')].commission.toLocaleString()}</Typography>
                                                                        </Box>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Fees</Typography>
                                                                            <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.7rem' }}>₹{trades[tx.reference.replace('TRADE_', '')].fees.toLocaleString()}</Typography>
                                                                        </Box>
                                                                        <Divider sx={{ my: 0.5 }} />
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <Typography variant="caption" color="primary.main" fontWeight={800} sx={{ fontSize: '0.75rem' }}>Net</Typography>
                                                                            <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ fontSize: '0.75rem' }}>₹{trades[tx.reference.replace('TRADE_', '')].netValue.toLocaleString()}</Typography>
                                                                        </Box>
                                                                    </Stack>
                                                                </Box>
                                                            ) : (
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <CircularProgress size={10} color="primary" />
                                                                    <Typography variant="caption" color="text.secondary" fontSize="0.7rem">Loading...</Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    }
                                                    arrow
                                                    componentsProps={{
                                                        tooltip: {
                                                            sx: {
                                                                bgcolor: 'background.paper',
                                                                color: 'text.primary',
                                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                '& .MuiTooltip-arrow': {
                                                                    color: 'background.paper',
                                                                    '&::before': {
                                                                        border: '1px solid',
                                                                        borderColor: 'divider',
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: 0.5,
                                                        cursor: 'help',
                                                        bgcolor: alpha(useTheme().palette.primary.main, 0.05),
                                                        px: 1,
                                                        py: 0.5,
                                                        borderRadius: 1,
                                                        transition: 'all 0.2s',
                                                        '&:hover': {
                                                            bgcolor: alpha(useTheme().palette.primary.main, 0.1),
                                                            transform: 'translateY(-1px)'
                                                        }
                                                    }}>
                                                        <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                                                            {tx.reference}
                                                        </Typography>
                                                        <InfoIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                                                    </Box>
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="caption" color="text.secondary">
                                                    {tx.reference}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="right">
                                            {(() => {
                                                const trade = trades[tx.reference?.replace('TRADE_', '')];
                                                const isTrade = tx.type === 'TRADE' && trade;
                                                const isBuy = isTrade && trade.side === 'BUY';

                                                // If it's a trade, force sign based on Side (BUY = -, SELL = +)
                                                // This handles both old (stored as +) and new (stored as -) data correctly via Math.abs
                                                // Non-trade transactions rely on stored sign
                                                const displayAmount = isTrade
                                                    ? Math.abs(tx.amount)
                                                    : Math.abs(tx.amount); // For non-trades, we usually respect the sign, but here let's just format the number part and add prefix manually

                                                const isNegative = isTrade ? isBuy : tx.amount < 0;
                                                const color = isNegative ? 'text.primary' : 'success.main';
                                                const prefix = isNegative ? '-' : '+';

                                                return (
                                                    <Typography
                                                        variant="body2"
                                                        fontWeight={600}
                                                        color={color}
                                                    >
                                                        {prefix}{displayAmount.toLocaleString(undefined, { style: 'currency', currency: tx.currency })}
                                                    </Typography>
                                                );
                                            })()}
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
