import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

interface LiquidityDetailsProps {
    cashBalance: number;
    freeCash: number;
    marginCash: number;
    shortProceeds: number;
    settlementPending: number;
}

export const LiquidityDetails: React.FC<LiquidityDetailsProps> = ({
    cashBalance, freeCash, marginCash, shortProceeds, settlementPending
}) => {
    return (
        <Paper elevation={0} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                Cash & Liquidity
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>Total Cash</Typography>
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

            {shortProceeds > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4, pl: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>• Short Proceeds</Typography>
                    <Typography variant="body2" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.75rem' }}>
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
                <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>Available to Trade</Typography>
                <Typography variant="body2" fontWeight={700} color="success.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                    ₹{freeCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                </Typography>
            </Box>
        </Paper>
    );
};
