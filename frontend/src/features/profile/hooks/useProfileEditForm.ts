import { useState } from 'react';
import { profileService } from '../services/profileService';
import type { User } from '@/features/auth/types';

export const useProfileEditForm = (user: User, onSuccess: (user: User) => void) => {
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
            if (file.size > 1024 * 1024) return setError('Image size should be less than 1MB');
            const reader = new FileReader();
            reader.onloadend = () => { setAvatar(reader.result as string); setError(null); };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true); setError(null); setSuccess(null);
        try {
            const updatedUser = await profileService.updateProfile({ fullName, displayName, bio, avatar, phone });
            onSuccess(updatedUser); setSuccess('Profile updated successfully');
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to update'); }
        finally { setIsLoading(false); }
    };

    const handleInitiateEmailUpdate = async () => {
        if (!newEmail || !currentPassword) return setError('Both fields required');
        setIsLoading(true); setError(null);
        try {
            await profileService.initiateEmailUpdate(currentPassword, newEmail);
            setEmailUpdateStep('otp'); setSuccess('Verification code sent.');
        } catch (err: any) { setError(err.response?.data?.message || 'Failed to initiate'); }
        finally { setIsLoading(false); }
    };

    const handleCompleteEmailUpdate = async () => {
        if (!emailOtp) return setError('Verification code required');
        setIsLoading(true); setError(null);
        try {
            const updatedUser = await profileService.completeEmailUpdate(newEmail, emailOtp);
            setEmail(updatedUser.email); setEmailUpdateStep('view'); setNewEmail(''); setCurrentPassword(''); setEmailOtp('');
            setSuccess('Email updated successfully'); onSuccess(updatedUser);
        } catch (err: any) { setError(err.response?.data?.message || 'Verification failed'); }
        finally { setIsLoading(false); }
    };

    return {
        fullName, setFullName, displayName, setDisplayName, email, setEmail, newEmail, setNewEmail, currentPassword, setCurrentPassword,
        emailOtp, setEmailOtp, emailUpdateStep, setEmailUpdateStep, bio, setBio, avatar, setAvatar, phone, setPhone, isLoading, error, success,
        handleFileChange, handleSubmit, handleInitiateEmailUpdate, handleCompleteEmailUpdate
    };
};
