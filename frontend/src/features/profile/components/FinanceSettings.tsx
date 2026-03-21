import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    Alert,
    TablePagination,
    Divider,
    alpha,
    useTheme,
    CircularProgress,
    Chip,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Tooltip,
    Grid
} from '@mui/material';
import {
    AccountBalanceWallet as WalletIcon,
    History as HistoryIcon,
    AddCircle as AddIcon,
    InfoOutlined as InfoIcon,
} from '@mui/icons-material';
import { accountService, TradingAccount, Transaction } from '../services/accountService';
import { tradeService, Trade as TradeModel } from '../../trading/services/tradeService';
import { CustomGrid } from '../../../shared/components/CustomGrid';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

export const FinanceSettings: React.FC = () => {
    const [account, setAccount] = useState<TradingAccount | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [trades, setTrades] = useState<Record<string, TradeModel>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isFunding, setIsFunding] = useState(false);
    const [fundAmount, setFundAmount] = useState('10000');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isFundingDialogOpen, setIsFundingDialogOpen] = useState(false);
    const [fundingStep, setFundingStep] = useState<'amount' | 'otp'>('amount');
    const [otpCode, setOtpCode] = useState('');
    const [pendingTransactionId, setPendingTransactionId] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const theme = useTheme();

    const fetchData = async () => {
        try {
            const [acc, txs, userTrades] = await Promise.all([
                accountService.getBalance(),
                accountService.getTransactions(),
                tradeService.getTrades(),
            ]);
            setAccount(acc);
            setTransactions(txs || []);

            // Create a lookup map for trades by tradeId
            const tradeMap: Record<string, TradeModel> = {};
            if (userTrades) {
                userTrades.forEach(t => {
                    tradeMap[t.tradeId] = t;
                });
            }
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

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleFund = async () => {
        const amount = parseFloat(fundAmount);
        if (isNaN(amount) || amount <= 0) {
            setMessage({ type: 'error', text: 'Please enter a valid amount' });
            return;
        }

        setIsFunding(true);
        try {
            const { transactionId } = await accountService.initiateDeposit(amount);
            setPendingTransactionId(transactionId);
            setFundingStep('otp');
            setTimer(60);
            setMessage({ type: 'success', text: 'OTP has been sent to your registered email.' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to initiate deposit' });
        } finally {
            setIsFunding(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpCode || !pendingTransactionId) {
            setMessage({ type: 'error', text: 'Please enter the OTP' });
            return;
        }

        setIsFunding(true);
        try {
            const updatedAccount = await accountService.completeDeposit(pendingTransactionId, otpCode);
            setAccount(updatedAccount);
            const updatedTxs = await accountService.getTransactions();
            setTransactions(updatedTxs || []);
            setMessage({ type: 'success', text: `Successfully added funds to your account!` });
            handleCloseDialog();
        } catch (err: any) {
            setMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid or expired OTP' });
        } finally {
            setIsFunding(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        await handleFund();
    };

    const handleCloseDialog = () => {
        setIsFundingDialogOpen(false);
        setFundingStep('amount');
        setOtpCode('');
        setPendingTransactionId(null);
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const columns = [
        {
            id: 'createdAt',
            label: 'Date',
            format: (value: string) => formatDate(value),
        },
        {
            id: 'type',
            label: 'Type',
            format: (value: string) => (
                <Typography variant="body2" fontWeight={500}>
                    {value}
                </Typography>
            ),
        },
        {
            id: 'reference',
            label: 'Reference',
            format: (value: string) => {
                if (value?.startsWith('TRADE_')) {
                    const tradeId = value.replace('TRADE_', '');
                    const trade = trades[tradeId];
                    return (
                        <Tooltip
                            title={
                                <Box sx={{ p: 1, minWidth: 240 }}>
                                    {trade ? (
                                        <Box>
                                            <Grid container spacing={1.5} sx={{ mb: 1 }}>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>INSTRUMENT</Typography>
                                                    <Typography variant="body2" fontWeight={800} color="text.primary">{trade.symbol}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>SIDE</Typography>
                                                    <Typography variant="body2" fontWeight={800} color={trade.side === 'BUY' ? 'success.main' : 'error.main'}>
                                                        {trade.side}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>PRICE</Typography>
                                                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block' }}>{formatCurrency(trade.price)}</Typography>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem', fontWeight: 700 }}>QTY</Typography>
                                                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ display: 'block' }}>{trade.quantity}</Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.65rem' }}>{new Date(trade.executedAt).toLocaleString()}</Typography>
                                                </Grid>
                                            </Grid>

                                            <Stack spacing={0.3} sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.04), borderRadius: 0.5 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Value</Typography>
                                                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.7rem' }}>{formatCurrency(trade.value)}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Comm.</Typography>
                                                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.7rem' }}>{formatCurrency(trade.commission)}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>Fees</Typography>
                                                    <Typography variant="caption" fontWeight={700} color="text.primary" sx={{ fontSize: '0.7rem' }}>{formatCurrency(trade.fees)}</Typography>
                                                </Box>
                                                <Divider sx={{ my: 0.5 }} />
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <Typography variant="caption" color="primary.main" fontWeight={800} sx={{ fontSize: '0.75rem' }}>Net</Typography>
                                                    <Typography variant="caption" fontWeight={800} color="primary.main" sx={{ fontSize: '0.75rem' }}>{formatCurrency(trade.netValue)}</Typography>
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
                        >
                            <Box sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.5,
                                cursor: 'help',
                                bgcolor: alpha(theme.palette.primary.main, 0.05),
                                px: 1,
                                py: 0.5,
                                borderRadius: 1,
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    transform: 'translateY(-1px)'
                                }
                            }}>
                                <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                                    {value}
                                </Typography>
                                <InfoIcon sx={{ fontSize: 14, color: 'primary.main' }} />
                            </Box>
                        </Tooltip>
                    );
                }
                return (
                    <Typography variant="caption" color="text.secondary">
                        {value}
                    </Typography>
                );
            },
        },
        {
            id: 'amount',
            label: 'Amount',
            align: 'right' as const,
            format: (_value: number, tx: Transaction) => {
                const trade = trades[tx.reference?.replace('TRADE_', '')];
                const isTrade = tx.type === 'TRADE' && trade;
                const isBuy = isTrade && trade.side === 'BUY';
                const displayAmount = Math.abs(tx.amount);
                const isNegative = isTrade ? isBuy : tx.amount < 0;
                const color = isNegative ? 'text.primary' : 'success.main';
                const prefix = isNegative ? '-' : '+';

                return (
                    <Typography variant="body2" fontWeight={600} color={color}>
                        {prefix}{formatCurrency(displayAmount)}
                    </Typography>
                );
            },
        },
        {
            id: 'status',
            label: 'Status',
            align: 'center' as const,
            format: (value: string) => (
                <Chip
                    label={value}
                    size="small"
                    color={value === 'COMPLETED' ? 'success' : 'default'}
                    variant="outlined"
                />
            ),
        },
    ];

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
                        Add Funds
                    </Button>
                </Box>

                <Box>
                    <Typography variant="h3" fontWeight={800} color="primary.main">
                        {formatCurrency(account?.balance || 0)}
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

                <Box sx={{ position: 'relative' }}>
                    <CustomGrid
                        columns={columns}
                        rows={transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={transactions.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
                    />
                </Box>
            </Box>

            <Dialog open={isFundingDialogOpen} onClose={() => !isFunding && handleCloseDialog()}>
                <DialogTitle>{fundingStep === 'amount' ? 'Add Funds' : 'Verify Deposit'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, minWidth: { xs: '100%', sm: 400 } }}>
                        {fundingStep === 'amount' ? (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Enter the amount you would like to add to your account.
                                </Typography>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    label="Amount"
                                    variant="outlined"
                                    type="number"
                                    value={fundAmount}
                                    onChange={(e) => setFundAmount(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                                    }}
                                />
                                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                                    {['1000', '5000', '10000', '50000'].map((amt) => (
                                        <Button
                                            key={amt}
                                            size="small"
                                            variant="outlined"
                                            onClick={() => setFundAmount(amt)}
                                            sx={{ borderRadius: 1.5 }}
                                        >
                                            ₹{(parseInt(amt) / 1000)}k
                                        </Button>
                                    ))}
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    We've sent a 6-digit verification code to your email. Please enter it below to complete the deposit.
                                </Typography>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    label="Enter OTP"
                                    variant="outlined"
                                    placeholder="000000"
                                    value={otpCode}
                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                                    inputProps={{
                                        style: { fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' }
                                    }}
                                />
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        Didn't receive code?
                                    </Typography>
                                    {timer > 0 ? (
                                        <Typography variant="caption" color="primary.main" fontWeight={700}>
                                            Resend in {timer}s
                                        </Typography>
                                    ) : (
                                        <Button
                                            size="small"
                                            onClick={handleResendOtp}
                                            disabled={isFunding}
                                            sx={{ p: 0, minWidth: 0, textTransform: 'none', fontWeight: 700 }}
                                        >
                                            Resend Now
                                        </Button>
                                    )}
                                </Box>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} disabled={isFunding}>Cancel</Button>
                    {fundingStep === 'amount' ? (
                        <Button
                            onClick={handleFund}
                            variant="contained"
                            disabled={isFunding}
                            sx={{ px: 4, borderRadius: 1.5 }}
                        >
                            {isFunding ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleVerifyOtp}
                            variant="contained"
                            disabled={isFunding || otpCode.length < 6}
                            sx={{ px: 4, borderRadius: 1.5 }}
                        >
                            {isFunding ? <CircularProgress size={24} color="inherit" /> : 'Complete Deposit'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Stack>
    );
};
