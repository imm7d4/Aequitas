import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Fade,
} from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import {
    Visibility as VisibleIcon,
    VisibilityOff as HiddenIcon,
} from '@mui/icons-material';
import { useAuth } from '@/features/auth';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { MarketPulse } from '@/features/dashboard/components/MarketPulse';
import { BehavioralInsights } from '@/features/dashboard/components/BehavioralInsights';
import { TradingAnalysis } from '@/features/dashboard/components/TradingAnalysis';
import { MarketHeatmap } from '@/features/dashboard/components/MarketHeatmap';
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
                setError('Failed to load dashboard data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const userDisplayName =
        user?.fullName || user?.email?.split('@')[0] || 'Trader';

    return (
        <Box
            id="dashboard-overview"
            sx={{
                height: 'calc(100vh - 64px)',
                p: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
            }}
        >
            <Fade in={true} timeout={600}>
                <Box
                    sx={{
                        mb: 3,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                letterSpacing: '-0.01em',
                                mb: 0.5,
                                color: 'text.primary',
                            }}
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
            </Fade>

            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '40vh',
                    }}
                >
                    <Loader size="medium" />
                </Box>
            ) : error || !dashboardData ? (
                <Alert severity="error">{error || 'No data available'}</Alert>
            ) : (
                <Fade in={!loading} timeout={400}>
                    <Box>
                        {/* Performance Overview */}
                        <Grid container spacing={3} sx={{ mb: 6 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Total Equity"
                                    value={`₹${dashboardData.performanceOverview.totalEquity.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    subtitle="Cash + Holdings"
                                    isPrivate={!showBalance}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Realized P&L"
                                    value={`₹${dashboardData.performanceOverview.realizedPL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    isPrivate={!showBalance}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Unrealized P&L"
                                    value={`₹${dashboardData.performanceOverview.unrealizedPL.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                    isPrivate={!showBalance}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard
                                    title="Active Positions"
                                    value={dashboardData.portfolioDistribution.activePositions.toString()}
                                    subtitle="Current holdings"
                                    isPrivate={!showBalance}
                                />
                            </Grid>
                        </Grid>

                        {/* Trading Analysis */}
                        <Box sx={{ mb: 6 }}>
                            <TradingAnalysis analysis={dashboardData.tradingAnalysis} />
                        </Box>

                        {/* Behavioral Insights */}
                        <Box sx={{ mb: 6 }}>
                            <BehavioralInsights insights={dashboardData.behavioralInsights} />
                        </Box>

                        {/* Market Pulse */}
                        <Box sx={{ mb: 6 }}>
                            <MarketPulse
                                topGainers={dashboardData.marketIntelligence.topGainers}
                                topLosers={dashboardData.marketIntelligence.topLosers}
                            />
                        </Box>

                        {/* Market Heatmap */}
                        <Box sx={{ mb: 6 }}>
                            <MarketHeatmap data={dashboardData.marketHeatmap} />
                        </Box>
                    </Box>
                </Fade>
            )}
        </Box>
    );
}
