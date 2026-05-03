import React from 'react';
import styles from '../../styles/Auth.module.css';

interface VerifyStepProps {
    otp: string;
    setOtp: (v: string) => void;
    onResend: () => void;
    onBack: () => void;
    timer: number;
}

export const VerifyStep: React.FC<VerifyStepProps> = ({
    otp, setOtp, onResend, onBack, timer
}) => (
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
                onClick={onBack}
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
                    onClick={onResend}
                    className={styles.footerLink}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--accent-cyan)' }}
                >
                    Resend Code
                </button>
            )}
        </div>
    </div>
);
