import React from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Box,
    Badge,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { MarketStatusBadge } from '@/features/market/components/MarketStatusBadge';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';
import { BrandLogo } from './header/BrandLogo';
import { GlobalSearch } from './header/GlobalSearch';
import { UserProfile } from './header/UserProfile';

export const Header: React.FC = () => {
    const { toggleSidebar, notificationCount } = useLayoutStore();
    const { track } = useTelemetry();

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

                    <IconButton
                        size="large"
                        color="inherit"
                        onClick={() => {
                            track({
                                event_name: 'notification.dropdown_opened',
                                event_version: 'v1',
                                classification: 'USER_ACTION',
                                metadata: { count: notificationCount }
                            });
                        }}
                    >
                        <Badge badgeContent={notificationCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>

                    <UserProfile />
                </Box>
            </Toolbar>
        </AppBar>
    );
};
