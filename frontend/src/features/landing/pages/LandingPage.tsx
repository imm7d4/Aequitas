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
                            INSTITUTIONAL LIQUIDITY // QUANT-DRIVEN EXECUTION
                        </motion.span>
                        <motion.h1 className={styles.glitchTitle} variants={itemVariants}>
                            AEQUITAS: <br />
                            <span className={styles.cyanText}>DETERMINISTIC CAPITAL</span>
                        </motion.h1>
                        <motion.p className={styles.heroSubtext} variants={itemVariants}>
                            The premier bridge between global institutional capital and sub-nanosecond execution. 
                            Our FPGA-powered core eliminates toxic order flow, providing a fair, 
                            zero-jitter foundation for high-frequency liquidity providers.
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
                                    { val: "<500ns", label: "LATENCY" },
                                    { val: "1.2M+", label: "TPS" },
                                    { val: "0.0ns", label: "JITTER" }
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
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>CORE ARCHITECTURE</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                            <h3>Hardware-First Execution</h3>
                            <p>
                                Traditional software-based matching engines suffer from "micro-burst" 
                                jitter. Aequitas executes on custom FPGA arrays, ensuring that every 
                                order is processed with mathematical certainty.
                            </p>
                            <ul className={styles.featureList}>
                                {["Direct Market Access (DMA)", "Colocation-Ready Interface", "Sub-Nanosecond Time-Stamping"].map((f, i) => (
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
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>GOVERNANCE & FAIRNESS</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: -20 }}>
                            <h3 className={styles.goldText}>Anti-Frontrunning Engine</h3>
                            <p>
                                True to our name (Aequitas = Fairness), our engine uses a 
                                deterministic queueing protocol that eliminates toxic order-flow 
                                and predatory latency arbitrage.
                            </p>
                            <div className={styles.techMetrics}>
                                <span>PROTOCOL: AEQ-DET-v1</span>
                                <span>AUDIT: REAL-TIME</span>
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
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>RISK INFRASTRUCTURE</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                            <h3>Institutional Risk Controls</h3>
                            <p>
                                Manage your exposure with millisecond-precision risk gates. 
                                Our JIT (Just-In-Time) approval queue ensures that high-value 
                                trades are secure without sacrificing performance.
                            </p>
                            <div className={styles.statsRow}>
                                <div className={styles.statMini}>
                                    <strong>100+</strong>
                                    <span>Risk Checks</span>
                                </div>
                                <div className={styles.statMini}>
                                    <strong>&lt;1μs</strong>
                                    <span>Gate Latency</span>
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
                        <motion.h2 className={styles.finalTitle} variants={itemVariants}>READY TO EVOLVE?</motion.h2>
                        <motion.p className={styles.ctaSubtext} variants={itemVariants}>
                            Join the next generation of financial infrastructure. 
                            Secure your seat in the deterministic future.
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
