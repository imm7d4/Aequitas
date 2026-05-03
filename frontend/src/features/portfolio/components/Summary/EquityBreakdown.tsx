import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

interface EquityBreakdownProps {
    cashBalance: number;
    longValue: number;
    shortLiability: number;
    totalPL: number;
    realizedPL: number;
}

export const EquityBreakdown: React.FC<EquityBreakdownProps> = ({
    cashBalance, longValue, shortLiability, totalPL, realizedPL
}) => {
    const isUnrealizedProfit = totalPL >= 0;
    const isRealizedProfit = realizedPL >= 0;

    return (
        <Paper elevation={0} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                Equity Breakdown
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Cash</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                    ₹{cashBalance.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Long Holdings</Typography>
                <Typography variant="body2" fontWeight={600} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                    ₹{longValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Typography>
            </Box>
            {shortLiability < 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Short Liability</Typography>
                    <Typography variant="body2" fontWeight={600} color="error.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                        -₹{Math.abs(shortLiability).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                </Box>
            )}
            <Divider sx={{ my: 0.5 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>Unrealized P&L</Typography>
                <Typography variant="body2" fontWeight={700} color={isUnrealizedProfit ? 'success.main' : 'error.main'} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                    {isUnrealizedProfit ? '+' : '-'}₹{Math.abs(totalPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>Realized P&L</Typography>
                <Typography variant="body2" fontWeight={700} color={isRealizedProfit ? 'success.main' : 'error.main'} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                    {isRealizedProfit ? '+' : '-'}₹{Math.abs(realizedPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Typography>
            </Box>
        </Paper>
    );
};
