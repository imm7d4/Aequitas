import { useEffect, useRef } from 'react';

/**
 * Hook to track the previous value of a variable
 * Useful for comparing current vs previous tick prices
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T>();

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
