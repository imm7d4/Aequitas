import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { healthService } from '@/services/healthService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../styles/Auth.module.css';

export function RegisterForm(): JSX.Element {
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
            } catch (err) {
                // Error handled by hook
            }
        } else {
            // OTP Verification step
            if (!otp || otp.length !== 6) {
                setLocalError('Please enter the 6-digit code');
                return;
            }

            try {
                await completeRegistration(email, password, otp);
                navigate('/login', { state: { message: 'Registration complete! You can now log in.' } });
            } catch (err) {
                // Error handled by hook
            }
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;
        setLocalError('');
        try {
            await initiateRegistration(email, password);
            setTimer(60);
            setSuccessMessage('A new verification code has been sent.');
        } catch (err) {
            // Error handled by hook
        }
    };

    const displayError = localError || error;

    return (
        <div className={styles.authContainer}>
            <div className={styles.authBackground}>
                <div className={styles.authGrid} />
            </div>

            <Link to="/" className={styles.backLink}>
                ← Back to Home
            </Link>

            <div className={styles.authContent}>
                {/* Left Side - Branding Content */}
                <div className={styles.authBranding}>
                    <div className={styles.brandingContent}>
                        <h1 className={styles.brandingTitle}>
                            Trade Like <br /> 
                            <span style={{ color: 'var(--accent-cyan)' }}>A Pro.</span>
                        </h1>
                        <p className={styles.brandingSubtitle}>
                            Stop being the liquidity for someone else's bot. 
                            Join the Aequitas revolution today.
                        </p>
                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>01</div>
                                <span className={styles.featureText}>Democratized FPGA Speed</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>02</div>
                                <span className={styles.featureText}>100% Fair FIFO Execution</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>03</div>
                                <span className={styles.featureText}>Pro-Grade Performance Tools</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Card */}
                <div className={styles.authFormSection}>
                    <div className={styles.authFormCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.systemTag}>ACCOUNT SETUP</span>
                            <h2 className={styles.formTitle}>{step === 'form' ? 'Get Started' : 'Verify Account'}</h2>
                            <p className={styles.formSubtitle}>
                                {step === 'form' 
                                    ? 'Create your institutional trading account'
                                    : 'Enter the 6-digit code sent to your email'}
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
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="email" className={styles.formLabel}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={styles.formInput}
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="password" className={styles.formLabel}>
                                            Password
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={styles.formInput}
                                                style={{ width: '100%', paddingRight: '45px' }}
                                                placeholder="••••••••"
                                                required
                                            />
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
                                                    color: '#555',
                                                    display: 'flex',
                                                    padding: '4px'
                                                }}
                                            >
                                                {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                            </button>
                                        </div>
                                        <span className={styles.errorMessage} style={{ color: '#666', marginTop: '0.5rem' }}>
                                            Password must be at least 8 characters
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.formGroup}>
                                    <label htmlFor="otp" className={styles.formLabel}>
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className={styles.formInput}
                                        placeholder="000000"
                                        autoFocus
                                        required
                                        style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => setStep('form')}
                                            className={styles.footerLink}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                                        >
                                            Change Email
                                        </button>
                                        {timer > 0 ? (
                                            <span className={styles.footerLink}>Resend in {timer}s</span>
                                        ) : (
                                            <button 
                                                type="button" 
                                                onClick={handleResend}
                                                className={styles.footerLink}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent-cyan)' }}
                                            >
                                                Resend Code
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
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
