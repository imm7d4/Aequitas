import React from 'react';
import { Box, Typography, Avatar, Menu, MenuItem, Divider, ListItemIcon, Button } from '@mui/material';
import { AccountCircle, Logout as LogoutIcon, KeyboardArrowDown as ExpandIcon } from '@mui/icons-material';
import { useUserProfile } from './hooks/useUserProfile';
import { LogoutDialog } from './LogoutDialog';

export const UserProfile: React.FC = () => {
    const { user, anchorEl, openLogoutConfirm, setOpenLogoutConfirm, handleMenuOpen, handleMenuClose, handleLogoutConfirm, navigate } = useUserProfile();

    const userInitial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';
    const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

    return (
        <Box>
            <Button onClick={handleMenuOpen} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, textTransform: 'none', color: 'inherit', px: 1, py: 0.5, borderRadius: '12px' }}>
                <Avatar src={user?.avatar} sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', fontSize: '0.8rem', fontWeight: 800 }}>{userInitial}</Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'left', maxWidth: 140 }}>
                    <Typography variant="subtitle2" sx={{ lineHeight: 1.1, fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>{user?.isAdmin ? 'Administrator' : 'Master Trader'}</Typography>
                </Box>
                <ExpandIcon sx={{ fontSize: 16, color: 'text.disabled', ml: -0.5, transition: 'transform 0.2s', transform: anchorEl ? 'rotate(180deg)' : 'none' }} />
            </Button>

            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleMenuClose} onClick={handleMenuClose} transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
                <MenuItem onClick={() => navigate('/profile')}><ListItemIcon><AccountCircle /></ListItemIcon>Profile</MenuItem>
                <Divider />
                <MenuItem onClick={() => setOpenLogoutConfirm(true)} sx={{ color: 'error.main' }}><ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>Logout</MenuItem>
            </Menu>

            <LogoutDialog open={openLogoutConfirm} onClose={() => setOpenLogoutConfirm(false)} onConfirm={handleLogoutConfirm} />
        </Box>
    );
};
