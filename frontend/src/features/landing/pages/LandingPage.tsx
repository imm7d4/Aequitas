import { useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MarketEngineScene } from '../components/MarketEngineScene';
import { LandingHeader } from '../components/LandingHeader';
import { LandingFooter } from '../components/LandingFooter';
import { LandingHero } from '../components/LandingHero';
import { LandingCapabilities } from '../components/LandingCapabilities';
import { LandingPhilosophy } from '../components/LandingPhilosophy';
import { LandingCTA } from '../components/LandingCTA';
import styles from '../styles/LandingPage.module.css';

export function LandingPage(): JSX.Element {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        document.title = 'Aequitas - Institutional Capital Intelligence';
        document.documentElement.style.scrollBehavior = 'smooth';
        return () => { document.documentElement.style.scrollBehavior = 'auto'; };
    }, []);

    const variants = useMemo(() => ({
        container: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } } },
        item: { hidden: { opacity: 0, y: 30, filter: 'blur(10px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: "easeOut" } } }
    }), []);

    return (
        <div className={styles.landingWrapper}>
            <LandingHeader />
            <MarketEngineScene />
            <motion.div className={styles.progressBar} style={{ scaleX }} />

            <main className={styles.contentOverlay}>
                <LandingHero variants={variants} />
                
                <section className={styles.fullSection}>
                    <motion.div className={styles.sideContent} initial="hidden" whileInView="visible" viewport={{ amount: 0.5 }} variants={variants.container}>
                        <motion.h2 className={styles.sectionTitle} variants={variants.item}>EXECUTION, WITHOUT AMBIGUITY</motion.h2>
                        <motion.div className={styles.brutalistCard} variants={variants.item} whileHover={{ x: 20 }}>
                            <h3>The Trading Core</h3>
                            <p>Aequitas is a low-latency trading core engineered to reduce execution uncertainty. Every order follows a defined, observable path.</p>
                        </motion.div>
                    </motion.div>
                </section>

                <LandingCapabilities variants={variants} />
                <LandingPhilosophy variants={variants} />
                <LandingCTA variants={variants} />
            </main>

            <LandingFooter />
        </div>
    );
}
