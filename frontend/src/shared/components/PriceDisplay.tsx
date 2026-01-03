import React from 'react';
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';

interface PriceDisplayProps {
    price: number;
    change: number;
    changePct: number;
    fontSize?: string | number;
    showIcon?: boolean;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
    price,
    change,
    changePct,
    fontSize = '1rem',
    showIcon = true,
}) => {
    const isPositive = change > 0;
    const isNegative = change < 0;
    const color = isPositive ? 'success.main' : isNegative ? 'error.main' : 'text.secondary';

    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : TrendingFlat;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Typography sx={{ fontWeight: 600, fontSize }}>
                ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', color }}>
                {showIcon && <Icon sx={{ fontSize: '0.9em', mr: 0.5 }} />}
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                    {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
                </Typography>
            </Box>
        </Box>
    );
};
