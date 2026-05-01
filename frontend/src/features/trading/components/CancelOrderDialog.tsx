import React from 'react';
import { 
    Dialog, DialogTitle, DialogContent, 
    DialogContentText, DialogActions, 
    Button 
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

interface CancelOrderDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
    open, onClose, onConfirm
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 3, p: 1, minWidth: 320 }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700 }}>
                <WarningIcon color="warning" />
                Confirm Cancellation
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ fontWeight: 500 }}>
                    Are you sure you want to cancel this order? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={onClose}
                    variant="text"
                    color="inherit"
                    sx={{ fontWeight: 600, borderRadius: 2 }}
                >
                    No, Keep Order
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{ fontWeight: 700, borderRadius: 2, px: 3, boxShadow: 'none' }}
                >
                    Yes, Cancel Order
                </Button>
            </DialogActions>
        </Dialog>
    );
};
