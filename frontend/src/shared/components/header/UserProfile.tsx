import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
} from '@mui/material';
import {
    AccountCircle,
    Logout as LogoutIcon,
    KeyboardArrowDown as ExpandIcon,
} from '@mui/icons-material';
import { useAuth } from '@/features/auth';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';

export const UserProfile: React.FC = () => {
    const { user, logout } = useAuth();
    const { track } = useTelemetry();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

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

    const handleLogoutClick = () => {
        handleMenuClose();
        setOpenLogoutConfirm(true);
    };

    const handleLogoutConfirm = async () => {
        setOpenLogoutConfirm(false);
        track({
            event_name: 'profile.logout_clicked',
            event_version: 'v1',
            classification: 'USER_ACTION',
        });
        await logout();
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate('/profile');
    };

    const userInitial = user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U';
    const emailPrefix = user?.email?.split('@')[0] || 'User';
    const displayName = user?.displayName || emailPrefix;

    return (
        <Box>
            <Box
                id="user-menu"
                onClick={handleProfileMenuOpen}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    cursor: 'pointer',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    }
                }}
            >
                <Avatar
                    src={user?.avatar}
                    sx={{
                        width: 36,
                        height: 36,
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        fontSize: '0.9rem',
                        fontWeight: 800,
                        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.25)',
                        border: '2px solid rgba(25, 118, 210, 0.1)',
                    }}
                >
                    {userInitial}
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            lineHeight: 1.2,
                            fontWeight: 700,
                            color: 'text.primary'
                        }}
                    >
                        {displayName}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'primary.main',
                            fontWeight: 500,
                            letterSpacing: '0.02em'
                        }}
                    >
                        {user?.isAdmin ? 'Administrator' : 'Master Trader'}
                    </Typography>
                </Box>
                <ExpandIcon
                    sx={{
                        fontSize: 20,
                        color: 'text.secondary',
                        transition: 'transform 0.2s',
                        transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'none'
                    }}
                />
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1.5,
                        minWidth: 180,
                        borderRadius: 2,
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <AccountCircle />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogoutClick} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            <Dialog
                open={openLogoutConfirm}
                onClose={() => setOpenLogoutConfirm(false)}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
            >
                <DialogTitle id="logout-dialog-title">
                    {"Confirm Logout"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description">
                        Are you sure you want to log out of your account?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLogoutConfirm(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleLogoutConfirm} color="error" autoFocus>
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
