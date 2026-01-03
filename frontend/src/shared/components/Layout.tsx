import React from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Header />
            <Sidebar />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` }, // Dynamic width handling is better in Sidebar component
                    transition: theme.transitions.create('margin', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Toolbar /> {/* Spacer for the fixed AppBar */}
                <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};
