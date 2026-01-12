import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    Visibility as VisibleIcon,
    VisibilityOff as HiddenIcon,
} from '@mui/icons-material';
import { useAuth } from '@/features/auth';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { MarketPulse } from '@/features/dashboard/components/MarketPulse';
import { BehavioralInsights } from '@/features/dashboard/components/BehavioralInsights';
import { TradingAnalysis } from '@/features/dashboard/components/TradingAnalysis';
import {
    dashboardService,
    DashboardSummary,
} from '@/features/dashboard/services/dashboardService';

export function Dashboard(): JSX.Element {
    const { user } = useAuth();
    const [showBalance, setShowBalance] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(
        null
    );

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const data = await dashboardService.getSummary();
                setDashboardData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch dashboard data', err);
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const userDisplayName =
        user?.fullName || user?.email?.split('@')[0] || 'Trader';

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !dashboardData) {
        return (
            <Box sx={{ py: 3, px: { xs: 1, md: 3 } }}>
                <Alert severity="error">{error || 'No data available'}</Alert>
            </Box>
        );
    }

    const { performanceOverview, tradingAnalysis, behavioralInsights,
        marketIntelligence, portfolioDistribution } = dashboardData;

    return (
        <Box sx={{ py: 3, px: { xs: 1, md: 3 } }}>
            {/* Greeter Section */}
            <Box
                sx={{
                    mb: 5,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        sx={{ letterSpacing: '-0.02em', mb: 1 }}
                    >
                        Welcome back, {userDisplayName}! 📈
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                        The market is calling. Let's analyze your performance.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={showBalance ? <HiddenIcon /> : <VisibleIcon />}
                    onClick={() => setShowBalance(!showBalance)}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        mt: 1,
                    }}
                >
                    {showBalance ? 'Hide Values' : 'Show Values'}
                </Button>
            </Box>

            {/* Performance Overview */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Equity"
                        value={`₹${performanceOverview.totalEquity.toLocaleString()}`}
                        subtitle="Cash + Holdings"
                        isPrivate={!showBalance}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Realized P&L"
                        value={`₹${performanceOverview.realizedPL.toLocaleString()}`}
                        change={
                            performanceOverview.realizedPL > 0
                                ? `+${performanceOverview.realizedPL.toFixed(2)}`
                                : performanceOverview.realizedPL.toFixed(2)
                        }
                        isPositive={performanceOverview.realizedPL > 0}
                        subtitle="Closed trades"
                        isPrivate={!showBalance}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Unrealized P&L"
                        value={`₹${performanceOverview.unrealizedPL.toLocaleString()}`}
                        change={
                            performanceOverview.unrealizedPL > 0
                                ? `+${performanceOverview.unrealizedPL.toFixed(2)}`
                                : performanceOverview.unrealizedPL.toFixed(2)
                        }
                        isPositive={performanceOverview.unrealizedPL > 0}
                        subtitle="Open positions"
                        isPrivate={!showBalance}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Positions"
                        value={portfolioDistribution.activePositions.toString()}
                        subtitle="Current holdings"
                        isPrivate={!showBalance}
                    />
                </Grid>
            </Grid>

            {/* Trading Analysis */}
            <Box sx={{ mb: 6 }}>
                <TradingAnalysis analysis={tradingAnalysis} />
            </Box>

            {/* Behavioral Insights */}
            <Box sx={{ mb: 6 }}>
                <BehavioralInsights insights={behavioralInsights} />
            </Box>

            {/* Market Pulse */}
            <Box sx={{ mb: 6 }}>
                <MarketPulse
                    topGainers={marketIntelligence.topGainers}
                    topLosers={marketIntelligence.topLosers}
                />
            </Box>
        </Box>
    );
}
