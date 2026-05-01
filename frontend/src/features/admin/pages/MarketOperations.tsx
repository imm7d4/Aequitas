import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, 
    Alert, AlertTitle, Grid
} from '@mui/material';
import { 
    Dangerous as HaltIcon, 
    PlayArrow as ResumeIcon,
    Gavel as DualAuthIcon
} from '@mui/icons-material';
import { adminService, AdminConfig } from '../services/adminService';
import { HaltDialog, ResumeDialog } from '../components/MarketOpsDialogs';

export const MarketOps: React.FC = () => {
    const [config, setConfig] = useState<AdminConfig | null>(null);
    const [haltDialogOpen, setHaltDialogOpen] = useState(false);
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = async () => {
        try {
            const data = await adminService.getAdminConfig();
            setConfig(data);
        } catch (err) {
            console.error('Failed to fetch config', err);
        }
    };

    useEffect(() => { fetchConfig(); }, []);

    const handleHaltRequest = async () => {
        if (!reason) return;
        setLoading(true);
        try {
            await adminService.requestJITAccess({
                action: 'CONFIG_UPDATE',
                resourceId: '000000000000000000000000',
                amount: 0,
                reason: `MARKET_HALT: ${reason}`,
                duration: 60
            });
            alert('JIT Request Created. Please approve it in the JIT Queue before proceeding.');
            setHaltDialogOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalHalt = async () => {
        setLoading(true);
        try {
            await adminService.updateAdminConfig({ isGlobalHalt: true, haltReason: reason });
            await fetchConfig();
            setHaltDialogOpen(false);
            setReason('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeRequest = async () => {
        setLoading(true);
        try {
            await adminService.requestJITAccess({
                action: 'RESUME_MARKET',
                resourceId: '000000000000000000000000',
                amount: 0,
                reason: 'Emergency resume after review',
                duration: 60
            });
            setResumeDialogOpen(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalResume = async () => {
        setLoading(true);
        try {
            await adminService.updateAdminConfig({ isGlobalHalt: false, haltReason: '' });
            await fetchConfig();
            setResumeDialogOpen(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>Market Operations Control</Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }} onClose={() => setError(null)}>
                    <AlertTitle>Error</AlertTitle>{error}
                </Alert>
            )}

            <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #eee' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            Global Market State: {config?.isGlobalHalt ? (
                                <Box component="span" sx={{ color: 'error.main' }}>HALTED</Box>
                            ) : (
                                <Box component="span" sx={{ color: 'success.main' }}>OPERATIONAL</Box>
                            )}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {config?.isGlobalHalt ? `Reason: ${config.haltReason}` : 'Market is operating normally.'}
                        </Typography>
                    </Box>

                    {config?.isGlobalHalt ? (
                        <Button 
                            variant="contained" color="success" size="large" startIcon={<ResumeIcon />}
                            onClick={handleResumeRequest} sx={{ borderRadius: '12px', px: 4, fontWeight: 700 }}
                        >
                            Initiate Resume
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" color="error" size="large" startIcon={<HaltIcon />}
                            onClick={() => setHaltDialogOpen(true)} sx={{ borderRadius: '12px', px: 4, fontWeight: 700 }}
                        >
                            GLOBAL HALT
                        </Button>
                    )}
                </Box>
            </Paper>

            <Box sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 4, borderRadius: '24px', border: '1px solid #eee', height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                <DualAuthIcon sx={{ mr: 2, color: 'primary.main' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Governance Settings</Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                                Resuming the market after a global halt requires dual-party authorization.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <HaltDialog 
                open={haltDialogOpen} onClose={() => setHaltDialogOpen(false)} 
                reason={reason} onReasonChange={setReason} 
                onHaltRequest={handleHaltRequest} onFinalHalt={handleFinalHalt} loading={loading}
            />

            <ResumeDialog 
                open={resumeDialogOpen} onClose={() => setResumeDialogOpen(false)} 
                onFinalResume={handleFinalResume} loading={loading}
            />
        </Box>
    );
};
