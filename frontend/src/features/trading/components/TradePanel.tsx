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
    Alert,
    CircularProgress,
    InputAdornment,
    Chip,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import {
    TrendingUp as BuyIcon,
    TrendingDown as SellIcon,
    Settings as AdvancedIcon,
} from '@mui/icons-material';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { orderService } from '../services/orderService';

interface TradePanelProps {
    instrument: Instrument;
    ltp: number;
}

export const TradePanel: React.FC<TradePanelProps> = ({ instrument, ltp }) => {
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP'>('LIMIT');
    const [quantity, setQuantity] = useState<string>('');
    const [price, setPrice] = useState<string>(ltp > 0 ? ltp.toFixed(2) : '0');
    const [isPriceTouched, setIsPriceTouched] = useState(false);

    // Advanced mode state
    const [advancedMode, setAdvancedMode] = useState(false);

    // Stop order fields
    const [stopPrice, setStopPrice] = useState<string>('');
    const [limitPrice, setLimitPrice] = useState<string>('');
    const [trailAmount, setTrailAmount] = useState<string>('');
    const [trailType, setTrailType] = useState<'ABSOLUTE' | 'PERCENTAGE'>('PERCENTAGE');

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

    // Auto-dismiss notifications
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

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

        // Validate stop order fields
        if (orderType === 'STOP' || orderType === 'STOP_LIMIT') {
            const sp = parseFloat(stopPrice);
            if (isNaN(sp) || sp <= 0) return false;
        }

        if (orderType === 'STOP_LIMIT') {
            const lp = parseFloat(limitPrice);
            if (isNaN(lp) || lp <= 0) return false;
        }

        if (orderType === 'TRAILING_STOP') {
            const ta = parseFloat(trailAmount);
            if (isNaN(ta) || ta <= 0) return false;
            if (trailType === 'PERCENTAGE' && (ta < 0.1 || ta > 50)) return false;
        }

        return true;
    }, [quantity, price, orderType, instrument.lotSize, stopPrice, limitPrice, trailAmount, trailType]);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const orderRequest: any = {
                instrumentId: instrument.id,
                symbol: instrument.symbol,
                side,
                orderType,
                quantity: parseInt(quantity),
                clientOrderId: crypto.randomUUID(),
            };

            // Add price for LIMIT orders
            if (orderType === 'LIMIT' && price) {
                const priceNum = parseFloat(price);
                if (!isNaN(priceNum)) {
                    orderRequest.price = priceNum;
                }
            }

            // Add stop order fields
            if ((orderType === 'STOP' || orderType === 'STOP_LIMIT') && stopPrice) {
                const stopPriceNum = parseFloat(stopPrice);
                if (!isNaN(stopPriceNum)) {
                    orderRequest.stopPrice = stopPriceNum;
                }
            }

            if (orderType === 'STOP_LIMIT' && limitPrice) {
                const limitPriceNum = parseFloat(limitPrice);
                if (!isNaN(limitPriceNum)) {
                    orderRequest.limitPrice = limitPriceNum;
                }
            }

            if (orderType === 'TRAILING_STOP' && trailAmount) {
                const trailAmountNum = parseFloat(trailAmount);
                if (!isNaN(trailAmountNum)) {
                    orderRequest.trailAmount = trailAmountNum;
                    orderRequest.trailType = trailType;
                }
            }

            const res = await orderService.placeOrder(orderRequest);
            setSuccess(`Order ${res.orderId} placed successfully!`);

            // Clear all fields to prevent accidental duplicate orders
            setQuantity('');
            setStopPrice('');
            setLimitPrice('');
            setTrailAmount('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack spacing={2}>
                {/* Inline Notification Banner */}
                {(success || error) && (
                    <Alert
                        severity={success ? 'success' : 'error'}
                        onClose={() => {
                            setSuccess(null);
                            setError(null);
                        }}
                        sx={{ borderRadius: 1 }}
                    >
                        {success || error}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight={700}>
                        Trade {instrument.symbol}
                    </Typography>
                    <Chip
                        icon={<AdvancedIcon />}
                        label={advancedMode ? 'Advanced' : 'Basic'}
                        onClick={() => {
                            setAdvancedMode(!advancedMode);
                            if (advancedMode) {
                                // Reset to LIMIT when disabling advanced mode
                                setOrderType('LIMIT');
                            }
                        }}
                        color={advancedMode ? 'primary' : 'default'}
                        size="small"
                        sx={{ cursor: 'pointer' }}
                    />
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

                {/* Order Type Selection - Redesigned for better UX */}
                <Stack spacing={1.5}>
                    {/* Basic Order Types - Always Visible */}
                    <ToggleButtonGroup
                        fullWidth
                        value={['LIMIT', 'MARKET'].includes(orderType) ? orderType : ''}
                        exclusive
                        onChange={(_, v) => {
                            if (v) {
                                setOrderType(v);
                            }
                        }}
                        size="small"
                    >
                        <ToggleButton value="LIMIT">
                            <Tooltip title="Order executes only at specified price or better">
                                <span>LIMIT</span>
                            </Tooltip>
                        </ToggleButton>
                        <ToggleButton value="MARKET">
                            <Tooltip title="Order executes immediately at best available price">
                                <span>MARKET</span>
                            </Tooltip>
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Advanced Order Types - Dropdown Select */}
                    {advancedMode && (
                        <FormControl fullWidth size="small">
                            <InputLabel>Advanced Order Type</InputLabel>
                            <Select
                                value={['STOP', 'STOP_LIMIT', 'TRAILING_STOP'].includes(orderType) ? orderType : ''}
                                label="Advanced Order Type"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setOrderType(e.target.value as any);
                                    }
                                }}
                            >
                                <MenuItem value="">
                                    <em>Select advanced type...</em>
                                </MenuItem>
                                <MenuItem value="STOP">
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>STOP</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Triggers market order when stop price is reached
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="STOP_LIMIT">
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>STOP-LIMIT</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Triggers limit order when stop price is reached
                                        </Typography>
                                    </Box>
                                </MenuItem>
                                <MenuItem value="TRAILING_STOP">
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>TRAILING STOP</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Stop price trails market price to lock in profits
                                        </Typography>
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    )}
                </Stack>

                {/* Compact Input Fields */}
                <Stack spacing={1.5}>
                    {/* Quantity and Price in two-column grid for LIMIT orders */}
                    {orderType === 'LIMIT' ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                            <TextField
                                label="Quantity"
                                type="number"
                                size="small"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                helperText={`Lot: ${instrument.lotSize}`}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">Qty</InputAdornment>,
                                }}
                            />
                            <TextField
                                label="Price"
                                type="number"
                                size="small"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                    setIsPriceTouched(true);
                                }}
                                helperText={`Tick: ${instrument.tickSize}`}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                }}
                            />
                        </Box>
                    ) : (
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
                    )}

                    {/* Stop Price Input for STOP and STOP_LIMIT orders */}
                    {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
                        <TextField
                            fullWidth
                            label="Stop Price"
                            type="number"
                            size="small"
                            value={stopPrice}
                            onChange={(e) => setStopPrice(e.target.value)}
                            helperText={
                                stopPrice && parseFloat(stopPrice) > 0
                                    ? `Distance: ₹${Math.abs(ltp - parseFloat(stopPrice)).toFixed(2)} (${((Math.abs(ltp - parseFloat(stopPrice)) / ltp) * 100).toFixed(2)}%)`
                                    : `Trigger when ${side === 'BUY' ? 'above' : 'below'} this price`
                            }
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    )}

                    {/* Limit Price Input for STOP_LIMIT orders */}
                    {orderType === 'STOP_LIMIT' && (
                        <TextField
                            fullWidth
                            label="Limit Price"
                            type="number"
                            size="small"
                            value={limitPrice}
                            onChange={(e) => setLimitPrice(e.target.value)}
                            helperText="Max price to pay (BUY) or min to accept (SELL)"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                            }}
                        />
                    )}

                    {/* Trailing Stop Controls */}
                    {orderType === 'TRAILING_STOP' && (
                        <>
                            <ToggleButtonGroup
                                fullWidth
                                value={trailType}
                                exclusive
                                onChange={(_, v) => v && setTrailType(v)}
                                size="small"
                            >
                                <ToggleButton value="PERCENTAGE">Percentage %</ToggleButton>
                                <ToggleButton value="ABSOLUTE">Absolute ₹</ToggleButton>
                            </ToggleButtonGroup>

                            <TextField
                                fullWidth
                                label={`Trail Amount (${trailType === 'PERCENTAGE' ? '%' : '₹'})`}
                                type="number"
                                size="small"
                                value={trailAmount}
                                onChange={(e) => setTrailAmount(e.target.value)}
                                helperText={`Stop trails ${trailAmount || '0'}${trailType === 'PERCENTAGE' ? '%' : '₹'} behind peak`}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {trailType === 'PERCENTAGE' ? '%' : '₹'}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </>
                    )}
                </Stack>

                {/* Compact Order Summary */}
                <Box sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">Est. Value</Typography>
                        <Typography variant="body1" fontWeight={700}>₹{estValue.toLocaleString()}</Typography>
                    </Box>
                </Box>

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
