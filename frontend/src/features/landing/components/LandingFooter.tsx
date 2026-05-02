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
                        Next-generation deterministic trading infrastructure. 
                        Engineered for institutional capital and sub-nanosecond 
                        market intelligence.
                    </p>
                </div>

                <div className={styles.footerNav}>
                    <span className={styles.footerHeading}>NAVIGATION</span>
                    <Link to="/login" className={styles.footerNavLink}>TERMINAL ACCESS</Link>
                    <Link to="/register" className={styles.footerNavLink}>NODE REGISTRATION</Link>
                    <a href="#features" className={styles.footerNavLink}>INFRASTRUCTURE</a>
                </div>

                <div className={styles.footerSystemInfo}>
                    <span className={styles.footerHeading}>SYSTEM STATUS</span>
                    <div className={styles.statusIndicator}>
                        <div className={styles.statusDot} />
                        <span>MAINNET-STABLE // ONLINE</span>
                    </div>
                    <span>UPTIME: 99.9999%</span>
                    <span>NODE_ID: AEQ-GLB-01</span>
                    <span>REGION: GLOBAL_MESH</span>
                </div>
            </div>

            <div className={styles.footerBottom}>
                <div className={styles.footerLegal}>
                    © {currentYear} AEQUITAS. SYSTEM_V2.0.4 // ALL RIGHTS RESERVED.
                </div>

                <div className={styles.footerEngineer}>
                    ARCHITECT: <a 
                        href="https://www.linkedin.com/in/im7d4/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.engineerLink}
                    >
                        DHARMESH MENARIA
                    </a>
                </div>

                <div className={styles.footerSocials}>
                    <a href="https://github.com/imm7d4" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
                        GITHUB
                    </a>
                    <a href="https://www.linkedin.com/in/im7d4/" target="_blank" rel="noopener noreferrer" className={styles.footerSocialLink}>
                        LINKEDIN
                    </a>
                </div>
            </div>
        </footer>
    );
}
