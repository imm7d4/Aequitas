import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    Alert,
    Typography,
    Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface ShortSellWarningProps {
    open: boolean;
    onClose: (accepted: boolean) => void;
}

export const ShortSellWarning: React.FC<ShortSellWarningProps> = ({ open, onClose }) => {
    const [checks, setChecks] = useState({
        unlimitedRisk: false,
        marginCall: false,
        lossPotential: false
    });

    const canProceed = Object.values(checks).every(Boolean);

    const handleCheck = (key: keyof typeof checks) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecks(prev => ({ ...prev, [key]: e.target.checked }));
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
                <WarningIcon /> Short Selling Risk Disclosure
            </DialogTitle>
            <DialogContent>
                <DialogContentText paragraph sx={{ fontWeight: 600 }}>
                    Short selling involves significant risks that differ from buying stocks.
                    Please acknowledge the following risks to proceed:
                </DialogContentText>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Alert severity="warning" variant="outlined" sx={{ mb: 2 }}>
                        Unlike buying a stock where your loss is limited to your investment,
                        short selling has theoretically <strong>unlimited loss potential</strong> if the stock price rises indefinitely.
                    </Alert>

                    <FormControlLabel
                        control={<Checkbox checked={checks.unlimitedRisk} onChange={handleCheck('unlimitedRisk')} />}
                        label="I understand that short selling involves theoretically unlimited risk."
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checks.lossPotential} onChange={handleCheck('lossPotential')} />}
                        label="I understand I may lose substantially more than my initial margin."
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checks.marginCall} onChange={handleCheck('marginCall')} />}
                        label="I understand margin calls may require immediate funds or position liquidation."
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => onClose(false)} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={() => onClose(true)}
                    variant="contained"
                    color="warning"
                    disabled={!canProceed}
                >
                    I Understand & Accept Risks
                </Button>
            </DialogActions>
        </Dialog>
    );
};
