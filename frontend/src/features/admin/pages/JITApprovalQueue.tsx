import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, Chip
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';

interface JITRequest {
    id: string;
    makerId: string;
    action: string;
    resourceId: string;
    amount: number;
    reason: string;
    duration: number;
    status: string;
    createdAt: string;
}

export const JITApprovalQueue: React.FC = () => {
    const [requests, setRequests] = useState<JITRequest[]>([]);

    const fetchRequests = () => {
        fetch(`${import.meta.env.VITE_API_URL}/admin/jit/requests`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setRequests(data.data || []))
        .catch(console.error);
    };

    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    const handleApprove = (id: string) => {
        fetch(`${import.meta.env.VITE_API_URL}/admin/jit/approve`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ requestId: id })
        })
        .then(() => fetchRequests())
        .catch(console.error);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #eee' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Pending Approvals (Maker-Checker)</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Action</TableCell>
                                <TableCell>Resource</TableCell>
                                <TableCell>Details</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.filter(r => r.status === 'PENDING').map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell><Chip label={req.action} size="small" color="primary" variant="outlined" /></TableCell>
                                    <TableCell>{req.resourceId}</TableCell>
                                    <TableCell>{req.amount !== 0 ? `Amount: ${req.amount}` : 'N/A'}</TableCell>
                                    <TableCell>{req.reason}</TableCell>
                                    <TableCell><Chip label={req.status} size="small" /></TableCell>
                                    <TableCell align="right">
                                        <Button 
                                            startIcon={<Close />} 
                                            color="error" 
                                            sx={{ mr: 1 }}
                                            onClick={() => {/* Implement Reject */}}
                                        >
                                            Reject
                                        </Button>
                                        <Button 
                                            startIcon={<Check />} 
                                            variant="contained" 
                                            color="success"
                                            onClick={() => handleApprove(req.id)}
                                        >
                                            Approve
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};
