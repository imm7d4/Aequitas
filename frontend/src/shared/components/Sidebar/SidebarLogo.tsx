import React from 'react';
import { Box, useTheme } from '@mui/material';
import logoFull from '@/assets/logo/logo-full.png';
import logoIcon from '@/assets/logo/logo-icon.png';

interface SidebarLogoProps {
    isSidebarOpen: boolean;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({ isSidebarOpen }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                p: 2.5, display: 'flex', justifyContent: 'center', alignItems: 'center',
                minHeight: 80, cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease',
                borderTop: `1px solid ${theme.palette.divider}`, mt: 'auto',
            }}
        >
            <img
                src={logoFull}
                alt="Aequitas Logo"
                style={{
                    width: 'auto', height: '32px', position: 'absolute',
                    opacity: isSidebarOpen ? 1 : 0, transition: `opacity 0.2s ease, transform 0.2s ease`,
                    transform: isSidebarOpen ? 'scale(1)' : 'scale(0.9)',
                    pointerEvents: isSidebarOpen ? 'auto' : 'none',
                }}
            />
            <img
                src={logoIcon}
                alt="Aequitas Icon"
                style={{
                    width: '32px', height: '32px', position: 'absolute',
                    opacity: isSidebarOpen ? 0 : 1, transition: `opacity 0.2s ease, transform 0.2s ease`,
                    transform: !isSidebarOpen ? 'scale(1)' : 'scale(0.9)',
                    pointerEvents: !isSidebarOpen ? 'auto' : 'none',
                }}
            />
        </Box>
    );
};
