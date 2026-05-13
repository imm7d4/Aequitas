import React, { useState, useRef } from 'react';
import {
    Box, Avatar, Typography, Chip, IconButton,
    TextField, Tooltip, Stack, useTheme,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import VerifiedIcon from '@mui/icons-material/Verified';
import type { User } from '@/features/auth/types';
import { profileService } from '../services/profileService';

interface ProfileHeroCardProps {
    user: User;
    onUserUpdate: (user: User) => void;
}

export const ProfileHeroCard: React.FC<ProfileHeroCardProps> = ({ user, onUserUpdate }) => {
    const theme = useTheme();
    const [editingBio, setEditingBio] = useState(false);
    const [bioValue, setBioValue] = useState(user.bio || '');
    const [saving, setSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
        : '—';

    const initials = (user.displayName || user.email || '?')[0].toUpperCase();

    const handleBioSave = async () => {
        setSaving(true);
        try {
            const updated = await profileService.updateProfile({
                fullName: user.fullName || '',
                displayName: user.displayName || '',
                bio: bioValue,
                avatar: user.avatar || '',
                phone: user.phone || '',
            });
            onUserUpdate(updated);
            setEditingBio(false);
        } catch {
            // silently revert
        } finally {
            setSaving(false);
        }
    };

    const handleBioKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleBioSave(); }
        if (e.key === 'Escape') { setBioValue(user.bio || ''); setEditingBio(false); }
    };

    return (
        <Box sx={{
            display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3, mb: 4,
        }}>
            {/* Avatar */}
            <Avatar
                src={user.avatar}
                sx={{
                    width: 96, height: 96, fontSize: '2.2rem', fontWeight: 800,
                    bgcolor: theme.palette.primary.main,
                    boxShadow: `0 0 0 4px ${theme.palette.background.paper}, 0 0 0 6px ${theme.palette.primary.main}22`,
                    flexShrink: 0,
                }}
            >
                {initials}
            </Avatar>

            {/* Identity */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                    <Typography variant="h5" fontWeight={800} noWrap>
                        {user.displayName || user.email.split('@')[0]}
                    </Typography>
                    {user.isAdmin && (
                        <Tooltip title="Administrator">
                            <VerifiedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                        </Tooltip>
                    )}
                    <Chip
                        label="Active"
                        size="small"
                        color="success"
                        sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                    />
                </Stack>

                {user.fullName && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                        {user.fullName}
                    </Typography>
                )}

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Member since {memberSince}
                </Typography>

                {/* Inline bio */}
                <Box sx={{ mt: 1.5 }}>
                    {editingBio ? (
                        <Stack direction="row" spacing={1} alignItems="flex-start">
                            <TextField
                                inputRef={inputRef}
                                value={bioValue}
                                onChange={(e) => setBioValue(e.target.value)}
                                onKeyDown={handleBioKeyDown}
                                multiline maxRows={3} size="small" autoFocus
                                placeholder="Tell us about your trading style…"
                                sx={{ flex: 1, '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                            />
                            <IconButton size="small" color="primary" onClick={handleBioSave} disabled={saving}>
                                <CheckIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => { setBioValue(user.bio || ''); setEditingBio(false); }}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    ) : (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography
                                variant="body2"
                                color={user.bio ? 'text.primary' : 'text.disabled'}
                                sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' }, transition: 'color 0.2s', fontStyle: user.bio ? 'normal' : 'italic' }}
                                onClick={() => setEditingBio(true)}
                            >
                                {user.bio || 'Click to add a bio…'}
                            </Typography>
                            <Tooltip title="Edit bio">
                                <IconButton size="small" onClick={() => setEditingBio(true)} sx={{ opacity: 0.4, '&:hover': { opacity: 1 } }}>
                                    <EditIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )}
                </Box>
            </Box>
        </Box>
    );
};
