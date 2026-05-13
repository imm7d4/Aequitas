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
import { useColorMode } from '@/app/providers';

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
    const { setColorMode } = useColorMode();
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
            setColorMode(preferences.theme as any); // Apply theme immediately
            setSnackbar({ open: true, message: 'Preferences updated successfully', severity: 'success' });
        } catch (err: any) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Failed to update preferences', severity: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'flex-start' }}>
                    {/* Theme Section */}
                    <FormControl component="fieldset">
                        <FormLabel component="legend" sx={{ mb: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>Theme</FormLabel>
                        <RadioGroup
                            row
                            value={preferences.theme}
                            onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                        >
                            <FormControlLabel value="light" control={<Radio size="small" />} label={<Typography variant="body2">Light</Typography>} />
                            <FormControlLabel value="dark" control={<Radio size="small" />} label={<Typography variant="body2">Dark</Typography>} />
                            <FormControlLabel value="system" control={<Radio size="small" />} label={<Typography variant="body2">System</Typography>} />
                        </RadioGroup>
                    </FormControl>

                    {/* Navigation Section */}
                    <FormControl sx={{ minWidth: 200 }}>
                        <FormLabel sx={{ mb: 0.5, fontSize: '0.85rem', fontWeight: 600 }}>Default Landing Page</FormLabel>
                        <Select
                            size="small"
                            value={preferences.defaultPage}
                            onChange={(e) => setPreferences({ ...preferences, defaultPage: e.target.value })}
                            sx={{ maxWidth: 200 }}
                        >
                            <MenuItem value="/dashboard">Dashboard</MenuItem>
                            <MenuItem value="/portfolio">Portfolio</MenuItem>
                            <MenuItem value="/orders">Orders</MenuItem>
                            <MenuItem value="/instruments">Instruments</MenuItem>
                            <MenuItem value="/diagnostics">Trade Diagnostics</MenuItem>
                        </Select>
                        <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.75rem' }}>
                            Loads automatically after login.
                        </Typography>
                    </FormControl>
                </Box>
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
