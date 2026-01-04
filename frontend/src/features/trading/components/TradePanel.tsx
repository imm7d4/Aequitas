import React, { useState, useMemo, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    TextField,
    Button,
    Stack,
    Divider,
    Alert,
    CircularProgress,
    InputAdornment,
} from '@mui/material';
import {
    TrendingUp as BuyIcon,
    TrendingDown as SellIcon,
} from '@mui/icons-material';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { orderService } from '../services/orderService';

interface TradePanelProps {
    instrument: Instrument;
    ltp: number;
}

export const TradePanel: React.FC<TradePanelProps> = ({ instrument, ltp }) => {
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('LIMIT');
    const [quantity, setQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>(ltp > 0 ? ltp.toFixed(2) : '0');
    const [isPriceTouched, setIsPriceTouched] = useState(false);

    useEffect(() => {
        if (ltp > 0 && (price === '0' || price === '') && !isPriceTouched) {
            setPrice(ltp.toFixed(2));
        }
    }, [ltp, price, isPriceTouched]);

    useEffect(() => {
        // Only reset price when instrument changes, not on every LTP update
        setPrice(ltp > 0 ? ltp.toFixed(2) : '0');
        setIsPriceTouched(false);
    }, [instrument.id]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const estValue = useMemo(() => {
        const qty = parseInt(quantity) || 0;
        const p = orderType === 'LIMIT' ? parseFloat(price) : ltp;
        const buffer = orderType === 'MARKET' ? 1.01 : 1.0;
        return qty * p * buffer;
    }, [quantity, price, orderType, ltp]);

    const isValid = useMemo(() => {
        const qty = parseInt(quantity);
        if (isNaN(qty) || qty <= 0 || qty % instrument.lotSize !== 0) return false;

        if (orderType === 'LIMIT') {
            const p = parseFloat(price);
            if (isNaN(p) || p <= 0) return false;
        }

        return true;
    }, [quantity, price, orderType, instrument.lotSize]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await orderService.placeOrder({
                instrumentId: instrument.id,
                symbol: instrument.symbol,
                side,
                orderType,
                quantity: parseInt(quantity),
                price: orderType === 'LIMIT' ? parseFloat(price) : undefined,
                clientOrderId: crypto.randomUUID(),
            });
            setSuccess(`Order ${res.orderId} placed successfully!`);
            setQuantity('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Trade {instrument.symbol}
                    </Typography>
                </Box>

                <ToggleButtonGroup
                    fullWidth
                    value={side}
                    exclusive
                    onChange={(_, v) => v && setSide(v)}
                    size="small"
                >
                    <ToggleButton
                        value="BUY"
                        sx={{
                            '&.Mui-selected': { bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }
                        }}
                    >
                        <BuyIcon sx={{ mr: 1, fontSize: 18 }} /> BUY
                    </ToggleButton>
                    <ToggleButton
                        value="SELL"
                        sx={{
                            '&.Mui-selected': { bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }
                        }}
                    >
                        <SellIcon sx={{ mr: 1, fontSize: 18 }} /> SELL
                    </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButtonGroup
                    fullWidth
                    value={orderType}
                    exclusive
                    onChange={(_, v) => v && setOrderType(v)}
                    size="small"
                >
                    <ToggleButton value="LIMIT">LIMIT</ToggleButton>
                    <ToggleButton value="MARKET">MARKET</ToggleButton>
                </ToggleButtonGroup>

                <Stack spacing={2}>
                    <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        helperText={`Lot Size: ${instrument.lotSize}`}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Qty</InputAdornment>,
                        }}
                    />

                    {orderType === 'LIMIT' && (
                        <TextField
                            fullWidth
                            label="Price"
                            type="number"
                            size="small"
                            value={price}
                            onChange={(e) => {
                                setPrice(e.target.value);
                                setIsPriceTouched(true);
                            }}
                            helperText={`Tick Size: ${instrument.tickSize}`}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    )}
                </Stack>

                <Divider />

                <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">Est. Order Value</Typography>
                        <Typography variant="body2" fontWeight={600}>₹{estValue.toLocaleString()}</Typography>
                    </Box>
                    {orderType === 'MARKET' && (
                        <Box sx={{ mt: 1.5, p: 1.5, borderRadius: 1.5, bgcolor: 'rgba(237, 108, 2, 0.08)', border: '1px dashed rgba(237, 108, 2, 0.3)' }}>
                            <Typography variant="caption" sx={{ color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                                ⚠ Risk Context: Market order may execute between ₹{(ltp * 0.9995).toFixed(2)} – ₹{(ltp * 1.0005).toFixed(2)}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {error && <Alert severity="error" sx={{ borderRadius: 1 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ borderRadius: 1 }}>{success}</Alert>}

                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    color={side === 'BUY' ? 'success' : 'error'}
                    disabled={!isValid || isLoading}
                    onClick={handlePlaceOrder}
                    sx={{ py: 1.5, fontWeight: 700 }}
                >
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : `PLACE ${side} ORDER`}
                </Button>
            </Stack>
        </Paper>
    );
};
