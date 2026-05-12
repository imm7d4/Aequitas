import React from 'react';
import { Box, Typography, Button, Paper, Stack, Chip, Alert, Snackbar } from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { usePositionBanner } from '../hooks/usePositionBanner';
import { Instrument } from '@/features/instruments/types/instrument.types';

export const PositionBanner: React.FC<{ instrument: Instrument; ltp: number }> = ({ instrument, ltp }) => {
    const { position, unrealizedPL, plPercentage, isSquaringOff, message, setMessage, handleSquareOff } = usePositionBanner(instrument, ltp);

    if (!position || position.quantity === 0) return null;
    const isProfit = unrealizedPL >= 0;

    return (
        <>
            <Paper elevation={0} sx={{
                mb: 1.5, px: 2, py: 1, borderRadius: 2, border: '1px solid',
                borderColor: isProfit ? 'success.light' : 'error.light',
                bgcolor: isProfit ? 'rgba(46, 125, 50, 0.04)' : 'rgba(211, 47, 47, 0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, overflowX: 'auto'
            }}>
                <Stack direction="row" spacing={3} alignItems="center" sx={{ flexShrink: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.65rem' }}>POSITION</Typography>
                            <Stack direction="row" spacing={0.8} alignItems="center">
                                <Typography variant="subtitle2" fontWeight={800}>{position.quantity}</Typography>
                                <Chip label={position.positionType} size="small" color={position.positionType === 'SHORT' ? "error" : "success"} sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800 }} />
                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ width: '1px', height: 24, bgcolor: 'divider' }} />
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.65rem' }}>AVG. COST</Typography>
                        <Typography variant="subtitle2" fontWeight={800}>₹{position.avgEntryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                    </Box>
                    <Box sx={{ width: '1px', height: 24, bgcolor: 'divider' }} />
                    <Box>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ fontSize: '0.65rem' }}>P&L</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="subtitle2" fontWeight={900} color={isProfit ? "success.main" : "error.main"} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {isProfit ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
                                ₹{Math.abs(unrealizedPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </Typography>
                            <Typography variant="caption" fontWeight={800} color={isProfit ? "success.main" : "error.main"} sx={{ fontSize: '0.65rem' }}>({isProfit ? '+' : ''}{plPercentage.toFixed(2)}%)</Typography>
                        </Stack>
                    </Box>
                </Stack>
                <Button variant="contained" size="small" startIcon={isSquaringOff ? <Loader size="small" color="inherit" /> : <CloseIcon sx={{ fontSize: 14 }} />} onClick={handleSquareOff} disabled={isSquaringOff} sx={{ borderRadius: 1.5, fontWeight: 800, bgcolor: 'text.primary', color: 'background.paper' }}>
                    {isSquaringOff ? 'EXITING...' : 'SQUARE OFF'}
                </Button>
            </Paper>
            <Snackbar open={!!message} autoHideDuration={4000} onClose={() => setMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
                <Alert onClose={() => setMessage(null)} severity={message?.type} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>{message?.text}</Alert>
            </Snackbar>
        </>
    );
};
