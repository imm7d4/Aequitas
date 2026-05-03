import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from '../styles/LandingPage.module.css';

interface LandingHeroProps {
    variants: { container: any, item: any };
}

export const LandingHero: React.FC<LandingHeroProps> = ({ variants }) => (
    <section className={styles.fullSection}>
        <motion.div className={styles.heroContent} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants.container}>
            <motion.h1 className={styles.glitchTitle} variants={variants.item}>AEQUITAS</motion.h1>
            <motion.span className={styles.tagline} variants={variants.item}>Deterministic Market Infrastructure for Individual Traders</motion.span>
            <motion.p className={styles.heroSubtext} variants={variants.item}>Access institutional-grade execution architecture designed for consistency and control.</motion.p>
            <motion.div className={styles.heroActions} variants={variants.item}>
                <Link to="/register"><motion.button className={styles.primaryBtn} whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.6)" }}>REQUEST ACCESS</motion.button></Link>
                <div className={styles.specGrid}>
                    {[{ val: "NSE + BSE", label: "READY", live: true }, { val: "0", label: "FEES" }, { val: "PRO", label: "EXECUTION" }].map((s, i) => (
                        <motion.div key={i} className={styles.specItem} variants={variants.item}>
                            <div className={styles.specValueContainer}>{s.live && <div className={styles.liveDot} />}<span className={styles.specValue}>{s.val}</span></div>
                            <span className={styles.specLabel}>{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    </section>
);
