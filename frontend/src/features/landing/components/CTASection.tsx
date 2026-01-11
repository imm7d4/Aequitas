import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/LandingPage.module.css';

export function CTASection(): JSX.Element {
    const ref = useScrollAnimation('fade-in-up');

    return (
        <section className={styles.ctaSection} ref={ref}>
            <motion.h2
                className={styles.ctaSectionTitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                Ready to Start Trading?
            </motion.h2>

            <motion.p
                className={styles.ctaSectionSubtitle}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Join Aequitas today and experience fair, fast, and transparent
                stock trading.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
            >
                <Link to="/register" className={styles.ctaSectionButton}>
                    Create Free Account
                </Link>
            </motion.div>
        </section>
    );
}
