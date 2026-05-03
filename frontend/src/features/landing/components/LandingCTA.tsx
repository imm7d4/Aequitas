import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

interface LandingCTAProps {
    variants: { container: any, item: any };
}

export const LandingCTA: React.FC<LandingCTAProps> = ({ variants }) => (
    <section className={styles.fullSection}>
        <motion.div className={styles.ctaCenter} initial="hidden" whileInView="visible" variants={variants.container}>
            <motion.h2 className={styles.finalTitle} variants={variants.item}>READY TO TRADE?</motion.h2>
            <motion.p className={styles.ctaSubtext} variants={variants.item}>Aequitas is currently available via controlled onboarding.</motion.p>
            <motion.div className={styles.ctaButtonGroup} variants={variants.item}>
                <Link to="/register">
                    <motion.button className={styles.massiveBtn} whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}>REQUEST ACCESS</motion.button>
                </Link>
            </motion.div>
            <p style={{ marginTop: '4rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#444' }}>AEQUITAS CORE // EXECUTION INFRASTRUCTURE.</p>
        </motion.div>
    </section>
);
