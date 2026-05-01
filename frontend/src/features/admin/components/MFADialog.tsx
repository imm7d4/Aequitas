import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Typography, TextField, Button, Box 
} from '@mui/material';
import { Security } from '@mui/icons-material';

interface MFADialogProps {
    open: boolean;
    onClose: () => void;
    otp: string;
    onOtpChange: (val: string) => void;
    onSubmit: () => void;
}

export const MFADialog: React.FC<MFADialogProps> = ({ open, onClose, otp, onOtpChange, onSubmit }) => (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '12px', width: 360 } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 800 }}>
            <Security color="primary" /> Step-Up MFA
        </DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                This is a high-risk action. Please enter the verification code sent to your registered device.
            </Typography>
            <TextField
                fullWidth label="Verification Code" placeholder="123456"
                value={otp} onChange={e => onOtpChange(e.target.value)}
                variant="outlined" autoFocus
            />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button onClick={onClose}>Cancel</Button>
            <Button 
                variant="contained" onClick={onSubmit}
                sx={{ fontWeight: 700, borderRadius: '8px' }}
            >
                Verify & Approve
            </Button>
        </DialogActions>
    </Dialog>
);
