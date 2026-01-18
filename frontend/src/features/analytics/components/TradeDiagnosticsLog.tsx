import React, { useState } from 'react';
import { Grid, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Collapse, alpha, useTheme, Tooltip } from '@mui/material';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
    Timer as TimerIcon,
    AccountBalanceWallet as WalletIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { TradeResult } from '../services/analyticsService';

interface TradeDiagnosticsLogProps {
    trades: TradeResult[];
}

export const TradeDiagnosticsLog: React.FC<TradeDiagnosticsLogProps> = ({ trades }) => {
    return (
        <TableContainer
            component={Paper}
            elevation={0}
            sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                flex: 1,
                overflow: 'auto',
                bgcolor: 'background.paper'
            }}
        >
            <Table size="small" stickyHeader aria-label="trade diagnostics table">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ width: 40, bgcolor: 'background.paper' }} />
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>INSTRUMENT</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>SIDE</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>QTY</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>AVG. ENTRY</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>AVG. EXIT</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>GROSS P&L</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>NET P&L</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', py: 1, bgcolor: 'background.paper' }}>DURATION</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(trades || []).map((trade) => (
                        <TradeRow key={trade.id} trade={trade} />
                    ))}
                    {(!trades || trades.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={9} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                No completed trades found for diagnostics.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const TradeRow: React.FC<{ trade: TradeResult }> = ({ trade }) => {
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    const isProfit = trade.netPNL >= 0;
    const pnlColor = isProfit ? 'success.main' : 'error.main';

    // Calculate Opportunity Cost
    // MFE in model is delta from Entry. Price = Entry + MFE.
    const mfePrice = trade.avgEntryPrice + trade.mfe;
    const oppCost = trade.side === 'LONG'
        ? mfePrice - trade.avgExitPrice
        : trade.avgExitPrice - mfePrice;

    const oppCostPercent = (oppCost / trade.avgEntryPrice) * 100;
    const totalOppCost = oppCost * trade.quantity;

    // Verdict Logic
    const captureEfficiency = trade.netPNL > 0
        ? (trade.netPNL / (trade.netPNL + totalOppCost)) * 100
        : 0;

    const riskRewardRatio = trade.mae !== 0
        ? Math.abs(trade.netPNL / (trade.mae * trade.quantity))
        : trade.netPNL > 0 ? 99 : 0; // 99 as proxy for 'Infinite' risk/reward if MAE is 0

    const labels: string[] = [];
    if (trade.mae === 0) labels.push("Sniper Entry");
    if (oppCost === 0 && trade.netPNL > 0) labels.push("Perfect Exit");
    if (captureEfficiency > 80) labels.push("High Efficiency");
    if (trade.netPNL > 0 && Math.abs(trade.mae * trade.quantity) > trade.netPNL) labels.push("High Heat");
    if (trade.netPNL < 0 && Math.abs(trade.mae * trade.quantity) < Math.abs(trade.netPNL)) labels.push("Weak Defense");

    return (
        <>
            <TableRow hover sx={{ '& > *': { borderBottom: 'unset !important' } }}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Typography variant="body2" fontWeight={700}>{trade.symbol}</Typography>
                </TableCell>
                <TableCell>
                    <Chip
                        label={trade.side}
                        size="small"
                        variant="outlined"
                        sx={{
                            height: 20,
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            color: trade.side === 'LONG' ? theme.palette.primary.main : theme.palette.secondary.main,
                            borderColor: alpha(trade.side === 'LONG' ? theme.palette.primary.main : theme.palette.secondary.main, 0.4),
                            bgcolor: alpha(trade.side === 'LONG' ? theme.palette.primary.main : theme.palette.secondary.main, 0.05)
                        }}
                    />
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>{trade.quantity}</TableCell>
                <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                    ₹{trade.avgEntryPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace' }}>
                    ₹{trade.avgExitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace', color: trade.grossPNL >= 0 ? 'success.main' : 'error.main' }}>
                    {trade.grossPNL >= 0 ? '+' : ''}₹{trade.grossPNL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell align="right" sx={{ fontFamily: '"Roboto Mono", monospace', fontWeight: 700, color: pnlColor }}>
                    {trade.netPNL >= 0 ? '+' : ''}₹{trade.netPNL.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    <Typography variant="caption" sx={{ display: 'block', mt: -0.5, fontSize: '0.65rem' }}>
                        ({trade.netReturnPct.toFixed(2)}%)
                    </Typography>
                </TableCell>
                <TableCell align="right">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        <TimerIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{trade.duration}</Typography>
                    </Box>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 2, bgcolor: alpha(theme.palette.background.default, 0.5), borderBottom: '1px solid', borderColor: 'divider' }}>
                            <Grid container spacing={4}>
                                {/* Micro-Analytics Section */}
                                <Grid item xs={12} md={4}>
                                    <SectionTitle icon={<AssessmentIcon color="primary" />} title="Excursion Metrics" />
                                    <MetricRow
                                        label="MAE (Max Adverse Excursion)"
                                        value={`₹${Math.abs(trade.mae).toLocaleString('en-IN', { maximumFractionDigits: 2 })} / share`}
                                        subValue={`₹${Math.abs(trade.mae * trade.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total Risk (${((trade.mae / trade.avgEntryPrice) * 100).toFixed(2)}%)`}
                                        color="error.main"
                                        tooltip="The worst price excursion hit while position was open."
                                    />
                                    <MetricRow
                                        label="MFE (Max Favorable Excursion)"
                                        value={`₹${Math.abs(trade.mfe).toLocaleString('en-IN', { maximumFractionDigits: 2 })} / share`}
                                        subValue={`₹${Math.abs(trade.mfe * trade.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Total Potential (${((trade.mfe / trade.avgEntryPrice) * 100).toFixed(2)}%)`}
                                        color="success.main"
                                        tooltip="The best price excursion reached while position was open."
                                    />
                                </Grid>

                                {/* Economic Breakdown */}
                                <Grid item xs={12} md={4}>
                                    <SectionTitle icon={<WalletIcon color="primary" />} title="Economic Audit" />
                                    <MetricRow
                                        label="Total Commissions"
                                        value={`₹${trade.totalCommissions.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                                        tooltip="Combined buy/sell fees and taxes."
                                    />
                                    <MetricRow
                                        label="Opp. Cost (Opportunity Cost)"
                                        value={`₹${oppCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })} / share`}
                                        subValue={`₹${(oppCost * trade.quantity).toLocaleString('en-IN', { maximumFractionDigits: 0 })} Money Left on Table (${oppCostPercent.toFixed(2)}%)`}
                                        color={oppCost > 0 ? 'warning.main' : 'text.secondary'}
                                        tooltip="Profit left on the table (MFE Price minus actual Exit Price)."
                                    />
                                </Grid>

                                {/* Execution Integrity */}
                                <Grid item xs={12} md={4}>
                                    <SectionTitle icon={<AssessmentIcon color="primary" />} title="Execution References" />
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                        This trade consolidated {trade.entryOrderIds.length} entry and {trade.exitOrderIds.length} exit orders.
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {trade.entryOrderIds.map(id => (
                                            <Chip key={id} label={`E:${id.substring(0, 6)}`} size="small" sx={{ fontSize: '0.6rem' }} />
                                        ))}
                                        {trade.exitOrderIds.map(id => (
                                            <Chip key={id} label={`X:${id.substring(0, 6)}`} size="small" sx={{ fontSize: '0.6rem' }} />
                                        ))}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontSize: '0.6rem' }}>
                                        Diagnostics Engine v{trade.calculationVersion}.0 | Finalized Exit: {new Date(trade.exitTime).toLocaleString()}
                                    </Typography>
                                </Grid>

                                {/* Trade Verdict Column */}
                                <Grid item xs={12} md={4}>
                                    <SectionTitle icon={<TimerIcon color="primary" />} title="Trade Verdict" />
                                    {trade.netPNL > 0 ? (
                                        <>
                                            <MetricRow
                                                label="Capture Efficiency"
                                                value={`${captureEfficiency.toFixed(1)}%`}
                                                color={captureEfficiency > 70 ? 'success.main' : 'warning.main'}
                                                tooltip="Percentage of the total available move (Profit + Opportunity Cost) that you successfully captured."
                                            />
                                            <MetricRow
                                                label="Risk/Reward Index"
                                                value={riskRewardRatio >= 99 ? 'Infinite (MAE 0)' : `${riskRewardRatio.toFixed(1)}x`}
                                                color={riskRewardRatio > 3 ? 'success.main' : 'text.primary'}
                                                tooltip="Realized Profit divided by maximum unrealized loss (heat) taken during the trade."
                                            />
                                        </>
                                    ) : (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', display: 'block', mb: 2 }}>
                                            Efficiency tracking disabled for loss-making trades.
                                        </Typography>
                                    )}

                                    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {labels.map(label => {
                                            const getTooltip = (l: string) => {
                                                switch (l) {
                                                    case "Sniper Entry": return "Zero heat taken. The price never moved against your entry.";
                                                    case "Perfect Exit": return "Maximum capture. You exited at the absolute peak of the move.";
                                                    case "High Efficiency": return "Excellent timing. You captured a significant majority of the available profit.";
                                                    case "High Heat": return "High stress. You sat through more unrealized loss than you eventually made in profit.";
                                                    case "Weak Defense": return "Poor risk management. The trade hit maximum heat and you exited near the bottom.";
                                                    default: return "";
                                                }
                                            };
                                            return (
                                                <Tooltip key={label} title={getTooltip(label)} arrow>
                                                    <Chip
                                                        label={label}
                                                        size="small"
                                                        color={label.includes("Sniper") || label.includes("Perfect") || label.includes("High Efficiency") ? "success" : "warning"}
                                                        sx={{ fontSize: '0.65rem', fontWeight: 700, cursor: 'help' }}
                                                    />
                                                </Tooltip>
                                            );
                                        })}
                                        {labels.length === 0 && (
                                            <Typography variant="caption" color="text.disabled">No specific behavioral markers detected.</Typography>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const MetricRow: React.FC<{
    label: string;
    value: string;
    subValue?: string;
    color?: string;
    tooltip: string;
}> = ({ label, value, subValue, color, tooltip }) => (
    <Box sx={{ mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
            <Tooltip title={tooltip} arrow><Typography sx={{ cursor: 'help', fontSize: '0.7rem', color: 'text.disabled' }}>[?]</Typography></Tooltip>
        </Box>
        <Typography variant="body2" fontWeight={700} sx={{ fontFamily: '"Roboto Mono", monospace', color: color }}>
            {value}
        </Typography>
        {subValue && (
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: -0.25 }}>
                {subValue}
            </Typography>
        )}
    </Box>
);

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, pb: 0.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        {icon}
        <Typography variant="caption" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
        </Typography>
    </Box>
);
