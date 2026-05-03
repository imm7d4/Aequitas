import React from 'react';
import { Box, Typography, Paper, Grid, Chip, LinearProgress, alpha, useTheme } from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';

interface RiskCenterProps {
    shortLiability: number;
    shortPositions: number;
    blockedMargin: number;
}

export const RiskCenter: React.FC<RiskCenterProps> = ({
    shortLiability, shortPositions, blockedMargin
}) => {
    const theme = useTheme();
    const risk5 = Math.abs(shortLiability) * 0.05;
    const risk10 = Math.abs(shortLiability) * 0.10;
    const marginCallTrigger = blockedMargin * 0.8;
    const bufferRemaining = marginCallTrigger;
    const bufferPercent = blockedMargin > 0 ? (bufferRemaining / marginCallTrigger) * 100 : 100;
    const isLowBuffer = bufferPercent < 30;
    const isCriticalBuffer = bufferPercent < 15;

    return (
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
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>Liability</Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                        ₹{Math.abs(shortLiability).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>+5% Risk</Typography>
                    <Typography variant="body2" fontWeight={700} color="warning.main" sx={{ fontFamily: '"Roboto Mono", monospace', fontSize: '0.8rem' }}>
                        ₹{risk5.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>+10% Risk</Typography>
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
    );
};
