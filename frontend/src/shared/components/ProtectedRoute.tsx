import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth';
import { Loader } from './Loader';

interface ProtectedRouteProps {
    children: JSX.Element;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const { isAuthenticated, isLoading } = useAuth();

    // Show nothing while checking authentication status
    if (isLoading) {
        return <Loader fullScreen message="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
