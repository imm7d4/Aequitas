import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Alert,
    Stack,
} from '@mui/material';
import {
    Shield as ShieldIcon,
    History as HistoryIcon,
} from '@mui/icons-material';
import { profileService } from '../services/profileService';
import type { User } from '@/features/auth/types';

interface SecuritySettingsProps {
    user: User;
}

export const SecuritySettings: React.FC<SecuritySettingsProps> = ({ user }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setIsLoading(true);
        setMessage(null);

        try {
            await profileService.updatePassword(currentPassword, newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        } finally {
            setIsLoading(false);
        }
    };

    const lastLoginDate = user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A';

    return (
        <Stack spacing={4}>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <ShieldIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Change Password
                    </Typography>
                </Box>

                <form onSubmit={handlePasswordChange}>
                    <Stack spacing={3} sx={{ maxWidth: 400 }}>
                        {message && (
                            <Alert severity={message.type} sx={{ borderRadius: 1.5 }}>
                                {message.text}
                            </Alert>
                        )}
                        <TextField
                            fullWidth
                            label="Current Password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            helperText="Must be at least 8 characters long"
                        />
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isLoading}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </Stack>
                </form>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <HistoryIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                        Login Activity
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Last Login
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                            {lastLoginDate}
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            Last IP Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.5, borderRadius: 1 }}>
                            {user.lastLoginIP || 'N/A'}
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Stack>
    );
};
