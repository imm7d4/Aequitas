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
    Switch,
    Button,
    Stack,
    Divider,
    Alert,
    Select,
    MenuItem,
} from '@mui/material';
import {
    Palette as PaletteIcon,
    OpenInNew as OpenInNewIcon,
    Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { profileService } from '../services/profileService';
import type { User, UserPreferences as UserPrefsType } from '@/features/auth/types';

interface UserPreferencesProps {
    user: User;
    onUpdate: (updatedUser: User) => void;
}

export const UserPreferences: React.FC<UserPreferencesProps> = ({ user, onUpdate }) => {
    const [preferences, setPreferences] = useState<UserPrefsType>(
        user.preferences || {
            theme: 'dark',
            defaultPage: '/dashboard',
            notificationsEnabled: true,
        }
    );
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSave = async () => {
        setIsLoading(true);
        setMessage(null);
        try {
            const updatedUser = await profileService.updatePreferences(preferences);
            onUpdate(updatedUser);
            setMessage({ type: 'success', text: 'Preferences updated successfully' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update preferences' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack spacing={4}>
            {message && (
                <Alert severity={message.type} sx={{ borderRadius: 1.5 }}>
                    {message.text}
                </Alert>
            )}

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

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <NotificationsIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Alerts & Notifications
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="body1" fontWeight={500}>
                            System Notifications
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Receive updates about trades, alerts and system status.
                        </Typography>
                    </Box>
                    <Switch
                        checked={preferences.notificationsEnabled}
                        onChange={(e) => setPreferences({ ...preferences, notificationsEnabled: e.target.checked })}
                    />
                </Box>
            </Paper>

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
        </Stack>
    );
};
