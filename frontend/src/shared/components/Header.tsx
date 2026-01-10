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

export const Header: React.FC = () => {
    const { toggleSidebar } = useLayoutStore();

    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                color: 'text.primary',
                boxShadow: 1
            }}
        >
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick={toggleSidebar}
                >
                    <MenuIcon />
                </IconButton>

                <BrandLogo />

                <GlobalSearch />

                <Box sx={{ flexGrow: 1 }} />

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 4, display: { xs: 'none', md: 'block' } }}>
                        <MarketStatusBadge />
                    </Box>

                    <NotificationCenter />

                    <UserProfile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
