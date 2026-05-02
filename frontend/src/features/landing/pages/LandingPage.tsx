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
                        <motion.h1 className={styles.glitchTitle} variants={itemVariants}>
                            AEQUITAS
                        </motion.h1>
                        <motion.span className={styles.tagline} variants={itemVariants}>
                            Deterministic Market Infrastructure for Individual Traders
                        </motion.span>
                        <motion.p className={styles.heroSubtext} variants={itemVariants}>
                            Access institutional-grade execution architecture designed for consistency, transparency, and control.
                        </motion.p>
                        <motion.div className={styles.heroActions} variants={itemVariants}>
                            <Link to="/register">
                                <motion.button
                                    className={styles.primaryBtn}
                                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 240, 255, 0.6)" }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    REQUEST ACCESS
                                </motion.button>
                            </Link>
                            <div className={styles.specGrid}>
                                {[
                                    { val: "NSE + BSE", label: "READY", isLive: true },
                                    { val: "0", label: "HIDDEN FEES" },
                                    { val: "PRO", label: "EXECUTION" }
                                ].map((spec, i) => (
                                    <motion.div 
                                        key={i} 
                                        className={styles.specItem}
                                        variants={itemVariants}
                                    >
                                        <div className={styles.specValueContainer}>
                                            {spec.isLive && <div className={styles.liveDot} />}
                                            <span className={styles.specValue}>{spec.val}</span>
                                        </div>
                                        <span className={styles.specLabel}>{spec.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 2. PHILOSOPHY / AMBIGUITY */}
                <section className={styles.fullSection}>
                    <motion.div
                        className={styles.sideContent}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>EXECUTION, WITHOUT AMBIGUITY</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                            <h3>The Trading Core</h3>
                            <p>
                                Aequitas is a low-latency trading core engineered to reduce execution uncertainty.
                                Every order follows a defined, observable path — from submission to fill.
                            </p>
                            <ul className={styles.featureList} style={{ color: 'var(--accent-cyan)', fontStyle: 'italic', marginTop: '2rem' }}>
                                {["No hidden prioritization", "No opaque routing logic", "No behavioral guesswork"].map((f, i) => (
                                    <motion.li key={i} variants={itemVariants}>{f}</motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </motion.div>
                </section>

                {/* 3. CORE CAPABILITIES */}
                <section className={styles.fullSection} style={{ justifyContent: 'flex-end' }}>
                    <motion.div
                        className={styles.sideContentRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>CORE CAPABILITIES</motion.h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: -20 }}>
                                <h3 className={styles.goldText}>Deterministic Execution Engine</h3>
                                <p>Orders are processed using strict sequencing logic with bounded latency variance.</p>
                                <div className={styles.techMetrics}>
                                    <span>FIFO ORDER HANDLING</span>
                                    <span>PREDICTABLE TIMING</span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: -20 }}>
                                <h3 className={styles.goldText}>Latency Architecture</h3>
                                <p>Built for consistency under load, not theoretical peak speed. Microsecond-level execution pipeline.</p>
                                <div className={styles.techMetrics}>
                                    <span>STABLE JITTER ENVELOPE</span>
                                    <span>HARDWARE-ACCELERATED</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* 4. MARKET STRUCTURE & RISK */}
                <section className={styles.fullSection}>
                    <motion.div
                        className={styles.sideContent}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants}>MARKET & RISK</motion.h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                                <h3>Market Structure Alignment</h3>
                                <p>Designed to operate within real-world market constraints — not abstract around them.</p>
                                <div className={styles.techMetrics}>
                                    <span>STANDARD ROUTING</span>
                                    <span>NO INTERNALIZATION</span>
                                </div>
                            </motion.div>

                            <motion.div className={styles.brutalistCard} variants={itemVariants} whileHover={{ x: 20 }}>
                                <h3>Risk Controls at Execution Layer</h3>
                                <p>Risk is enforced at the point of action, not after exposure. Pre-trade validation gates.</p>
                                <div className={styles.techMetrics}>
                                    <span>DETERMINISTIC STOPS</span>
                                    <span>POSITION CONSTRAINTS</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* 5. SYSTEM PHILOSOPHY */}
                <section className={styles.fullSection} style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                    <motion.div
                        className={styles.ctaCenter}
                        initial="hidden"
                        whileInView="visible"
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.sectionTitle} variants={itemVariants} style={{ fontSize: '1.2rem', color: '#666' }}>SYSTEM PHILOSOPHY</motion.h2>
                        <motion.p className={styles.finalTitle} variants={itemVariants} style={{ fontSize: '2.5rem', marginTop: '1rem' }}>
                            Institutional systems optimize for <span className={styles.cyanText}>control</span>.
                        </motion.p>
                        <motion.p className={styles.ctaSubtext} variants={itemVariants} style={{ maxWidth: '800px' }}>
                            Most retail platforms optimize for accessibility. Aequitas is built on the latter.
                            You are not interacting with a simplified interface layered over opaque systems.
                            You are interacting with the system itself.
                        </motion.p>
                    </motion.div>
                </section>

                {/* 6. WHO THIS IS FOR */}
                <section className={styles.fullSection}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={containerVariants}
                        >
                            <h2 className={styles.sectionTitle}>WHO THIS IS FOR</h2>
                            <ul className={styles.featureList} style={{ marginTop: '2rem' }}>
                                {[
                                    "Traders requiring consistent execution behavior",
                                    "Systematic participants sensitive to latency variance",
                                    "Individuals transitioning from retail to structured trading"
                                ].map((item, i) => (
                                    <motion.li key={i} variants={itemVariants}>{item}</motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            variants={containerVariants}
                        >
                            <h2 className={styles.sectionTitle}>WHAT THIS IS NOT</h2>
                            <ul className={styles.featureList} style={{ marginTop: '2rem', opacity: 0.6 }}>
                                {[
                                    "Not a zero-latency claim",
                                    "Not a predictive trading system",
                                    "Not a strategy provider"
                                ].map((item, i) => (
                                    <motion.li key={i} variants={itemVariants}>{item}</motion.li>
                                ))}
                            </ul>
                            <p style={{ marginTop: '2rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                                Aequitas does not generate alpha. <br />
                                It preserves the integrity of your execution.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* 7. CTA */}
                <section className={styles.fullSection}>
                    <motion.div
                        className={styles.ctaCenter}
                        initial="hidden"
                        whileInView="visible"
                        variants={containerVariants}
                    >
                        <motion.h2 className={styles.finalTitle} variants={itemVariants}>READY TO TRADE?</motion.h2>
                        <motion.p className={styles.ctaSubtext} variants={itemVariants}>
                            Aequitas is currently available via controlled onboarding.
                        </motion.p>
                        <motion.div className={styles.ctaButtonGroup} variants={itemVariants}>
                            <Link to="/register">
                                <motion.button
                                    className={styles.massiveBtn}
                                    whileHover={{ scale: 1.1, backgroundColor: "#fff", color: "#000" }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    REQUEST ACCESS
                                </motion.button>
                            </Link>
                        </motion.div>
                        <p style={{ marginTop: '4rem', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#444' }}>
                            AEQUITAS CORE // EXECUTION INFRASTRUCTURE. NO ABSTRACTION LAYERS.
                        </p>
                    </motion.div>
                </section>

            </main>

            <LandingFooter />
        </div>
    );
}
