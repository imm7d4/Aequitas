import { Box, Typography, Button, Stack, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { WatchlistManager } from '@/features/watchlist/components/WatchlistManager';
import { WatchlistTable } from '@/features/watchlist/components/WatchlistTable';
import { useInstruments } from '@/features/instruments/hooks/useInstruments';

export function Dashboard(): JSX.Element {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Ensure instruments are fetched as they are needed for watchlist display
    // useInstruments() hook handles fetching on mount automatically
    useInstruments();


    return (
        <Box sx={{ py: 2 }}>
            <Box sx={{ mb: 8 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Dashboard
                        </Typography>
                    </Box>
                </Stack>

                <Grid container spacing={3}>
                    {/* Main Content - Watchlist */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                                <Typography variant="h6" fontWeight={600}>
                                    Watchlists
                                </Typography>
                            </Box>
                            <WatchlistManager />
                            <Box sx={{ p: 2 }}>
                                <WatchlistTable />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Sidebar - Quick Actions */}
                    <Grid item xs={12} md={4}>
                        <Stack spacing={3}>
                            <Paper sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Quick Actions
                                </Typography>
                                <Stack spacing={2}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        onClick={() => navigate('/instruments')}
                                    >
                                        View All Instruments
                                    </Button>
                                    {user?.isAdmin && (
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            fullWidth
                                            onClick={() => navigate('/admin')}
                                        >
                                            Admin Panel
                                        </Button>
                                    )}
                                </Stack>
                            </Paper>

                            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                <Typography variant="h6" gutterBottom>
                                    Trading Status
                                </Typography>
                                <Typography variant="body2">
                                    Your account is active and ready for trading.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
