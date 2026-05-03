import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { healthService } from '@/services/healthService';

export const useRegisterForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [step, setStep] = useState<'form' | 'otp'>('form');
    const [timer, setTimer] = useState<number>(0);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [localError, setLocalError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const navigate = useNavigate();
    const { initiateRegistration, completeRegistration, isLoading, error } = useAuth();

    useEffect(() => {
        let interval: any;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        healthService.checkHealth();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLocalError('');

        if (step === 'form') {
            if (!email || !password) {
                setLocalError('Email and password are required');
                return;
            }
            if (password.length < 8) {
                setLocalError('Password must be at least 8 characters');
                return;
            }

            try {
                await initiateRegistration(email, password);
                setStep('otp');
                setTimer(60);
                setSuccessMessage('A verification code has been sent to your email.');
            } catch (err) {}
        } else {
            if (!otp || otp.length !== 6) {
                setLocalError('Please enter the 6-digit code');
                return;
            }

            try {
                await completeRegistration(email, password, otp);
                navigate('/login', { state: { message: 'Registration complete! You can now log in.' } });
            } catch (err) {}
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLocalError('');
        try {
            await initiateRegistration(email, password);
            setTimer(60);
            setSuccessMessage('A new verification code has been sent.');
        } catch (err) {}
    };

    const displayError = localError || error;

    return {
        email, setEmail,
        password, setPassword,
        otp, setOtp,
        step, setStep,
        timer,
        showPassword, setShowPassword,
        successMessage,
        isLoading,
        displayError,
        handleSubmit,
        handleResend
    };
};
