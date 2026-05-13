import React from 'react';
import {
    Box, Typography, Paper, Switch, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Stack
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import type { NotificationSettings } from '@/features/auth/types';

interface NotificationPreferencesPanelProps {
    settings: NotificationSettings;
    onChange: (settings: NotificationSettings) => void;
}

export const NotificationPreferencesPanel: React.FC<NotificationPreferencesPanelProps> = ({ settings, onChange }) => {
    const handleToggle = (key: keyof NotificationSettings) => {
        onChange({
            ...settings,
            [key]: !settings[key]
        });
    };

    const handleMuteAll = () => {
        onChange({
            ...settings,
            muteAll: !settings.muteAll
        });
    };

    const categories = [
        { key: 'orderFilled', label: 'Order Filled' },
        { key: 'orderRejected', label: 'Order Rejected' },
        { key: 'orderCancelled', label: 'Order Cancelled' },
        { key: 'marginCallWarning', label: 'Margin Call Warning' },
        { key: 'autoLiquidation', label: 'Position Auto-Liquidated' },
        { key: 'fundsDeposited', label: 'Funds Deposited' },
        { key: 'priceAlertTriggered', label: 'Price Alert Triggered' },
        { key: 'supportTicketUpdated', label: 'Support Ticket Updated' },
        { key: 'systemAnnouncements', label: 'System Announcements' },
    ];

    const enabledCount = settings.muteAll 
        ? 0 
        : categories.filter(c => settings[c.key as keyof NotificationSettings]).length;

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <NotificationsIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Alerts & Notifications
                    </Typography>
                </Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Chip 
                        label={`${enabledCount} of ${categories.length} alerts enabled`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">Mute All</Typography>
                        <Switch checked={settings.muteAll} onChange={handleMuteAll} />
                    </Box>
                </Stack>
            </Box>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">In-App Bell</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat.key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">
                                    <Typography variant="body2" fontWeight={500}>
                                        {cat.label}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Switch
                                        checked={!settings.muteAll && settings[cat.key as keyof NotificationSettings]}
                                        onChange={() => handleToggle(cat.key as keyof NotificationSettings)}
                                        disabled={settings.muteAll}
                                        size="small"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
