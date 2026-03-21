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
    Snackbar,
    Alert,
    Switch,
    useTheme,
    alpha,
    Divider,
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
import { formatCurrency } from '../../../shared/utils/formatters';

interface TradePanelProps {
    instrument: Instrument;
    ltp: number;
    initialSide?: 'BUY' | 'SELL';
    initialQuantity?: number;
    initialIntent?: 'OPEN_LONG' | 'OPEN_SHORT' | 'CLOSE_LONG' | 'CLOSE_SHORT';
}

export const TradePanel: React.FC<TradePanelProps> = ({ instrument, ltp, initialSide = 'BUY', initialQuantity, initialIntent }) => {
    const theme = useTheme();
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
                    warnings.push(`⚠ Stop price must be ABOVE current price (${formatCurrency(ltp)}) for BUY orders`);
                } else if (side === 'SELL' && sp >= ltp) {
                    warnings.push(`⚠ Stop price must be BELOW current price (${formatCurrency(ltp)}) for SELL orders`);
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
            return `Order will execute immediately at best available price (around ${formatCurrency(ltp)})`;
        }

        if (orderType === 'LIMIT') {
            const p = parseFloat(price);
            if (isNaN(p)) return null;
            return side === 'BUY'
                ? `Order will execute when price falls to ${formatCurrency(p)} or better`
                : `Order will execute when price rises to ${formatCurrency(p)} or better`;
        }

        if (orderType === 'STOP') {
            const sp = parseFloat(stopPrice);
            if (isNaN(sp)) return null;
            return side === 'BUY'
                ? `When price rises to ${formatCurrency(sp)}, system will place a MARKET BUY order`
                : `When price falls to ${formatCurrency(sp)}, system will place a MARKET SELL order`;
        }

        if (orderType === 'STOP_LIMIT') {
            const sp = parseFloat(stopPrice);
            const lp = parseFloat(limitPrice);
            if (isNaN(sp) || isNaN(lp)) return null;
            return side === 'BUY'
                ? `When price rises to ${formatCurrency(sp)}, system will try to buy at ${formatCurrency(lp)} or better. ⚠ Fast breakout may skip your order.`
                : `When price falls to ${formatCurrency(sp)}, system will try to sell at ${formatCurrency(lp)} or better. ⚠ Fast breakdown may skip your order.`;
        }

        if (orderType === 'TRAILING_STOP') {
            const ta = parseFloat(trailAmount);
            if (isNaN(ta)) return null;
            const trailText = trailType === 'PERCENTAGE' ? `${ta}%` : formatCurrency(ta);
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
                setSuccess(`Order ${res.orderId} filled at ${formatCurrency(res.avgFillPrice || 0)}!`);
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
        <Paper
            id="trade-panel"
            elevation={0}
            sx={{
                p: 2, // Reduced from 3
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3, // Slightly smaller radius
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
            }}
        >
            <Stack spacing={2}> {/* Reduced from 3 */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                    <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                        Trade {instrument.symbol}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
                        {instrument.isShortable && (
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Typography
                                    variant="caption"
                                    fontWeight={700}
                                    color={shortMode ? 'warning.main' : 'text.secondary'}
                                    sx={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}
                                >
                                    {advancedMode ? 'Short' : 'Short Mode'}
                                </Typography>
                                <Switch
                                    checked={shortMode}
                                    onChange={(e) => handleShortModeChange(e.target.checked)}
                                    size="small"
                                    color="warning"
                                    sx={{
                                        padding: 0,
                                        width: 32,
                                        height: 18,
                                        '& .MuiSwitch-switchBase': {
                                            padding: 0,
                                            margin: '2px',
                                            transitionDuration: '300ms',
                                            '&.Mui-checked': {
                                                transform: 'translateX(14px)',
                                                color: '#fff',
                                                '& + .MuiSwitch-track': {
                                                    opacity: 1,
                                                    border: 0,
                                                },
                                            },
                                        },
                                        '& .MuiSwitch-thumb': {
                                            boxSizing: 'border-box',
                                            width: 14,
                                            height: 14,
                                        },
                                        '& .MuiSwitch-track': {
                                            borderRadius: 18 / 2,
                                            backgroundColor: 'rgba(0,0,0,0.1)',
                                            opacity: 1,
                                        },
                                    }}
                                />
                            </Stack>
                        )}

                        <Chip
                            icon={<AdvancedIcon sx={{ fontSize: '14px !important' }} />}
                            label={advancedMode ? 'Advanced' : 'Basic'}
                            onClick={() => {
                                setAdvancedMode(!advancedMode);
                                if (advancedMode) {
                                    setOrderType('LIMIT');
                                }
                            }}
                            size="small"
                            sx={{
                                cursor: 'pointer',
                                fontWeight: 700,
                                borderRadius: '8px',
                                bgcolor: advancedMode ? 'primary.main' : 'rgba(0,0,0,0.05)',
                                color: advancedMode ? 'white' : 'text.primary',
                                '&:hover': { bgcolor: advancedMode ? 'primary.dark' : 'rgba(0,0,0,0.1)' }
                            }}
                        />
                    </Box>
                </Box>

                <ShortSellWarning
                    open={showRiskWarning}
                    onClose={handleRiskAccept}
                />

                <ToggleButtonGroup
                    fullWidth
                    value={side}
                    exclusive
                    onChange={(_, v) => v && setSide(v)}
                    sx={{
                        p: 0.5,
                        bgcolor: 'rgba(0,0,0,0.03)',
                        borderRadius: '12px',
                        border: 'none',
                        '& .MuiToggleButton-root': {
                            border: 'none',
                            borderRadius: '10px !important',
                            fontWeight: 800,
                            transition: 'all 0.2s ease',
                            '&.Mui-selected': {
                                color: 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }
                        }
                    }}
                >
                    <ToggleButton
                        value="BUY"
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: 'success.main',
                                '&:hover': { bgcolor: 'success.dark' }
                            }
                        }}
                    >
                        <BuyIcon sx={{ mr: 1, fontSize: 18 }} /> {shortMode ? 'COVER' : 'BUY'}
                    </ToggleButton>
                    <ToggleButton
                        value="SELL"
                        sx={{
                            '&.Mui-selected': {
                                bgcolor: 'error.main',
                                '&:hover': { bgcolor: 'error.dark' }
                            }
                        }}
                    >
                        <SellIcon sx={{ mr: 1, fontSize: 18 }} /> {shortMode ? 'SHORT' : 'SELL'}
                    </ToggleButton>
                </ToggleButtonGroup>

                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Order Configuration
                    </Typography>
                    <Stack spacing={1.2}> {/* Reduced from 2 */}
                        <ToggleButtonGroup
                            fullWidth
                            value={['LIMIT', 'MARKET'].includes(orderType) ? orderType : ''}
                            exclusive
                            onChange={(_, v) => v && setOrderType(v)}
                            size="small"
                            sx={{
                                '& .MuiToggleButton-root': {
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    fontSize: '0.75rem'
                                }
                            }}
                        >
                            <ToggleButton value="LIMIT">LIMIT</ToggleButton>
                            <ToggleButton value="MARKET">MARKET</ToggleButton>
                        </ToggleButtonGroup>

                        {advancedMode && (
                            <FormControl fullWidth size="small">
                                <Select
                                    value={['STOP', 'STOP_LIMIT', 'TRAILING_STOP'].includes(orderType) ? orderType : ''}
                                    displayEmpty
                                    onChange={(e) => e.target.value && setOrderType(e.target.value as any)}
                                    sx={{ borderRadius: '8px', fontWeight: 600 }}
                                >
                                    <MenuItem value="" disabled>Advanced Order Type</MenuItem>
                                    <MenuItem value="STOP">STOP (MARKET)</MenuItem>
                                    <MenuItem value="STOP_LIMIT">STOP-LIMIT</MenuItem>
                                    <MenuItem value="TRAILING_STOP">TRAILING STOP</MenuItem>
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            fullWidth
                            label="Quantity"
                            type="number"
                            size="small"
                            value={quantity}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '' || /^\d+$/.test(value)) {
                                    setQuantity(value);
                                }
                            }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end" sx={{ fontWeight: 700, fontSize: '0.75rem' }}>QTY</InputAdornment>,
                                sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                            }}
                        />

                        {orderType === 'LIMIT' && (
                            <TextField
                                fullWidth
                                label="Limit Price"
                                type="number"
                                size="small"
                                value={price}
                                onChange={(e) => {
                                    setPrice(e.target.value);
                                    setIsPriceTouched(true);
                                }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                                }}
                            />
                        )}

                        {/* Combined Advanced Inputs */}
                        {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
                            <TextField
                                fullWidth
                                label="Trigger Price"
                                type="number"
                                size="small"
                                value={stopPrice}
                                onChange={(e) => setStopPrice(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                                }}
                                helperText={`Triggers when ${side === 'BUY' ? 'rises to' : 'falls to'}`}
                            />
                        )}

                        {orderType === 'STOP_LIMIT' && (
                            <TextField
                                fullWidth
                                label="Limit Price"
                                type="number"
                                size="small"
                                value={limitPrice}
                                onChange={(e) => setLimitPrice(e.target.value)}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                                    sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                                }}
                            />
                        )}

                        {orderType === 'TRAILING_STOP' && (
                            <Stack direction="row" spacing={1}>
                                <TextField
                                    fullWidth
                                    label="Trail Amount"
                                    type="number"
                                    size="small"
                                    value={trailAmount}
                                    onChange={(e) => setTrailAmount(e.target.value)}
                                    InputProps={{
                                        sx: { borderRadius: '8px', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }
                                    }}
                                />
                                <Select
                                    value={trailType}
                                    onChange={(e) => setTrailType(e.target.value as any)}
                                    size="small"
                                    sx={{ minWidth: 80, borderRadius: '8px', fontWeight: 700 }}
                                >
                                    <MenuItem value="PERCENTAGE">%</MenuItem>
                                    <MenuItem value="ABSOLUTE">₹</MenuItem>
                                </Select>
                            </Stack>
                        )}

                        <FormControl fullWidth size="small">
                            <Select
                                value={validity}
                                onChange={(e) => setValidity(e.target.value as any)}
                                sx={{ borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem' }}
                            >
                                <MenuItem value="DAY">DAY (Standard)</MenuItem>
                                <MenuItem value="IOC">IOC (Immediate or Cancel)</MenuItem>
                                <MenuItem value="GTC" disabled={orderType === 'MARKET'}>GTC (Good Til Cancelled)</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>

                {/* Digital Receipt / Margin Summary */}
                {estValue > 0 && (
                    <Box sx={{
                        p: 1.5, // Reduced from 2
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 2.5,
                        border: '1px solid',
                        borderColor: 'divider',
                        position: 'relative',
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            left: 12,
                            right: 12,
                            height: '1px',
                            borderTop: '1px dashed',
                            borderColor: 'divider',
                        },
                        '&::before': { top: 0 },
                        '&::after': { bottom: 0 }
                    }}>
                        <Stack spacing={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Est. Value</Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                    {formatCurrency(estValue)}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>Taxes & Charges</Typography>
                                <Typography variant="caption" fontWeight={800} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                    {formatCurrency(fees)}
                                </Typography>
                            </Box>
                            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase' }}>
                                    {side === 'BUY' || (side === 'SELL' && shortMode) ? 'Total Required' : 'Net Proceeds'}
                                </Typography>
                                <Typography variant="h6" fontWeight={900} color={side === 'BUY' || shortMode ? "primary.main" : "success.main"} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                                    {formatCurrency(side === 'BUY' || (side === 'SELL' && shortMode) ? requiredMargin : estValue - fees)}
                                </Typography>
                            </Box>
                        </Stack>
                    </Box>
                )}

                {validationWarnings.length > 0 && (
                    <Alert severity="warning" sx={{ borderRadius: 2, fontSize: '0.75rem', py: 0 }}>
                        {validationWarnings[0]}
                    </Alert>
                )}

                <Tooltip
                    title={liveInterpretation || ''}
                    arrow
                    placement="top"
                >
                    <Box>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            color={side === 'BUY' ? 'success' : 'error'}
                            disabled={!isValid || isLoading}
                            onClick={handlePlaceOrder}
                            sx={{
                                py: 1.4, // Reduced from 2
                                fontWeight: 900,
                                borderRadius: '12px',
                                fontSize: '0.9rem',
                                letterSpacing: '0.02em',
                                boxShadow: `0 6px 12px ${alpha(side === 'BUY' ? theme.palette.success.main : theme.palette.error.main, 0.2)}`,
                                '&:hover': {
                                    boxShadow: `0 10px 18px ${alpha(side === 'BUY' ? theme.palette.success.main : theme.palette.error.main, 0.3)}`,
                                }
                            }}
                        >
                            {isLoading ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                `${side} ${instrument.symbol}`
                            )}
                        </Button>
                    </Box>
                </Tooltip>

                <Snackbar
                    open={!!success || !!error}
                    autoHideDuration={success ? 3000 : 5000}
                    onClose={() => { setSuccess(null); setError(null); }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={success ? 'success' : 'error'} variant="filled" sx={{ borderRadius: 2 }}>
                        {success || error}
                    </Alert>
                </Snackbar>
            </Stack>
        </Paper>
    );
};
