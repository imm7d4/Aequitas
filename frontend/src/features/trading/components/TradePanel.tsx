import React, { useState, useMemo } from 'react';
import {
    Box, Paper, ToggleButtonGroup, ToggleButton,
    Button, Stack, CircularProgress, Tooltip,
    Snackbar, Alert, useTheme, alpha, Typography
} from '@mui/material';
import {
    TrendingUp as BuyIcon,
    TrendingDown as SellIcon
} from '@mui/icons-material';
import { Instrument } from '@/features/instruments/types/instrument.types';
import { ShortSellWarning } from './ShortSellWarning';
import { TradePanelHeader } from './TradePanelHeader';
import { OrderConfigurationSection } from './OrderConfigurationSection';
import { TradeReceiptSection } from './TradeReceiptSection';
import { useTradePanel } from '../hooks/useTradePanel';
import { formatCurrency } from '../../../shared/utils/formatters';
import { 
    ORDER_SIDE, ORDER_TYPE,
    OrderSide, TradingIntent
} from '@/shared/constants/AppConstants';

interface TradePanelProps {
    instrument: Instrument;
    ltp: number;
    initialSide?: OrderSide;
    initialQuantity?: number;
    initialIntent?: TradingIntent;
}

export const TradePanel: React.FC<TradePanelProps> = ({ 
    instrument, ltp, initialSide = ORDER_SIDE.BUY, initialQuantity, initialIntent 
}) => {
    const theme = useTheme();
    const trade = useTradePanel(instrument, ltp, initialSide, initialQuantity, initialIntent);

    // Short Selling Risk Warning
    const [showRiskWarning, setShowRiskWarning] = useState(false);
    const [riskAccepted, setRiskAccepted] = useState(() => localStorage.getItem('shortSellRiskAccepted') === 'true');

    const handleShortModeChange = (enabled: boolean) => {
        if (enabled && !riskAccepted) setShowRiskWarning(true);
        else trade.setShortMode(enabled);
    };

    const handleRiskAccept = (accepted: boolean) => {
        setShowRiskWarning(false);
        if (accepted) {
            setRiskAccepted(true);
            localStorage.setItem('shortSellRiskAccepted', 'true');
            trade.setShortMode(true);
        }
    };

    const liveInterpretation = useMemo(() => {
        if (trade.orderType === ORDER_TYPE.MARKET) return `Executes immediately at ~${formatCurrency(ltp)}`;
        if (trade.orderType === ORDER_TYPE.LIMIT) {
            const p = parseFloat(trade.price);
            return isNaN(p) ? null : `Executes when price reaches ${formatCurrency(p)} or better`;
        }
        return "Advanced order will trigger based on conditions";
    }, [trade.orderType, trade.price, ltp]);

    const isValid = useMemo(() => {
        const qty = parseInt(trade.quantity);
        return !isNaN(qty) && qty > 0 && qty % instrument.lotSize === 0;
    }, [trade.quantity, instrument.lotSize]);

    return (
        <Paper id="trade-panel" elevation={0} sx={{
            p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)'
        }}>
            <Stack spacing={2}>
                <TradePanelHeader 
                    symbol={instrument.symbol}
                    isShortable={!!instrument.isShortable}
                    shortMode={trade.shortMode}
                    onShortModeChange={handleShortModeChange}
                    advancedMode={trade.advancedMode}
                    onAdvancedModeToggle={() => trade.setAdvancedMode(!trade.advancedMode)}
                />

                <ShortSellWarning open={showRiskWarning} onClose={handleRiskAccept} />

                <ToggleButtonGroup
                    fullWidth value={trade.side} exclusive
                    onChange={(_, v) => v && trade.setSide(v as OrderSide)}
                    sx={{ p: 0.5, bgcolor: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: 'none' }}
                >
                    <ToggleButton value={ORDER_SIDE.BUY} sx={{ '&.Mui-selected': { bgcolor: 'success.main', color: 'white' } }}>
                        <BuyIcon sx={{ mr: 1, fontSize: 18 }} /> {trade.shortMode ? 'COVER' : 'BUY'}
                    </ToggleButton>
                    <ToggleButton value={ORDER_SIDE.SELL} sx={{ '&.Mui-selected': { bgcolor: 'error.main', color: 'white' } }}>
                        <SellIcon sx={{ mr: 1, fontSize: 18 }} /> {trade.shortMode ? 'SHORT' : 'SELL'}
                    </ToggleButton>
                </ToggleButtonGroup>

                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 1, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' }}>
                        Order Configuration
                    </Typography>
                    <OrderConfigurationSection 
                        {...trade}
                        onOrderTypeChange={trade.setOrderType}
                        onQuantityChange={trade.setQuantity}
                        onPriceChange={trade.setPrice}
                        onStopPriceChange={trade.setStopPrice}
                        onLimitPriceChange={trade.setLimitPrice}
                        onTrailAmountChange={trade.setTrailAmount}
                        onTrailTypeChange={trade.setTrailType}
                        onValidityChange={trade.setValidity}
                    />
                </Box>

                <TradeReceiptSection 
                    estValue={trade.estValue}
                    fees={trade.fees}
                    side={trade.side}
                    shortMode={trade.shortMode}
                    requiredMargin={trade.requiredMargin}
                />

                <Tooltip title={liveInterpretation || ''} arrow placement="top">
                    <Box>
                        <Button
                            fullWidth variant="contained" size="large"
                            color={trade.side === ORDER_SIDE.BUY ? 'success' : 'error'}
                            disabled={!isValid || trade.isLoading}
                            onClick={trade.handlePlaceOrder}
                            sx={{
                                py: 1.4, fontWeight: 900, borderRadius: '12px',
                                boxShadow: `0 6px 12px ${alpha(trade.side === ORDER_SIDE.BUY ? theme.palette.success.main : theme.palette.error.main, 0.2)}`
                            }}
                        >
                            {trade.isLoading ? <CircularProgress size={24} color="inherit" /> : `${trade.side} ${instrument.symbol}`}
                        </Button>
                    </Box>
                </Tooltip>

                <Snackbar
                    open={!!trade.success || !!trade.error}
                    autoHideDuration={trade.success ? 3000 : 5000}
                    onClose={() => { trade.setSuccess(null); trade.setError(null); }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert severity={trade.success ? 'success' : 'error'} variant="filled" sx={{ borderRadius: 2 }}>
                        {trade.success || trade.error}
                    </Alert>
                </Snackbar>
            </Stack>
        </Paper>
    );
};
