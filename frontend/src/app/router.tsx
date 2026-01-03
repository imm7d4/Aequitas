import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm, RegisterForm } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { Layout } from '@/shared/components/Layout';
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
                {/* Public Routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Protected Routes inside Layout */}
                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/instruments" element={<InstrumentsPage />} />
                    <Route path="/instruments/:id" element={<InstrumentDetail />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin/instruments/new" element={<AdminInstrumentForm />} />
                    <Route path="/admin/instruments/edit/:id" element={<AdminInstrumentForm />} />
                    <Route path="/admin/market-hours" element={<AdminMarketHoursForm />} />
                    <Route path="/admin/market-holidays" element={<AdminMarketHolidayForm />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
