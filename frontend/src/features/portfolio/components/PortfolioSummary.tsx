import React, { useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    useTheme,
    alpha,
    Divider,
    Grid,
    LinearProgress,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { Holding } from '../services/portfolioService';

interface PortfolioSummaryProps {
    totalEquity: number;
    totalHoldingsValue: number;
    cashBalance: number;
    blockedMargin: number;
    totalPL: number;
    totalPLPercent: number;
    realizedPL: number;
    holdings: Holding[];
    marketPrices?: Record<string, number>;
    freeCash: number;
    marginCash: number;
    shortProceeds?: number;
    settlementPending: number;
    holdingsCount?: number; // Added missing prop
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
    totalEquity = 0,
    totalHoldingsValue = 0,
    cashBalance = 0,
    blockedMargin = 0,
    totalPL = 0,
    totalPLPercent = 0,
    realizedPL = 0,
    holdings = [],
    marketPrices = {},
    freeCash = 0,
    marginCash = 0,
    shortProceeds = 0,
    settlementPending = 0,
    holdingsCount = 0,
}) => {
    // ... existing code ...

    const theme = useTheme();
    const isUnrealizedProfit = totalPL >= 0;
    const isRealizedProfit = realizedPL >= 0;

    // Calculate metrics
    const { shortLiability, longValue, shortPositions, longPositions } = useMemo(() => {
        let liability = 0;
        let longVal = 0;
        let shorts = 0;
        let longs = 0;

        holdings.forEach((h) => {
            const ltp = marketPrices[h.instrumentId] || h.avgEntryPrice;
            const value = ltp * h.quantity;

            if (h.positionType === 'SHORT') {
                liability -= value;
                shorts++;
            } else {
                longVal += value;
                longs++;
            }
        });

        return { shortLiability: liability, longValue: longVal, shortPositions: shorts, longPositions: longs };
    }, [holdings, marketPrices]);

    const hasShortPositions = shortLiability < 0;
    const risk5 = Math.abs(shortLiability) * 0.05;
    const risk10 = Math.abs(shortLiability) * 0.10;
    const marginCallTrigger = blockedMargin * 0.8;
    const bufferRemaining = marginCallTrigger;
    const bufferPercent = blockedMargin > 0 ? (bufferRemaining / marginCallTrigger) * 100 : 100;
    const isLowBuffer = bufferPercent < 30;
    const isCriticalBuffer = bufferPercent < 15;

    return (
        <Box>
            {/* ROW 1: Compact Portfolio Snapshot */}
            <Paper elevation={0} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={3}>
                        <Tooltip title="Net Worth = Total Cash + Long Holdings - Short Liability. Total absolute value of your equity." arrow placement="top">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                                Net Worth
                            </Typography>
                        </Tooltip>
                        <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                            ₹{totalEquity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color={isUnrealizedProfit ? 'success.main' : 'error.main'} fontWeight={600} sx={{ fontSize: '0.65rem' }}>
                            {isUnrealizedProfit ? '+' : '-'}₹{Math.abs(totalPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Tooltip title="Cash available for new trades or withdrawals. Total Cash - Margin Used - Pending." arrow placement="top">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                                Free Cash
                            </Typography>
                        </Tooltip>
                        <Typography variant="body1" fontWeight={700} color="success.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                            ₹{freeCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            Withdrawable
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Tooltip title="Cash blocked to support your active short positions." arrow placement="top">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                                Margin Used
                            </Typography>
                        </Tooltip>
                        <Typography variant="body1" fontWeight={700} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                            ₹{marginCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            Locked
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Tooltip title="Current market value of borrowed shares. This is a debt that increases if prices rise." arrow placement="top">
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                                Short Risk
                            </Typography>
                        </Tooltip>
                        <Typography variant="body1" fontWeight={700} color="error.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                            ₹{Math.abs(shortLiability).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            Liability
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {/* ROW 2: Equity Breakdown + Cash Details */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                            Equity Breakdown
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                            <Tooltip title="Total ledger balance including blocked margin and pending settlements." placement="left" arrow>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', cursor: 'help' }}>Cash</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{cashBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                            <Tooltip title="Current market value of stocks you own (buy positions)." placement="left" arrow>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', cursor: 'help' }}>Long Holdings</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{longValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                        {hasShortPositions && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                                <Tooltip title="Value of stocks you've shorted. This amount is subtracted from your equity." placement="left" arrow>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', cursor: 'help' }}>Short Liability</Typography>
                                </Tooltip>
                                <Typography variant="body2" fontWeight={600} color="error.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                    -₹{Math.abs(shortLiability).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        )}
                        <Divider sx={{ my: 0.5 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                            <Tooltip title="Total profit or loss on current active positions based on live market prices." placement="left" arrow>
                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem', cursor: 'help' }}>Unrealized P&L</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={700} color={isUnrealizedProfit ? 'success.main' : 'error.main'} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                {isUnrealizedProfit ? '+' : '-'}₹{Math.abs(totalPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                            <Tooltip title="Profit or loss from trades that have been closed (squared off)." placement="left" arrow>
                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem', cursor: 'help' }}>Realized P&L</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={700} color={isRealizedProfit ? 'success.main' : 'error.main'} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                {isRealizedProfit ? '+' : '-'}₹{Math.abs(realizedPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={0} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                            Cash & Liquidity
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                            <Tooltip title="Absolute ledger balance (Free Cash + Margin + Short Proceeds + Pending)." placement="left" arrow>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem', cursor: 'help' }}>Total Cash</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={600} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{cashBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, pl: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>• Free Cash</Typography>
                            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.75rem' }}>
                                ₹{freeCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, pl: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>• Margin</Typography>
                            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.75rem' }}>
                                ₹{marginCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>

                        {/* Short Proceeds Line */}
                        {shortProceeds > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, pl: 2 }}>
                                <Tooltip title="Cash generated from short selling. This is held as collateral and not withdrawable." placement="left" arrow>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', cursor: 'help' }}>• Short Proceeds</Typography>
                                </Tooltip>
                                <Typography variant="body2" color="text.primary" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.75rem' }}>
                                    ₹{shortProceeds.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, pl: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>• Pending</Typography>
                            <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.75rem' }}>
                                ₹{settlementPending.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 0.5 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                            <Tooltip title="Buying power for new trades. Matches your Free Cash." placement="left" arrow>
                                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem', cursor: 'help' }}>Available to Trade</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={700} color="success.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{freeCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* ROW 3: Risk Center (if short positions exist) */}
            {hasShortPositions && (
                <Paper elevation={0} sx={{ p: 1.25, border: '2px solid', borderColor: 'warning.main', borderRadius: 1, bgcolor: alpha(theme.palette.warning.main, 0.02) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.75 }}>
                        <WarningIcon sx={{ color: 'warning.main', fontSize: 18 }} />
                        <Typography variant="subtitle2" fontWeight={700} color="warning.main" sx={{ fontSize: '0.8rem' }}>
                            SHORT RISK & MARGIN HEALTH
                        </Typography>
                        <Chip label={`${shortPositions} Short${shortPositions > 1 ? 's' : ''}`} size="small" sx={{ height: 18, fontSize: '0.65rem' }} />
                    </Box>
                    <Grid container spacing={1.5} sx={{ mb: 0.75 }}>
                        <Grid item xs={4}>
                            <Tooltip title="Current market value of your short debt." arrow>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', cursor: 'help' }}>Liability</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={700} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{Math.abs(shortLiability).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Tooltip title="Estimated additional loss if shorted stocks rise by 5%." arrow>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', cursor: 'help' }}>+5% Risk</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={700} color="warning.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{risk5.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Tooltip title="Probability of significant loss if market rallies 10% against your shorts." arrow>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', cursor: 'help' }}>+10% Risk</Typography>
                            </Tooltip>
                            <Typography variant="body2" fontWeight={700} color="error.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                                ₹{risk10.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                MARGIN BUFFER
                            </Typography>
                            <Chip
                                label={`${bufferPercent.toFixed(0)}%`}
                                size="small"
                                sx={{
                                    height: 16,
                                    fontSize: '0.6rem',
                                    fontWeight: 700,
                                    bgcolor: isCriticalBuffer ? 'error.main' : isLowBuffer ? 'warning.main' : 'success.main',
                                    color: 'white'
                                }}
                            />
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={Math.max(0, Math.min(100, bufferPercent))}
                            sx={{
                                height: 5,
                                borderRadius: 1,
                                bgcolor: 'grey.200',
                                mb: 0.4,
                                '& .MuiLinearProgress-bar': {
                                    bgcolor: isCriticalBuffer ? 'error.main' : isLowBuffer ? 'warning.main' : 'success.main',
                                }
                            }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            ₹{bufferRemaining.toLocaleString('en-IN', { maximumFractionDigits: 2 })} remaining • Trigger: ₹{marginCallTrigger.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};
