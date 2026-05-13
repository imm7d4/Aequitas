import React, { useEffect } from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/shared/components/ToastContainer';
import { useWebSocket } from '@/shared/hooks/useWebSocket';
import { useNotificationStore } from '@/shared/store/useNotificationStore';

export const Layout: React.FC = () => {
    const theme = useTheme();
    const { unreadCount } = useNotificationStore();
    const location = useLocation();
    useWebSocket(); // Initialize WebSocket connection

    useEffect(() => {
        const updateTitle = () => {
            const currentTitle = document.title;
            const pattern = /^\(\d+\)\s+/;
            const cleanTitle = currentTitle.replace(pattern, '');
            
            const prefix = unreadCount > 0 ? `(${unreadCount}) ` : '';
            document.title = `${prefix}${cleanTitle}`;
        };

        updateTitle();
        
        // Wait a tick for the page component to set its own title
        const timer = setTimeout(updateTitle, 100);
        return () => clearTimeout(timer);
    }, [unreadCount, location]);

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            bgcolor: 'background.default',
            transition: 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
            <Header />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    minWidth: 0, // Prevent flex items from overflowing
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                    }),
                }}
            >
                <Toolbar /> {/* Spacer for the fixed AppBar */}
                <Box sx={{ width: '100%' }}>
                    <Outlet />
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
};
