import React, { useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    Chip,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { usePortfolioStore } from '../store/portfolioStore';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { orderService } from '@/features/trading/services/orderService';

interface PositionBannerProps {
    instrument: Instrument;
    ltp: number;
}

export const PositionBanner: React.FC<PositionBannerProps> = ({ instrument, ltp }) => {
    const { getPositionByInstrumentId, fetchHoldings } = usePortfolioStore();
    const position = getPositionByInstrumentId(instrument.id);

    // Squaring off state
    const [isSquaringOff, setIsSquaringOff] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const unrealizedPL = useMemo(() => {
        if (!position || ltp <= 0) return 0;
        let pnl = 0;
        if (position.positionType === 'SHORT') {
            pnl = (position.avgEntryPrice - ltp) * position.quantity;
        } else {
            pnl = (ltp - position.avgEntryPrice) * position.quantity;
        }
        return pnl;
    }, [position, ltp]);

    const plPercentage = useMemo(() => {
        if (!position || position.avgEntryPrice === 0) return 0;
        const pnl = unrealizedPL; // Use already calculated P&L
        const investedAmount = position.avgEntryPrice * position.quantity;
        return (pnl / investedAmount) * 100;
    }, [position, unrealizedPL]);

    if (!position || position.quantity === 0) return null;

    const isProfit = unrealizedPL >= 0;

    const handleSquareOff = async () => {
        if (!position || isSquaringOff) return;

        setIsSquaringOff(true);
        try {
            const isShort = position.positionType === 'SHORT';
            const side = isShort ? 'BUY' : 'SELL';
            const intent = isShort ? 'CLOSE_SHORT' : 'CLOSE_LONG';
            const absQty = Math.abs(position.quantity);

            await orderService.placeOrder({
                instrumentId: instrument.id,
                symbol: instrument.symbol,
                side,
                orderType: 'MARKET',
                quantity: absQty,
                clientOrderId: crypto.randomUUID(),
                intent
            });

            setMessage({ type: 'success', text: `Position closed successfully!` });
            setTimeout(() => fetchHoldings(), 500);
        } catch (err: any) {
            setMessage({
                type: 'error',
                text: err.response?.data?.message || 'Failed to square off'
            });
        } finally {
            setIsSquaringOff(false);
        }
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    mb: 2,
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: isProfit ? 'success.light' : 'error.light',
                    bgcolor: isProfit ? 'rgba(46, 125, 50, 0.04)' : 'rgba(211, 47, 47, 0.04)',
                    background: isProfit
                        ? 'linear-gradient(90deg, rgba(46,125,50,0.08) 0%, rgba(255,255,255,0) 100%)'
                        : 'linear-gradient(90deg, rgba(211,47,47,0.08) 0%, rgba(255,255,255,0) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AccountBalanceWalletIcon color="action" />
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                                CURRENT POSITION
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography variant="h6" fontWeight={800}>
                                    {position.quantity} <Typography component="span" variant="caption" sx={{ verticalAlign: 'middle' }}>Qty</Typography>
                                </Typography>
                                <Chip
                                    label={position.positionType === 'SHORT' ? "SHORT" : "LONG"}
                                    size="small"
                                    color={position.positionType === 'SHORT' ? "error" : "success"}
                                    variant="outlined"
                                    sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, borderRadius: 1 }}
                                />
                            </Stack>
                        </Box>
                    </Box>

                    <Box sx={{ width: '1px', height: 40, bgcolor: 'divider' }} />

                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                            AVG. COST
                        </Typography>
                        <Typography variant="subtitle1" fontWeight={700}>
                            ₹{position.avgEntryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </Typography>
                    </Box>

                    <Box sx={{ width: '1px', height: 40, bgcolor: 'divider' }} />

                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                            UNREALIZED P&L
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                color={isProfit ? "success.main" : "error.main"}
                                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                            >
                                {isProfit ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                                ₹{Math.abs(unrealizedPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Typography>
                            <Typography
                                variant="caption"
                                fontWeight={700}
                                color={isProfit ? "success.main" : "error.main"}
                            >
                                ({isProfit ? '+' : ''}{plPercentage.toFixed(2)}%)
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>

                <Button
                    variant="contained"
                    color="inherit"
                    size="medium"
                    startIcon={isSquaringOff ? <CircularProgress size={16} color="inherit" /> : <CloseIcon />}
                    onClick={handleSquareOff}
                    disabled={isSquaringOff}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: 'text.primary',
                        color: 'background.paper',
                        '&:hover': {
                            bgcolor: 'text.secondary',
                        }
                    }}
                >
                    {isSquaringOff ? 'SQUARING OFF...' : 'SQUARE OFF'}
                </Button>
            </Paper>

            <Snackbar
                open={!!message}
                autoHideDuration={4000}
                onClose={() => setMessage(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setMessage(null)}
                    severity={message?.type}
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {message?.text}
                </Alert>
            </Snackbar>
        </>
    );
};
