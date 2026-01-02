import { useEffect } from 'react';
import { Router } from './router';
import { Providers } from './providers';
import { useAuth } from '@/features/auth';

function App(): JSX.Element {
    const { initialize } = useAuth();

    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Providers>
            <Router />
        </Providers>
    );
}

export default App;
