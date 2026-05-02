import React from 'react';
import { Drawer, List, Toolbar, Box, useTheme, SxProps, Theme } from '@mui/material';
import {
    Dashboard as DashboardIcon, BarChart as InstrumentsIcon, ShowChart as PortfolioIcon,
    History as OrdersIcon, Star as WatchlistIcon, AdminPanelSettings as AdminIcon,
    Assessment as DiagnosticsIcon, School as EducationIcon, ContactSupport as SupportIcon,
    Security as RiskIcon, AccountBalanceWallet as WalletIcon, HistoryEdu as AuditIcon,
    SettingsApplications as MarketOpsIcon,
} from '@mui/icons-material';
import { useLayoutStore } from '@/shared/store/layoutStore';
import { useAuth } from '@/features/auth';
import { SidebarItem } from './Sidebar/SidebarItem';
import { SidebarLogo } from './Sidebar/SidebarLogo';

const drawerWidth = 240;

export const Sidebar: React.FC = () => {
    const { isSidebarOpen, setSidebarOpen } = useLayoutStore();
    const { user } = useAuth();
    const theme = useTheme();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', id: 'dashboard-nav', roles: ['TRADER'] },
        { text: 'Instruments', icon: <InstrumentsIcon />, path: '/instruments', id: 'market-data-nav', roles: ['TRADER'] },
        { text: 'Watchlists', icon: <WatchlistIcon />, path: '/watchlists', id: 'watchlists-nav', roles: ['TRADER'] },
        { text: 'Diagnostics', icon: <DiagnosticsIcon />, path: '/diagnostics', id: 'diagnostics-nav', roles: ['TRADER'] },
        { text: 'Portfolio', icon: <PortfolioIcon />, path: '/portfolio', id: 'portfolio-nav', roles: ['TRADER'] },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders', id: 'orders-nav', roles: ['TRADER'] },
        { text: 'Education', icon: <EducationIcon />, path: '/education', id: 'education-nav', roles: ['TRADER'] },
        { text: 'Support', icon: <SupportIcon />, path: '/support', id: 'support-nav', roles: ['TRADER'] },
        { text: 'Control Center', icon: <AdminIcon />, path: '/admin/control-center', id: 'admin-cc-nav', roles: ['PLATFORM_ADMIN', 'RISK_OFFICER'] },
        { text: 'User Administration', icon: <AdminIcon />, path: '/user-management', id: 'admin-users-nav', roles: ['PLATFORM_ADMIN'] },
        { text: 'Wallet Management', icon: <WalletIcon />, path: '/wallet-management', id: 'wallet-mgmt-nav', roles: ['PLATFORM_ADMIN', 'SUPPORT'] },
        { text: 'Market Ops', icon: <MarketOpsIcon />, path: '/admin/market', id: 'admin-market-nav', roles: ['PLATFORM_ADMIN'] },
        { text: 'Audit Logs', icon: <AuditIcon />, path: '/admin/audit', id: 'admin-audit-nav', roles: ['PLATFORM_ADMIN'] },
        { text: 'Risk Governance', icon: <RiskIcon />, path: '/admin/risk', id: 'admin-risk-nav', roles: ['RISK_OFFICER', 'PLATFORM_ADMIN'] },
        { text: 'JIT Approvals', icon: <RiskIcon />, path: '/admin/jit', id: 'admin-jit-nav', roles: ['PLATFORM_ADMIN', 'RISK_OFFICER'] },
        { text: 'Support Ticketing', icon: <SupportIcon />, path: '/admin/tickets', id: 'admin-tickets-nav', roles: ['SUPPORT', 'PLATFORM_ADMIN'] },
    ];

    const visibleMenuItems = menuItems.filter(item => user && item.roles.includes(user.role || 'TRADER'));

    return (
        <Drawer
            variant="permanent" onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => setSidebarOpen(false)}
            sx={{
                width: isSidebarOpen ? drawerWidth : theme.spacing(9), flexShrink: 0,
                transition: theme.transitions.create('width', { easing: theme.transitions.easing.easeInOut, duration: theme.transitions.duration.standard }),
                [`\u0026 .MuiDrawer-paper`]: {
                    width: isSidebarOpen ? drawerWidth : theme.spacing(9), boxSizing: 'border-box',
                    transition: theme.transitions.create('width', { easing: theme.transitions.easing.easeInOut, duration: theme.transitions.duration.standard }),
                    overflowX: 'hidden', background: theme.palette.mode === 'light' ? 'linear-gradient(180deg, #F9FAFB 0%, #F3F4F6 100%)' : 'linear-gradient(180deg, #0a0a0a 0%, #050505 100%)',
                    borderRight: `1px solid ${theme.palette.divider}`, boxShadow: 'none',
                },
            }}
        >
            <Toolbar sx={{ minHeight: '64px !important' }} />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', pt: 1.5 } as SxProps<Theme>}>
                <List sx={{ px: 1.5 }}>
                    {visibleMenuItems.map((item) => (
                        <SidebarItem key={item.id} item={item} isSidebarOpen={isSidebarOpen} />
                    ))}
                </List>
            </Box>
            <SidebarLogo isSidebarOpen={isSidebarOpen} />
        </Drawer>
    );
};
