import React from 'react';
import { Box, Stack, Typography, Divider } from '@mui/material';
import { formatCurrency } from '../../../shared/utils/formatters';

interface TradeReceiptSectionProps {
    estValue: number;
    fees: number;
    side: 'BUY' | 'SELL';
    shortMode: boolean;
    requiredMargin: number;
}

export const TradeReceiptSection: React.FC<TradeReceiptSectionProps> = ({
    estValue, fees, side, shortMode, requiredMargin
}) => {
    if (estValue <= 0) return null;

    return (
        <Box sx={{
            p: 1.5,
            bgcolor: 'rgba(0,0,0,0.02)',
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
        }}>
            <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Est. Value</Typography>
                    <Typography variant="caption" fontWeight={800} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {formatCurrency(estValue)}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>Taxes & Charges</Typography>
                    <Typography variant="caption" fontWeight={800} sx={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        {formatCurrency(fees)}
                    </Typography>
                </Box>
                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" fontWeight={800} sx={{ textTransform: 'uppercase' }}>
                        {side === 'BUY' || (side === 'SELL' && shortMode) ? 'Total Required' : 'Net Proceeds'}
                    </Typography>
                    <Typography 
                        variant="h6" 
                        fontWeight={900} 
                        color={side === 'BUY' || shortMode ? "primary.main" : "success.main"} 
                        sx={{ fontFamily: '"JetBrains Mono", monospace' }}
                    >
                        {formatCurrency(side === 'BUY' || (side === 'SELL' && shortMode) ? requiredMargin : estValue - fees)}
                    </Typography>
                </Box>
            </Stack>
        </Box>
    );
};
