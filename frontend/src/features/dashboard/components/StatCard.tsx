import React from 'react';
import { Paper, Box, Typography, alpha, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon?: React.ReactNode;
    subtitle?: string;
    isPrivate?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    change,
    isPositive,
    icon,
    subtitle,
    isPrivate = false,
}) => {
    const theme = useTheme();
    const color = isPositive === undefined ? 'text.secondary' : isPositive ? 'success.main' : 'error.main';

    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                },
            }}
        >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="overline" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                        {isPrivate ? '₹ • • • •' : value}
                    </Typography>
                </Box>
                {icon && (
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            display: 'flex',
                        }}
                    >
                        {icon}
                    </Box>
                )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                {!isPrivate && change && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            color,
                            bgcolor: alpha(isPositive ? theme.palette.success.main : theme.palette.error.main, 0.1),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            mr: 1.5,
                        }}
                    >
                        {isPositive ? <TrendingUp sx={{ fontSize: 18, mr: 0.5 }} /> : <TrendingDown sx={{ fontSize: 18, mr: 0.5 }} />}
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {change}
                        </Typography>
                    </Box>
                )}
                {subtitle && (
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Paper>
    );
};
