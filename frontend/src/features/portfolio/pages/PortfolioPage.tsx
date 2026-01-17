import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Container, CircularProgress, Button } from '@mui/material';
import { portfolioService, PortfolioSummaryData } from '../services/portfolioService';
import { HoldingsTable } from '../components/HoldingsTable';
// Removed unused accountService
import { PortfolioSummary } from '../components/PortfolioSummary';
import { useMarketData } from '../../market/hooks/useMarketData';




export const PortfolioPage: React.FC = () => {


    const [summaryData, setSummaryData] = useState<PortfolioSummaryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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

        // Total Equity = Cash + Current Holdings Value
        const totalEquity = cashBalance + totalHoldingsValue;

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
                <Box sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} gutterBottom>
                            Portfolio
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Manage your holdings and track performance.
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
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
                    />
                </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                    Your Holdings
                </Typography>
                <HoldingsTable holdings={holdings} />
            </Box>
        </Container>
    );
};
