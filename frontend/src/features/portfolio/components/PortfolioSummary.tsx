import React, { useMemo } from 'react';
import {
    Box,
    Card,
    Grid,
    Typography,
    useTheme,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Tooltip,
    alpha,
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    InfoOutlined as InfoIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
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
    holdings: Holding[]; // NEW: To calculate short liability
    marketPrices?: Record<string, number>; // NEW: Current market prices
}

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
    const theme = useTheme();
    const displayValue = negative ? -Math.abs(value) : value;
    const color = negative
        ? 'error.main'
        : highlight
            ? 'primary.main'
            : 'text.primary';

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                    variant="body2"
                    fontWeight={bold || highlight ? 700 : 500}
                    color="text.primary"
                >
                    {label}
                </Typography>
                {tooltip && (
                    <Tooltip title={tooltip} arrow placement="top">
                        <InfoIcon
                            sx={{
                                fontSize: 16,
                                color: 'text.secondary',
                                cursor: 'help',
                            }}
                        />
                    </Tooltip>
                )}
            </Box>
            <Typography
                variant="body2"
                fontWeight={bold || highlight ? 700 : 600}
                color={color}
            >
                {displayValue < 0 ? '-' : ''}₹
                {Math.abs(displayValue).toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                })}
            </Typography>
        </Box>
    );
};

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

const BalanceSheetSection: React.FC<SectionProps> = ({ title, children }) => {
    const theme = useTheme();
    return (
        <Box sx={{ mb: 2 }}>
            <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
                sx={{ letterSpacing: 1 }}
            >
                {title}
            </Typography>
            <Divider sx={{ mb: 1, mt: 0.5 }} />
            {children}
        </Box>
    );
};

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
    const isProfit = totalPL >= 0;
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

    // Calculate Available to Trade
    const availableToTrade = cashBalance - blockedMargin;

    const hasShortPositions = shortLiability < 0;

    return (
        <Box>
            {/* Balance Sheet - Collapsible */}
            <Accordion
                defaultExpanded={false}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 3,
                    '&:before': { display: 'none' },
                    boxShadow: 'none',
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.03),
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.06),
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            width: '100%',
                            pr: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight={700}>
                            Balance Sheet
                        </Typography>
                        <Typography
                            variant="h5"
                            fontWeight={800}
                            color="primary.main"
                        >
                            Total Equity: ₹
                            {totalEquity.toLocaleString('en-IN', {
                                maximumFractionDigits: 2,
                            })}
                        </Typography>
                    </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 2 }}>
                    {/* Assets Section */}
                    <BalanceSheetSection title="Assets">
                        <BalanceSheetLineItem
                            label="Cash Balance"
                            value={cashBalance}
                            tooltip="Total money in your account, including proceeds from short sales"
                        />
                    </BalanceSheetSection>

                    {/* Liabilities Section - Only show if short positions exist */}
                    {hasShortPositions && (
                        <BalanceSheetSection title="Liabilities">
                            <BalanceSheetLineItem
                                label="Short Stock Liability"
                                value={shortLiability}
                                tooltip="Market value of borrowed shares you must buy back"
                                negative
                            />
                        </BalanceSheetSection>
                    )}

                    {/* Risk Controls Section */}
                    {blockedMargin > 0 && (
                        <BalanceSheetSection title="Risk Controls">
                            <BalanceSheetLineItem
                                label="Blocked Margin"
                                value={blockedMargin}
                                tooltip="Cash locked to cover potential losses. Cannot be used for new trades or withdrawal"
                            />
                        </BalanceSheetSection>
                    )}

                    {/* Available to Trade */}
                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                    <BalanceSheetLineItem
                        label="Available to Trade"
                        value={availableToTrade}
                        tooltip="Maximum amount you can use to open new positions"
                        highlight
                        bold
                    />
                </AccordionDetails>
            </Accordion>

            {/* Performance Metrics - Always Visible */}
            <Grid container spacing={2}>
                {/* Unrealized P&L */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            height: '100%',
                            border: 1,
                            borderColor: 'divider',
                            boxShadow: 'none',
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0.5,
                                        borderRadius: 1,
                                        bgcolor: alpha(
                                            isProfit
                                                ? theme.palette.success.main
                                                : theme.palette.error.main,
                                            0.1
                                        ),
                                    }}
                                >
                                    {isProfit ? (
                                        <TrendingUpIcon
                                            sx={{
                                                fontSize: 20,
                                                color: 'success.main',
                                            }}
                                        />
                                    ) : (
                                        <TrendingDownIcon
                                            sx={{
                                                fontSize: 20,
                                                color: 'error.main',
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Unrealized P&L
                                </Typography>
                            </Box>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                                color={
                                    isProfit ? 'success.main' : 'error.main'
                                }
                            >
                                {isProfit ? '+' : ''}₹
                                {totalPL.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                })}
                            </Typography>
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                color={
                                    isProfit ? 'success.main' : 'error.main'
                                }
                            >
                                {isProfit ? '+' : ''}
                                {totalPLPercent.toFixed(2)}% Return
                            </Typography>
                        </Box>
                    </Card>
                </Grid>

                {/* Realized P&L */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            height: '100%',
                            border: 1,
                            borderColor: 'divider',
                            boxShadow: 'none',
                        }}
                    >
                        <Box sx={{ p: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 0.5,
                                        borderRadius: 1,
                                        bgcolor: alpha(
                                            isRealizedProfit
                                                ? theme.palette.success.main
                                                : theme.palette.error.main,
                                            0.1
                                        ),
                                    }}
                                >
                                    {isRealizedProfit ? (
                                        <TrendingUpIcon
                                            sx={{
                                                fontSize: 20,
                                                color: 'success.main',
                                            }}
                                        />
                                    ) : (
                                        <TrendingDownIcon
                                            sx={{
                                                fontSize: 20,
                                                color: 'error.main',
                                            }}
                                        />
                                    )}
                                </Box>
                                <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                >
                                    Realized P&L
                                </Typography>
                            </Box>
                            <Typography
                                variant="h5"
                                fontWeight={800}
                                color={
                                    isRealizedProfit
                                        ? 'success.main'
                                        : 'error.main'
                                }
                            >
                                {isRealizedProfit ? '+' : ''}₹
                                {realizedPL.toLocaleString('en-IN', {
                                    maximumFractionDigits: 2,
                                })}
                            </Typography>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Lifetime Booked Profit
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
