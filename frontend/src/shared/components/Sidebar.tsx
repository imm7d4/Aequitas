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
    Assessment as DiagnosticsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { alpha, useTheme } from '@mui/material/styles';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { useAuth } from '@/features/auth';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';
import logoFull from '@/assets/logo/logo-full.png';
import logoIcon from '@/assets/logo/logo-icon.png';

const drawerWidth = 240;

export const Sidebar: React.FC = () => {
    const { isSidebarOpen, setSidebarOpen } = useLayoutStore();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const { track } = useTelemetry();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Instruments', icon: <InstrumentsIcon />, path: '/instruments' },
        { text: 'Watchlists', icon: <WatchlistIcon />, path: '/watchlists' },
        { text: 'Diagnostics', icon: <DiagnosticsIcon />, path: '/diagnostics' },
        { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio' },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
    ];

    if (user?.isAdmin) {
        menuItems.push({ text: 'Admin', icon: <AdminIcon />, path: '/admin' });
    }

    return (
        <Drawer
            variant="permanent"
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
            sx={{
                width: isSidebarOpen ? drawerWidth : theme.spacing(9),
                flexShrink: 0,
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.easeInOut,
                    duration: theme.transitions.duration.standard,
                }),
                [`& .MuiDrawer-paper`]: {
                    width: isSidebarOpen ? drawerWidth : theme.spacing(9),
                    boxSizing: 'border-box',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.easeInOut,
                        duration: theme.transitions.duration.standard,
                    }),
                    overflowX: 'hidden',
                },
            }}
        >
            <Toolbar />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden' }}>
                <List>
                    {menuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => {
                                            track({
                                                event_name: 'navigation.sidebar_clicked',
                                                event_version: 'v1',
                                                classification: 'USER_ACTION',
                                                metadata: {
                                                    path: item.path,
                                                    label: item.text,
                                                }
                                            });
                                            navigate(item.path);
                                        }}
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
                                                mr: isSidebarOpen ? 3 : 0,
                                                justifyContent: 'center',
                                                transition: theme.transitions.create('margin', {
                                                    easing: theme.transitions.easing.easeInOut,
                                                    duration: theme.transitions.duration.standard,
                                                }),
                                                color: isActive ? 'primary.main' : 'inherit',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            sx={{
                                                opacity: isSidebarOpen ? 1 : 0,
                                                fontWeight: isActive ? 700 : 500,
                                                whiteSpace: 'nowrap',
                                                transition: theme.transitions.create(['opacity', 'margin'], {
                                                    easing: theme.transitions.easing.easeInOut,
                                                    duration: theme.transitions.duration.standard,
                                                }),
                                            }}
                                        />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Divider />
            <Tooltip title="Made with Love by Dharmesh 💚" placement="right" arrow>
                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: 64,
                        cursor: 'pointer',
                        position: 'relative',
                        transition: theme.transitions.create(['padding', 'min-height'], {
                            easing: theme.transitions.easing.easeInOut,
                            duration: theme.transitions.duration.standard,
                        }),
                    }}
                >
                    <img
                        src={logoFull}
                        alt="Aequitas Logo"
                        style={{
                            width: '100%',
                            maxWidth: '160px',
                            height: 'auto',
                            position: 'absolute',
                            opacity: isSidebarOpen ? 1 : 0,
                            transition: `opacity ${theme.transitions.duration.standard}ms ease-in-out`,
                            pointerEvents: isSidebarOpen ? 'auto' : 'none',
                            display: 'block'
                        }}
                    />
                    <img
                        src={logoIcon}
                        alt="Aequitas Icon"
                        style={{
                            width: '32px',
                            height: '32px',
                            position: 'absolute',
                            opacity: isSidebarOpen ? 0 : 1,
                            transition: `opacity ${theme.transitions.duration.standard}ms ease-in-out`,
                            pointerEvents: !isSidebarOpen ? 'auto' : 'none',
                            display: 'block'
                        }}
                    />
                </Box>
            </Tooltip>
        </Drawer>
    );
};

