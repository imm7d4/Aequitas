import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Grid, Chip, Divider,
    IconButton, TextField, alpha, useTheme, CircularProgress
} from '@mui/material';
import {
    Close,
    ConfirmationNumber, Description, Send
} from '@mui/icons-material';

interface TradingAccount {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    balance: number;
    blockedMargin: number;
    freeCash: number;
    settlementPending: number;
    currency: string;
}

interface WalletDetailModalProps {
    open: boolean;
    account: TradingAccount | null;
    onClose: () => void;
}

const StatItem: React.FC<{ label: string, value: number, isCurrency?: boolean }> = ({ label, value, isCurrency = true }) => (
    <Box sx={{ p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block', mb: 0.5 }}>{label}</Typography>
        <Typography variant="body1" fontWeight={800} color={value < 0 ? 'error.main' : 'text.primary'}>
            {isCurrency ? `₹${value.toLocaleString()}` : value}
        </Typography>
    </Box>
);

export const WalletDetailModal: React.FC<WalletDetailModalProps> = ({ open, account, onClose }) => {
    const theme = useTheme();
    const [adjAmount, setAdjAmount] = useState('');
    const [ticketId, setTicketId] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmitJIT = () => {
        if (!account || !adjAmount || !ticketId || !reason) return;
        setSubmitting(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/jit/request`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'WALLET_ADJUSTMENT',
                resourceId: account.userId,
                amount: parseFloat(adjAmount),
                reason: `[Ticket: ${ticketId}] ${reason}`,
                duration: 60
            })
        })
        .then(() => {
            alert('JIT Request submitted to Approval Queue.');
            setSubmitting(false);
            onClose();
        })
        .catch(() => setSubmitting(false));
    };

    if (!account) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                <Typography variant="h6" fontWeight={800}>Wallet Management</Typography>
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight={800}>{account.fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">{account.email}</Typography>
                </Box>
                
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}><StatItem label="Total Balance" value={account.balance || 0} /></Grid>
                    <Grid item xs={6}><StatItem label="Free Cash" value={account.freeCash || 0} /></Grid>
                    <Grid item xs={6}><StatItem label="Locked Margin" value={account.blockedMargin || 0} /></Grid>
                    <Grid item xs={6}><StatItem label="Settlement Pending" value={account.settlementPending || 0} /></Grid>
                </Grid>

                <Divider sx={{ my: 3 }}><Chip label="ADJUSTMENT REQUEST (JIT)" size="small" sx={{ fontWeight: 800 }} /></Divider>
                <TextField fullWidth label="Adjustment Amount" type="number" size="small" value={adjAmount} onChange={e => setAdjAmount(e.target.value)} sx={{ mb: 2 }} placeholder="e.g. 5000 or -2000" />
                <TextField fullWidth label="Ticket ID / Reference" size="small" value={ticketId} onChange={e => setTicketId(e.target.value)} sx={{ mb: 2 }} InputProps={{ startAdornment: <ConfirmationNumber sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                <TextField fullWidth label="Reason" multiline rows={2} size="small" value={reason} onChange={e => setReason(e.target.value)} InputProps={{ startAdornment: <Description sx={{ mr: 1, color: 'text.disabled', fontSize: 20, mt: 1 }} /> }} />
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 0 }}>
                <Button variant="contained" fullWidth size="large" onClick={handleSubmitJIT} disabled={submitting || !adjAmount || !ticketId} startIcon={submitting ? <CircularProgress size={20} /> : <Send />} sx={{ borderRadius: '10px', fontWeight: 800 }}>Submit for Approval</Button>
            </DialogActions>
        </Dialog>
    );
};
