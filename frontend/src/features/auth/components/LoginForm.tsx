import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, useAuthStore } from '../hooks/useAuth';
import { healthService } from '@/services/healthService';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../styles/Auth.module.css';

export function LoginForm(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [localError, setLocalError] = useState<string>('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error } = useAuth();

    const successMessage = location.state?.message;

    useEffect(() => {
        healthService.checkHealth();
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setLocalError('');

        if (!email || !password) {
            setLocalError('Email and password are required');
            return;
        }

        try {
            await login(email, password);
            const user = useAuthStore.getState().user;
            const defaultPage = user?.preferences?.defaultPage || '/dashboard';
            navigate(defaultPage);
        } catch (err) {
            // Error handled by store
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
                            Execution, <br /> 
                            <span style={{ color: 'var(--accent-cyan)' }}>Refined.</span>
                        </h1>
                        <p className={styles.brandingSubtitle}>
                            Move beyond retail-grade systems. <br />
                            Operate with infrastructure designed for precision under real market conditions.
                        </p>
                        <div className={styles.featureList}>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>01</div>
                                <span className={styles.featureText}>Consistent Low-Latency Execution</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>02</div>
                                <span className={styles.featureText}>Granular Trade Visibility</span>
                            </div>
                            <div className={styles.featureItem}>
                                <div className={styles.featureIcon}>03</div>
                                <span className={styles.featureText}>Verifiable Order Handling</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Card */}
                <div className={styles.authFormSection}>
                    <div className={styles.authFormCard}>
                        <div className={styles.formHeader}>
                            <span className={styles.systemTag}>SECURE ACCESS</span>
                            <h2 className={styles.formTitle}>Welcome Back</h2>
                            <p className={styles.formSubtitle}>
                                Sign in to your Aequitas account
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
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-1rem' }}>
                                <Link to="/forgot-password" className={styles.footerLink}>
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <div className={styles.formFooter}>
                            <span className={styles.footerLink}>No account?</span>
                            <Link to="/register" className={styles.footerLink} style={{ color: 'var(--accent-cyan)' }}>
                                Create one now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
