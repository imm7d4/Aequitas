import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../../../shared/components/header/BrandLogo';
import { ArrowBack } from '@mui/icons-material';
import styles from '../styles/Auth.module.css';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import { EmailStep } from './forgot-password/EmailStep';
import { OtpStep } from './forgot-password/OtpStep';
import { ResetStep } from './forgot-password/ResetStep';

export function ForgotPasswordForm(): JSX.Element {
    const {
        email, setEmail, otp, setOtp, newPassword, setNewPassword,
        confirmPassword, setConfirmPassword, step, setStep,
        showPassword, setShowPassword, successMessage, timer,
        isLoading, displayError, handleSendOtp, handleVerifyOtp,
        handleResetPassword, handleResend
    } = useForgotPasswordForm();

    const getFormTitle = () => {
        if (step === 'email') return 'Forgot Password';
        if (step === 'otp') return 'Verify Identity';
        return 'Reset Password';
    };

    const getFormSubtitle = () => {
        if (step === 'email') return 'Enter your email to receive a password reset code';
        if (step === 'otp') return `Enter the 6-digit code sent to ${email}`;
        return 'Create a strong new password for your account';
    };

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
                            <h2 className={styles.formTitle}>{getFormTitle()}</h2>
                            <p className={styles.formSubtitle}>{getFormSubtitle()}</p>
                        </div>

                        {displayError && (
                            <div className={`${styles.alert} ${styles.alertError}`}>
                                <span>⚠</span><span>{displayError}</span>
                            </div>
                        )}

                        {successMessage && !displayError && (
                            <div className={`${styles.alert} ${styles.alertSuccess}`} style={{ 
                                marginBottom: '20px', padding: '12px', background: 'rgba(76, 175, 80, 0.1)', 
                                color: '#4caf50', borderRadius: '8px', fontSize: '14px', 
                                display: 'flex', alignItems: 'center', gap: '8px' 
                            }}>
                                <span>✓</span><span>{successMessage}</span>
                            </div>
                        )}

                        {step === 'email' && (
                            <EmailStep 
                                email={email} setEmail={setEmail} 
                                onSubmit={handleSendOtp} isLoading={isLoading} 
                            />
                        )}

                        {step === 'otp' && (
                            <OtpStep 
                                otp={otp} setOtp={setOtp} onSubmit={handleVerifyOtp} 
                                onResend={handleResend} onBack={() => setStep('email')} 
                                timer={timer} 
                            />
                        )}

                        {step === 'reset' && (
                            <ResetStep 
                                newPassword={newPassword} setNewPassword={setNewPassword}
                                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                showPassword={showPassword} setShowPassword={setShowPassword}
                                onSubmit={handleResetPassword} isLoading={isLoading}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
