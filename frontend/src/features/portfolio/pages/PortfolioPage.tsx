import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Container, CircularProgress, Tabs, Tab } from '@mui/material';
import { portfolioService, PortfolioSummaryData } from '../services/portfolioService';
import { HoldingsTable } from '../components/HoldingsTable';
// Removed unused accountService
import { PortfolioSummary } from '../components/PortfolioSummary';
import { useMarketData } from '../../market/hooks/useMarketData';




export const PortfolioPage: React.FC = () => {


    const [summaryData, setSummaryData] = useState<PortfolioSummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Fetch portfolio summary on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await portfolioService.getSummary();
                console.log('PortfolioPage Summary:', data);
                setSummaryData(data);
                // setHoldings(data.holdings); // If we need holdings separately
            } catch (err) {
                console.error('Failed to fetch portfolio summary:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Use Market Data to calculate Real-Time Portfolio Summary
    // We use holdings from summaryData
    const holdings = summaryData?.holdings || [];
    const instrumentIds = useMemo(() => holdings.map(h => h.instrumentId), [holdings]);
    const marketData = useMarketData(instrumentIds);

    const calculatedSummary = useMemo(() => {
        if (!summaryData) return null;

        let totalInvested = 0;
        let totalHoldingsValue = 0;
        let totalUnrealizedPL = 0;

        holdings.forEach(h => {
            // Fallback to cost if no price
            const ltp = marketData.prices[h.instrumentId]?.lastPrice || h.avgEntryPrice;

            const invested = h.avgEntryPrice * h.quantity;
            const current = ltp * h.quantity;

            totalInvested += invested;
            totalHoldingsValue += current; // Note: For Shorts, this represents market value of liability

            // Calculate P&L based on position type
            let pnl = 0;
            if (h.positionType === 'SHORT') {
                pnl = (h.avgEntryPrice - ltp) * h.quantity;
            } else {
                pnl = (ltp - h.avgEntryPrice) * h.quantity;
            }
            totalUnrealizedPL += pnl;
        });

        // Unrealized P&L
        const unrealizedPL = totalUnrealizedPL;
        const unrealizedPLPercent = totalInvested > 0 ? (unrealizedPL / totalInvested) * 100 : 0;

        // Use backend values for cash and realized PL
        const cashBalance = summaryData.cashBalance || 0;
        const realizedPL = summaryData.realizedPL || 0;
        const blockedMargin = summaryData.blockedMargin || 0;

        // Backend now handles the correct "Net Worth" logic (Assets - Liabilities)
        // However, backend Equity is based on Entry Price (Book Value). 
        // We need to add Unrealized P&L to get Mark-to-Market Equity.
        const backendEquity = summaryData.totalEquity || 0;
        const totalEquity = backendEquity + unrealizedPL;

        return {
            totalHoldingsValue,
            totalInvested,
            unrealizedPL,
            unrealizedPLPercent,
            realizedPL,
            totalEquity,
            cashBalance,
            blockedMargin,
            holdingsCount: holdings.length
        };
    }, [summaryData, marketData, holdings]);

    // Fallback if loading or error
    const displaySummary = calculatedSummary || {
        totalEquity: 0,
        totalHoldingsValue: 0,
        cashBalance: 0,
        blockedMargin: 0,
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
        realizedPL: 0,
        holdingsCount: 0
    };

    // Extract market prices for PortfolioSummary
    const marketPrices = useMemo(() => {
        const prices: Record<string, number> = {};
        Object.entries(marketData.prices).forEach(([instrumentId, data]) => {
            if (data?.lastPrice) {
                prices[instrumentId] = data.lastPrice;
            }
        });
        return prices;
    }, [marketData]);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', pb: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexShrink: 0 }}>
                <Box sx={{ mb: 1.5 }}>
                    <Typography variant="h5" fontWeight={700}>
                        Portfolio
                    </Typography>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 1.5 }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="portfolio tabs">
                        <Tab label="Overview" />
                        <Tab label="Holdings" />
                    </Tabs>
                </Box>
            </Box>

            {/* Overview Tab */}
            {tabValue === 0 && (
                <Box sx={{ flexShrink: 0, overflow: 'auto', flex: 1, minHeight: 0 }}>
                    <PortfolioSummary
                        totalEquity={displaySummary.totalEquity}
                        totalHoldingsValue={displaySummary.totalHoldingsValue}
                        cashBalance={displaySummary.cashBalance}
                        blockedMargin={displaySummary.blockedMargin}
                        totalPL={displaySummary.unrealizedPL}
                        totalPLPercent={displaySummary.unrealizedPLPercent}
                        realizedPL={displaySummary.realizedPL}
                        holdingsCount={displaySummary.holdingsCount}
                        holdings={holdings}
                        marketPrices={marketPrices}
                        freeCash={summaryData?.freeCash || 0}
                        marginCash={summaryData?.marginCash || 0}
                        shortProceeds={summaryData?.shortProceeds || 0}
                        settlementPending={summaryData?.settlementPending || 0}
                    />
                </Box>
            )}

            {/* Holdings Tab */}
            {tabValue === 1 && (
                <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Your Holdings
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                                    Unrealized P&L
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontWeight={700}
                                    color={displaySummary.unrealizedPL >= 0 ? 'success.main' : 'error.main'}
                                    sx={{ fontSize: '0.95rem' }}
                                >
                                    {displaySummary.unrealizedPL >= 0 ? '+' : '-'}₹{Math.abs(displaySummary.unrealizedPL).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                                    <Typography component="span" variant="caption" sx={{ ml: 0.5, fontSize: '0.7rem' }}>
                                        ({displaySummary.unrealizedPL >= 0 ? '+' : ''}{displaySummary.unrealizedPLPercent.toFixed(2)}%)
                                    </Typography>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <HoldingsTable holdings={holdings} />
                </Box>
            )}
        </Container>
    );
};
