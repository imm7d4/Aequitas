import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/LandingPage.module.css';

import {
    Bolt,
    CandlestickChart,
    Tune,
    PieChart,
    Security,
    MonetizationOn
} from '@mui/icons-material';

interface Feature {
    icon: JSX.Element;
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        icon: <Bolt fontSize="inherit" />,
        title: 'Lightning-Fast Execution',
        description:
            'Market orders execute instantly. Limit orders matched in real-time with sub-millisecond latency.',
    },
    {
        icon: <CandlestickChart fontSize="inherit" />,
        title: 'Professional Charts',
        description:
            'Interactive candlestick charts with multiple timeframes, technical indicators, and live overlays.',
    },
    {
        icon: <Tune fontSize="inherit" />,
        title: 'Advanced Controls',
        description:
            'Granular control with Stop Loss, Stop Limit, and Trailing Stop orders to manage risk effectively.',
    },
    {
        icon: <PieChart fontSize="inherit" />,
        title: 'Smart Portfolio',
        description:
            'Track realtime holdings, realized and unrealized P&L, and performance analytics.',
    },
    {
        icon: <Security fontSize="inherit" />,
        title: 'Bank-Grade Security',
        description:
            'Enterprise-level JWT authentication, end-to-end encrypted data, and regulatory grade audit trails.',
    },
    {
        icon: <MonetizationOn fontSize="inherit" />,
        title: 'Transparent Pricing',
        description:
            'Zero hidden fees. Capped commissions at 0.03% or ₹20. What you see is exactly what you pay.',
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
