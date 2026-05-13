import { useEffect } from 'react';
import { useNotificationStore } from '../store/useNotificationStore';

/**
 * Custom hook to manage the browser's document title
 * @param title - The title to set for the document
 */
export const useDocumentTitle = (title: string, fallbackTitle: string = 'Aequitas') => {
    const { unreadCount } = useNotificationStore();

    useEffect(() => {
        const prefix = unreadCount > 0 ? `(${unreadCount}) ` : '';
        document.title = `${prefix}${title}`;

        // Restore original/fallback title on unmount
        return () => {
            const fallbackPrefix = unreadCount > 0 ? `(${unreadCount}) ` : '';
            document.title = `${fallbackPrefix}${fallbackTitle}`;
        };
    }, [title, fallbackTitle, unreadCount]);
};
