import React, { useMemo, useCallback } from 'react';
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
    Tooltip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Holding } from '../services/portfolioService';
import { useMarketData } from '../../market/hooks/useMarketData';
import { HoldingRow } from './HoldingsTable/HoldingRow';

interface HoldingsTableProps {
    holdings: Holding[];
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings }) => {
    const navigate = useNavigate();
    
    // Extract all instrument IDs for batch subscription
    const instrumentIds = useMemo(() => holdings.map(h => h.instrumentId), [holdings]);
    const marketData = useMarketData(instrumentIds);

    const handleAction = useCallback((instrumentId: string, side: 'BUY' | 'SELL', intent: string, quantity: number) => {
        navigate(`/instruments/${instrumentId}`, {
            state: { side, intent, quantity }
        });
    }, [navigate]);

    if (holdings.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant="body1">No holdings found.</Typography>
                <Typography variant="caption">Start trading to build your portfolio.</Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} elevation={0} sx={{ height: '100%', overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 0 }}>
            <Table
                stickyHeader
                size="small"
                sx={{
                    minWidth: 650,
                    '& .MuiTableCell-root': {
                        py: 0.75,
                        px: 2,
                        fontSize: '0.8125rem',
                        fontFamily: 'Inter, Roboto, sans-serif',
                    },
                    '& .MuiTableCell-head': {
                        fontWeight: 600,
                        backgroundColor: 'background.paper',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontSize: '0.75rem',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    },
                    '& .MuiTableRow-root': {
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        },
                    }
                }}
            >
                <TableHead sx={{ bgcolor: 'background.default' }}>
                    <TableRow>
                        <TableCell>
                            <Tooltip title="Stock Symbol and current position details" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>Instrument</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Number of shares held" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>Qty</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Average price per share at entry" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>Avg. Cost</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Last Traded Price" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>LTP</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Current market value" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>Value</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Cash blocked by the exchange" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>Margin</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Total Unrealized Profit or Loss" arrow placement="top">
                                <Box sx={{ cursor: 'help' }}>P&L</Box>
                            </Tooltip>
                        </TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {holdings.map((holding) => {
                        const data = marketData.prices[holding.instrumentId];
                        return (
                            <HoldingRow 
                                key={holding.id}
                                holding={holding}
                                ltp={data?.lastPrice || 0}
                                priceChange={data?.change || 0}
                                onAction={handleAction}
                            />
                        );
                    })}
                </TableBody>
            </Table >
        </TableContainer >
    );
};
