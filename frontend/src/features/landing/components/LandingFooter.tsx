import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

export function LandingFooter(): JSX.Element {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.landingFooter}>
            <div className={styles.footerContent}>
                <div className={styles.footerBrand}>
                    <span className={styles.footerHeading}>AEQUITAS CORE</span>
                    <p className={styles.footerBrandText}>
                        Execution Infrastructure. <br />
                        No Abstraction Layers.
                    </p>
                </div>

                <div className={styles.footerNav}>
                    <span className={styles.footerHeading}>SYSTEM_METRICS</span>
                    <div className={styles.footerNavLink}>SYSTEM_VERSION: 2.0.4</div>
                    <div className={styles.footerNavLink}>ARCHITECTURE: DETERMINISTIC EXECUTION CORE</div>
                </div>

                <div className={styles.footerSystemInfo}>
                    <span className={styles.footerHeading}>SYSTEM STATUS</span>
                    <div className={styles.statusIndicator}>
                        <div className={styles.statusDot} />
                        <span>MAINNET: ONLINE</span>
                    </div>
                    <span>UPTIME: 99.999% (rolling)</span>
                    <span>REGION: Distributed execution mesh</span>
                    <span>NODE: AEQ-GLB-01</span>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.footerLegal}>
                    © {currentYear} AEQUITAS
                </div>

                <div className={styles.footerEngineer}>
                    Architect: <a 
                        href="https://www.linkedin.com/in/im7d4/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.engineerLink}
                    >
                        Dharmesh Menaria
                    </a>
                </div>

                <div className={styles.footerSocials}>
                    <a href="https://github.com/imm7d4" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
                        GITHUB
                    </a>
                    <a href="https://x.com/imm7d4" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
                        X (TWITTER)
                    </a>
                </div>
            </div>
        </footer>
    );
}
