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
    const [bio, setBio] = useState(user.bio || '');
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const updatedUser = await profileService.updateProfile({
                fullName,
                displayName,
                bio,
                avatar,
            });
            onSuccess(updatedUser);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
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
                    label="Bio"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Describe your trading philosophy..."
                />

                {error && <Typography color="error" variant="body2">{error}</Typography>}

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
