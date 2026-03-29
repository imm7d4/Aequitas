import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Typography, Box, Grid, Chip, Divider,
    IconButton, alpha, useTheme
} from '@mui/material';
import {
    Close, Edit, Block, CheckCircle, 
    Email, Phone, Person, AccessTime, Security
} from '@mui/icons-material';

interface User {
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

interface UserDetailModalProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onEdit: (user: User) => void;
    onToggleStatus: (user: User) => void;
}

const InfoItem: React.FC<{ icon: React.ReactNode, label: string, value: string | React.ReactNode }> = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2 }}>
        <Box sx={{ color: 'text.disabled', mt: 0.3 }}>{icon}</Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {value || 'N/A'}
            </Typography>
        </Box>
    </Box>
);

import { formatDate } from '../../../shared/utils/formatters';

export const UserDetailModal: React.FC<UserDetailModalProps> = ({ open, user, onClose, onEdit, onToggleStatus }) => {
    const theme = useTheme();
    if (!user) return null;

    const isActive = user.status === 'ACTIVE';

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', overflow: 'hidden' }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, p: 2, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                bgcolor: alpha(theme.palette.primary.main, 0.03)
            }}>
                <Typography variant="h6" fontWeight={800}>User Details</Typography>
                <IconButton onClick={onClose} size="small"><Close /></IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Box sx={{ 
                        width: 64, height: 64, 
                        borderRadius: '16px', 
                        bgcolor: 'primary.main', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '24px',
                        fontWeight: 800
                    }}>
                        {user.fullName.charAt(0)}
                    </Box>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>{user.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                    <Box sx={{ ml: 'auto', textAlign: 'right' }}>
                        <Chip 
                            label={user.status} 
                            color={isActive ? 'success' : 'error'} 
                            variant="outlined"
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: '6px' }}
                        />
                    </Box>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <InfoItem icon={<Email fontSize="small" />} label="Email Address" value={user.email} />
                        <InfoItem icon={<Phone fontSize="small" />} label="Phone Number" value={user.phone} />
                        <InfoItem icon={<Security fontSize="small" />} label="System Role" value={
                            <Chip label={user.role} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                        } />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InfoItem icon={<Person fontSize="small" />} label="KYC Status" value={
                            <Chip 
                                label={user.kycStatus} 
                                color={user.kycStatus === 'VERIFIED' ? 'success' : 'warning'} 
                                size="small" 
                                sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} 
                            />
                        } />
                        <InfoItem icon={<AccessTime fontSize="small" />} label="Last Activity" value={user.lastActivityAt ? formatDate(user.lastActivityAt) : 'Never'} />
                        <InfoItem icon={<AccessTime fontSize="small" />} label="Signed Up" value={user.createdAt ? formatDate(user.createdAt) : 'Unknown'} />
                    </Grid>
                </Grid>

                {user.bio && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, textTransform: 'uppercase', fontWeight: 700 }}>
                            Bio
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {user.bio}
                        </Typography>
                    </>
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 3, gap: 1 }}>
                <Button 
                    variant="outlined" 
                    startIcon={<Edit />} 
                    onClick={() => onEdit(user)}
                    fullWidth
                    sx={{ borderRadius: '8px', fontWeight: 700 }}
                >
                    Edit User
                </Button>
                <Button 
                    variant="contained" 
                    color={isActive ? 'error' : 'success'} 
                    startIcon={isActive ? <Block /> : <CheckCircle />}
                    onClick={() => onToggleStatus(user)}
                    fullWidth
                    sx={{ borderRadius: '8px', fontWeight: 700 }}
                >
                    {isActive ? 'Inactivate User' : 'Activate User'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
