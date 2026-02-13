import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from '../styles/LandingPage.module.css';
import { HeroTradingVisuals } from './HeroTradingVisuals';

export function HeroSection(): JSX.Element {
    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        featuresSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroBackground} />

            {/* New Animated Visuals Layer */}
            <HeroTradingVisuals />

            <div className={styles.heroContent}>
                <motion.span
                    className={styles.heroLabel}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Next-Gen Trading Engine
                </motion.span>

                <motion.h1
                    className={styles.heroHeadline}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Trade with <br /> Absolute Confidence
                </motion.h1>

                <motion.p
                    className={styles.heroTagline}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    Fair. Transparent. Instant.
                </motion.p>

                <motion.p
                    className={styles.heroSubheadline}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    Experience the future of financial markets with <strong>Aequitas</strong>.
                    Institutional-grade infrastructure available for everyone. Zero hidden fees.
                </motion.p>

                <motion.div
                    className={styles.heroCTAs}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Link to="/register" className={styles.ctaPrimary}>
                        Start Trading Now
                    </Link>
                    <button
                        onClick={scrollToFeatures}
                        className={styles.ctaSecondary}
                    >
                        Explore Features
                    </button>
                </motion.div>
            </div>
        </section>
    );
}

