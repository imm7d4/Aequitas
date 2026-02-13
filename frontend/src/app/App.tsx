import { useEffect } from 'react';
import { AppRoutes } from './router';
import { Providers } from './providers';
import { useAuth } from '@/features/auth';
import { WatchlistSelectionDialog } from '@/features/watchlist/components/WatchlistSelectionDialog';

import OnboardingTour from '@/features/onboarding/components/OnboardingTour';

import { BrowserRouter } from 'react-router-dom';

function App(): JSX.Element {
    const { initialize, isAuthenticated } = useAuth();

    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Providers>
            <BrowserRouter>
                <AppRoutes />
                {isAuthenticated && (
                    <>
                        <WatchlistSelectionDialog />
                        <OnboardingTour />
                    </>
                )}
            </BrowserRouter>
        </Providers>
    );
}

export default App;
