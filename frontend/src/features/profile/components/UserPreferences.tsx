import React, { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Stack,
    Alert,
    Select,
    MenuItem,
    Snackbar,
} from '@mui/material';
import {
    Palette as PaletteIcon,
    OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { profileService } from '../services/profileService';
import type { User, UserPreferences as UserPrefsType, NotificationSettings } from '@/features/auth/types';
import { NotificationPreferencesPanel } from './NotificationPreferencesPanel';

interface UserPreferencesProps {
    user: User;
    onUpdate: (updatedUser: User) => void;
}

const defaultNotificationSettings: NotificationSettings = {
    orderFilled: true,
    orderRejected: true,
    orderCancelled: true,
    marginCallWarning: true,
    autoLiquidation: true,
    fundsDeposited: true,
    priceAlertTriggered: true,
    supportTicketUpdated: true,
    systemAnnouncements: true,
    muteAll: false,
};

export const UserPreferences: React.FC<UserPreferencesProps> = ({ user, onUpdate }) => {
    const [preferences, setPreferences] = useState<UserPrefsType>({
        ...user.preferences,
        notificationSettings: user.preferences?.notificationSettings || defaultNotificationSettings
    });
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updatedUser = await profileService.updatePreferences(preferences);
            onUpdate(updatedUser);
            setSnackbar({ open: true, message: 'Preferences updated successfully', severity: 'success' });
        } catch (err: any) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update preferences', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <PaletteIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Appearance
                    </Typography>
                </Box>

                <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ mb: 1 }}>Current Theme</FormLabel>
                    <RadioGroup
                        row
                        value={preferences.theme}
                        onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    >
                        <FormControlLabel value="light" control={<Radio />} label="Light" />
                        <FormControlLabel value="dark" control={<Radio />} label="Dark" />
                        <FormControlLabel value="system" control={<Radio />} label="System" />
                    </RadioGroup>
                </FormControl>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <OpenInNewIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Navigation
                    </Typography>
                </Box>

                <FormControl fullWidth>
                    <FormLabel sx={{ mb: 1 }}>Default Starting Page</FormLabel>
                    <Select
                        value={preferences.defaultPage}
                        onChange={(e) => setPreferences({ ...preferences, defaultPage: e.target.value })}
                        sx={{ maxWidth: 300 }}
                    >
                        <MenuItem value="/dashboard">Dashboard</MenuItem>
                        <MenuItem value="/markets">Market Pulse</MenuItem>
                        <MenuItem value="/portfolio">My Portfolio</MenuItem>
                    </Select>
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                        This page will load automatically after successful login.
                    </Typography>
                </FormControl>
            </Paper>

            <NotificationPreferencesPanel
                settings={preferences.notificationSettings || defaultNotificationSettings}
                onChange={(newSettings) => setPreferences({ ...preferences, notificationSettings: newSettings })}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    onClick={handleSave}
                >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
            </Box>

            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={3000} 
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })} 
                    severity={snackbar.severity} 
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 1.5 }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Stack>
    );
};
