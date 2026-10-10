import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Smartphone, Layers, RefreshCw, LogOut, UserCheck, Menu, X } from 'lucide-react';
import { adminService } from '../services/adminService';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset simulator state to default initial values?')) {
      await adminService.resetSystem();
      queryClient.invalidateQueries();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 shadow-xs">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0"
        >
          <Layers size={20} />
        </Link>
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-none tracking-tight truncate">
            BrokerSim Platform
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate hidden sm:block">
            Direct Inventory & Pro Plus Platform
          </p>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-2">
        {user?.role === 'superadmin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <ShieldCheck size={16} />
            <span>Super Admin Portal</span>
          </NavLink>
        )}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
        >
          <RefreshCw size={13} />
          <span>Reset Demo</span>
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-900 truncate max-w-[120px]">{user?.name}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-all"
          >
            <UserCheck size={14} />
            <span>Sign In</span>
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Trigger */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={handleReset}
          className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg"
          title="Reset Demo"
        >
          <RefreshCw size={14} />
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 shadow-xl md:hidden space-y-3">
          {user?.role === 'superadmin' && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-800"
            >
              <ShieldCheck size={16} className="text-indigo-600" />
              <span>Super Admin Portal</span>
            </NavLink>
          )}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-slate-500">{user?.role || 'Visitor'}</p>
            </div>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
