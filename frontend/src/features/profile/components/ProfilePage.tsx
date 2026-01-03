import { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    Avatar,
    Button,
    Grid,
    Divider,
    CircularProgress,
    Alert,
    Snackbar,
    Tabs,
    Tab,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '@/features/auth';
import { profileService } from '../services/profileService';
import { ProfileEditForm } from './ProfileEditForm';
import { SecuritySettings } from './SecuritySettings';
import type { User } from '@/features/auth/types';

export function ProfilePage() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const profile = await profileService.getProfile();
            setUser(profile);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) return null;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Trader Settings
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                    <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Identity" />
                    <Tab icon={<SecurityIcon />} iconPosition="start" label="Account Security" />
                </Tabs>
            </Box>

            {activeTab === 0 ? (
                <Paper sx={{ p: 4, borderRadius: 2, mb: 4 }}>
                    {isEditing ? (
                        <ProfileEditForm
                            user={user}
                            onSuccess={(updatedUser: User) => {
                                setUser(updatedUser);
                                setIsEditing(false);
                                setSuccessMessage('Profile updated successfully');
                            }}
                            onCancel={() => setIsEditing(false)}
                        />
                    ) : (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                    <Avatar
                                        src={user.avatar}
                                        sx={{
                                            width: 100,
                                            height: 100,
                                            fontSize: '2.5rem',
                                            bgcolor: 'primary.main',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {user.displayName?.[0] || user.email[0].toUpperCase()}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight={700}>
                                            {user.displayName || user.email.split('@')[0]}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary">
                                            {user.fullName || 'No name provided'}
                                        </Typography>
                                        <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'primary.main', fontWeight: 600 }}>
                                            {user.isAdmin ? 'Administrator' : 'Master Trader'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit Profile
                                </Button>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        BIO
                                    </Typography>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {user.bio || 'Your bio is empty. Tell us about your trading style!'}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        EMAIL ADDRESS
                                    </Typography>
                                    <Typography variant="body1">
                                        {user.email}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        MEMBER SINCE
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Paper>
            ) : (
                <SecuritySettings user={user} />
            )}

            <Snackbar
                open={!!successMessage}
                autoHideDuration={6000}
                onClose={() => setSuccessMessage(null)}
                message={successMessage}
            />

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Container>
    );
}
