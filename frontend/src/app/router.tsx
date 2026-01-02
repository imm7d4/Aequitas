import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { Dashboard } from './Dashboard';

export function Router(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
