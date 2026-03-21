import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    Avatar,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { profileService } from '../services/profileService';
import type { User } from '@/features/auth/types';

interface ProfileEditFormProps {
    user: User;
    onSuccess: (user: User) => void;
    onCancel: () => void;
}

export function ProfileEditForm({ user, onSuccess, onCancel }: ProfileEditFormProps) {
    const [fullName, setFullName] = useState(user.fullName || '');
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [email, setEmail] = useState(user.email || '');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [emailUpdateStep, setEmailUpdateStep] = useState<'view' | 'confirm' | 'otp'>('view');
    const [bio, setBio] = useState(user.bio || '');
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit for Base64 storage
                setError('Image size should be less than 1MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const updatedUser = await profileService.updateProfile({
                fullName,
                displayName,
                bio,
                avatar,
                phone,
            });
            onSuccess(updatedUser);
            setSuccess('Profile updated successfully');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitiateEmailUpdate = async () => {
        if (!newEmail || !currentPassword) {
            setError('Both new email and current password are required');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await profileService.initiateEmailUpdate(currentPassword, newEmail);
            setEmailUpdateStep('otp');
            setSuccess('A verification code has been sent to your new email.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to initiate email update');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteEmailUpdate = async () => {
        if (!emailOtp) {
            setError('Verification code is required');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const updatedUser = await profileService.completeEmailUpdate(newEmail, emailOtp);
            setEmail(updatedUser.email);
            setEmailUpdateStep('view');
            setNewEmail('');
            setCurrentPassword('');
            setEmailOtp('');
            setSuccess('Email updated successfully');
            onSuccess(updatedUser);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Verification failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                Edit Profile Details
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                        src={avatar}
                        sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}
                    >
                        {displayName?.[0] || user.email[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCamera />}
                            sx={{ mb: 1 }}
                        >
                            Upload Photo
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary">
                            JPG, PNG or GIF. Max size 1MB.
                        </Typography>
                    </Box>
                </Box>

                <TextField
                    fullWidth
                    label="Display Name"
                    variant="outlined"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    helperText="This name will be shown to other traders"
                />

                <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Phone Number"
                    variant="outlined"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+919876543210"
                />

                <TextField
                    fullWidth
                    label="Bio"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your trading philosophy..."
                />

                <Box sx={{ p: 2, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, bgcolor: 'rgba(255,255,255,0.02)' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                        🛡 Secure Email Management
                    </Typography>

                    {emailUpdateStep === 'view' ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Current Primary Email</Typography>
                                <Typography variant="body1">{email}</Typography>
                            </Box>
                            <Button variant="outlined" size="small" onClick={() => setEmailUpdateStep('confirm')}>
                                Change Email
                            </Button>
                        </Box>
                    ) : emailUpdateStep === 'confirm' ? (
                        <Stack spacing={2}>
                            <TextField
                                fullWidth
                                label="New Email Address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                size="small"
                                required
                            />
                            <TextField
                                fullWidth
                                type="password"
                                label="Confirm with Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                size="small"
                                required
                            />
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" size="small" onClick={handleInitiateEmailUpdate} disabled={isLoading}>
                                    Send Verification
                                </Button>
                                <Button variant="text" size="small" onClick={() => setEmailUpdateStep('view')} disabled={isLoading}>
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack spacing={2}>
                            <Typography variant="body2" color="text.secondary">
                                We've sent a 6-digit code to <strong>{newEmail}</strong>. Please enter it below to confirm the change.
                            </Typography>
                            <TextField
                                fullWidth
                                label="Verification Code"
                                value={emailOtp}
                                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                size="small"
                                placeholder="123456"
                                required
                                autoFocus
                            />
                            <Stack direction="row" spacing={1}>
                                <Button variant="contained" size="small" onClick={handleCompleteEmailUpdate} disabled={isLoading}>
                                    Verify & Update
                                </Button>
                                <Button variant="text" size="small" onClick={() => setEmailUpdateStep('confirm')} disabled={isLoading}>
                                    Back
                                </Button>
                            </Stack>
                        </Stack>
                    )}
                </Box>

                {error && <Typography color="error" variant="body2">{error}</Typography>}
                {success && <Typography color="success.main" variant="body2">{success}</Typography>}

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        size="large"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        variant="text"
                        onClick={onCancel}
                        disabled={isLoading}
                        size="large"
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </form>
    );
}
