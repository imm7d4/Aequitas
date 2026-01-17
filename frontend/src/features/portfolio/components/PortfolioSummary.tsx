import React, { useMemo } from 'react';
import {
    Box,
    Paper,
    Typography,
    useTheme,
    alpha,
    Stack,
    Divider,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import {
    InfoOutlined as InfoIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { Holding } from '../services/portfolioService';

interface PortfolioSummaryProps {
    totalEquity: number;
    totalHoldingsValue: number;
    cashBalance: number;
    blockedMargin: number;
    totalPL: number; // Unrealized P&L
    totalPLPercent: number;
    realizedPL: number;
    holdingsCount: number;
    holdings: Holding[];
    marketPrices?: Record<string, number>;
}

// --- Helper Components for Balance Sheet ---

interface LineItemProps {
    label: string;
    value: number;
    tooltip?: string;
    negative?: boolean;
    highlight?: boolean;
    bold?: boolean;
}

const BalanceSheetLineItem: React.FC<LineItemProps> = ({
    label,
    value,
    tooltip,
    negative = false,
    highlight = false,
    bold = false,
}) => {
    const displayValue = negative ? -Math.abs(value) : value;
    // Highlight available to trade with primary color
    const color = negative ? 'error.main' : (highlight ? 'primary.main' : 'text.primary');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" fontWeight={bold || highlight ? 700 : 500} color="text.primary">
                    {label}
                </Typography>
                {tooltip && (
                    <Tooltip title={tooltip} arrow placement="top">
                        <InfoIcon sx={{ fontSize: 16, color: 'text.secondary', cursor: 'help' }} />
                    </Tooltip>
                )}
            </Box>
            <Typography variant="body2" fontWeight={bold || highlight ? 700 : 600} color={color}>
                {displayValue < 0 ? '-' : ''}₹{Math.abs(displayValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Typography>
        </Box>
    );
};

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const BalanceSheetSection: React.FC<SectionProps> = ({ title, children }) => (
    <Box sx={{ mb: 1.5 }}>
        <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1, fontSize: '0.7rem' }}>
            {title}
        </Typography>
        <Divider sx={{ mb: 0.5, mt: 0.25 }} />
        {children}
    </Box>
);

// --- Helper Component for P&L Metrics ---

interface MetricProps {
    label: string;
    value: number;
    subValue?: string;
    color?: string;
    tooltip?: string;
    isCurrency?: boolean;
}

const CompactMetric: React.FC<MetricProps> = ({ label, value, subValue, color = 'text.primary', tooltip, isCurrency = true }) => (
    <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                {label}
            </Typography>
            {tooltip && (
                <Tooltip title={tooltip} arrow placement="top">
                    <InfoIcon sx={{ fontSize: 14, color: 'text.disabled', cursor: 'help' }} />
                </Tooltip>
            )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="h6" fontWeight={700} color={color} sx={{ lineHeight: 1.2 }}>
                {isCurrency && (value < 0 ? '-' : '')}
                {isCurrency ? '₹' : ''}
                {Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </Typography>
            {subValue && (
                <Typography variant="caption" fontWeight={700} color={color}>
                    {subValue}
                </Typography>
            )}
        </Box>
    </Box>
);

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
    totalEquity = 0,
    totalHoldingsValue = 0,
    cashBalance = 0,
    blockedMargin = 0,
    totalPL = 0,
    totalPLPercent = 0,
    realizedPL = 0,
    holdingsCount = 0,
    holdings = [],
    marketPrices = {},
}) => {
    const theme = useTheme();
    const isUnrealizedProfit = totalPL >= 0;
    const isRealizedProfit = realizedPL >= 0;

    // Calculate Short Stock Liability
    const shortLiability = useMemo(() => {
        let liability = 0;
        holdings.forEach((h) => {
            if (h.positionType === 'SHORT') {
                const ltp = marketPrices[h.instrumentId] || h.avgEntryPrice;
                liability -= ltp * h.quantity; // Negative value
            }
        });
        return liability;
    }, [holdings, marketPrices]);

    const availableToTrade = cashBalance - blockedMargin;
    const hasShortPositions = shortLiability < 0;

    return (
        <Box>
            {/* 1. Balance Sheet Accordion (Restored) */}
            <Accordion
                defaultExpanded={false}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px !important', // Force rounded corners
                    mb: 2,
                    '&:before': { display: 'none' }, // Check if this removes the separator line
                    boxShadow: 'none',
                    overflow: 'hidden'
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                        minHeight: 48,
                        '& .MuiAccordionSummary-content': { my: 1 },
                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.06) },
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', pr: 2 }}>
                        <Typography variant="subtitle1" fontWeight={700}>
                            Balance Sheet
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Total Equity
                            </Typography>
                            <Typography variant="h6" fontWeight={800} color="primary.main">
                                ₹{totalEquity.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 2, pb: 2, bgcolor: 'background.paper' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
                        <Box>
                            <BalanceSheetSection title="Assets">
                                <BalanceSheetLineItem
                                    label="Cash Balance"
                                    value={cashBalance}
                                    tooltip="Total money including realized profits"
                                />
                            </BalanceSheetSection>
                            {hasShortPositions && (
                                <BalanceSheetSection title="Liabilities">
                                    <BalanceSheetLineItem
                                        label="Short Stock Liability"
                                        value={shortLiability}
                                        tooltip="Market value of borrowed shares"
                                        negative
                                    />
                                </BalanceSheetSection>
                            )}
                        </Box>
                        <Box>
                            {blockedMargin > 0 && (
                                <BalanceSheetSection title="Risk Controls">
                                    <BalanceSheetLineItem
                                        label="Blocked Margin"
                                        value={blockedMargin}
                                        tooltip="Locked cash for open positions"
                                    />
                                </BalanceSheetSection>
                            )}
                            <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
                            <BalanceSheetLineItem
                                label="Available to Trade"
                                value={availableToTrade}
                                tooltip="Unencumbered cash available for new positions"
                                highlight
                                bold
                            />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* 2. Compact P&L Cards Row (New Style) */}
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 2, md: 4 }}
                    divider={<Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />}
                >
                    {/* Unrealized P&L */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                                Unrealized P&L
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    px: 0.5,
                                    py: 0.25,
                                    borderRadius: 0.5,
                                    bgcolor: alpha(isUnrealizedProfit ? theme.palette.success.main : theme.palette.error.main, 0.1)
                                }}
                            >
                                {isUnrealizedProfit ?
                                    <TrendingUpIcon sx={{ fontSize: 14, color: 'success.main', mr: 0.5 }} /> :
                                    <TrendingDownIcon sx={{ fontSize: 14, color: 'error.main', mr: 0.5 }} />
                                }
                                <Typography variant="caption" fontWeight={700} color={isUnrealizedProfit ? 'success.main' : 'error.main'}>
                                    {totalPLPercent.toFixed(2)}%
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="h6" fontWeight={700} color={isUnrealizedProfit ? 'success.main' : 'error.main'}>
                            {isUnrealizedProfit ? '+' : ''}₹{Math.abs(totalPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </Typography>
                    </Box>

                    {/* Realized P&L */}
                    <Box sx={{ flex: 1 }}>
                        <CompactMetric
                            label="Realized P&L"
                            value={realizedPL}
                            color={isRealizedProfit ? 'success.main' : 'error.main'}
                            subValue={realizedPL !== 0 ? (isRealizedProfit ? "PROFIT" : "LOSS") : undefined}
                        />
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};
