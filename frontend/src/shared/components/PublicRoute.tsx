import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Loader } from './Loader';

interface PublicRouteProps {
    children: ReactNode;
}

/**
 * PublicRoute - Route wrapper for unauthenticated users
 * Redirects authenticated users to dashboard
 */
export function PublicRoute({ children }: PublicRouteProps): JSX.Element {
    const { isAuthenticated, isLoading } = useAuth();

    // Show nothing while checking authentication status
    if (isLoading) {
        return <Loader fullScreen message="Preparing your session..." />;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}
