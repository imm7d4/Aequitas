import React, { useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { Holding } from '../services/portfolioService';
import { PortfolioSnapshot } from './Summary/PortfolioSnapshot';
import { EquityBreakdown } from './Summary/EquityBreakdown';
import { LiquidityDetails } from './Summary/LiquidityDetails';
import { RiskCenter } from './Summary/RiskCenter';

interface PortfolioSummaryProps {
    totalEquity: number;
    totalHoldingsValue: number;
    cashBalance: number;
    blockedMargin: number;
    totalPL: number;
    totalPLPercent: number;
    realizedPL: number;
    holdings: Holding[];
    marketPrices?: Record<string, number>;
    freeCash: number;
    marginCash: number;
    shortProceeds?: number;
    settlementPending: number;
}

/**
 * Production-grade Portfolio Summary.
 * Decomposed into modular sub-components to maintain readability and performance.
 */
export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
    totalEquity = 0,
    cashBalance = 0,
    blockedMargin = 0,
    totalPL = 0,
    realizedPL = 0,
    holdings = [],
    marketPrices = {},
    freeCash = 0,
    marginCash = 0,
    shortProceeds = 0,
    settlementPending = 0,
}) => {
    // Calculate aggregate metrics for sub-components
    const metrics = useMemo(() => {
        let shortLiability = 0;
        let longValue = 0;
        let shortPositions = 0;

        holdings.forEach((h) => {
            const ltp = marketPrices[h.instrumentId] || h.avgEntryPrice;
            const value = ltp * h.quantity;

            if (h.positionType === 'SHORT') {
                shortLiability -= value;
                shortPositions++;
            } else {
                longValue += value;
            }
        });

        return { shortLiability, longValue, shortPositions };
    }, [holdings, marketPrices]);

    const hasShortPositions = metrics.shortLiability < 0;

    return (
        <Box>
            {/* ROW 1: Compact Portfolio Snapshot */}
            <PortfolioSnapshot 
                totalEquity={totalEquity}
                totalPL={totalPL}
                freeCash={freeCash}
                marginCash={marginCash}
                shortLiability={metrics.shortLiability}
            />

            {/* ROW 2: Equity Breakdown + Cash Details */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
                <Grid item xs={12} md={6}>
                    <EquityBreakdown 
                        cashBalance={cashBalance}
                        longValue={metrics.longValue}
                        shortLiability={metrics.shortLiability}
                        totalPL={totalPL}
                        realizedPL={realizedPL}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <LiquidityDetails 
                        cashBalance={cashBalance}
                        freeCash={freeCash}
                        marginCash={marginCash}
                        shortProceeds={shortProceeds}
                        settlementPending={settlementPending}
                    />
                </Grid>
            </Grid>

            {/* ROW 3: Risk Center (if short positions exist) */}
            {hasShortPositions && (
                <RiskCenter 
                    shortLiability={metrics.shortLiability}
                    shortPositions={metrics.shortPositions}
                    blockedMargin={blockedMargin}
                />
            )}
        </Box>
    );
};
