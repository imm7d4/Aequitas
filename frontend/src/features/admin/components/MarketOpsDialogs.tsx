import React from 'react';
import { 
    Box, Typography, Button, TextField, 
    Dialog, DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';

interface HaltDialogProps {
    open: boolean;
    onClose: () => void;
    reason: string;
    onReasonChange: (val: string) => void;
    onHaltRequest: () => void;
    onFinalHalt: () => void;
    loading: boolean;
}

export const HaltDialog: React.FC<HaltDialogProps> = ({ 
    open, onClose, reason, onReasonChange, onHaltRequest, onFinalHalt, loading 
}) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Confirm Emergency Market Halt</DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ mb: 3, mt: 1 }}>
                This will immediately halt ALL trading activity across the platform for all users.
            </Typography>
            <TextField
                fullWidth label="Reason for Halt" multiline rows={3}
                value={reason} onChange={(e) => onReasonChange(e.target.value)}
                placeholder="e.g., Extreme Volatility, Risk Engine Failure, etc."
            />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="outlined" color="info" onClick={onHaltRequest} disabled={!reason || loading}>
                    Step 1: Request JIT
                </Button>
                <Button variant="contained" color="error" onClick={onFinalHalt} disabled={!reason || loading}>
                    Step 2: Halt Market
                </Button>
            </Box>
        </DialogActions>
    </Dialog>
);

interface ResumeDialogProps {
    open: boolean;
    onClose: () => void;
    onFinalResume: () => void;
    loading: boolean;
}

export const ResumeDialog: React.FC<ResumeDialogProps> = ({ open, onClose, onFinalResume, loading }) => (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            <Button onClick={onClose}>Later</Button>
            <Button variant="contained" color="success" onClick={onFinalResume} disabled={loading}>
                Verify & Resume Market
            </Button>
        </DialogActions>
    </Dialog>
);
