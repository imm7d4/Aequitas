import React, { useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
} from '@mui/material';
import {
    AccountCircle,
    Settings,
    Logout,
    KeyboardArrowDown as ExpandIcon,
} from '@mui/icons-material';
import { useAuth } from '@/features/auth';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';

export const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const { track } = useTelemetry();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        track({
            event_name: 'profile.menu_opened',
            event_version: 'v1',
            classification: 'USER_ACTION',
        });
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        track({
            event_name: 'profile.logout_clicked',
            event_version: 'v1',
            classification: 'USER_ACTION',
        });
        handleMenuClose();
        logout();
    };

    return (
        <>
            <Box
                sx={{
                    ml: 2,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 0.5,
                    pr: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        bgcolor: 'action.hover',
                        '& .profile-arrow': {
                            transform: 'translateY(2px)'
                        }
                    }
                }}
                onClick={handleProfileMenuOpen}
            >
                <Avatar
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: 'primary.main',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                        mr: 1.5,
                        border: '2px solid transparent',
                        backgroundClip: 'padding-box',
                        transition: 'transform 0.2s',
                    }}
                >
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                <Box sx={{ mr: 1, textAlign: 'left', display: { xs: 'none', md: 'block' } }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
                        {user?.email?.split('@')[0] || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                        Master Trader
                    </Typography>
                </Box>
                <ExpandIcon
                    className="profile-arrow"
                    sx={{
                        fontSize: 18,
                        color: 'text.disabled',
                        transition: 'transform 0.2s ease'
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                    sx: { mt: 1.5, minWidth: 180, boxShadow: 3 }
                }}
            >
                <MenuItem onClick={handleMenuClose}>
                    <AccountCircle sx={{ mr: 1.5 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                    <Settings sx={{ mr: 1.5 }} /> Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <Logout sx={{ mr: 1.5 }} /> Logout
                </MenuItem>
            </Menu>
        </>
    );
};
