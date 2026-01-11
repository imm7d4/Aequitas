import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/LandingPage.module.css';

interface ValueProp {
    icon: string;
    title: string;
    description: string;
}

const valueProps: ValueProp[] = [
    {
        icon: '⚖️',
        title: 'Fairness First',
        description:
            '"Aequitas" means fairness. We believe in transparent execution and honest pricing.',
    },
    {
        icon: '🚀',
        title: 'Built for Speed',
        description:
            'Sub-200ms API latency. Real-time market data. No lag, no missed opportunities.',
    },
    {
        icon: '🛠️',
        title: 'Professional Tools',
        description:
            'Access the same advanced order types and analytics used by professional traders.',
    },
];

const trustSignals = [
    '🔐 Bank-grade encryption',
    '✅ ACID-compliant transactions',
    '📈 Real-time market data',
    '🛡️ Complete audit trails',
];

export function WhyAequitasSection(): JSX.Element {
    const ref = useScrollAnimation('fade-in-up');

    return (
        <section className={styles.whySection} ref={ref}>
            <h2 className={styles.sectionTitle}>Why Aequitas?</h2>
            <p className={styles.sectionSubtitle}>
                Built on principles of fairness, speed, and transparency
            </p>

            <div className={styles.whyGrid}>
                {valueProps.map((prop, index) => (
                    <motion.div
                        key={index}
                        className={styles.whyCard}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                        <div className={styles.whyIcon}>{prop.icon}</div>
                        <h3 className={styles.whyTitle}>{prop.title}</h3>
                        <p className={styles.whyDescription}>{prop.description}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                className={styles.trustSignals}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                {trustSignals.map((signal, index) => (
                    <motion.div
                        key={index}
                        className={styles.trustBadge}
                        initial={{ opacity: 0, rotate: -5 }}
                        whileInView={{ opacity: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    >
                        {signal}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
