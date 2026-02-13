import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api/apiClient';

interface OnboardingState {
    isOnboardingComplete: boolean;
    isTourRunning: boolean;
    stepIndex: number;
    setIsOnboardingComplete: (complete: boolean) => void;
    startTour: () => void;
    stopTour: () => void;
    setStepIndex: (index: number) => void;
    completeOnboarding: () => Promise<void>;
    skipOnboarding: () => Promise<void>;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set, get) => ({
            isOnboardingComplete: false,
            isTourRunning: false,
            stepIndex: 0,
            setIsOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
            startTour: () => {
                const { isOnboardingComplete } = get();
                if (!isOnboardingComplete) {
                    set({ isTourRunning: true, stepIndex: 0 });
                }
            },
            stopTour: () => set({ isTourRunning: false }),
            setStepIndex: (index) => set({ stepIndex: index }),
            completeOnboarding: async () => {
                set({ isOnboardingComplete: true, isTourRunning: false });
                try {
                    await api.patch('/user/onboarding-status', { isOnboardingComplete: true, skipped: false });
                } catch (error) {
                    console.error('Failed to update onboarding status:', error);
                    // Revert on failure? Or just rely on local state?
                    // For now, rely on local state + retry logic elsewhere if needed
                }
            },
            skipOnboarding: async () => {
                set({ isOnboardingComplete: true, isTourRunning: false });
                try {
                    await api.patch('/user/onboarding-status', { isOnboardingComplete: true, skipped: true });
                } catch (error) {
                    console.error('Failed to update onboarding status (skipped):', error);
                }
            },
            reset: () => set({ isOnboardingComplete: false, isTourRunning: false, stepIndex: 0 }),
        }),
        {
            name: 'onboarding-storage',
            partialize: (state) => ({ isOnboardingComplete: state.isOnboardingComplete }),
        }
    )
);
