import React from 'react';
import { Box, Typography, IconButton, Tooltip, alpha, useTheme } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import { MarketData } from '@/features/market/types/market.types';
import { formatCurrency } from '@/shared/utils/formatters';

interface PriceActionsProps {
    marketData: MarketData | null;
    ltp: number;
    tickColor: string;
    isStarred: boolean;
    onWatchlistToggle: () => void;
    onSetAlert: () => void;
    tooltipSlotProps: any;
}

export const PriceActions: React.FC<PriceActionsProps> = ({
    marketData, ltp, tickColor, isStarred, onWatchlistToggle, onSetAlert, tooltipSlotProps
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, flexShrink: 0 }}>
            <Box sx={{ textAlign: 'right' }}>
                <Typography 
                    variant="h5" 
                    fontWeight={900} 
                    color={tickColor} 
                    sx={{ 
                        lineHeight: 1, 
                        fontFamily: '"JetBrains Mono", monospace', 
                        letterSpacing: '-0.03em',
                        fontSize: { xs: '1.25rem', md: '1.75rem' }
                    }}
                >
                    ₹{formatCurrency(ltp, false)}
                </Typography>
                {marketData && (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, mt: 0.5 }}>
                        <Typography 
                            variant="caption" 
                            fontWeight={800} 
                            color={marketData.changePct >= 0 ? "success.main" : "error.main"}
                            sx={{ fontSize: '0.7rem' }}
                        >
                            {marketData.changePct >= 0 ? '+' : ''}{marketData.changePct.toFixed(2)}%
                        </Typography>
                        <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ fontSize: '0.65rem' }}>
                            {marketData.change >= 0 ? '+' : '-'}{formatCurrency(Math.abs(marketData.change), false)}
                        </Typography>
                    </Box>
                )}
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Set Price Alert" arrow slotProps={tooltipSlotProps}>
                    <IconButton 
                        onClick={onSetAlert}
                        sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '12px', '&:hover': { bgcolor: 'action.hover' } }}
                    >
                        <AddAlarmIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title={isStarred ? "Remove from Watchlist" : "Add to Watchlist"} arrow slotProps={tooltipSlotProps}>
                    <IconButton
                        onClick={onWatchlistToggle}
                        sx={{ 
                            border: '1px solid', 
                            borderColor: isStarred ? 'primary.main' : 'divider', 
                            borderRadius: '12px',
                            bgcolor: isStarred ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                            color: isStarred ? 'primary.main' : 'inherit',
                            '&:hover': { bgcolor: isStarred ? alpha(theme.palette.primary.main, 0.12) : 'action.hover' }
                        }}
                    >
                        {isStarred ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
};
