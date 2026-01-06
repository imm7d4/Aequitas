import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Box, Typography, Paper, useTheme, CircularProgress } from '@mui/material';
import { portfolioService } from '../services/portfolioService';

interface Snapshot {
    date: string;
    totalEquity: number;
    cashBalance: number;
    holdingsValue: number;
}

export const EquityCurveChart: React.FC = () => {
    const theme = useTheme();
    const [data, setData] = useState<Snapshot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const history = await portfolioService.getHistory(30);
                // Format date for display
                const formattedData = history.map((item: any) => ({
                    ...item,
                    date: new Date(item.date).toLocaleDateString(),
                }));
                setData(formattedData);
            } catch (err) {
                console.error('Failed to fetch history', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>;
    }

    if (data.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                    No history data available yet. Snapshots will be generated daily.
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
                Portfolio Performance (30 Days)
            </Typography>
            <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke={theme.palette.text.secondary}
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 8,
                                border: `1px solid ${theme.palette.divider}`
                            }}
                            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Equity']}
                        />
                        <Area
                            type="monotone"
                            dataKey="totalEquity"
                            stroke={theme.palette.primary.main}
                            fillOpacity={1}
                            fill="url(#colorEquity)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};
