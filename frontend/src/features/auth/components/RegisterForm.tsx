import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { healthService } from '@/services/healthService';
import { BrandLogo } from '../../../shared/components/header/BrandLogo';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../styles/Auth.module.css';

export function RegisterForm(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [localError, setLocalError] = useState<string>('');
    const navigate = useNavigate();
    const { register, isLoading, error } = useAuth();

    useEffect(() => {
        healthService.checkHealth();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLocalError('');

        // Client-side validation
        if (!email || !password) {
            setLocalError('Email and password are required');
            return;
        }

        if (password.length < 8) {
            setLocalError('Password must be at least 8 characters');
            return;
        }

        try {
            await register(email, password);
            navigate('/login');
        } catch (err) {
            // Error handled by store
        }
    };

    const displayError = localError || error;

    return (
        <div className={styles.authContainer}>
            <Link to="/" className={styles.backLink}>
                ← Back to Home
            </Link>

            <div className={styles.authContent}>
                {/* Left Side - Branding */}
                <div className={styles.authBranding}>
                    <div className={styles.brandingContent}>
                        <div className={styles.brandingLogo}>
                            <BrandLogo />
                        </div>
                        <h1 className={styles.brandingTitle}>
                            Start Trading with Aequitas
                        </h1>
                        <p className={styles.brandingSubtitle}>
                            Join thousands of traders who trust Aequitas for fair, transparent, and deterministic trading.
                        </p>
                        <div className={styles.brandingFeatures}>
                            <div className={styles.brandingFeature}>
                                <div className={styles.featureIcon}>✓</div>
                                <span>Free account setup</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <div className={styles.featureIcon}>✓</div>
                                <span>No hidden fees</span>
                            </div>
                            <div className={styles.brandingFeature}>
                                <div className={styles.featureIcon}>✓</div>
                                <span>24/7 customer support</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className={styles.authFormSection}>
                    <div className={styles.authFormCard}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>Create Account</h2>
                            <p className={styles.formSubtitle}>
                                Get started with your free trading account
                            </p>
                        </div>

                        {displayError && (
                            <div className={`${styles.alert} ${styles.alertError}`}>
                                <span>⚠</span>
                                <span>{displayError}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.authForm}>
                            <div className={styles.formGroup}>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.formInput}
                                    placeholder=" "
                                    required
                                />
                                <label htmlFor="email" className={styles.formLabel}>
                                    Email Address
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={styles.formInput}
                                        placeholder=" "
                                        required
                                        style={{ paddingRight: '40px' }}
                                    />
                                    <label htmlFor="password" className={styles.formLabel}>
                                        Password
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
                                <p className={styles.helperText}>
                                    Minimum 8 characters
                                </p>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className={styles.formFooter}>
                            Already have an account?{' '}
                            <Link to="/login" className={styles.formLink}>
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
