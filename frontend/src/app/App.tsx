import { useEffect } from 'react';
import { Router } from './router';
import { Providers } from './providers';
import { useAuth } from '@/features/auth';
import { WatchlistSelectionDialog } from '@/features/watchlist/components/WatchlistSelectionDialog';

function App(): JSX.Element {
    const { initialize } = useAuth();

    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Providers>
            <Router />
            <WatchlistSelectionDialog />
        </Providers>
    );
}

export default App;
