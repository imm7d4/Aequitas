import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Chip, TextField, InputAdornment, Button
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { CustomGrid, Column } from '../../../shared/components/CustomGrid';
import { UserDetailModal } from '../components/UserDetailModal';
import { adminService, AdminUser } from '../services/adminService';
import { CreateUserModal } from '../components/CreateUserModal';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminService.getUsers();
            const mappedUsers = data.map((user: any) => ({
                ...user,
                id: user.id || user._id
            }));
            setUsers(mappedUsers);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user: AdminUser) => {
        alert(`Edit functionality for ${user.fullName} would open here.`);
    };

    const handleToggleStatus = async (user: AdminUser) => {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (confirm(`Are you sure you want to set ${user.fullName} to ${newStatus}?`)) {
            try {
                await adminService.updateUserStatus(user.id, newStatus);
                setIsDetailOpen(false);
                fetchUsers();
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    const handleCreateUser = async (newUserData: any) => {
        setIsSubmitting(true);
        try {
            await adminService.createUser(newUserData);
            setIsCreateOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns: Column<AdminUser>[] = [
        {
            id: 'fullName',
            label: 'Name',
            minWidth: 200,
            render: (row) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.fullName || 'No Name Set'}</Typography>
        },
        { id: 'email', label: 'Email', minWidth: 220 },
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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', px: 3, pt: 2 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '20px', fontWeight: 800 }}>User Management</Typography>
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <TextField 
                        size="small" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.disabled', fontSize: 18 }} /></InputAdornment>,
                            sx: { borderRadius: '6px', bgcolor: '#fff', width: 220 }
                        }}
                    />
                    <Button
                        variant="contained" startIcon={<AddIcon />} size="small" onClick={() => setIsCreateOpen(true)}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '6px' }}
                    >
                        Create User
                    </Button>
                </Box>
            </Box>

            <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomGrid
                    columns={columns} data={filteredUsers} isLoading={loading} maxHeight="100%"
                    onRowClick={(row) => { setSelectedUser(row); setIsDetailOpen(true); }}
                    pagination={{
                        page, rowsPerPage, totalCount: filteredUsers.length,
                        onPageChange: setPage, onRowsPerPageChange: setRowsPerPage
                    }}
                />
            </Box>

            <UserDetailModal 
                open={isDetailOpen} user={selectedUser} onClose={() => setIsDetailOpen(false)}
                onEdit={handleEditUser} onToggleStatus={handleToggleStatus}
            />

            <CreateUserModal 
                open={isCreateOpen} onClose={() => setIsCreateOpen(false)} 
                onSubmit={handleCreateUser} submitting={isSubmitting}
            />
        </Box>
    );
};
