import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MarketEngineScene } from '../components/MarketEngineScene';
import { LandingHeader } from '../components/LandingHeader';
import { LandingFooter } from '../components/LandingFooter';
import styles from '../styles/LandingPage.module.css';

export function LandingPage(): JSX.Element {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        document.title = 'Aequitas - Institutional Capital Intelligence';
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    const containerVariants: any = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.3 }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className={styles.landingWrapper}>
            <LandingHeader />
            <MarketEngineScene />
            
            {/* Scroll Progress Bar */}
            <motion.div className={styles.progressBar} style={{ scaleX }} />

            <main className={styles.contentOverlay}>
                
                {/* 1. HERO */}
                <section className={styles.fullSection}>
                    <motion.div 
                        className={styles.heroContent}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={containerVariants}
                    >
                        <motion.span className={styles.tagline} variants={itemVariants}>
                            PROFESSIONAL EDGE // INDIVIDUAL POWER
                        </motion.span>
                        <motion.h1 className={styles.glitchTitle} variants={itemVariants}>
                            AEQUITAS: <br />
                            <span className={styles.cyanText}>THE RETAIL REVOLUTION</span>
                        </motion.h1>
                        <motion.p className={styles.heroSubtext} variants={itemVariants}>
                            Unlock the sub-nanosecond edge once reserved for banks. 
                            Our FPGA-powered core eliminates the "Unfair Advantage" 
                            of big institutions, giving you the fastest foundation 
                            to master the global markets.
                        </motion.p>
                        <motion.div className={styles.heroActions} variants={itemVariants}>
                            <Link to="/register">
                                <motion.button 
                                    className={styles.primaryBtn}
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    GET STARTED
                                </motion.button>
                            </Link>
                            <div className={styles.specGrid}>
                                {[
                                    { val: "INSTANT", label: "EXECUTION" },
                                    { val: "0.0ns", label: "JITTER" },
                                    { val: "PRO", label: "TOOLS" }
                                ].map((spec, i) => (
                                    <motion.div 
                                        key={i} 
                                        className={styles.specItem}
                                        variants={itemVariants}
                                    >
                                        <span className={styles.specValue}>{spec.val}</span>
                                        <span className={styles.specLabel}>{spec.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 2. ARCHITECTURE */}
                <section className={styles.fullSection}>
                    <motion.div 
                        className={styles.sideContent}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>YOUR UNFAIR ADVANTAGE</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                            <h3>High-Performance Core</h3>
                            <p>
                                Why settle for retail-grade lag? Aequitas brings 
                                low-latency FPGA hardware to your fingertips. 
                                Execute trades at the speed of light and stop being 
                                the liquidity for someone else's bot.
                            </p>
                            <ul className={styles.featureList}>
                                {["Pro-Grade Order Execution", "Real-Time Trade Diagnostics", "Hardware-Accelerated Speed"].map((f, i) => (
                                    <motion.li key={i} variants={itemVariants}>{f}</motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 3. GOVERNANCE */}
                <section className={styles.fullSection}>
                    <motion.div 
                        className={styles.sideContentRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>FAIRNESS BY DESIGN</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: -20 }}>
                            <h3 className={styles.goldText}>Anti-Frontrunning Engine</h3>
                            <p>
                                We've eliminated the edge of predatory algos. 
                                Aequitas ensures that your orders are processed 
                                with strict FIFO logic. No hidden queues, no 
                                preferential treatment. Just pure trading.
                            </p>
                            <div className={styles.techMetrics}>
                                <span>STATUS: 100% TRANSPARENT</span>
                                <span>LOGIC: STOCHASTIC-FAIR</span>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 4. RISK */}
                <section className={styles.fullSection}>
                    <motion.div 
                        className={styles.sideContent}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>SMART CONTROLS</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                            <h3>Protect Your Alpha</h3>
                            <p>
                                Trade with confidence using advanced risk tools. 
                                Set millisecond-precision stop losses and exposure 
                                limits that are hard-coded into the execution path.
                            </p>
                            <div className={styles.statsRow}>
                                <div className={styles.statMini}>
                                    <strong>SMART</strong>
                                    <span>Risk Gates</span>
                                </div>
                                <div className={styles.statMini}>
                                    <strong>&lt;1μs</strong>
                                    <span>Protection</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 5. CTA */}
                <section className={styles.fullSection}>
                    <motion.div 
                        className={styles.ctaCenter}
                        initial="hidden"
                        whileInView="visible"
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.finalTitle} variants={itemVariants}>READY TO TRADE?</motion.h2>
                        <motion.p className={styles.ctaSubtext} variants={itemVariants}>
                            Stop settling for slow execution. 
                            Unlock your professional edge with Aequitas.
                        </motion.p>
                        <motion.div className={styles.ctaButtonGroup} variants={itemVariants}>
                            <Link to="/register">
                                <motion.button 
                                    className={styles.massiveBtn}
                                    whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    GET STARTED
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </section>

            </main>

            <LandingFooter />
        </div>
    );
}
