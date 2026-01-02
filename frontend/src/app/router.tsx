import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { Dashboard } from './Dashboard';
import { InstrumentsPage } from './InstrumentsPage';
import { InstrumentDetail } from '@/features/instruments/components/InstrumentDetail';
import { AdminPanel } from '@/features/instruments/components/AdminPanel';
import { AdminInstrumentForm } from '@/features/instruments/components/AdminInstrumentForm';
import { AdminMarketHoursForm } from '@/features/market/components/AdminMarketHoursForm';
import { AdminMarketHolidayForm } from '@/features/market/components/AdminMarketHolidayForm';


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
                <Route
                    path="/instruments"
                    element={
                        <ProtectedRoute>
                            <InstrumentsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/instruments/:id"
                    element={
                        <ProtectedRoute>
                            <InstrumentDetail />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/instruments/new"
                    element={
                        <ProtectedRoute>
                            <AdminInstrumentForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/instruments/edit/:id"
                    element={
                        <ProtectedRoute>
                            <AdminInstrumentForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/market-hours"
                    element={
                        <ProtectedRoute>
                            <AdminMarketHoursForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/market-holidays"
                    element={
                        <ProtectedRoute>
                            <AdminMarketHolidayForm />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
