import { useState, useEffect } from 'react';
import {
    Container, Box, Typography, Button,
    Alert, Snackbar, Tabs, Tab, Fade, Divider, Paper,
} from '@mui/material';
import { Loader } from '@/shared/components/Loader';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from '@mui/icons-material/Settings';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '@/features/auth';
import { profileService } from '../services/profileService';
import { ProfileEditForm } from './ProfileEditForm';
import { SecuritySettings } from './SecuritySettings';
import { UserPreferences } from './UserPreferences';
import { FinanceSettings } from './FinanceSettings';
import { ProfileHeroCard } from './ProfileHeroCard';
import { ProfileKPITiles } from './ProfileKPITiles';
import { useProfileStats } from '../hooks/useProfileStats';
import { useFinanceSettings } from '../hooks/useFinanceSettings';
import type { User } from '@/features/auth/types';

export function ProfilePage() {
    const { user, setUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(!user);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const { stats, isLoading: statsLoading, refresh: refreshStats } = useProfileStats();
    const { account } = useFinanceSettings();
    const balance = account?.balance ?? 0;

    const fetchProfile = async () => {
        if (!user) setIsLoading(true);
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

    return (
        <Container
            maxWidth="lg"
            sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}
            id="profile-container"
        >
            <Fade in={true} timeout={600}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 3, color: 'text.primary' }}>
                        Trader Profile
                    </Typography>

                    {(isLoading || !user) ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                            <Loader size="medium" />
                        </Box>
                    ) : (
                        <Fade in timeout={400}>
                            <Box>
                                {/* Hero Card */}
                                <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3.5 }, border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
                                    <ProfileHeroCard
                                        user={user}
                                        onUserUpdate={(updated: User) => {
                                            setUser(updated);
                                            setSuccessMessage('Bio updated');
                                        }}
                                    />
                                    <Divider sx={{ mb: 3 }} />
                                    <ProfileKPITiles
                                        stats={stats}
                                        balance={balance}
                                        isLoading={statsLoading}
                                        onRefresh={refreshStats}
                                    />
                                </Paper>

                                {/* Settings Tabs */}
                                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }} id="profile-tabs">
                                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
                                        <Tab icon={<PersonIcon />} iconPosition="start" label="Personal Identity" />
                                        <Tab icon={<SecurityIcon />} iconPosition="start" label="Account Security" />
                                        <Tab icon={<SettingsIcon />} iconPosition="start" label="Preferences" />
                                        <Tab icon={<WalletIcon />} iconPosition="start" label="Finances" id="profile-finance-tab" />
                                    </Tabs>
                                </Box>

                                {/* Tab Content */}
                                {activeTab === 0 && (
                                    <Paper sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 2, mb: 4, border: '1px solid', borderColor: 'divider' }} elevation={0}>
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
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                                    <Typography variant="h6" fontWeight={700}>Personal Information</Typography>
                                                    <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setIsEditing(true)} size="small">
                                                        Edit Profile
                                                    </Button>
                                                </Box>
                                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                                                    {[
                                                        { label: 'Display Name', value: user.displayName || '—' },
                                                        { label: 'Full Name', value: user.fullName || '—' },
                                                        { label: 'Email Address', value: user.email },
                                                        { label: 'Phone', value: user.phone || '—' },
                                                    ].map(({ label, value }) => (
                                                        <Box key={label}>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', fontSize: '0.65rem' }}>
                                                                {label}
                                                            </Typography>
                                                            <Typography variant="body1" fontWeight={500} sx={{ mt: 0.3 }}>
                                                                {value}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}
                                    </Paper>
                                )}
                                {activeTab === 1 && <SecuritySettings user={user} />}
                                {activeTab === 2 && <UserPreferences user={user} onUpdate={setUser} />}
                                {activeTab === 3 && <FinanceSettings />}
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Fade>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={4000}
                onClose={() => setSuccessMessage(null)}
                message={successMessage}
            />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Container>
    );
}
