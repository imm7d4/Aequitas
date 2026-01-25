import { useEffect } from 'react';
import { healthService } from '@/services/healthService';
import { LandingHeader } from '../components/LandingHeader';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { WhyAequitasSection } from '../components/WhyAequitasSection';
import { CTASection } from '../components/CTASection';
import { LandingFooter } from '../components/LandingFooter';
import styles from '../styles/LandingPage.module.css';

/**
 * LandingPage - Main landing page for unauthenticated users
 * Showcases Aequitas features with modern animations
 */
export function LandingPage(): JSX.Element {
    useEffect(() => {
        // Set page title
        document.title = 'Aequitas - Fair & Deterministic Trading Infrastructure';

        // Smooth scroll behavior
        document.documentElement.style.scrollBehavior = 'smooth';

        // Warm up backend
        healthService.checkHealth();

        return () => {
            document.documentElement.style.scrollBehavior = 'auto';
        };
    }, []);

    return (
        <div className={styles.landingPage}>
            <LandingHeader />
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <WhyAequitasSection />
            <CTASection />
            <LandingFooter />
        </div>
    );
}
