import React from 'react';
import styles from '../../styles/Auth.module.css';

export const BrandingContent: React.FC = () => (
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
);
