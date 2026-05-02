import React from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ToastContainer } from '@/shared/components/ToastContainer';
import { useWebSocket } from '@/shared/hooks/useWebSocket';

export const Layout: React.FC = () => {
    const theme = useTheme();
    useWebSocket(); // Initialize WebSocket connection

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
