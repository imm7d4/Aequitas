import React from 'react';
import styles from '../../styles/Auth.module.css';

interface OtpStepProps {
    otp: string;
    setOtp: (otp: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    onResend: () => void;
    onBack: () => void;
    timer: number;
}

export const OtpStep: React.FC<OtpStepProps> = ({ 
    otp, setOtp, onSubmit, onResend, onBack, timer 
}) => (
    <form onSubmit={onSubmit} className={styles.authForm}>
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
                    onClick={onBack}
                    style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0 }}
                >
                    Change Email
                </button>
                {timer > 0 ? (
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>Resend in {timer}s</span>
                ) : (
                    <button 
                        type="button" 
                        onClick={onResend}
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
);
