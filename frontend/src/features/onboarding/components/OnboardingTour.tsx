import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReactJoyride, { CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { useOnboardingStore } from '../store/onboardingStore';
import { getTourSteps, tourStyles } from '../config/tourConfig';
import { useInstrumentStore } from '@/features/instruments/store/instrumentStore';
import { useInstruments } from '@/features/instruments/hooks/useInstruments';
import { useTheme } from '@mui/material';
import { useAuth } from '@/features/auth';
import { TourTooltip } from './TourTooltip';

const OnboardingTour = () => {
    const { user, setUser } = useAuth();
    const {
        isOnboardingComplete,
        isTourRunning,
        stepIndex,
        setStepIndex,
        stopTour,
        startTour,
        setIsOnboardingComplete,
        completeOnboarding,
        skipOnboarding
    } = useOnboardingStore();

    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [mounted, setMounted] = useState(false);
    // Local state to manage navigation transitions
    // When != null, we are navigating and should pause the tour
    const [pendingIndex, setPendingIndex] = useState<number | null>(null);

    // Fetch instruments to ensure we can find RELIANCE
    useInstruments();

    // Get instruments from store
    const { instruments } = useInstrumentStore();

    // Find Reliance or fallback to first instrument
    const relianceInstrument = useMemo(() =>
        instruments.find(i => i.symbol === 'RELIANCE' || i.symbol.includes('RELIANCE')) || instruments[0],
        [instruments]
    );
    const relianceId = relianceInstrument?.id;

    const steps = useMemo(() => getTourSteps(relianceId), [relianceId]);

    // Handle navigation completion
    useEffect(() => {
        if (pendingIndex !== null) {
            const targetStep = steps[pendingIndex];
            const targetRoute = targetStep?.data?.route;

            if (targetRoute && location.pathname === targetRoute) {
                // Navigation completed (location matches), now resume tour at new step
                // Small timeout to ensure DOM is ready after navigation
                const timer = setTimeout(() => {
                    setStepIndex(pendingIndex);
                    setPendingIndex(null);
                }, 500);
                return () => clearTimeout(timer);
            }
        }
    }, [location.pathname, pendingIndex, setStepIndex, steps]);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync state with user profile and start tour if needed
    useEffect(() => {
        if (user) {
            // Sync store
            const userComplete = user.isOnboardingComplete ?? false;
            if (userComplete) {
                setIsOnboardingComplete(true);
            }

            // Trigger tour if fresh user and not complete/skipped
            if (!userComplete && !user.onboardingSkipped && !isTourRunning && !useOnboardingStore.getState().isOnboardingComplete) {
                const timer = setTimeout(() => {
                    startTour();
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [user, setUser, setIsOnboardingComplete, startTour]);

    // Don't render anything if onboarding is complete or not running
    if (!mounted || isOnboardingComplete || !isTourRunning) {
        return null;
    }

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status, type, index, action } = data;

        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            setPendingIndex(null); // Clear any pending state
            stopTour();
            if (status === STATUS.FINISHED) {
                completeOnboarding();
                if (user) {
                    setUser({ ...user, isOnboardingComplete: true, onboardingCompletedAt: new Date().toISOString() });
                }
                // Navigate back to dashboard on finish
                navigate('/dashboard');
            } else {
                skipOnboarding();
                if (user) {
                    setUser({ ...user, isOnboardingComplete: true, onboardingSkipped: true });
                }
            }
        } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type as any)) {
            const nextIndex = index + (action === 'prev' ? -1 : 1);

            if (nextIndex >= 0 && nextIndex < steps.length) {
                const nextStep = steps[nextIndex];
                const targetRoute = nextStep.data?.route;

                if (targetRoute && location.pathname !== targetRoute) {
                    // Need to navigate first
                    setPendingIndex(nextIndex); // Pause tour
                    navigate(targetRoute);
                    return; // Don't setStepIndex yet
                }
            } else {
            }

            setStepIndex(nextIndex);
        }
    };

    // Custom styles based on theme
    const finalStyles = {
        options: {
            ...tourStyles.options,
            primaryColor: theme.palette.primary.main,
            textColor: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            arrowColor: theme.palette.background.paper,
            zIndex: 10000,
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
        spotlight: {
            borderRadius: 8,
        }
    };

    return (
        <ReactJoyride
            steps={steps}
            run={isTourRunning && pendingIndex === null} // Pause when navigating
            stepIndex={stepIndex}
            continuous
            showProgress
            showSkipButton
            disableOverlayClose
            spotlightClicks={false}
            styles={finalStyles}
            callback={handleJoyrideCallback}
            scrollOffset={100}
            floaterProps={{
                disableAnimation: false,
            }}
            tooltipComponent={TourTooltip}
        />
    );
};

export default OnboardingTour;
