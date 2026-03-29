import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, MenuItem, Stack, Typography, Alert
} from '@mui/material';
import { Base64ImagePicker } from './Base64ImagePicker';

interface RaiseTicketModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const RaiseTicketModal: React.FC<RaiseTicketModalProps> = ({ open, onClose, onSuccess }) => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('TECHNICAL');
    const [description, setDescription] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!subject || !description) {
            setError('Subject and Description are required.');
            return;
        }

        setLoading(true);
        setError('');

        fetch(`${import.meta.env.VITE_API_URL}/tickets`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject,
                category,
                description,
                attachments
            })
        })
        .then(async res => {
            if (!res.ok) throw new Error('Failed to create ticket');
            onSuccess();
            onClose();
            reset();
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    const reset = () => {
        setSubject('');
        setCategory('TECHNICAL');
        setDescription('');
        setAttachments([]);
        setLoading(false);
        setError('');
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Raise Support Ticket</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Subject"
                        fullWidth
                        size="small"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="e.g. Withdrawal failed, Login issue"
                    />
                    <TextField
                        select
                        label="Category"
                        fullWidth
                        size="small"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <MenuItem value="TECHNICAL">Technical Issue</MenuItem>
                        <MenuItem value="WALLET">Wallet & Payments</MenuItem>
                        <MenuItem value="TRADING">Trading & Orders</MenuItem>
                        <MenuItem value="ACCOUNT">Account & Profile</MenuItem>
                        <MenuItem value="OTHERS">Others</MenuItem>
                    </TextField>
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        size="small"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Provide as much detail as possible..."
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 1 }}>
                        Attachments
                    </Typography>
                    <Base64ImagePicker 
                        selectedImages={attachments}
                        onImagesSelected={(imgs) => setAttachments(prev => [...prev, ...imgs].slice(0, 3))}
                        onRemoveImage={(i) => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button 
                    variant="contained" 
                    onClick={handleSubmit} 
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
