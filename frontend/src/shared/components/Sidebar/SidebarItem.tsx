import React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Box, alpha, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTelemetry } from '@/shared/services/telemetry/TelemetryProvider';

interface SidebarItemProps {
    item: { text: string; icon: React.ReactNode; path: string; id: string };
    isSidebarOpen: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isSidebarOpen }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const { track } = useTelemetry();
    const isActive = location.pathname.startsWith(item.path);

    const handleClick = () => {
        track({
            event_name: 'navigation.sidebar_clicked',
            event_version: 'v1',
            classification: 'USER_ACTION',
            metadata: { path: item.path, label: item.text }
        });
        navigate(item.path);
    };

    return (
        <ListItem disablePadding sx={{ display: 'block', mb: 0.75 }} id={item.id}>
            <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right" arrow>
                <ListItemButton
                    onClick={handleClick}
                    sx={{
                        minHeight: 44, justifyContent: isSidebarOpen ? 'initial' : 'center', px: 2,
                        borderRadius: '12px', color: isActive ? 'primary.main' : 'text.primary',
                        bgcolor: isActive ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                        position: 'relative', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                            bgcolor: isActive ? alpha(theme.palette.primary.main, 0.14) : alpha(theme.palette.text.primary, 0.05),
                            transform: 'scale(1.02)',
                        },
                    }}
                >
                    {isActive && (
                        <Box sx={{ position: 'absolute', left: -6, width: 4, height: 18, bgcolor: 'primary.main', borderRadius: '0 4px 4px 0', boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}` }} />
                    )}
                    <ListItemIcon sx={{ minWidth: 0, mr: isSidebarOpen ? 2 : 0, justifyContent: 'center', color: isActive ? 'primary.main' : theme.palette.text.secondary }}>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isActive ? 700 : 500 }}
                        sx={{ opacity: isSidebarOpen ? 1 : 0, whiteSpace: 'nowrap' }}
                    />
                </ListItemButton>
            </Tooltip>
        </ListItem>
    );
};
