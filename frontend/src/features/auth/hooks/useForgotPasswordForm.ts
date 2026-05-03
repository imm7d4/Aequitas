import { useState, FormEvent, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const useForgotPasswordForm = () => {
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [localError, setLocalError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [timer, setTimer] = useState<number>(0);

    const navigate = useNavigate();
    const { forgotPassword, resetPassword, isLoading, error } = useAuth();

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setSuccessMessage('');
        if (!email) {
            setLocalError('Email is required');
            return;
        }

        try {
            await forgotPassword(email);
            setStep('otp');
            setTimer(60);
            setSuccessMessage('A reset code has been sent to your email.');
        } catch (err) {}
    };

    const handleVerifyOtp = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError('');
        if (!otp || otp.length !== 6) {
            setLocalError('Please enter the 6-digit code');
            return;
        }
        setStep('reset');
        setSuccessMessage('Code verified. Set your new password.');
    };

    const handleResetPassword = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError('');

        if (newPassword !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return;
        }

        try {
            await resetPassword({ email, otp, newPassword });
            navigate('/login', { state: { message: 'Password reset successful! You can now log in.' } });
        } catch (err) {}
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLocalError('');
        try {
            await forgotPassword(email);
            setTimer(60);
            setSuccessMessage('A new reset code has been sent.');
        } catch (err) {}
    };

    const displayError = localError || error;

    return {
        email, setEmail,
        otp, setOtp,
        newPassword, setNewPassword,
        confirmPassword, setConfirmPassword,
        step, setStep,
        showPassword, setShowPassword,
        successMessage,
        timer,
        isLoading,
        displayError,
        handleSendOtp,
        handleVerifyOtp,
        handleResetPassword,
        handleResend
    };
};
