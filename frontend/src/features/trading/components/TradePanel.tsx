import React, { useState, useCallback } from 'react';
import {
    Box, Paper,
    Button, Stack, Tooltip,
    Snackbar, Alert, useTheme, alpha, Typography, Theme, SxProps
} from '@mui/material';
import { Loader } from '@/shared/components/Loader';
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

import { TradeSideSelection } from './TradeSideSelection';

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

    const [showRiskWarning, setShowRiskWarning] = useState(false);
    const [riskAccepted, setRiskAccepted] = useState(() => localStorage.getItem('shortSellRiskAccepted') === 'true');

    const handleShortModeChange = useCallback((enabled: boolean) => {
        if (enabled && !riskAccepted) setShowRiskWarning(true);
        else trade.setShortMode(enabled);
    }, [riskAccepted, trade]);

    const handleRiskAccept = useCallback((accepted: boolean) => {
        setShowRiskWarning(false);
        if (accepted) {
            setRiskAccepted(true);
            localStorage.setItem('shortSellRiskAccepted', 'true');
            trade.setShortMode(true);
        }
    }, [trade]);

    // Simple derived values computed during render (aggressive useEffect/useMemo minimization)
    const isValid = parseInt(trade.quantity) > 0 && (parseInt(trade.quantity) % instrument.lotSize === 0);
    const isBuy = trade.side === ORDER_SIDE.BUY;

    const liveInterpretation = (() => {
        if (trade.orderType === ORDER_TYPE.MARKET) return `Executes immediately at ~${formatCurrency(ltp)}`;
        if (trade.orderType === ORDER_TYPE.LIMIT) {
            const p = parseFloat(trade.price);
            return isNaN(p) ? null : `Executes when price reaches ${formatCurrency(p)} or better`;
        }
        return "Advanced order will trigger based on conditions";
    })();

    return (
        <Paper id="trade-panel" elevation={0} sx={getPanelStyles(theme)}>
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

                <TradeSideSelection 
                    side={trade.side} 
                    shortMode={trade.shortMode} 
                    onSideChange={trade.setSide} 
                    theme={theme} 
                />

                <Box>
                    <Typography variant="caption" color="text.secondary" fontWeight={700} sx={SECTION_HEADER_STYLES as any}>
                        Order Configuration
                    </Typography>
                    <OrderConfigurationSection 
                        side={trade.side}
                        orderType={trade.orderType}
                        quantity={trade.quantity}
                        price={trade.price}
                        stopPrice={trade.stopPrice}
                        limitPrice={trade.limitPrice}
                        trailAmount={trade.trailAmount}
                        trailType={trade.trailType}
                        validity={trade.validity}
                        advancedMode={trade.advancedMode}
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
                            color={isBuy ? 'success' : 'error'}
                            disabled={!isValid || trade.isLoading}
                            onClick={trade.handlePlaceOrder}
                            sx={{
                                py: 1.4, fontWeight: 900, borderRadius: '12px',
                            } as any}
                        >
                            {trade.isLoading ? <Loader size="small" color="inherit" /> : `${trade.side} ${instrument.symbol}`}
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

const getPanelStyles = (theme: Theme): SxProps<Theme> => ({
    p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 3,
    background: theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : alpha(theme.palette.background.paper, 0.8),
    backdropFilter: 'blur(12px)',
    boxShadow: theme.palette.mode === 'light' ? '0 8px 32px rgba(0,0,0,0.04)' : '0 8px 32px rgba(0,0,0,0.4)'
});

const SECTION_HEADER_STYLES: SxProps<Theme> = { mb: 1, display: 'block', fontSize: '0.65rem', textTransform: 'uppercase' };

