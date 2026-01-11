import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BrandLogo } from '@/shared/components/header/BrandLogo';
import styles from '../styles/LandingPage.module.css';

/**
 * LandingHeader - Sticky header for landing page
 * Shows Aequitas branding and auth buttons
 */
export function LandingHeader(): JSX.Element {
    const { scrollY } = useScroll();

    // Change header background opacity based on scroll
    const headerBg = useTransform(
        scrollY,
        [0, 100],
        ['rgba(15, 31, 53, 0.2)', 'rgba(15, 31, 53, 0.75)']
    );

    const headerShadow = useTransform(
        scrollY,
        [0, 100],
        ['0 2px 10px rgba(0, 0, 0, 0.1)', '0 4px 20px rgba(0, 0, 0, 0.3)']
    );

    return (
        <motion.header
            className={styles.landingHeader}
            style={{
                backgroundColor: headerBg,
                boxShadow: headerShadow,
            }}
        >
            <div className={styles.headerContent}>
                <Link to="/" className={styles.headerLogo}>
                    <BrandLogo />
                </Link>

                <div className={styles.headerActions}>
                    <Link to="/login" className={styles.headerLoginBtn}>
                        Login
                    </Link>
                    <Link to="/register" className={styles.headerRegisterBtn}>
                        Register
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
