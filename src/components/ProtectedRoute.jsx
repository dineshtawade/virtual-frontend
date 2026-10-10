import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RefreshCw } from 'lucide-react';

export default function ProtectedRoute({ requireAdmin = false }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const token = localStorage.getItem('token');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans">
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-indigo-400" size={20} />
          <span className="text-xs font-bold text-slate-300">Verifying Super Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // Without valid token or authentication, redirect to login!
  if (!token || !isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Without superadmin role, redirect to login!
  if (requireAdmin && user.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
