import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/LandingPage.module.css';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: '⚡',
        title: 'Lightning-Fast Execution',
        description:
            'Market orders execute instantly. Limit orders matched in real-time.',
    },
    {
        icon: '📊',
        title: 'Professional-Grade Charts',
        description:
            'Interactive candlestick charts with multiple timeframes and live price overlays.',
    },
    {
        icon: '🎯',
        title: 'Advanced Order Types',
        description:
            'Stop Loss, Stop Limit, Trailing Stop - manage risk like a pro.',
    },
    {
        icon: '💼',
        title: 'Smart Portfolio Management',
        description:
            'Track holdings, realized/unrealized P&L, and performance in real-time.',
    },
    {
        icon: '🔒',
        title: 'Bank-Grade Security',
        description:
            'JWT authentication, encrypted data, and complete audit trails.',
    },
    {
        icon: '💰',
        title: 'Transparent Pricing',
        description:
            'Capped commissions (0.03% or ₹20, whichever is lower). No surprises.',
    },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};

export function FeaturesSection(): JSX.Element {
    const ref = useScrollAnimation('fade-in-up');

    return (
        <section id="features" className={styles.featuresSection} ref={ref}>
            <h2 className={styles.sectionTitle}>Powerful Features</h2>
            <p className={styles.sectionSubtitle}>
                Everything you need to trade with confidence
            </p>

            <motion.div
                className={styles.featuresGrid}
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={index}
                        className={styles.featureCard}
                        variants={item}
                    >
                        <div className={styles.featureIcon}>{feature.icon}</div>
                        <h3 className={styles.featureTitle}>{feature.title}</h3>
                        <p className={styles.featureDescription}>
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
