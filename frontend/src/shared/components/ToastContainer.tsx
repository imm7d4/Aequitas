import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useNotificationStore, Notification } from '../store/useNotificationStore';

export const ToastContainer: React.FC = () => {
    const { notifications } = useNotificationStore();
    const [open, setOpen] = useState(false);
    const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);

    // Simple implementation: Show the latest unread notification as a toast
    // Improving to standard toast queue behavior typically requires a separate 'toasts' state, 
    // but let's try to just show key alerts when they arrive.

    // We can track the last ID we showed to avoid repeating.
    const [lastShownId, setLastShownId] = useState<string | null>(null);

    useEffect(() => {
        if (notifications.length > 0) {
            const latest = notifications[0];
            // Only show if it's new (unread and different from last shown)
            // And typically created very recently (within last few seconds), but here we trust the feed functionality.
            if (!latest.isRead && latest.id !== lastShownId) {
                setCurrentNotification(latest);
                setLastShownId(latest.id);
                setOpen(true);
            }
        }
    }, [notifications, lastShownId]);

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const getSeverity = (type: string) => {
        switch (type) {
            case 'ORDER': return 'success';
            case 'ALERT': return 'warning';
            case 'ACCOUNT': return 'error'; // Margin calls etc
            default: return 'info';
        }
    };

    if (!currentNotification) return null;

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={getSeverity(currentNotification.type)}
                sx={{ width: '100%' }}
                variant="filled"
            >
                {currentNotification.title}: {currentNotification.message}
            </Alert>
        </Snackbar>
    );
};
