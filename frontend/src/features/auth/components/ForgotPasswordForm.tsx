import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BrandLogo } from '../../../shared/components/header/BrandLogo';
import { Visibility, VisibilityOff, Email, ArrowBack } from '@mui/icons-material';
import styles from '../styles/Auth.module.css';

export function ForgotPasswordForm(): JSX.Element {
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
        } catch (err) {
            // Error handled by hook
        }
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
        } catch (err) {
            // Error handled by hook
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLocalError('');
        try {
            await forgotPassword(email);
            setTimer(60);
            setSuccessMessage('A new reset code has been sent.');
        } catch (err) {
            // Error handled by hook
        }
    };

    const displayError = localError || error;

    return (
        <div className={styles.authContainer}>
            <Link to="/login" className={styles.backLink}>
                <ArrowBack sx={{ fontSize: 18, mr: 1 }} /> Back to Login
            </Link>

            <div className={styles.authContent} style={{ maxWidth: '480px', margin: '0 auto', width: '100%' }}>
                <div className={styles.authFormSection} style={{ width: '100%' }}>
                    <div className={styles.authFormCard}>
                        <div className={styles.formHeader}>
                            <div className={styles.brandingLogo} style={{ marginBottom: '24px' }}>
                                <BrandLogo />
                            </div>
                            <h2 className={styles.formTitle}>
                                {step === 'email' && 'Forgot Password'}
                                {step === 'otp' && 'Verify Identity'}
                                {step === 'reset' && 'Reset Password'}
                            </h2>
                            <p className={styles.formSubtitle}>
                                {step === 'email' && 'Enter your email to receive a password reset code'}
                                {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
                                {step === 'reset' && 'Create a strong new password for your account'}
                            </p>
                        </div>

                        {displayError && (
                            <div className={`${styles.alert} ${styles.alertError}`}>
                                <span>⚠</span>
                                <span>{displayError}</span>
                            </div>
                        )}

                        {successMessage && !displayError && (
                            <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ marginBottom: '20px', padding: '12px', background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>✓</span>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {step === 'email' && (
                            <form onSubmit={handleSendOtp} className={styles.authForm}>
                                <div className={styles.formGroup}>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={styles.formInput}
                                        placeholder=" "
                                        required
                                        autoFocus
                                    />
                                    <label htmlFor="email" className={styles.formLabel}>
                                        Email Address
                                    </label>
                                    <Email className={styles.inputIcon} style={{ position: 'absolute', right: '12px', top: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '20px' }} />
                                </div>
                                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                                </button>
                            </form>
                        )}

                        {step === 'otp' && (
                            <form onSubmit={handleVerifyOtp} className={styles.authForm}>
                                <div className={styles.formGroup}>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className={styles.formInput}
                                        placeholder=" "
                                        required
                                        autoFocus
                                        style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                                    />
                                    <label htmlFor="otp" className={styles.formLabel}>
                                        Verification Code
                                    </label>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '13px' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep('email')}
                                            style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0 }}
                                        >
                                            Change Email
                                        </button>
                                        {timer > 0 ? (
                                            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Resend in {timer}s</span>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={handleResend}
                                                style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0 }}
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <button type="submit" className={styles.submitButton}>
                                    Verify Code
                                </button>
                            </form>
                        )}

                        {step === 'reset' && (
                            <form onSubmit={handleResetPassword} className={styles.authForm}>
                                <div className={styles.formGroup}>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className={styles.formInput}
                                            placeholder=" "
                                            required
                                            autoFocus
                                            style={{ paddingRight: '40px' }}
                                        />
                                        <label htmlFor="newPassword" className={styles.formLabel}>
                                            New Password
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute',
                                                right: '12px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '4px',
                                                zIndex: 10
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={styles.formInput}
                                        placeholder=" "
                                        required
                                    />
                                    <label htmlFor="confirmPassword" className={styles.formLabel}>
                                        Confirm New Password
                                    </label>
                                </div>

                                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
