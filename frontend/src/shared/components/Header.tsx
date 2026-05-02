import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
} from '@mui/material';
import {
    Menu as MenuIcon,
} from '@mui/icons-material';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { NotificationCenter } from '@/shared/components/NotificationCenter';
import { MarketStatusBadge } from '@/features/market/components/MarketStatusBadge';
import { BrandLogo } from './header/BrandLogo';
import { GlobalSearch } from './header/GlobalSearch';
import { UserProfile } from './header/UserProfile';

import { Theme } from '@mui/material/styles';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
    const { toggleSidebar, isSidebarOpen } = useLayoutStore();
    const sidebarWidth = isSidebarOpen ? 240 : 72;

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: (theme: Theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                height: 64,
                justifyContent: 'center',
                transition: (theme: Theme) => theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                // Dynamic border that starts AFTER the sidebar
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: `${sidebarWidth}px`,
                    height: '1px',
                    bgcolor: 'divider',
                    transition: (theme: Theme) => theme.transitions.create('left', {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                    }),
                }
            }}
        >
            <Toolbar
                sx={{
                    height: 64,
                    display: 'grid',
                    gridTemplateColumns: 'min-content 1fr min-content',
                    px: { xs: 1.5, sm: 2, md: 3 },
                    gap: { xs: 1, sm: 2, md: 3 },
                    minHeight: '64px !important',
                }}
            >
                {/* Left Section: Hamburger + Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' } as const}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 1.5 }}
                        onClick={toggleSidebar}
                    >
                        <MenuIcon />
                    </IconButton>
                    <BrandLogo />
                </Box>

                {/* Center Section: Global Search (Truly Centered) */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <Box sx={{ width: '100%', maxWidth: 480 }}>
                        <GlobalSearch />
                    </Box>
                </Box>

                {/* Right Section: Status, Notifications, Profile */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 0.5, sm: 1, md: 2 }, // Responsive gap
                        justifyContent: 'flex-end'
                    }}
                >
                    <ThemeToggle />

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <MarketStatusBadge />
                    </Box>

                    <NotificationCenter />

                    <UserProfile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
