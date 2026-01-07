import React from 'react';
import { Box, Card, CardContent, Grid, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PieChartIcon from '@mui/icons-material/PieChart';

interface PortfolioSummaryProps {
    totalEquity: number;
    totalHoldingsValue: number;
    cashBalance: number;
    totalPL: number; // This is Unrealized P&L
    totalPLPercent: number; // This is Unrealized %
    realizedPL: number; // New prop
    holdingsCount: number;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
    totalEquity = 0,
    totalHoldingsValue = 0,
    cashBalance = 0,
    totalPL = 0,
    totalPLPercent = 0,
    realizedPL = 0,
    holdingsCount = 0,
}) => {
    const theme = useTheme();
    const isProfit = totalPL >= 0;
    const isRealizedProfit = realizedPL >= 0;

    return (
        <Grid container spacing={2}>
            {/* Row 1: Key Balances */}
            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', border: 1, borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                                <AccountBalanceWalletIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary">Total Equity</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={800}>
                            ₹{totalEquity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Cash + Holdings
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', border: 1, borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.warning.main, 0.1) }}>
                                <AccountBalanceWalletIcon sx={{ fontSize: 20, color: 'warning.main' }} />
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary">Cash Balance</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={800}>
                            ₹{cashBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Available to Trade
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%', border: 1, borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(theme.palette.info.main, 0.1) }}>
                                <PieChartIcon sx={{ fontSize: 20, color: 'info.main' }} />
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary">Holdings Value</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={800}>
                            ₹{totalHoldingsValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {holdingsCount} Active Positions
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* Row 2: Performance */}
            <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', border: 1, borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(isProfit ? theme.palette.success.main : theme.palette.error.main, 0.1) }}>
                                {isProfit ? (
                                    <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 20, color: 'error.main' }} />
                                )}
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary">Unrealized P&L</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={800} color={isProfit ? 'success.main' : 'error.main'}>
                            {isProfit ? '+' : ''}₹{totalPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color={isProfit ? 'success.main' : 'error.main'}>
                            {isProfit ? '+' : ''}{totalPLPercent.toFixed(2)}% Return
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', border: 1, borderColor: 'divider', boxShadow: 'none' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                            <Box sx={{ p: 0.5, borderRadius: 1, bgcolor: alpha(isRealizedProfit ? theme.palette.success.main : theme.palette.error.main, 0.1) }}>
                                {isRealizedProfit ? (
                                    <TrendingUpIcon sx={{ fontSize: 20, color: 'success.main' }} />
                                ) : (
                                    <TrendingDownIcon sx={{ fontSize: 20, color: 'error.main' }} />
                                )}
                            </Box>
                            <Typography variant="subtitle2" color="text.secondary">Realized P&L</Typography>
                        </Box>
                        <Typography variant="h5" fontWeight={800} color={isRealizedProfit ? 'success.main' : 'error.main'}>
                            {isRealizedProfit ? '+' : ''}₹{realizedPL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Lifetime Booked Profit
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};
