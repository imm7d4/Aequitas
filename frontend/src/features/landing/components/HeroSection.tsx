import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../styles/LandingPage.module.css';

export function HeroSection(): JSX.Element {
    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        featuresSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.heroSection}>
            <img
                src="/hero_trading_illustration.png"
                alt="Trading Platform"
                className={styles.heroBackground}
            />

            <div className={styles.heroContent}>
                <motion.h1
                    className={styles.heroHeadline}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Trade Smarter, Not Harder
                </motion.h1>

                <motion.p
                    className={styles.heroTagline}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Fair & Deterministic Trading Infrastructure
                </motion.p>

                <motion.p
                    className={styles.heroSubheadline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    Experience the future of retail stock trading with <strong>Aequitas. </strong>
                    Real-time data, advanced tools, zero hidden fees.
                </motion.p>

                <motion.div
                    className={styles.heroCTAs}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    <Link to="/register" className={styles.ctaPrimary}>
                        Get Started Free
                    </Link>
                    <button
                        onClick={scrollToFeatures}
                        className={styles.ctaSecondary}
                    >
                        Learn More
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
