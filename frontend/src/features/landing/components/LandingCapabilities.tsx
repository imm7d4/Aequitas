import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/LandingPage.module.css';

interface LandingCapabilitiesProps {
    variants: { container: any, item: any };
}

export const LandingCapabilities: React.FC<LandingCapabilitiesProps> = ({ variants }) => (
    <>
        <section className={styles.fullSection} style={{ justifyContent: 'flex-end' }}>
            <motion.div className={styles.sideContentRight} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }} variants={variants.container}>
                <motion.h2 className={styles.sectionTitle} variants={variants.item}>CORE CAPABILITIES</motion.h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.div className={styles.brutalistCard} variants={variants.item} whileHover={{ x: -20 }}>
                        <h3 className={styles.goldText}>Deterministic Execution Engine</h3>
                        <p>Orders are processed using strict sequencing logic with bounded latency variance.</p>
                    </motion.div>
                    <motion.div className={styles.brutalistCard} variants={variants.item} whileHover={{ x: -20 }}>
                        <h3 className={styles.goldText}>Latency Architecture</h3>
                        <p>Built for consistency under load, not theoretical peak speed.</p>
                    </motion.div>
                </div>
            </motion.div>
        </section>

        <section className={styles.fullSection}>
            <motion.div className={styles.sideContent} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }} variants={variants.container}>
                <motion.h2 className={styles.sectionTitle} variants={variants.item}>MARKET & RISK</motion.h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <motion.div className={styles.brutalistCard} variants={variants.item} whileHover={{ x: 20 }}>
                        <h3>Market Structure Alignment</h3>
                        <p>Designed to operate within real-world market constraints.</p>
                    </motion.div>
                    <motion.div className={styles.brutalistCard} variants={variants.item} whileHover={{ x: 20 }}>
                        <h3>Risk Controls</h3>
                        <p>Risk is enforced at the point of action, not after exposure.</p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    </>
);
