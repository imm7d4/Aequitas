import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../../styles/Auth.module.css';

interface RegisterStepProps {
    email: string;
    setEmail: (v: string) => void;
    password: string;
    setPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
}

export const RegisterStep: React.FC<RegisterStepProps> = ({
    email, setEmail, password, setPassword, showPassword, setShowPassword
}) => (
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
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', background: 'none',
                        border: 'none', cursor: 'pointer', color: '#555',
                        display: 'flex', padding: '4px'
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
);
