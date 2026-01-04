import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { OrderResponse } from '../services/orderService';

interface EditOrderDialogProps {
    open: boolean;
    order: OrderResponse | null;
    onClose: () => void;
    onConfirm: (quantity: number, price?: number) => void;
    lotSize?: number;
    tickSize?: number;
}

export const EditOrderDialog: React.FC<EditOrderDialogProps> = ({
    open,
    order,
    onClose,
    onConfirm,
    lotSize = 1,
    tickSize = 0.05,
}) => {
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState<number | undefined>(undefined);
    const [errors, setErrors] = useState<{ quantity?: string; price?: string }>({});

    useEffect(() => {
        if (order) {
            setQuantity(order.quantity);
            setPrice(order.price);
            setErrors({});
        }
    }, [order]);

    const validate = () => {
        const newErrors: { quantity?: string; price?: string } = {};

        if (quantity <= 0) {
            newErrors.quantity = 'Quantity must be positive';
        } else if (quantity % lotSize !== 0) {
            newErrors.quantity = `Quantity must be a multiple of ${lotSize}`;
        }

        if (order?.orderType === 'LIMIT') {
            if (!price || price <= 0) {
                newErrors.price = 'Price is required for limit orders';
            } else {
                // Use a more robust tick size validation to avoid floating-point precision issues
                const factor = 1 / tickSize;
                const scaledPrice = Math.round(price * factor);
                const scaledTickSize = Math.round(tickSize * factor);

                if (scaledPrice % scaledTickSize !== 0) {
                    newErrors.price = `Price must be a multiple of ${tickSize}`;
                }
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirm = () => {
        if (validate()) {
            onConfirm(quantity, order?.orderType === 'LIMIT' ? price : undefined);
            onClose();
        }
    };

    if (!order) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, p: 1 },
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
                <EditIcon color="primary" />
                Modify Order
            </DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                        Modifying <strong>{order.symbol}</strong> {order.side} order
                    </Alert>

                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        error={!!errors.quantity}
                        helperText={errors.quantity || `Lot size: ${lotSize}`}
                        sx={{ mb: 2 }}
                    />

                    {order.orderType === 'LIMIT' && (
                        <TextField
                            label="Price"
                            type="number"
                            fullWidth
                            value={price || ''}
                            onChange={(e) => setPrice(parseFloat(e.target.value) || undefined)}
                            error={!!errors.price}
                            helperText={errors.price || `Tick size: ${tickSize}`}
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                            }}
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="text"
                    color="inherit"
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="primary"
                    sx={{ fontWeight: 700, borderRadius: 2, px: 3, boxShadow: 'none' }}
                >
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};
