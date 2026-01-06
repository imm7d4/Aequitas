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
    styled
} from '@mui/material';
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {holdings.map((holding) => {
                        const data = marketData.prices[holding.instrumentId];
                        const ltp = data?.lastPrice || 0;
                        const currentValue = ltp * holding.quantity;
                        const investedValue = holding.avgCost * holding.quantity;
                        const unrealizedPL = currentValue - investedValue;
                        const unrealizedPLPercent = investedValue > 0 ? (unrealizedPL / investedValue) * 100 : 0;
                        const isProfit = unrealizedPL >= 0;

                        return (
                            <TableRow key={holding.id} hover>
                                <StyledTableCell>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {holding.symbol}
                                        </Typography>
                                        {/* Accessing Name is tricky if not in Holding model. 
                        Ideally Holding should have Name or we fetch it. 
                        For now just Symbol. */}
                                    </Box>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Typography variant="body2" fontWeight={600}>
                                        {holding.quantity}
                                    </Typography>
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    ₹{holding.avgCost.toFixed(2)}
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
                                    ₹{currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
