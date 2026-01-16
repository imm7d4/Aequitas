import React, { useMemo } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    styled,
    Button,
    Chip,
    Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Holding } from '../services/portfolioService';
import { useMarketData } from '../../market/hooks/useMarketData';

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: '0.85rem',
    padding: '12px 16px',
    borderColor: theme.palette.divider,
}));

interface HoldingsTableProps {
    holdings: Holding[];
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
    const navigate = useNavigate();
    // Extract all instrument IDs for batch subscription
    const instrumentIds = useMemo(() => holdings.map(h => h.instrumentId), [holdings]);
    const marketData = useMarketData(instrumentIds);

    if (holdings.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1">No holdings found.</Typography>
                <Typography variant="caption">Start trading to build your portfolio.</Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <Table>
                <TableHead sx={{ bgcolor: 'background.default' }}>
                    <TableRow>
                        <StyledTableCell>Instrument</StyledTableCell>
                        <StyledTableCell align="right">Qty</StyledTableCell>
                        <StyledTableCell align="right">Avg. Cost</StyledTableCell>
                        <StyledTableCell align="right">LTP</StyledTableCell>
                        <StyledTableCell align="right">Current Value</StyledTableCell>
                        <StyledTableCell align="right">P&L</StyledTableCell>
                        <StyledTableCell align="right">Action</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {holdings.map((holding) => {
                        const data = marketData.prices[holding.instrumentId];
                        const ltp = data?.lastPrice || 0;
                        const isShort = holding.positionType === 'SHORT';
                        const currentValue = ltp * holding.quantity;
                        const investedValue = (holding.avgEntryPrice || 0) * holding.quantity;

                        // P&L Logic
                        // Long: Current - Invested
                        // Short: Invested - Current (Liability)
                        const unrealizedPL = isShort
                            ? (investedValue - currentValue)
                            : (currentValue - investedValue);

                        const unrealizedPLPercent = investedValue > 0 ? (unrealizedPL / investedValue) * 100 : 0;
                        const isProfit = unrealizedPL >= 0;

                        return (
                            <TableRow key={holding.id} hover>
                                <StyledTableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {holding.symbol}
                                            </Typography>
                                        </Box>
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
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Typography variant="body2" fontWeight={600}>
                                        {holding.quantity}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Tooltip title={isShort ? "Avg. Sell Price" : "Avg. Buy Price"}>
                                        <Typography variant="body2">
                                            ₹{(holding.avgEntryPrice || 0).toFixed(2)}
                                        </Typography>
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    {ltp > 0 ? (
                                        <Typography variant="body2" fontWeight={700} color={data?.change >= 0 ? 'success.main' : 'error.main'}>
                                            ₹{ltp.toFixed(2)}
                                        </Typography>
                                    ) : (
                                        '-'
                                    )}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Tooltip title={isShort ? "Liability to Cover" : "Current Asset Value"}>
                                        <Typography variant="body2">
                                            ₹{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Typography>
                                    </Tooltip>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        <Typography variant="body2" sx={{ color: isProfit ? 'success.main' : 'error.main', fontWeight: 700 }}>
                                            {isProfit ? '+' : ''}₹{unrealizedPL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: isProfit ? 'success.main' : 'error.main' }}>
                                            ({isProfit ? '+' : ''}{unrealizedPLPercent.toFixed(2)}%)
                                        </Typography>
                                    </Box>
                                </StyledTableCell>

                                <StyledTableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={isShort ? "success" : "error"}
                                        onClick={() => navigate(`/instruments/${holding.instrumentId}`, {
                                            state: {
                                                side: isShort ? 'BUY' : 'SELL',
                                                intent: isShort ? 'CLOSE_SHORT' : 'CLOSE_LONG',
                                                quantity: holding.quantity
                                            }
                                        })}
                                        sx={{ minWidth: '60px', fontWeight: 700 }}
                                    >
                                        {isShort ? "Cover" : "Sell"}
                                    </Button>
                                </StyledTableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table >
        </TableContainer >
    );
};
