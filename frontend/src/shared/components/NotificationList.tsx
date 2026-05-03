import React from 'react';
import { List, ListItem, ListItemText, ListItemIcon, Typography, Box, Divider, Button } from '@mui/material';
import { Notifications as NotificationsIcon, CheckCircle as CheckCircleIcon, Info as InfoIcon, Warning as WarningIcon, MonetizationOn as MoneyIcon } from '@mui/icons-material';

interface NotificationListProps {
    notifications: any[];
    onItemClick: (item: any) => void;
}

const getIcon = (type: string) => {
    switch (type) {
        case 'ORDER': return <CheckCircleIcon color="success" fontSize="small" />;
        case 'ALERT': return <WarningIcon color="warning" fontSize="small" />;
        case 'ACCOUNT': return <MoneyIcon color="info" fontSize="small" />;
        case 'SYSTEM': return <InfoIcon color="primary" fontSize="small" />;
        default: return <NotificationsIcon fontSize="small" />;
    }
};

export const NotificationList: React.FC<NotificationListProps> = ({ notifications, onItemClick }) => (
    <List sx={{ p: 0, overflowY: 'auto', maxHeight: 260 }}>
        {notifications.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}><Typography variant="caption" color="text.secondary">No notifications</Typography></Box>
        ) : (
            notifications.map((n) => (
                <React.Fragment key={n.id}>
                    <ListItem sx={{ bgcolor: n.isRead ? 'transparent' : 'action.hover', cursor: 'pointer', '&:hover': { bgcolor: 'action.selected' }, py: 1, px: 2 }} onClick={() => onItemClick(n)}>
                        <ListItemIcon sx={{ minWidth: 32, mt: 0.5 }}>{getIcon(n.type)}</ListItemIcon>
                        <ListItemText
                            primary={<Typography variant="subtitle2" sx={{ fontSize: '0.875rem' }}>{n.title}</Typography>}
                            secondary={
                                <Box component="span" sx={{ display: 'flex', flexDirection: 'column', mt: 0.5 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>{n.message}</Typography>
                                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                                </Box>
                            }
                        />
                    </ListItem>
                    <Divider component="li" />
                </React.Fragment>
            ))
        )}
    </List>
);
