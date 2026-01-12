import { Box, Paper, Typography, Grid } from '@mui/material';
import { TradingAnalysis as TradingAnalysisType } from '../services/dashboardService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface TradingAnalysisProps {
    analysis: TradingAnalysisType;
}

export function TradingAnalysis({ analysis }: TradingAnalysisProps) {
    const winLossData = [
        { name: 'Wins', value: analysis.winCount, color: '#10b981' },
        { name: 'Losses', value: analysis.lossCount, color: '#ef4444' },
    ];

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
                📊 Trading Analysis
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                        Win/Loss Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={winLossData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {winLossData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="h4" fontWeight={700}>
                            {analysis.winRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Win Rate
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
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
                                    Avg Win
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="success.main">
                                    ₹{analysis.avgWin.toFixed(2)}
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
                                    Avg Loss
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="error.main">
                                    ₹{analysis.avgLoss.toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
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
                                    Largest Win
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="success.main">
                                    ₹{analysis.largestWin.toFixed(2)}
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
                                    Largest Loss
                                </Typography>
                                <Typography variant="h6" fontWeight={700} color="error.main">
                                    ₹{analysis.largestLoss.toFixed(2)}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: 'primary.50',
                                    border: '1px solid',
                                    borderColor: 'primary.200',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="caption" color="text.secondary">
                                    Total Trades
                                </Typography>
                                <Typography variant="h5" fontWeight={700} color="primary.main">
                                    {analysis.totalTrades}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}
