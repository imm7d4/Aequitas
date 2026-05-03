import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Typography, TextField, Stack, Button } from '@mui/material';
import { Loader } from '../../../shared/components/Loader';

interface FundingDialogProps {
    open: boolean;
    step: 'amount' | 'otp';
    amount: string;
    otp: string;
    isFunding: boolean;
    timer: number;
    onClose: () => void;
    onAmountChange: (val: string) => void;
    onOtpChange: (val: string) => void;
    onFund: () => void;
    onVerify: () => void;
    onResend: () => void;
}

export const FundingDialog: React.FC<FundingDialogProps> = ({
    open, step, amount, otp, isFunding, timer, onClose, onAmountChange, onOtpChange, onFund, onVerify, onResend
}) => (
    <Dialog open={open} onClose={() => !isFunding && onClose()}>
        <DialogTitle>{step === 'amount' ? 'Add Funds' : 'Verify Deposit'}</DialogTitle>
        <DialogContent>
            <Box sx={{ pt: 1, minWidth: { xs: '100%', sm: 400 } }}>
                {step === 'amount' ? (
                    <>
                        <TextField fullWidth autoFocus label="Amount" type="number" value={amount} onChange={(e) => onAmountChange(e.target.value)} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }} />
                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap', gap: 1 }}>
                            {['1000', '5000', '10000', '50000'].map((amt) => (
                                <Button key={amt} size="small" variant="outlined" onClick={() => onAmountChange(amt)}>₹{(parseInt(amt) / 1000)}k</Button>
                            ))}
                        </Stack>
                    </>
                ) : (
                    <>
                        <TextField fullWidth autoFocus label="OTP" value={otp} onChange={(e) => onOtpChange(e.target.value.replace(/\D/g, '').substring(0, 6))} inputProps={{ style: { fontSize: '1.5rem', fontWeight: 700, textAlign: 'center' } }} />
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            {timer > 0 ? <Typography variant="caption">Resend in {timer}s</Typography> : <Button size="small" onClick={onResend}>Resend Now</Button>}
                        </Box>
                    </>
                )}
            </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={onClose} disabled={isFunding}>Cancel</Button>
            <Button variant="contained" onClick={step === 'amount' ? onFund : onVerify} disabled={isFunding || (step === 'otp' && otp.length < 6)}>
                {isFunding ? <Loader size="small" color="inherit" /> : (step === 'amount' ? 'Send OTP' : 'Complete Deposit')}
            </Button>
        </DialogActions>
    </Dialog>
);
