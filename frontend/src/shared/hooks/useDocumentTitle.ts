import { useEffect } from 'react';

/**
 * Custom hook to manage the browser's document title
 * @param title - The title to set for the document
 */
// Custom hook to manage the browser's document title
export const useDocumentTitle = (title: string, fallbackTitle: string = 'Aequitas') => {
    useEffect(() => {
        document.title = title;

        // Restore original/fallback title on unmount
        return () => {
            document.title = fallbackTitle;
        };
    }, [title, fallbackTitle]);
};
