import { Box, TextField, Button, Stack, Typography, Avatar } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useProfileEditForm } from '../hooks/useProfileEditForm';
import { EmailUpdateSection } from './EmailUpdateSection';
import type { User } from '@/features/auth/types';

interface ProfileEditFormProps {
    user: User;
    onSuccess: (user: User) => void;
    onCancel: () => void;
}

export function ProfileEditForm({ user, onSuccess, onCancel }: ProfileEditFormProps) {
    const {
        fullName, setFullName, displayName, setDisplayName, email, newEmail, setNewEmail, currentPassword, setCurrentPassword,
        emailOtp, setEmailOtp, emailUpdateStep, setEmailUpdateStep, bio, setBio, avatar, phone, setPhone, isLoading, error, success,
        handleFileChange, handleSubmit, handleInitiateEmailUpdate, handleCompleteEmailUpdate
    } = useProfileEditForm(user, onSuccess);

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>Edit Profile Details</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar src={avatar} sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                        {displayName?.[0] || user.email[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Button variant="outlined" component="label" startIcon={<PhotoCamera />} sx={{ mb: 1 }}>
                            Upload Photo
                            <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                        </Button>
                        <Typography variant="caption" display="block" color="text.secondary">JPG, PNG or GIF. Max 1MB.</Typography>
                    </Box>
                </Box>

                <TextField fullWidth label="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                <TextField fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <TextField fullWidth label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <TextField fullWidth label="Bio" multiline rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />

                <EmailUpdateSection
                    email={email}
                    newEmail={newEmail}
                    currentPassword={currentPassword}
                    otp={emailOtp}
                    step={emailUpdateStep}
                    isLoading={isLoading}
                    onStepChange={setEmailUpdateStep}
                    onNewEmailChange={setNewEmail}
                    onPasswordChange={setCurrentPassword}
                    onOtpChange={setEmailOtp}
                    onInitiate={handleInitiateEmailUpdate}
                    onComplete={handleCompleteEmailUpdate}
                />

                {error && <Typography color="error" variant="body2">{error}</Typography>}
                {success && <Typography color="success.main" variant="body2">{success}</Typography>}

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" disabled={isLoading} size="large">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="text" onClick={onCancel} disabled={isLoading} size="large">Cancel</Button>
                </Stack>
            </Box>
        </form>
    );
}
