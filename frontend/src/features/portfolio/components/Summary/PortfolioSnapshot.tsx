import React from 'react';
import { Grid, Paper, Typography, Tooltip } from '@mui/material';

interface PortfolioSnapshotProps {
    totalEquity: number;
    totalPL: number;
    freeCash: number;
    marginCash: number;
    shortLiability: number;
}

export const PortfolioSnapshot: React.FC<PortfolioSnapshotProps> = ({
    totalEquity, totalPL, freeCash, marginCash, shortLiability
}) => {
    const isUnrealizedProfit = totalPL >= 0;

    return (
        <Paper elevation={0} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1 }}>
            <Grid container spacing={1.5}>
                <Grid item xs={3}>
                    <Tooltip title="Net Worth = Total Cash + Long Holdings - Short Liability." arrow placement="top">
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
                    <Tooltip title="Cash available for new trades or withdrawals." arrow placement="top">
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                            Free Cash
                        </Typography>
                    </Tooltip>
                    <Typography variant="body1" fontWeight={700} color="success.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                        ₹{freeCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Withdrawable</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Tooltip title="Cash blocked to support your active positions." arrow placement="top">
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                            Margin Used
                        </Typography>
                    </Tooltip>
                    <Typography variant="body1" fontWeight={700} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                        ₹{marginCash.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Locked</Typography>
                </Grid>
                <Grid item xs={3}>
                    <Tooltip title="Current market value of borrowed shares." arrow placement="top">
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', mb: 0.25, cursor: 'help' }}>
                            Short Risk
                        </Typography>
                    </Tooltip>
                    <Typography variant="body1" fontWeight={700} color="error.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.95rem' }}>
                        ₹{Math.abs(shortLiability).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Liability</Typography>
                </Grid>
            </Grid>
        </Paper>
    );
};
