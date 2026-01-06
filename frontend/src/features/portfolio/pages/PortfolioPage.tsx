import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Container, CircularProgress, Tab, Tabs, Button } from '@mui/material';
import { portfolioService, Holding } from '../services/portfolioService';
import { HoldingsTable } from '../components/HoldingsTable';
import { accountService } from '../../profile/services/accountService';
import { PortfolioSummary } from '../components/PortfolioSummary';
import { useMarketData } from '../../market/hooks/useMarketData';
import { EquityCurveChart } from '../components/EquityCurveChart';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`portfolio-tabpanel-${index}`}
            aria-labelledby={`portfolio-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export const PortfolioPage: React.FC = () => {


    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [cashBalance, setCashBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch holdings and balance on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await Promise.allSettled([
                    portfolioService.getHoldings(),
                    accountService.getBalance()
                ]);

                const holdingsResult = results[0];
                const accountResult = results[1];

                let holdingsData: Holding[] = [];
                let accountData: any = {};

                if (holdingsResult.status === 'fulfilled') {
                    holdingsData = holdingsResult.value;
                } else {
                    console.error('Failed to fetch holdings:', holdingsResult.reason);
                }

                if (accountResult.status === 'fulfilled') {
                    accountData = accountResult.value;
                } else {
                    console.error('Failed to fetch account balance:', accountResult.reason);
                }

                console.log('PortfolioPage Fetch:', { holdingsData, accountData });
                setHoldings(holdingsData || []);
                setCashBalance(accountData?.balance || 0);
            } catch (err) {
                console.error('Failed to fetch portfolio data:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Use Market Data to calculate Real-Time Portfolio Summary
    const instrumentIds = useMemo(() => holdings.map(h => h.instrumentId), [holdings]);
    const marketData = useMarketData(instrumentIds);

    const summary = useMemo(() => {
        let totalInvested = 0;
        let totalHoldingsValue = 0;

        holdings.forEach(h => {
            // Fallback to cost if no price
            const ltp = marketData.prices[h.instrumentId]?.lastPrice || h.avgCost;

            const invested = h.avgCost * h.quantity;
            const current = ltp * h.quantity;

            totalInvested += invested;
            totalHoldingsValue += current;
        });

        const totalPL = totalHoldingsValue - totalInvested;
        const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
        const totalEquity = totalHoldingsValue + cashBalance;

        return {
            totalHoldingsValue,
            totalInvested,
            totalPL,
            totalPLPercent,
            totalEquity,
            holdingsCount: holdings.length
        };
    }, [holdings, marketData, cashBalance]);

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleSimulateSnapshot = async () => {
        try {
            await portfolioService.captureSnapshot();
            alert('Snapshot captured! Refresh to see data update.');
        } catch (err) {
            console.error(err);
            alert('Failed to capture snapshot');
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Portfolio
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your holdings and track performance.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="portfolio tabs">
                    <Tab label="Overview" />
                    <Tab label="Analytics" />
                </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 4 }}>
                    <PortfolioSummary
                        totalEquity={summary.totalEquity}
                        totalHoldingsValue={summary.totalHoldingsValue}
                        cashBalance={cashBalance}
                        totalPL={summary.totalPL}
                        totalPLPercent={summary.totalPLPercent}
                        holdingsCount={summary.holdingsCount}
                    />
                </Box>

                <Box>
                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
                        Your Holdings
                    </Typography>
                    <HoldingsTable holdings={holdings} />
                </Box>
            </CustomTabPanel>

            <CustomTabPanel value={tabValue} index={1}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSimulateSnapshot}
                    >
                        Simulate Daily Snapshot
                    </Button>
                </Box>
                <EquityCurveChart />
            </CustomTabPanel>
        </Container>
    );
};
