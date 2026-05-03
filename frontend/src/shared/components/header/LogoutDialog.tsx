import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface LogoutDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const LogoutDialog: React.FC<LogoutDialogProps> = ({ open, onClose, onConfirm }) => (
    <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent><DialogContentText>Are you sure you want to log out?</DialogContentText></DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="inherit">Cancel</Button>
            <Button onClick={onConfirm} color="error" autoFocus>Logout</Button>
        </DialogActions>
    </Dialog>
);
