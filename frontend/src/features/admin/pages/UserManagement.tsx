import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Chip, TextField, InputAdornment, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { CustomGrid, Column, BaseRow } from '../../../shared/components/CustomGrid';
import { UserDetailModal } from '../components/UserDetailModal';

interface User extends BaseRow {
    id: string;
    fullName: string;
    email: string;
    role: string;
    kycStatus: string;
    status: string;
    phone?: string;
    displayName?: string;
    bio?: string;
    lastLoginAt?: string;
    lastActivityAt?: string;
    createdAt?: string;
}

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newUserData, setNewUserData] = useState({ email: '', fullName: '', password: '', role: 'SUPPORT' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(res => res.json())
        .then(data => {
            const mappedUsers = (data.data || []).map((user: any) => ({
                ...user,
                id: user.id || user._id
            }));
            setUsers(mappedUsers);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    };

    const handleEditUser = (user: User) => {
        alert(`Edit functionality for ${user.fullName} would open here.`);
    };

    const handleToggleStatus = (user: User) => {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (confirm(`Are you sure you want to set ${user.fullName} to ${newStatus}?`)) {
            fetch(`${import.meta.env.VITE_API_URL}/admin/users/${user.id}/status`, {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            })
            .then(res => res.json())
            .then(data => {
                if (data.statusCode === 200) {
                    setIsDetailOpen(false);
                    fetchUsers();
                } else {
                    alert(data.message || 'Failed to update status');
                }
            })
            .catch(err => alert(err.message));
        }
    };

    const handleCreateUser = () => {
        if (!newUserData.email || !newUserData.password || !newUserData.role) {
            alert('Email, Password and Role are required');
            return;
        }

        setIsSubmitting(true);
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, {
            method: 'POST',
            headers: { 
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserData)
        })
        .then(res => res.json())
        .then(data => {
            if (data.statusCode === 201) {
                setIsCreateOpen(false);
                setNewUserData({ email: '', fullName: '', password: '', role: 'SUPPORT' });
                fetchUsers();
            } else {
                alert(data.message || 'Failed to create user');
            }
        })
        .catch(err => alert(err.message))
        .finally(() => setIsSubmitting(false));
    };

    const columns: Column<User>[] = [
        {
            id: 'fullName',
            label: 'Name',
            minWidth: 200,
            render: (row) => (
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.fullName || 'No Name Set'}</Typography>
            )
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 220,
        },
        {
            id: 'role',
            label: 'Role',
            minWidth: 120,
            render: (row) => <Chip label={row.role || 'USER'} size="small" sx={{ fontWeight: 600, borderRadius: '4px' }} />
        },
        {
            id: 'kycStatus',
            label: 'KYC Status',
            minWidth: 140,
            render: (row) => (
                <Chip 
                    label={row.kycStatus || 'PENDING'} 
                    color={row.kycStatus === 'VERIFIED' ? 'success' : 'warning'} 
                    size="small" 
                    sx={{ fontWeight: 700, borderRadius: '4px', fontSize: '0.7rem' }}
                />
            )
        },
        {
            id: 'status',
            label: 'System Status',
            minWidth: 140,
            render: (row) => (
                <Chip 
                    label={row.status || 'ACTIVE'} 
                    variant="outlined"
                    color={row.status === 'ACTIVE' ? 'success' : 'error'} 
                    size="small" 
                    sx={{ fontWeight: 700, borderRadius: '4px', fontSize: '0.7rem' }}
                />
            )
        }
    ];

    const filteredUsers = users.filter(user => 
        (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            px: 3,
            pt: 2
        }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800, color: 'text.primary', letterSpacing: -0.5, whiteSpace: 'nowrap' }}>
                    User Management
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <TextField 
                        size="small"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                                </InputAdornment>
                            ),
                            sx: { borderRadius: '6px', bgcolor: '#fff', width: 220 }
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={() => setIsCreateOpen(true)}
                        sx={{ 
                            textTransform: 'none', 
                            fontWeight: 700, 
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                        }}
                    >
                        Create User
                    </Button>
                </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid
                    columns={columns}
                    data={filteredUsers}
                    isLoading={loading}
                    maxHeight="100%"
                    onRowClick={(row) => {
                        setSelectedUser(row);
                        setIsDetailOpen(true);
                    }}
                    pagination={{
                        page,
                        rowsPerPage,
                        totalCount: filteredUsers.length,
                        onPageChange: setPage,
                        onRowsPerPageChange: setRowsPerPage
                    }}
                />
            </Box>

            <UserDetailModal 
                open={isDetailOpen}
                user={selectedUser}
                onClose={() => setIsDetailOpen(false)}
                onEdit={handleEditUser}
                onToggleStatus={handleToggleStatus}
            />

            <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Create New Admin User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            size="small"
                            value={newUserData.fullName}
                            onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                        />
                        <TextField
                            label="Email Address"
                            fullWidth
                            size="small"
                            value={newUserData.email}
                            onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                        />
                        <TextField
                            label="Initial Password"
                            type="password"
                            fullWidth
                            size="small"
                            value={newUserData.password}
                            onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                        />
                        <FormControl fullWidth size="small">
                            <InputLabel>Assign Role</InputLabel>
                            <Select
                                value={newUserData.role}
                                label="Assign Role"
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
                    <Button onClick={() => setIsCreateOpen(false)} disabled={isSubmitting}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleCreateUser} 
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create User'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
