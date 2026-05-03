import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import styles from '../../styles/Auth.module.css';

interface ResetStepProps {
    newPassword: string;
    setNewPassword: (v: string) => void;
    confirmPassword: string;
    setConfirmPassword: (v: string) => void;
    showPassword: boolean;
    setShowPassword: (v: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export const ResetStep: React.FC<ResetStepProps> = ({
    newPassword, setNewPassword, confirmPassword, setConfirmPassword,
    showPassword, setShowPassword, onSubmit, isLoading
}) => (
    <form onSubmit={onSubmit} className={styles.authForm}>
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
                        position: 'absolute', right: '12px', top: '50%',
                        transform: 'translateY(-50%)', background: 'none',
                        border: 'none', cursor: 'pointer',
                        color: 'rgba(255, 255, 255, 0.7)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        padding: '4px', zIndex: 10
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
);
