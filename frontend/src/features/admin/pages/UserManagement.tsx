import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton
} from '@mui/material';
import { Edit, Block } from '@mui/icons-material';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    kycStatus: string;
    status: string;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/user-administration/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => setUsers(data.data || []))
        .catch(console.error);
    }, []);

    return (
        <Box sx={{ p: 4 }}>
            <Paper sx={{ p: 4, borderRadius: '20px', border: '1px solid #eee' }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>User Administration</Typography>
                
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>KYC Status</TableCell>
                                <TableCell>System Status</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell><Chip label={user.role} size="small" /></TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.kycStatus} 
                                            color={user.kycStatus === 'VERIFIED' ? 'success' : 'warning'} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={user.status} 
                                            variant="outlined"
                                            color={user.status === 'ACTIVE' ? 'success' : 'error'} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" title="Edit Role"><Edit /></IconButton>
                                        <IconButton size="small" color="error" title="Deactivate"><Block /></IconButton>
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
