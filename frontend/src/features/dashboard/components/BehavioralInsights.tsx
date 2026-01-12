import { Box, Paper, Typography, Grid, LinearProgress } from '@mui/material';
import { BehavioralInsights as BehavioralInsightsType } from '../services/dashboardService';

interface BehavioralInsightsProps {
    insights: BehavioralInsightsType;
}

export function BehavioralInsights({ insights }: BehavioralInsightsProps) {
    const timeSlots = ['Opening', 'Midday', 'Closing'];
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Typography variant="h6" gutterBottom fontWeight={700}>
                🕒 Behavioral Insights
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Reveals when you trade best—not just what you trade
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Win Rate by Time of Day
                    </Typography>
                    {timeSlots.map((slot) => {
                        const rate = insights.winRateByTimeOfDay[slot] || 0;
                        return (
                            <Box key={slot} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">{slot}</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {rate.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={rate}
                                    sx={{
                                        height: 8,
                                        borderRadius: 1,
                                        bgcolor: 'action.hover',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: rate > 50 ? 'success.main' : 'warning.main',
                                        },
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Win Rate by Day of Week
                    </Typography>
                    {weekdays.map((day) => {
                        const rate = insights.winRateByDayOfWeek[day] || 0;
                        return (
                            <Box key={day} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">{day}</Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {rate.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={rate}
                                    sx={{
                                        height: 8,
                                        borderRadius: 1,
                                        bgcolor: 'action.hover',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: rate > 50 ? 'success.main' : 'warning.main',
                                        },
                                    }}
                                />
                            </Box>
                        );
                    })}
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Average Holding Duration
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'success.50',
                                    border: '1px solid',
                                    borderColor: 'success.200',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    Winning Trades
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="success.main">
                                    {insights.avgHoldingDuration.winningTrades.toFixed(1)}h
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'error.50',
                                    border: '1px solid',
                                    borderColor: 'error.200',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    Losing Trades
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="error.main">
                                    {insights.avgHoldingDuration.losingTrades.toFixed(1)}h
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
