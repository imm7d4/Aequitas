import React from 'react';
import { Box, Typography, Stack, TextField, Button } from '@mui/material';

interface EmailUpdateSectionProps {
    email: string;
    newEmail: string;
    currentPassword: string;
    otp: string;
    step: 'view' | 'confirm' | 'otp';
    isLoading: boolean;
    onStepChange: (step: 'view' | 'confirm' | 'otp') => void;
    onNewEmailChange: (val: string) => void;
    onPasswordChange: (val: string) => void;
    onOtpChange: (val: string) => void;
    onInitiate: () => void;
    onComplete: () => void;
}

export const EmailUpdateSection: React.FC<EmailUpdateSectionProps> = ({
    email, newEmail, currentPassword, otp, step, isLoading, onStepChange, onNewEmailChange, onPasswordChange, onOtpChange, onInitiate, onComplete
}) => (
    <Box sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
        <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main' }}>🛡 Secure Email Management</Typography>
        {step === 'view' ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box><Typography variant="caption" color="text.secondary">Current Email</Typography><Typography variant="body1">{email}</Typography></Box>
                <Button variant="outlined" size="small" onClick={() => onStepChange('confirm')}>Change Email</Button>
            </Box>
        ) : step === 'confirm' ? (
            <Stack spacing={2}>
                <TextField fullWidth label="New Email" value={newEmail} onChange={(e) => onNewEmailChange(e.target.value)} size="small" />
                <TextField fullWidth type="password" label="Confirm Password" value={currentPassword} onChange={(e) => onPasswordChange(e.target.value)} size="small" />
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" onClick={onInitiate} disabled={isLoading}>Send Verification</Button>
                    <Button variant="text" size="small" onClick={() => onStepChange('view')} disabled={isLoading}>Cancel</Button>
                </Stack>
            </Stack>
        ) : (
            <Stack spacing={2}>
                <Typography variant="body2">Code sent to {newEmail}</Typography>
                <TextField fullWidth label="Code" value={otp} onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').slice(0, 6))} size="small" />
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" size="small" onClick={onComplete} disabled={isLoading}>Verify & Update</Button>
                    <Button variant="text" size="small" onClick={() => onStepChange('confirm')} disabled={isLoading}>Back</Button>
                </Stack>
            </Stack>
        )}
    </Box>
);
