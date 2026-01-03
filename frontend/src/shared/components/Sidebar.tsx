import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Box,
    Tooltip,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    BarChart as InstrumentsIcon,
    ShowChart as PortfolioIcon,
    History as OrdersIcon,
    Star as WatchlistIcon,
    AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { useAuth } from '@/features/auth';

const drawerWidth = 240;

export const Sidebar: React.FC = () => {
    const { isSidebarOpen } = useLayoutStore();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Instruments', icon: <InstrumentsIcon />, path: '/instruments' },
        { text: 'Watchlists', icon: <WatchlistIcon />, path: '/watchlists' },
        { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
    ];

    if (user?.isAdmin) {
        menuItems.push({ text: 'Admin', icon: <AdminIcon />, path: '/admin' });
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: isSidebarOpen ? drawerWidth : theme.spacing(9),
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: isSidebarOpen ? drawerWidth : theme.spacing(9),
                    boxSizing: 'border-box',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    overflowX: 'hidden',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                                            px: 2.5,
                                            color: isActive ? 'primary.main' : 'inherit',
                                            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: isSidebarOpen ? 3 : 'auto',
                                                justifyContent: 'center',
                                                color: isActive ? 'primary.main' : 'inherit',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            sx={{
                                                opacity: isSidebarOpen ? 1 : 0,
                                                fontWeight: isActive ? 'bold' : 'normal',
                                                display: isSidebarOpen ? 'block' : 'none',
                                            }}
                                        />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
                <Divider />
            </Box>
        </Drawer>
    );
};

