import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
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
    School as EducationIcon,
    ContactSupport as SupportIcon,
    Security as RiskIcon,
    AccountBalanceWallet as WalletIcon,
    HistoryEdu as AuditIcon,
    SettingsApplications as MarketOpsIcon,
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
        // Trader Pages
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', id: 'dashboard-nav', roles: ['TRADER'] },
        { text: 'Instruments', icon: <InstrumentsIcon />, path: '/instruments', id: 'market-data-nav', roles: ['TRADER'] },
        { text: 'Watchlists', icon: <WatchlistIcon />, path: '/watchlists', id: 'watchlists-nav', roles: ['TRADER'] },
        { text: 'Diagnostics', icon: <DiagnosticsIcon />, path: '/diagnostics', id: 'diagnostics-nav', roles: ['TRADER'] },
        { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio', id: 'portfolio-nav', roles: ['TRADER'] },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders', id: 'orders-nav', roles: ['TRADER'] },
        { text: 'Education', icon: <EducationIcon />, path: '/education', id: 'education-nav', roles: ['TRADER'] },
        { text: 'Support', icon: <SupportIcon />, path: '/support', id: 'support-nav', roles: ['TRADER'] },

        // Admin Pages
        { text: 'Control Center', icon: <AdminIcon />, path: '/admin/control-center', id: 'admin-cc-nav', roles: ['PLATFORM_ADMIN', 'RISK_OFFICER'] },
        { text: 'User Administration', icon: <AdminIcon />, path: '/user-management', id: 'admin-users-nav', roles: ['PLATFORM_ADMIN'] },
        { text: 'Wallet Management', icon: <WalletIcon />, path: '/wallet-management', id: 'wallet-mgmt-nav', roles: ['PLATFORM_ADMIN', 'SUPPORT'] },
        { text: 'Market Ops', icon: <MarketOpsIcon />, path: '/admin/market', id: 'admin-market-nav', roles: ['PLATFORM_ADMIN'] },
        { text: 'Audit Logs', icon: <AuditIcon />, path: '/admin/audit', id: 'admin-audit-nav', roles: ['PLATFORM_ADMIN'] },
        { text: 'Risk Governance', icon: <RiskIcon />, path: '/admin/risk', id: 'admin-risk-nav', roles: ['RISK_OFFICER', 'PLATFORM_ADMIN'] },
        { text: 'JIT Approvals', icon: <RiskIcon />, path: '/admin/jit', id: 'admin-jit-nav', roles: ['PLATFORM_ADMIN', 'RISK_OFFICER'] },
        { text: 'Support Ticketing', icon: <SupportIcon />, path: '/admin/tickets', id: 'admin-tickets-nav', roles: ['SUPPORT', 'PLATFORM_ADMIN'] },
    ];

    const visibleMenuItems = menuItems.filter(item => {
        if (!user) return false;
        // Default to TRADER if no role set for backward compatibility during migration
        const role = user.role || 'TRADER';
        return item.roles.includes(role);
    });

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
                    background: 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)', // Subtle gradient for depth
                    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: 'none',
                },
            }}
        >
            <Toolbar sx={{ minHeight: '64px !important' }} />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', pt: 1.5 }}>
                <List sx={{ px: 1.5 }}>
                    {visibleMenuItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.75 }} id={item.id}>
                                <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right" arrow>
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
                                            minHeight: 44,
                                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                                            px: 2,
                                            borderRadius: '12px',
                                            color: isActive ? 'primary.main' : 'text.primary', // High contrast
                                            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                                            position: 'relative',
                                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                            boxShadow: isActive ? `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}` : 'none',
                                            '&:hover': {
                                                bgcolor: isActive 
                                                    ? alpha(theme.palette.primary.main, 0.14) 
                                                    : 'rgba(0, 0, 0, 0.05)',
                                                transform: 'scale(1.02)', // Subtle lift
                                                '& .MuiListItemIcon-root': {
                                                    color: isActive ? 'primary.main' : 'text.primary',
                                                }
                                            },
                                        }}
                                    >
                                        {/* Active Indicator Bar - More integrated pill */}
                                        {isActive && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    left: -6,
                                                    width: 4,
                                                    height: 18,
                                                    bgcolor: 'primary.main',
                                                    borderRadius: '0 4px 4px 0',
                                                    boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}`,
                                                }}
                                            />
                                        )}

                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: isSidebarOpen ? 2 : 0,
                                                justifyContent: 'center',
                                                color: isActive ? 'primary.main' : 'rgba(0, 0, 0, 0.45)', // Stronger than disabled
                                                transition: 'all 0.2s ease',
                                                '& svg': { 
                                                    fontSize: 22,
                                                    filter: isActive ? `drop-shadow(0 0 2px ${alpha(theme.palette.primary.main, 0.3)})` : 'none'
                                                }
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: '0.85rem',
                                                fontWeight: isActive ? 700 : 500,
                                                letterSpacing: '0.015em',
                                            }}
                                            sx={{
                                                opacity: isSidebarOpen ? 1 : 0,
                                                whiteSpace: 'nowrap',
                                                transition: theme.transitions.create('opacity'),
                                                color: isActive ? 'primary.main' : 'text.secondary',
                                            }}
                                        />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Box>

            <Box
                sx={{
                    p: 2.5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 80,
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    borderTop: '1px solid rgba(0, 0, 0, 0.04)', // Discrete separator
                    mt: 'auto', // Ensure it stays at the bottom
                }}
            >
                <img
                    src={logoFull}
                    alt="Aequitas Logo"
                    style={{
                        width: 'auto',
                        height: '32px', // Fixed height for consistency
                        position: 'absolute',
                        opacity: isSidebarOpen ? 1 : 0,
                        transition: `opacity 0.2s ease-in-out, transform 0.2s ease`,
                        transform: isSidebarOpen ? 'scale(1)' : 'scale(0.9)',
                        pointerEvents: isSidebarOpen ? 'auto' : 'none',
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
                        transition: `opacity 0.2s ease-in-out, transform 0.2s ease`,
                        transform: !isSidebarOpen ? 'scale(1)' : 'scale(0.9)',
                        pointerEvents: !isSidebarOpen ? 'auto' : 'none',
                    }}
                />
            </Box>
        </Drawer>
    );
};

