import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, IconButton,
    Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { AccountBalanceWallet, History } from '@mui/icons-material';

interface User {
    id: string;
    fullName: string;
    email: string;
}

export const WalletManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [adjustmentOpen, setAdjustmentOpen] = useState(false);
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [adjustmentReason, setAdjustmentReason] = useState('');

    useEffect(() => {
        // We reuse the user list for now, but in a real app this might be a wallet-specific view
        fetch(`${import.meta.env.VITE_API_URL}/user-administration/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setUsers(data.data || []))
        .catch(console.error);
    }, []);

    const handleRequestJIT = () => {
        if (!selectedUser) return;
        
        fetch(`${import.meta.env.VITE_API_URL}/admin/jit/request`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'WALLET_ADJUSTMENT',
                resourceId: selectedUser.id,
                amount: parseFloat(adjustmentAmount),
                reason: adjustmentReason,
                duration: 15
            })
        })
        .then(() => {
            alert('JIT Request submitted to SuperAdmin for approval.');
            setAdjustmentOpen(false);
        })
        .catch(console.error);
    };

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #eee' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Wallet Management</Typography>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>User Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" title="Audit History"><History /></IconButton>
                                        <IconButton 
                                            size="small" 
                                            color="primary" 
                                            title="Adjust Wallet"
                                            onClick={() => { setSelectedUser(user); setAdjustmentOpen(true); }}
                                        >
                                            <AccountBalanceWallet />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={adjustmentOpen} onClose={() => setAdjustmentOpen(false)}>
                <DialogTitle>Request Wallet Adjustment</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Adjusting balance for <b>{selectedUser?.fullName}</b>. 
                        This requires SuperAdmin approval via Maker-Checker.
                    </Typography>
                    <TextField
                        fullWidth
                        label="Amount (Negative for Debit)"
                        type="number"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Reason for Adjustment"
                        multiline
                        rows={3}
                        value={adjustmentReason}
                        onChange={(e) => setAdjustmentReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAdjustmentOpen(false)}>Cancel</Button>
                    <Button onClick={handleRequestJIT} variant="contained" color="primary">Request Approval</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
