import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginForm, RegisterForm } from '@/features/auth';
import { ProtectedRoute } from '@/shared/components/ProtectedRoute';
import { PublicRoute } from '@/shared/components/PublicRoute';
import { Layout } from '@/shared/components/Layout';
import { Dashboard } from './Dashboard';
import { OrdersPage } from './OrdersPage';
import { InstrumentsPage } from './InstrumentsPage';
import { InstrumentDetail } from '@/features/instruments/components/InstrumentDetail';
import { AdminPanel } from '@/features/instruments/components/AdminPanel';
import { AdminInstrumentForm } from '@/features/instruments/components/AdminInstrumentForm';
import { AdminMarketHoursForm } from '@/features/market/components/AdminMarketHoursForm';
import { AdminMarketHolidayForm } from '@/features/market/components/AdminMarketHolidayForm';
import { AdminManageHours } from '@/features/market/components/AdminManageHours';

import { TelemetryProvider } from '@/shared/services/telemetry/TelemetryProvider';
import { ProfilePage } from '@/features/profile/components/ProfilePage';
import { NotFound } from '@/shared/components/NotFound';

import { PortfolioPage } from '@/features/portfolio/pages/PortfolioPage';
import { WatchlistPage } from '@/features/watchlist/pages/WatchlistPage';
import { LandingPage } from '@/features/landing/pages/LandingPage';
import { TradeDiagnosticsPage } from '@/features/analytics/pages/TradeDiagnosticsPage';
import EducationHub from '@/features/education/pages/EducationHub';
import ModulePage from '@/features/education/pages/ModulePage';

export function Router(): JSX.Element {
    return (
        <BrowserRouter>
            <TelemetryProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route
                        path="/"
                        element={
                            <PublicRoute>
                                <LandingPage />
                            </PublicRoute>
                        }
                    />
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
                        <Route path="/portfolio" element={<PortfolioPage />} />
                        <Route path="/diagnostics" element={<TradeDiagnosticsPage />} />
                        <Route path="/watchlists" element={<WatchlistPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/instruments" element={<InstrumentsPage />} />
                        <Route path="/instruments/:id" element={<InstrumentDetail />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/admin" element={<AdminPanel />} />
                        <Route path="/admin/instruments/new" element={<AdminInstrumentForm />} />
                        <Route path="/admin/instruments/edit/:id" element={<AdminInstrumentForm />} />
                        <Route path="/admin/market-hours" element={<AdminMarketHoursForm />} />
                        <Route path="/admin/manage-hours" element={<AdminManageHours />} />
                        <Route path="/admin/market-holidays" element={<AdminMarketHolidayForm />} />

                        {/* Education Routes */}
                        <Route path="/education" element={<EducationHub />} />
                        <Route path="/education/:moduleId" element={<ModulePage />} />


                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </TelemetryProvider>
        </BrowserRouter>
    );
}
