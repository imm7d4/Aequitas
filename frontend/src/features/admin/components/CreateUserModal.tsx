import React from 'react';
import { 
    Box, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, 
    Select, FormControl, InputLabel, Button
} from '@mui/material';

interface CreateUserModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    submitting: boolean;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onSubmit, submitting }) => {
    const [newUserData, setNewUserData] = React.useState({ email: '', fullName: '', password: '', role: 'SUPPORT' });

    const handleSubmit = () => {
        if (!newUserData.email || !newUserData.password || !newUserData.role) {
            alert('Email, Password and Role are required');
            return;
        }
        onSubmit(newUserData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Create New Admin User</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                    <TextField
                        label="Full Name" fullWidth size="small"
                        value={newUserData.fullName}
                        onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                    />
                    <TextField
                        label="Email Address" fullWidth size="small"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    />
                    <TextField
                        label="Initial Password" type="password" fullWidth size="small"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel>Assign Role</InputLabel>
                        <Select
                            value={newUserData.role} label="Assign Role"
                            onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value })}
                        >
                            <MenuItem value="PLATFORM_ADMIN">Platform Admin</MenuItem>
                            <MenuItem value="RISK_OFFICER">Risk Officer</MenuItem>
                            <MenuItem value="SUPPORT">Support Officer</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} disabled={submitting}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create User'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
