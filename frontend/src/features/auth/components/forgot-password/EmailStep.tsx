import React from 'react';
import { Email } from '@mui/icons-material';
import styles from '../../styles/Auth.module.css';

interface EmailStepProps {
    email: string;
    setEmail: (email: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export const EmailStep: React.FC<EmailStepProps> = ({ email, setEmail, onSubmit, isLoading }) => (
    <form onSubmit={onSubmit} className={styles.authForm}>
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
            <Email className={styles.inputIcon} style={{ 
                position: 'absolute', 
                right: '12px', 
                top: '16px', 
                color: 'rgba(255,255,255,0.3)', 
                fontSize: '20px' 
            }} />
        </div>
        <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Code'}
        </button>
    </form>
);
