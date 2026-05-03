import React from 'react';
import { TableRow, TableCell, Box, Typography, Chip, Tooltip, Button } from '@mui/material';
import { Holding } from '../services/portfolioService';

interface HoldingRowProps {
    holding: Holding;
    ltp: number;
    priceChange: number;
    onAction: (instrumentId: string, side: 'BUY' | 'SELL', intent: string, quantity: number) => void;
}

export const HoldingRow = React.memo<HoldingRowProps>(({
    holding, ltp, priceChange, onAction
}) => {
    const isShort = holding.positionType === 'SHORT';
    const currentValue = ltp * holding.quantity;
    const investedValue = (holding.avgEntryPrice || 0) * holding.quantity;

    // P&L Logic
    const unrealizedPL = isShort
        ? (investedValue - currentValue)
        : (currentValue - investedValue);

    const unrealizedPLPercent = investedValue > 0 ? (unrealizedPL / investedValue) * 100 : 0;
    const isProfit = unrealizedPL >= 0;

    return (
        <TableRow hover>
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>
                        {holding.symbol}
                    </Typography>
                    {isShort && (
                        <Chip
                            label="SHORT"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                    )}
                </Box>
            </TableCell>
            <TableCell align="right">
                <Typography variant="body2" fontWeight={600}>
                    {holding.quantity}
                </Typography>
            </TableCell>
            <TableCell align="right">
                <Tooltip title={isShort ? "Avg. Sell Price" : "Avg. Buy Price"}>
                    <Typography variant="body2">
                        ₹{(holding.avgEntryPrice || 0).toFixed(2)}
                    </Typography>
                </Tooltip>
            </TableCell>
            <TableCell align="right">
                {ltp > 0 ? (
                    <Typography variant="body2" fontWeight={700} color={priceChange >= 0 ? 'success.main' : 'error.main'}>
                        ₹{ltp.toFixed(2)}
                    </Typography>
                ) : (
                    '-'
                )}
            </TableCell>
            <TableCell align="right">
                <Tooltip title={isShort ? "Liability to Cover" : "Current Asset Value"}>
                    <Typography variant="body2">
                        ₹{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                </Tooltip>
            </TableCell>
            <TableCell align="right">
                {isShort && holding.blockedMargin ? (
                    <Tooltip title="Margin Locked for this position">
                        <Typography variant="body2" color="text.secondary">
                            🔒 ₹{holding.blockedMargin.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                    </Tooltip>
                ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                )}
            </TableCell>
            <TableCell align="right">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" sx={{ color: isProfit ? 'success.main' : 'error.main', fontWeight: 700 }}>
                        {isProfit ? '+' : ''}₹{unrealizedPL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isProfit ? 'success.main' : 'error.main' }}>
                        ({isProfit ? '+' : ''}{unrealizedPLPercent.toFixed(2)}%)
                    </Typography>
                    {isShort && holding.marginStatus && (
                        <Chip
                            label={holding.marginStatus}
                            size="small"
                            color={holding.marginStatus === 'OK' ? 'success' : holding.marginStatus === 'CALL' ? 'warning' : 'error'}
                            sx={{ mt: 0.5, height: 16, fontSize: '0.6rem' }}
                        />
                    )}
                </Box>
            </TableCell>

            <TableCell align="right">
                <Button
                    variant="outlined"
                    size="small"
                    color={isShort ? "success" : "error"}
                    onClick={() => onAction(
                        holding.instrumentId,
                        isShort ? 'BUY' : 'SELL',
                        isShort ? 'CLOSE_SHORT' : 'CLOSE_LONG',
                        holding.quantity
                    )}
                    sx={{ minWidth: '60px', fontWeight: 700 }}
                >
                    {isShort ? "Cover" : "Sell"}
                </Button>
            </TableCell>
        </TableRow>
    );
});
