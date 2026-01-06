import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage the browser's document title
 * @param title - The title to set for the document
 */
export const useDocumentTitle = (title: string) => {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    useEffect(() => {
        // Restore original title on unmount
        return () => {
            document.title = defaultTitle.current;
        };
    }, []);
};
