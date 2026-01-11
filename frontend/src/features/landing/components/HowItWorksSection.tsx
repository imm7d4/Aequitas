import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import styles from '../styles/LandingPage.module.css';

interface Step {
    number: number;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        number: 1,
        title: 'Create Your Account',
        description: 'Sign up in 60 seconds with just email and password.',
    },
    {
        number: 2,
        title: 'Fund Your Account',
        description: 'Add funds to your trading account (INR).',
    },
    {
        number: 3,
        title: 'Start Trading',
        description: 'Place orders with our intuitive trade panel.',
    },
    {
        number: 4,
        title: 'Track & Grow',
        description: 'Monitor your portfolio and watch your wealth grow.',
    },
];

export function HowItWorksSection(): JSX.Element {
    const ref = useScrollAnimation('fade-in-up');

    return (
        <section className={styles.howItWorksSection} ref={ref}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>
                Get started in minutes, not hours
            </p>

            <div className={styles.stepsContainer}>
                {steps.map((step, index) => (
                    <motion.div
                        key={step.number}
                        className={styles.stepCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <motion.div
                            className={styles.stepNumber}
                            whileInView={{ scale: [0, 1.1, 1] }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        >
                            {step.number}
                        </motion.div>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                        <p className={styles.stepDescription}>{step.description}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
