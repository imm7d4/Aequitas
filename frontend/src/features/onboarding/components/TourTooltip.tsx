import React from 'react';
import {
    Box,
    Card,
    Typography,
    Button,
    IconButton,
    LinearProgress,
    Stack,
    Chip,
    useTheme,
} from '@mui/material';
import { TooltipRenderProps } from 'react-joyride';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';

export const TourTooltip = ({
    index,
    step,
    backProps,
    closeProps,
    primaryProps,
    tooltipProps,
    isLastStep,
    size,
}: TooltipRenderProps) => {
    const theme = useTheme();

    // Calculate progress with safe fallback
    const progress = size > 0 ? Math.round(((index + 1) / size) * 100) : 0;

    return (
        <Card
            elevation={8}
            {...tooltipProps}
            sx={{
                maxWidth: 420,
                minWidth: 320,
                borderRadius: 3,
                overflow: 'hidden', // Ensure progress bar stays within rounded corners
                position: 'relative',
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.4)'
                    : '0 8px 32px rgba(0, 0, 0, 0.12)',
            }}
        >
            {/* Header / Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 4,
                    bgcolor: theme.palette.action.hover,
                    '& .MuiLinearProgress-bar': {
                        borderRadius: '0 4px 4px 0',
                        bgcolor: theme.palette.primary.main
                    }
                }}
            />

            {/* Close Button */}
            <IconButton
                {...closeProps}
                size="small"
                sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    color: 'text.secondary',
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                    zIndex: 1
                }}
            >
                <CloseIcon fontSize="small" />
            </IconButton>

            <Box sx={{ p: 3, pt: 4 }}>
                {/* Step Indicator */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                        label={`Step ${index + 1} / ${size}`}
                        size="small"
                        sx={{
                            fontWeight: 700,
                            borderRadius: '6px',
                            bgcolor: theme.palette.primary.main + '20', // roughly 12% opacity
                            color: theme.palette.primary.main,
                            fontSize: '0.75rem',
                            height: 24
                        }}
                    />
                </Stack>

                {/* Content */}
                {step.title && (
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: '1.1rem' }}>
                        {step.title}
                    </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, fontSize: '0.95rem' }}>
                    {step.content}
                </Typography>

                {/* Footer Controls */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    {/* Back Button */}
                    <Box>
                        {index > 0 && (
                            <Button
                                {...backProps}
                                size="medium"
                                startIcon={<ArrowBackIcon sx={{ fontSize: 18 }} />}
                                sx={{
                                    textTransform: 'none',
                                    color: 'text.secondary',
                                    fontWeight: 600,
                                    ':hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                Back
                            </Button>
                        )}
                    </Box>

                    {/* Next/Finish Button */}
                    <Button
                        {...primaryProps}
                        variant="contained"
                        size="medium"
                        endIcon={isLastStep ? <CheckIcon sx={{ fontSize: 18 }} /> : <ArrowForwardIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 3,
                            py: 1,
                            boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                            fontWeight: 700,
                            // Ensure button text is visible
                            color: theme.palette.primary.contrastText
                        }}
                    >
                        {isLastStep ? 'Get Started' : 'Next'}
                    </Button>
                </Stack>
            </Box>
        </Card>
    );
};
