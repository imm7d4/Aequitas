import React from 'react';
import { ToggleButtonGroup, ToggleButton, Theme, alpha } from '@mui/material';
import { TrendingUp as BuyIcon, TrendingDown as SellIcon } from '@mui/icons-material';
import { OrderSide, ORDER_SIDE } from '@/shared/constants/AppConstants';

interface TradeSideSelectionProps {
    side: OrderSide;
    shortMode: boolean;
    onSideChange: (side: OrderSide) => void;
    theme: Theme;
}

export const TradeSideSelection: React.FC<TradeSideSelectionProps> = ({ 
    side, shortMode, onSideChange, theme 
}) => {
    return (
        <ToggleButtonGroup
            fullWidth 
            value={side} 
            exclusive
            onChange={(_, v) => v && onSideChange(v as OrderSide)}
            sx={{
                p: 0.5, 
                bgcolor: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', 
                borderRadius: '12px', 
                border: 'none' 
            }}
        >
            <ToggleButton 
                value={ORDER_SIDE.BUY} 
                sx={{ 
                    '&.Mui-selected': { bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } },
                    borderRadius: '10px !important',
                    border: 'none !important'
                }}
            >
                <BuyIcon sx={{ mr: 1, fontSize: 18 }} /> {shortMode ? 'COVER' : 'BUY'}
            </ToggleButton>
            <ToggleButton 
                value={ORDER_SIDE.SELL} 
                sx={{ 
                    '&.Mui-selected': { bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } },
                    borderRadius: '10px !important',
                    border: 'none !important'
                }}
            >
                <SellIcon sx={{ mr: 1, fontSize: 18 }} /> {shortMode ? 'SHORT' : 'SELL'}
            </ToggleButton>
        </ToggleButtonGroup>
    );
};
