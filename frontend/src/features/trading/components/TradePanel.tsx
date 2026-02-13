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
    CircularProgress,
    InputAdornment,
    Chip,
    Tooltip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
    FormControlLabel,
    Switch,
} from '@mui/material';
import {
    TrendingUp as BuyIcon,
    TrendingDown as SellIcon,
    Settings as AdvancedIcon,
} from '@mui/icons-material';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { ShortSellWarning } from './ShortSellWarning';
import { orderService } from '../services/orderService';
import { usePortfolioStore } from '@/features/portfolio/store/portfolioStore';

interface TradePanelProps {
    instrument: Instrument;
    ltp: number;
    initialSide?: 'BUY' | 'SELL';
    initialQuantity?: number;
    initialIntent?: 'OPEN_LONG' | 'OPEN_SHORT' | 'CLOSE_LONG' | 'CLOSE_SHORT';
}

export const TradePanel: React.FC<TradePanelProps> = ({ instrument, ltp, initialSide = 'BUY', initialQuantity, initialIntent }) => {
    const [side, setSide] = useState<'BUY' | 'SELL'>(initialSide);
    const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT' | 'TRAILING_STOP'>('LIMIT');
    const [quantity, setQuantity] = useState<string>(initialQuantity ? initialQuantity.toString() : '');
    const [price, setPrice] = useState<string>(ltp > 0 ? ltp.toFixed(2) : '0');
    const [isPriceTouched, setIsPriceTouched] = useState(false);

    // Advanced mode state
    const [advancedMode, setAdvancedMode] = useState(false);

    // Initialize shortMode based on initialIntent
    const [shortMode, setShortMode] = useState(() => {
        // If intent is OPEN_SHORT or CLOSE_SHORT, enable short mode
        return initialIntent === 'OPEN_SHORT' || initialIntent === 'CLOSE_SHORT';
    });

    const { fetchHoldings } = usePortfolioStore();

    // Stop order fields
    const [stopPrice, setStopPrice] = useState<string>('');
    const [limitPrice, setLimitPrice] = useState<string>('');
    const [trailAmount, setTrailAmount] = useState<string>('');
    const [trailType, setTrailType] = useState<'ABSOLUTE' | 'PERCENTAGE'>('PERCENTAGE');

    // Validity state
    const [validity, setValidity] = useState<'DAY' | 'IOC' | 'GTC'>('DAY');

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

    // Risk Warning State
    const [showRiskWarning, setShowRiskWarning] = useState(false);
    const [riskAccepted, setRiskAccepted] = useState(() => localStorage.getItem('shortSellRiskAccepted') === 'true');

    // Handle Short Mode Toggle
    const handleShortModeChange = (enabled: boolean) => {
        if (enabled && !riskAccepted) {
            setShowRiskWarning(true);
        } else {
            setShortMode(enabled);
        }
    };

    const handleRiskAccept = (accepted: boolean) => {
        setShowRiskWarning(false);
        if (accepted) {
            setRiskAccepted(true);
            localStorage.setItem('shortSellRiskAccepted', 'true');
            setShortMode(true);
        }
    };

    // Calculate Fees
    const fees = useMemo(() => {
        // Match backend fees.json: 0.03% (0.0003) capped at ₹20
        const commissionRate = 0.0003; // 0.03%
        const maxCommission = 20.0;     // ₹20 cap
        const flatFee = 0.0;            // No flat fee

        const commission = estValue * commissionRate;
        return flatFee + Math.min(commission, maxCommission);
    }, [estValue]);

    // Calculate Required Margin
    const requiredMargin = useMemo(() => {
        const value = estValue;

        if (shortMode && side === 'SELL') {
            // Short Sell Margin: 20% of Value + Fees
            return (value * 0.20) + fees;
        }

        // Regular Buy: Full Value + Fees
        return value + fees;
    }, [estValue, shortMode, side, fees]);

    // Generate inline validation warnings
    const validationWarnings = useMemo(() => {
        const warnings: string[] = [];

        if (orderType === 'STOP' || orderType === 'STOP_LIMIT') {
            const sp = parseFloat(stopPrice);
            if (!isNaN(sp) && sp > 0) {
                if (side === 'BUY' && sp <= ltp) {
                    warnings.push('⚠ Stop price must be ABOVE current price (₹' + ltp.toFixed(2) + ') for BUY orders');
                } else if (side === 'SELL' && sp >= ltp) {
                    warnings.push('⚠ Stop price must be BELOW current price (₹' + ltp.toFixed(2) + ') for SELL orders');
                }
            }
        }

        if (orderType === 'STOP_LIMIT') {
            const sp = parseFloat(stopPrice);
            const lp = parseFloat(limitPrice);
            if (!isNaN(sp) && !isNaN(lp) && sp > 0 && lp > 0) {
                if (side === 'BUY' && lp < sp) {
                    warnings.push('❌ Limit price must be >= stop price for BUY stop-limit orders');
                } else if (side === 'SELL' && lp > sp) {
                    warnings.push('❌ Limit price must be <= stop price for SELL stop-limit orders');
                }
            }
        }

        return warnings;
    }, [orderType, side, stopPrice, limitPrice, ltp]);

    // Generate live interpretation text
    const liveInterpretation = useMemo(() => {
        if (orderType === 'MARKET') {
            return `Order will execute immediately at best available price (around ₹${ltp.toFixed(2)})`;
        }

        if (orderType === 'LIMIT') {
            const p = parseFloat(price);
            if (isNaN(p)) return null;
            return side === 'BUY'
                ? `Order will execute when price falls to ₹${p.toFixed(2)} or better`
                : `Order will execute when price rises to ₹${p.toFixed(2)} or better`;
        }

        if (orderType === 'STOP') {
            const sp = parseFloat(stopPrice);
            if (isNaN(sp)) return null;
            return side === 'BUY'
                ? `When price rises to ₹${sp.toFixed(2)}, system will place a MARKET BUY order`
                : `When price falls to ₹${sp.toFixed(2)}, system will place a MARKET SELL order`;
        }

        if (orderType === 'STOP_LIMIT') {
            const sp = parseFloat(stopPrice);
            const lp = parseFloat(limitPrice);
            if (isNaN(sp) || isNaN(lp)) return null;
            return side === 'BUY'
                ? `When price rises to ₹${sp.toFixed(2)}, system will try to buy at ₹${lp.toFixed(2)} or better. ⚠ Fast breakout may skip your order.`
                : `When price falls to ₹${sp.toFixed(2)}, system will try to sell at ₹${lp.toFixed(2)} or better. ⚠ Fast breakdown may skip your order.`;
        }

        if (orderType === 'TRAILING_STOP') {
            const ta = parseFloat(trailAmount);
            if (isNaN(ta)) return null;
            const trailText = trailType === 'PERCENTAGE' ? `${ta}%` : `₹${ta}`;
            return side === 'BUY'
                ? `Stop price will trail ${trailText} above the lowest price. When triggered, places MARKET BUY order.`
                : `Stop price will trail ${trailText} below the highest price. When triggered, places MARKET SELL order.`;
        }

        return null;
    }, [orderType, side, price, stopPrice, limitPrice, trailAmount, trailType, ltp]);

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
                validity,
                clientOrderId: crypto.randomUUID(),
                intent: shortMode
                    ? (side === 'SELL' ? 'OPEN_SHORT' : 'CLOSE_SHORT')
                    : (side === 'BUY' ? 'OPEN_LONG' : 'CLOSE_LONG')
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

            if (res.status === 'FILLED') {
                setSuccess(`Order ${res.orderId} filled at ₹${res.avgFillPrice?.toLocaleString()}!`);
            } else {
                setSuccess(`Order ${res.orderId} placed successfully!`);
            }

            // Refresh holdings
            fetchHoldings();

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
        <Paper id="trade-panel" elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Stack spacing={2}>


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



                {/* Short Selling Toggle */}
                {instrument.isShortable && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={shortMode}
                                    onChange={(e) => handleShortModeChange(e.target.checked)}
                                    size="small"
                                    color="warning"
                                />
                            }
                            label={
                                <Typography variant="caption" fontWeight={600} color={shortMode ? 'warning.main' : 'text.secondary'}>
                                    Short Sell Mode
                                </Typography>
                            }
                        />
                    </Box>
                )}

                <ShortSellWarning
                    open={showRiskWarning}
                    onClose={handleRiskAccept}
                />

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
                            '&.Mui-selected': {
                                bgcolor: shortMode ? 'success.main' : 'success.main',
                                color: 'white',
                                '&:hover': { bgcolor: shortMode ? 'success.dark' : 'success.dark' }
                            }
                        }}
                    >
                        <BuyIcon sx={{ mr: 1, fontSize: 18 }} /> {shortMode ? 'COVER (BUY)' : 'BUY'}
                    </ToggleButton>
                    <ToggleButton
                        value="SELL"
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: shortMode ? 'error.main' : 'error.main',
                                color: 'white',
                                '&:hover': { bgcolor: shortMode ? 'error.dark' : 'error.dark' }
                            }
                        }}
                    >
                        <SellIcon sx={{ mr: 1, fontSize: 18 }} /> {shortMode ? 'SHORT (SELL)' : 'SELL'}
                    </ToggleButton>
                </ToggleButtonGroup>


                {/* SECTION 2: Order Type Selection */}
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

                {/* Quantity Input - Moved after order type selection */}
                <Box>
                    <TextField
                        fullWidth
                        label="Quantity"
                        type="number"
                        size="small"
                        value={quantity}
                        onChange={(e) => {
                            // Only allow integers
                            const value = e.target.value;
                            if (value === '' || /^\d+$/.test(value)) {
                                setQuantity(value);
                            }
                        }}
                        inputProps={{
                            step: 1,
                            min: 0
                        }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Qty</InputAdornment>,
                        }}
                    />
                </Box>

                {/* Validity Selection */}
                <FormControl fullWidth size="small">
                    <InputLabel>Validity</InputLabel>
                    <Select
                        value={validity}
                        label="Validity"
                        onChange={(e) => setValidity(e.target.value as any)}
                    >
                        <MenuItem value="DAY">DAY (Standard)</MenuItem>
                        <MenuItem value="IOC">IOC (Immediate or Cancel)</MenuItem>
                        <MenuItem value="GTC" disabled={orderType === 'MARKET'}>
                            GTC (Good Til Cancelled) {orderType === 'MARKET' && '- N/A for Market'}
                        </MenuItem>
                    </Select>
                </FormControl>

                {/* Compact Input Fields */}
                <Stack spacing={1.5}>
                    {/* Price input for LIMIT orders */}
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
                            InputProps={{
                                startAdornment: <InputAdornment position="start">₹</InputAdornment>,
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

                {/* Margin / Proceeds Display */}
                {estValue > 0 && (
                    <Box sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">Est. Value</Typography>
                            <Typography variant="body2">₹{estValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">Est. Fees</Typography>
                            <Typography variant="body2">₹{(fees).toLocaleString(undefined, { maximumFractionDigits: 2 })}</Typography>
                        </Stack>

                        {/* Divider */}
                        <Box sx={{ my: 0.5, borderTop: '1px dashed', borderColor: 'divider' }} />

                        {side === 'BUY' || (side === 'SELL' && shortMode) ? (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" fontWeight={600}>Required Margin</Typography>
                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                    ₹{requiredMargin.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Stack>
                        ) : (
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="caption" fontWeight={600}>Net Proceeds</Typography>
                                <Typography variant="body2" fontWeight={700} color="success.main">
                                    ₹{(estValue - fees).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                </Typography>
                            </Stack>
                        )}
                    </Box>
                )}

                {/* SECTION 3: Inline Validation Warnings */}
                {validationWarnings.length > 0 && (
                    <Stack spacing={0.5}>
                        {validationWarnings.map((warning, idx) => (
                            <Typography
                                key={idx}
                                variant="caption"
                                sx={{
                                    color: warning.startsWith('❌') ? 'error.main' : 'warning.main',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5
                                }}
                            >
                                {warning}
                            </Typography>
                        ))}
                    </Stack>
                )}



                <Tooltip
                    title={
                        liveInterpretation ? (
                            <Box>
                                <Typography variant="caption" fontWeight={600} display="block" sx={{ mb: 0.5 }}>
                                    💡 What This Order Will Do
                                </Typography>
                                <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                                    Current Price: ₹{ltp.toFixed(2)}
                                </Typography>
                                <Typography variant="caption">
                                    {liveInterpretation}
                                </Typography>
                            </Box>
                        ) : ''
                    }
                    arrow
                    placement="top"
                >
                    <span style={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            color={side === 'BUY' ? 'success' : 'error'}
                            disabled={!isValid || isLoading}
                            onClick={handlePlaceOrder}
                            sx={{ py: 1.5, fontWeight: 700 }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                `PLACE ${side} ${orderType === 'STOP_LIMIT' ? 'STOP-LIMIT' : orderType === 'TRAILING_STOP' ? 'TRAILING STOP' : orderType} ORDER`
                            )}
                        </Button>
                    </span>
                </Tooltip>

                {/* Toast Notifications */}
                <Snackbar
                    open={!!success || !!error}
                    autoHideDuration={success ? 3000 : 5000}
                    onClose={() => {
                        setSuccess(null);
                        setError(null);
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => {
                            setSuccess(null);
                            setError(null);
                        }}
                        severity={success ? 'success' : 'error'}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {success || error}
                    </Alert>
                </Snackbar>
            </Stack>
        </Paper>
    );
};
