import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Typography,
    Box,
} from '@mui/material';
import { alertService } from '../services/alertService';


interface SetAlertModalProps {
    open: boolean;
    onClose: () => void;
    instrumentId: string;
    symbol: string;
    currentPrice: number;
}

export const SetAlertModal: React.FC<SetAlertModalProps> = ({
    open,
    onClose,
    instrumentId,
    symbol,
    currentPrice,
}) => {
    const [targetPrice, setTargetPrice] = useState<string>(currentPrice.toFixed(2));
    const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        const price = parseFloat(targetPrice);
        if (isNaN(price) || price <= 0) {
            setError('Please enter a valid price');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Auto-detect condition if user didn't change logic, but typically user sets logic.
            // Let's suggest logic based on current price if needed, but manual override is best.
            await alertService.createAlert(instrumentId, symbol, price, condition);
            onClose();
            // Provide feedback via global toast possibly
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create alert');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Set Price Alert for {symbol}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Price: ₹{currentPrice.toFixed(2)}
                    </Typography>

                    <TextField
                        select
                        label="Condition"
                        fullWidth
                        margin="normal"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as 'ABOVE' | 'BELOW')}
                    >
                        <MenuItem value="ABOVE">Price Goes Above</MenuItem>
                        <MenuItem value="BELOW">Price Goes Below</MenuItem>
                    </TextField>

                    <TextField
                        label="Target Price"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        error={!!error}
                        helperText={error}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? 'Setting...' : 'Set Alert'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
