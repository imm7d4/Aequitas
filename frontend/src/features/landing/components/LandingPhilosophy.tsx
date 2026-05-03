import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/LandingPage.module.css';

interface LandingPhilosophyProps {
    variants: { container: any, item: any };
}

export const LandingPhilosophy: React.FC<LandingPhilosophyProps> = ({ variants }) => (
    <section className={styles.fullSection} style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
        <motion.div className={styles.ctaCenter} initial="hidden" whileInView="visible" variants={variants.container}>
            <motion.h2 className={styles.sectionTitle} variants={variants.item} style={{ fontSize: '1.2rem', color: '#666' }}>SYSTEM PHILOSOPHY</motion.h2>
            <motion.p className={styles.finalTitle} variants={variants.item} style={{ fontSize: '2.5rem', marginTop: '1rem' }}>
                Institutional systems optimize for <span className={styles.cyanText}>control</span>.
            </motion.p>
            <motion.p className={styles.ctaSubtext} variants={variants.item} style={{ maxWidth: '800px' }}>
                Most retail platforms optimize for accessibility. Aequitas is built on the latter.
                You are not interacting with a simplified interface. You are interacting with the system itself.
            </motion.p>
        </motion.div>
    </section>
);
