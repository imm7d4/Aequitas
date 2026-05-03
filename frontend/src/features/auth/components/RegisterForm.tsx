import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Auth.module.css';
import { useRegisterForm } from '../hooks/useRegisterForm';
import { BrandingContent } from './register/BrandingContent';
import { RegisterStep } from './register/RegisterStep';
import { VerifyStep } from './register/VerifyStep';

export function RegisterForm(): JSX.Element {
    const {
        email, setEmail, password, setPassword, otp, setOtp,
        step, setStep, timer, showPassword, setShowPassword,
        successMessage, isLoading, displayError, handleSubmit, handleResend
    } = useRegisterForm();

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBackground}>
                <div className={styles.authGrid} />
            </div>

            <Link to="/" className={styles.backLink}>← Back to Home</Link>

            <div className={styles.authContent}>
                <BrandingContent />

                <div className={styles.authFormSection}>
                    <div className={styles.authFormCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.systemTag}>ACCOUNT SETUP</span>
                            <h2 className={styles.formTitle}>{step === 'form' ? 'Get Started' : 'Verify Account'}</h2>
                            <p className={styles.formSubtitle}>
                                {step === 'otp' ? 'Enter the 6-digit code sent to your email' : ''}
                            </p>
                        </div>

                        {displayError && (
                            <div className={styles.alert}>
                                <span>{displayError}</span>
                            </div>
                        )}

                        {successMessage && !displayError && (
                            <div className={styles.alert} style={{ borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.authForm}>
                            {step === 'form' ? (
                                <RegisterStep 
                                    email={email} setEmail={setEmail} 
                                    password={password} setPassword={setPassword} 
                                    showPassword={showPassword} setShowPassword={setShowPassword} 
                                />
                            ) : (
                                <VerifyStep 
                                    otp={otp} setOtp={setOtp} onResend={handleResend} 
                                    onBack={() => setStep('form')} timer={timer} 
                                />
                            )}

                            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                {isLoading
                                    ? (step === 'form' ? 'Preparing...' : 'Verifying...')
                                    : (step === 'form' ? 'Create Account' : 'Verify & Complete')}
                            </button>
                        </form>

                        <div className={styles.formFooter}>
                            <span className={styles.footerLink}>Already have an account?</span>
                            <Link to="/login" className={styles.footerLink} style={{ color: 'var(--accent-cyan)' }}>
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
