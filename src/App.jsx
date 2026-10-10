import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SimulatorPage from './pages/SimulatorPage';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageSubscriptionAccess from './components/Admin/ManageSubscriptionAccess';
import PlanCatalogManager from './components/Admin/PlanCatalogManager';
import CatalogFlagsManager from './components/Admin/CatalogFlagsManager';
import BrokerAccountsManager from './components/Admin/BrokerAccountsManager';
import ActionLogsManager from './components/Admin/ActionLogsManager';
import PaymentSystemSettings from './components/Admin/PaymentSystemSettings';
import SuperAdminPropertyManager from './components/Admin/SuperAdminPropertyManager';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public Screens */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Simulator Workspace */}
            <Route
              path="/simulator"
              element={
                <div className="app-container">
                  <Navbar />
                  <SimulatorPage />
                </div>
              }
            />

            {/* Super Admin Protected Portal */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="properties" element={<SuperAdminPropertyManager />} />
                <Route path="access" element={<ManageSubscriptionAccess />} />
                <Route path="catalog" element={<PlanCatalogManager />} />
                <Route path="flags" element={<CatalogFlagsManager />} />
                <Route path="brokers" element={<BrokerAccountsManager />} />
                <Route path="settings" element={<PaymentSystemSettings />} />
                <Route path="logs" element={<ActionLogsManager />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </Provider>
  );
}
