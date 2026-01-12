import { Box, Paper, Typography, Grid, alpha, useTheme } from '@mui/material';
import {
    TrendingUp as GainIcon,
    TrendingDown as LossIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SmartStock } from '../services/dashboardService';

interface MarketPulseProps {
    topGainers: SmartStock[];
    topLosers: SmartStock[];
}

export function MarketPulse({ topGainers, topLosers }: MarketPulseProps) {
    const theme = useTheme();
    const navigate = useNavigate();

    const handleStockClick = (instrumentId: string) => {
        navigate(`/instruments/${instrumentId}`);
    };

    const renderStock = (stock: SmartStock, isGainer: boolean) => (
        <Box
            key={stock.symbol}
            onClick={() => handleStockClick(stock.instrumentId)}
            sx={{
                p: 2,
                mb: 1,
                borderRadius: 2,
                bgcolor: alpha(
                    isGainer ? theme.palette.success.main : theme.palette.error.main,
                    0.05
                ),
                border: '1px solid',
                borderColor: alpha(
                    isGainer ? theme.palette.success.main : theme.palette.error.main,
                    0.2
                ),
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                    bgcolor: alpha(
                        isGainer ? theme.palette.success.main : theme.palette.error.main,
                        0.1
                    ),
                    transform: 'translateX(4px)',
                    boxShadow: 1,
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={700}>
                    {stock.symbol}
                </Typography>
                <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color={isGainer ? 'success.main' : 'error.main'}
                >
                    {isGainer ? '▲' : '▼'} {Math.abs(stock.changePct).toFixed(2)}%
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="caption" color="text.secondary">
                    ₹{stock.lastPrice.toFixed(2)}
                </Typography>
                {stock.volumeSurge > 0 && (
                    <Typography variant="caption" color="primary.main">
                        Vol +{stock.volumeSurge.toFixed(0)}%
                    </Typography>
                )}
                <Typography variant="caption" color="text.secondary">
                    {stock.vwapDistance} VWAP
                </Typography>
                {stock.breakoutFlag && (
                    <Typography
                        variant="caption"
                        sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                            color: 'warning.main',
                        }}
                    >
                        {stock.breakoutFlag}
                    </Typography>
                )}
                {stock.newsFlag && (
                    <Typography variant="caption">📰 {stock.newsFlag}</Typography>
                )}
            </Box>
        </Box>
    );

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
            }}
        >
            <Typography variant="h6" gutterBottom fontWeight={700}>
                🔥 Market Pulse
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <GainIcon color="success" />
                        <Typography variant="subtitle1" fontWeight={600}>
                            Top Gainers
                        </Typography>
                    </Box>
                    {topGainers.length > 0 ? (
                        topGainers.map((stock) => renderStock(stock, true))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No data available
                        </Typography>
                    )}
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <LossIcon color="error" />
                        <Typography variant="subtitle1" fontWeight={600}>
                            Top Losers
                        </Typography>
                    </Box>
                    {topLosers.length > 0 ? (
                        topLosers.map((stock) => renderStock(stock, false))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No data available
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
}
