import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component that resets the scroll position to the top of the window
 * whenever the route (URL path) changes.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
