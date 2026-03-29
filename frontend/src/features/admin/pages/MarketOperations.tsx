import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Button, Paper, TextField, 
    Dialog, DialogTitle, DialogContent, DialogActions,
    Alert, AlertTitle, Grid
} from '@mui/material';
import { 
    Dangerous as HaltIcon, 
    PlayArrow as ResumeIcon,
    Gavel as DualAuthIcon
} from '@mui/icons-material';

interface AdminConfig {
    isGlobalHalt: boolean;
    haltReason: string;
    maintenanceMode: boolean;
}

export const MarketOps: React.FC = () => {
    const [config, setConfig] = useState<AdminConfig | null>(null);
    const [haltDialogOpen, setHaltDialogOpen] = useState(false);
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            setConfig(data.data);
        } catch (err) {
            console.error('Failed to fetch config', err);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleHaltRequest = async () => {
        if (!reason) return;
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/jit/request`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'CONFIG_UPDATE',
                    resourceId: '000000000000000000000000',
                    amount: 0,
                    reason: `MARKET_HALT: ${reason}`,
                    duration: 60
                })
            });

            if (!res.ok) throw new Error('Failed to initiate halt request');
            
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...config, isGlobalHalt: true, haltReason: reason })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to halt. Ensure JIT request is approved.');
            }

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
            // US-12.3: Request JIT Access for RESUME_MARKET
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/jit/request`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'RESUME_MARKET',
                    resourceId: '000000000000000000000000', // Global
                    amount: 0,
                    reason: 'Emergency resume after review',
                    duration: 60
                })
            });

            if (!res.ok) throw new Error('Failed to initiate resume request');
            
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
            const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/config`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...config, isGlobalHalt: false, haltReason: '' })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to resume. Ensure JIT request is approved.');
            }

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
                    <AlertTitle>Error</AlertTitle>
                    {error}
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
                            variant="contained" 
                            color="success" 
                            size="large"
                            startIcon={<ResumeIcon />}
                            onClick={handleResumeRequest}
                            sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700 }}
                        >
                            Initiate Resume
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="error" 
                            size="large"
                            startIcon={<HaltIcon />}
                            onClick={() => setHaltDialogOpen(true)}
                            sx={{ borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700 }}
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
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Resuming the market after a global halt requires dual-party authorization. 
                                Clicking "Initiate Resume" creates a JIT request that must be approved by another administrator.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* Halt Dialog */}
            <Dialog open={haltDialogOpen} onClose={() => setHaltDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Confirm Emergency Market Halt</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 3, mt: 1 }}>
                        This will immediately halt ALL trading activity across the platform for all users.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Reason for Halt"
                        multiline
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g., Extreme Volatility, Risk Engine Failure, etc."
                    />
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setHaltDialogOpen(false)}>Cancel</Button>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="outlined" 
                            color="info" 
                            onClick={handleHaltRequest}
                            disabled={!reason || loading}
                        >
                            Step 1: Request JIT
                        </Button>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={handleFinalHalt}
                            disabled={!reason || loading}
                        >
                            Step 2: Halt Market
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Resume Dialog */}
            <Dialog open={resumeDialogOpen} onClose={() => setResumeDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Market Resume Requested</DialogTitle>
                <DialogContent>
                    <Alert severity="info" sx={{ mt: 1 }}>
                        A JIT request for 'RESUME_MARKET' has been created. 
                        Please ask another administrator to approve it in the <strong>JIT Approvals</strong> queue.
                    </Alert>
                    <Typography variant="body2" sx={{ mt: 3 }}>
                        Once approved, you can click the button below to reactivate the market.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setResumeDialogOpen(false)}>Later</Button>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handleFinalResume}
                        disabled={loading}
                    >
                        Verify & Resume Market
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
