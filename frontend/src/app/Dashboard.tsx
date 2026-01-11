import { useState, useEffect } from 'react';
import { Box, Typography, Button, Stack, Paper, Grid, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    AccountBalanceWallet as WalletIcon,
    Timeline as PortfolioIcon,
    TrendingUp as ProfitIcon,
    Layers as MarginIcon,
    Visibility as VisibleIcon,
    VisibilityOff as HiddenIcon
} from '@mui/icons-material';
import { useAuth } from '@/features/auth';
import { useInstruments } from '@/features/instruments/hooks/useInstruments';
import { StatCard } from '@/features/dashboard/components/StatCard';
import { accountService, TradingAccount } from '@/features/profile/services/accountService';

export function Dashboard(): JSX.Element {
    const { user } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const [account, setAccount] = useState<TradingAccount | null>(null);
    const [showBalance, setShowBalance] = useState(false);

    // Initial data fetch
    useInstruments();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const acc = await accountService.getBalance();
                setAccount(acc);
            } catch (err) {
                console.error('Failed to fetch balance', err);
            }
        };
        fetchBalance();
    }, []);

    const userDisplayName = user?.fullName || user?.email?.split('@')[0] || 'Trader';

    return (
        <Box sx={{ py: 3, px: { xs: 1, md: 3 } }}>
            {/* Greeter Section */}
            <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: '-0.02em', mb: 1 }}>
                        Welcome back, {userDisplayName}! 📈
                    </Typography>
                    <Typography variant="body1" color="text.secondary" fontWeight={500}>
                        The market is calling. Let's make some smart trades today.
                    </Typography>
                </Box>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={showBalance ? <HiddenIcon /> : <VisibleIcon />}
                    onClick={() => setShowBalance(!showBalance)}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, mt: 1 }}
                >
                    {showBalance ? 'Hide Values' : 'Show Values'}
                </Button>
            </Box>

            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Available Balance"
                        value={account ? `₹${account.balance.toLocaleString()}` : '₹0'}
                        subtitle="Cash in account"
                        icon={<WalletIcon />}
                        isPrivate={!showBalance}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Portfolio Value"
                        value="₹24,580"
                        change="+2.4%"
                        isPositive={true}
                        subtitle="Current holdings"
                        icon={<PortfolioIcon />}
                        isPrivate={!showBalance}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Day P&L"
                        value="₹840.50"
                        change="+0.85%"
                        isPositive={true}
                        subtitle="Today's performance"
                        icon={<ProfitIcon />}
                        isPrivate={!showBalance}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Utilized Margin"
                        value="₹12,400"
                        subtitle="Blocked for trades"
                        icon={<MarginIcon />}
                        isPrivate={!showBalance}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={4}>
                {/* Quick Actions */}
                <Grid item xs={12} lg={6}>
                    <Stack spacing={4}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'divider',
                                bgcolor: alpha(theme.palette.primary.main, 0.02)
                            }}
                        >
                            <Typography variant="h6" gutterBottom fontWeight={700}>
                                Quick Actions
                            </Typography>
                            <Stack spacing={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => navigate('/instruments')}
                                    sx={{ borderRadius: 2, py: 1.2, fontWeight: 600, boxShadow: 'none' }}
                                >
                                    Trade New Instruments
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={() => navigate('/profile')}
                                    sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
                                >
                                    Account Settings
                                </Button>
                                {user?.isAdmin && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        fullWidth
                                        onClick={() => navigate('/admin')}
                                        sx={{ borderRadius: 2, py: 1.2, fontWeight: 600 }}
                                    >
                                        Admin Panel
                                    </Button>
                                )}
                            </Stack>
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ position: 'relative', zIndex: 1 }}>
                                <Typography variant="h6" gutterBottom fontWeight={700}>
                                    Trading Status
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                    Your account is verified and active. Market hours are currently standard. Happy trading!
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    right: -20,
                                    top: -20,
                                    opacity: 0.1,
                                    transform: 'rotate(-20deg)'
                                }}
                            >
                                <PortfolioIcon sx={{ fontSize: 120 }} />
                            </Box>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
