import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, 
    DialogActions, Button, Alert, 
    Stack, TextField 
} from '@mui/material';
import { 
    Gavel as GavelIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';

interface AuditLogJustificationDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (ticketRef: string, justification: string) => Promise<void>;
}

export const AuditLogJustificationDialog: React.FC<AuditLogJustificationDialogProps> = ({
    open, onClose, onConfirm
}) => {
    const [ticketRef, setTicketRef] = useState('');
    const [justification, setJustification] = useState('');

    const handleConfirm = async () => {
        await onConfirm(ticketRef, justification);
        setTicketRef('');
        setJustification('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GavelIcon color="primary" /> PII Access Justification
            </DialogTitle>
            <DialogContent>
                <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
                    US-12.4 requires mandatory justification for unmasking PII.
                </Alert>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField 
                        label="Ticket Reference" 
                        size="small" 
                        fullWidth 
                        value={ticketRef} 
                        onChange={(e) => setTicketRef(e.target.value)} 
                    />
                    <TextField 
                        label="Rationale" 
                        multiline 
                        rows={3} 
                        size="small" 
                        fullWidth 
                        value={justification} 
                        onChange={(e) => setJustification(e.target.value)} 
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    disabled={!ticketRef || !justification} 
                    startIcon={<VisibilityIcon />}
                >
                    Verify & Unmask
                </Button>
            </DialogActions>
        </Dialog>
    );
};
