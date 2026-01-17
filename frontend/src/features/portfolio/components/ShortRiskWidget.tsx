import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Stack,
    LinearProgress,
    Tooltip,
    alpha,
    useTheme,
    Chip
} from '@mui/material';
import {
    WarningAmber as WarningIcon,
    InfoOutlined as InfoIcon
} from '@mui/icons-material';
import { ShortRiskExposure } from '../services/portfolioService';

interface ShortRiskWidgetProps {
    exposure: ShortRiskExposure;
}

export const ShortRiskWidget: React.FC<ShortRiskWidgetProps> = ({ exposure }) => {
    const theme = useTheme();

    // Calculate buffer percentage
    const bufferPercent = exposure.marginCallTrigger > 0
        ? (exposure.availableBuffer / exposure.marginCallTrigger) * 100
        : 100;

    const isLowBuffer = bufferPercent < 30;
    const isCriticalBuffer = bufferPercent < 15;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 1.5,
                border: '1px solid',
                borderColor: isCriticalBuffer ? 'error.main' : isLowBuffer ? 'warning.main' : 'warning.light',
                borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, 0.02)
            }}
        >
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                {/* Left: Title & Current Liability */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Box>
                        <Typography variant="caption" fontWeight={700} color="warning.main" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Short Risk
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                            ₹{(exposure.currentLiability / 100000).toFixed(2)}L
                        </Typography>
                    </Box>
                </Box>

                {/* Middle: Risk Scenarios */}
                <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                    <Tooltip title="Additional loss if prices rise 5%" arrow>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                +5% Risk
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="warning.main" sx={{ fontSize: '0.8rem' }}>
                                ₹{(exposure.risk5Percent / 100000).toFixed(2)}L
                            </Typography>
                        </Box>
                    </Tooltip>
                    <Tooltip title="Additional loss if prices rise 10%" arrow>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                +10% Risk
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="error.main" sx={{ fontSize: '0.8rem' }}>
                                ₹{(exposure.risk10Percent / 100000).toFixed(2)}L
                            </Typography>
                        </Box>
                    </Tooltip>
                </Stack>

                {/* Right: Margin Buffer */}
                <Box sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                Margin Buffer
                            </Typography>
                            <Tooltip title="When buffer reaches zero, margin call will be triggered" arrow placement="top">
                                <InfoIcon sx={{ fontSize: 12, color: 'text.disabled', cursor: 'help' }} />
                            </Tooltip>
                        </Box>
                        <Chip
                            label={`${bufferPercent.toFixed(0)}%`}
                            size="small"
                            sx={{
                                height: 18,
                                fontSize: '0.65rem',
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
                            height: 6,
                            borderRadius: 1,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                bgcolor: isCriticalBuffer ? 'error.main' : isLowBuffer ? 'warning.main' : 'success.main',
                                borderRadius: 1
                            }
                        }}
                    />

                    <Typography variant="caption" color={isCriticalBuffer ? 'error.main' : 'text.secondary'} sx={{ fontSize: '0.65rem' }}>
                        ₹{(exposure.availableBuffer / 100000).toFixed(2)}L remaining
                        {isCriticalBuffer && ' ⚠️'}
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
};
