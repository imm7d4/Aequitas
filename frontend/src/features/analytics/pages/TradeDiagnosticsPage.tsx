import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Container,
    CircularProgress,
    Alert,
    Fade,
} from '@mui/material';
import { TradeDiagnosticsLog } from '../components/TradeDiagnosticsLog';
import { analyticsService, TradeResult } from '../services/analyticsService';

export const TradeDiagnosticsPage: React.FC = () => {
    const [trades, setTrades] = useState<TradeResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDiagnostics = async () => {
            try {
                setLoading(true);
                const data = await analyticsService.getTradeDiagnostics();
                setTrades(data);
                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load trade diagnostics');
            } finally {
                setLoading(false);
            }
        };

        fetchDiagnostics();
    }, []);

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', pb: 1, display: 'flex', flexDirection: 'column' }}>
            <Fade in={true} timeout={600}>
                <Box sx={{ mb: 1.5, flexShrink: 0 }}>
                    <Typography variant="h5" fontWeight={700}>
                        Trade Diagnostics
                    </Typography>
                </Box>
            </Fade>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ ml: 2, color: 'text.secondary' }}>
                        Analyzing trade history...
                    </Typography>
                </Box>
            ) : (
                <Fade in={!loading} timeout={400}>
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        <TradeDiagnosticsLog trades={trades} />
                    </Box>
                </Fade>
            )}
        </Container>
    );
};
