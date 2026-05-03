import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../store/useNotificationStore';

export const useNotificationCenter = () => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { notifications, unreadCount, markAsRead, reset, fetchNotifications } = useNotificationStore();
    const navigate = useNavigate();

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleNotificationClick = (notification: any) => {
        if (!notification.isRead) markAsRead(notification.id);
        if (notification.data?.url) { navigate(notification.data.url); handleClose(); }
    };

    return { anchorEl, notifications, unreadCount, open: !!anchorEl, handleClick, handleClose, handleNotificationClick, handleClearAll: reset };
};
