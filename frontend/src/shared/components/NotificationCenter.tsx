import React, { useState, useEffect } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Divider,
    Button,
    ListItemIcon,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Info as InfoIcon,
    Warning as WarningIcon,
    MonetizationOn as MoneyIcon,
} from '@mui/icons-material';
import { useNotificationStore } from '../store/useNotificationStore';

export const NotificationCenter: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { notifications, unreadCount, markAsRead, reset, fetchNotifications } = useNotificationStore();

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER':
                return <CheckCircleIcon color="success" fontSize="small" />;
            case 'ALERT':
                return <WarningIcon color="warning" fontSize="small" />;
            case 'ACCOUNT':
                return <MoneyIcon color="info" fontSize="small" />;
            case 'SYSTEM':
                return <InfoIcon color="primary" fontSize="small" />;
            default:
                return <NotificationsIcon fontSize="small" />;
        }
    };

    const handleNotificationClick = (id: string, isRead: boolean) => {
        if (!isRead) {
            markAsRead(id);
        }
    };

    const handleClearAll = () => {
        reset();
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 320, maxHeight: 400, display: 'flex', flexDirection: 'column' },
                }}
            >
                <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    {notifications.length > 0 && (
                        <Button size="small" onClick={handleClearAll} color="inherit" sx={{ fontSize: '0.75rem' }}>
                            Clear all
                        </Button>
                    )}
                </Box>
                <List sx={{ p: 0, overflowY: 'auto', maxHeight: 260 }}> {/* Approx 4 items at ~60-65px each */}
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                                No notifications
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.selected' },
                                        py: 1, // Compact padding
                                        px: 2
                                    }}
                                    onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                                >
                                    <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>
                                        {getIcon(notification.type)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" sx={{ fontSize: '0.875rem', lineHeight: 1.2 }}>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', lineHeight: 1.1, mb: 0.5 }}>
                                                    {notification.message}
                                                </Typography>

                                                {/* Render Actions if available */}
                                                {notification.actions && notification.actions.length > 0 && (
                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                        {notification.actions.map((action, index) => (
                                                            <Button
                                                                key={index}
                                                                variant="outlined"
                                                                size="small"
                                                                color="primary"
                                                                href={action.link}
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Prevent triggering the row click
                                                                    // Optional: Mark as read when action is clicked?
                                                                    handleNotificationClick(notification.id, notification.isRead);
                                                                }}
                                                                sx={{
                                                                    fontSize: '0.7rem',
                                                                    py: 0.25,
                                                                    px: 1,
                                                                    minWidth: 'auto',
                                                                    height: 24
                                                                }}
                                                            >
                                                                {action.label}
                                                            </Button>
                                                        ))}
                                                    </Box>
                                                )}

                                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                                                    {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Popover>
        </>
    );
};
