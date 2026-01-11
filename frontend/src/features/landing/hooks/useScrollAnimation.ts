import { useRef, useEffect } from 'react';

type AnimationType = 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'scale-in';

/**
 * useScrollAnimation - Trigger animations when element scrolls into view
 * Uses Intersection Observer API
 */
export function useScrollAnimation(
    animationType: AnimationType = 'fade-in-up',
    threshold: number = 0.2
) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        // Set initial state
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

        switch (animationType) {
            case 'fade-in-up':
                element.style.transform = 'translateY(30px)';
                break;
            case 'fade-in-down':
                element.style.transform = 'translateY(-30px)';
                break;
            case 'scale-in':
                element.style.transform = 'scale(0.95)';
                break;
            default:
                element.style.transform = 'none';
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.setAttribute('style', `
              opacity: 1;
              transform: none;
              transition: opacity 0.6s ease-out, transform 0.6s ease-out;
            `);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [animationType, threshold]);

    return ref;
}
