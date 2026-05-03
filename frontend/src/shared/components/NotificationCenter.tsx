import React from 'react';
import { IconButton, Badge, Popover, Typography, Box, Button } from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { useNotificationCenter } from '../hooks/useNotificationCenter';
import { NotificationList } from './NotificationList';

export const NotificationCenter: React.FC = () => {
    const { anchorEl, notifications, unreadCount, open, handleClick, handleClose, handleNotificationClick, handleClearAll } = useNotificationCenter();

    return (
        <>
            <IconButton color="inherit" onClick={handleClick} sx={{ width: 40, height: 40 }}>
                <Badge badgeContent={unreadCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16, fontWeight: 700 } }}>
                    <NotificationsIcon sx={{ fontSize: 22, color: 'text.secondary' }} />
                </Badge>
            </IconButton>
            <Popover
                open={open} anchorEl={anchorEl} onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{ sx: { width: 320, maxHeight: 400, display: 'flex', flexDirection: 'column' } }}
            >
                <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    {notifications.length > 0 && <Button size="small" onClick={handleClearAll} color="inherit" sx={{ fontSize: '0.75rem' }}>Clear all</Button>}
                </Box>
                <NotificationList notifications={notifications} onItemClick={handleNotificationClick} />
            </Popover>
        </>
    );
};
