import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Smartphone,
  Layers,
  ShieldAlert,
  Users,
  Terminal,
  LogOut,
  Bell,
  Search,
  RefreshCw,
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  Lock,
  Settings,
  Home,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout, user } = useAuth();

  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleReset = async () => {
    if (window.confirm('Reset simulator system to initial factory defaults?')) {
      await adminService.resetSystem();
      queryClient.invalidateQueries();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container (Responsive + Collapsible) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out ${
          /* Mobile Drawer Positioning */
          mobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${
          /* Desktop Width Toggle */
          desktopCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Building2 size={20} />
            </div>
            {(!desktopCollapsed || mobileOpen) && (
              <div className="truncate">
                <h2 className="text-base font-bold text-white tracking-tight leading-none truncate">BrokerSim</h2>
                <span className="text-[10px] text-slate-400 font-medium truncate">Super Admin Portal</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            title={desktopCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {desktopCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-3 space-y-6 flex-1 overflow-y-auto">
          {/* Core Views Section */}
          <div>
            {(!desktopCollapsed || mobileOpen) && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Core Views</p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/admin"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="Admin Dashboard"
              >
                <LayoutDashboard size={18} className="shrink-0" />
                {(!desktopCollapsed || mobileOpen) && <span className="truncate">Admin Dashboard</span>}
              </NavLink>
            </div>
          </div>

          {/* User & Subscription Control Section */}
          <div>
            {(!desktopCollapsed || mobileOpen) && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">User & Accounts</p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/admin/brokers"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="User Management"
              >
                <UserCheck size={18} className="shrink-0 text-emerald-400" />
                {(!desktopCollapsed || mobileOpen) && (
                  <span className="truncate flex items-center justify-between w-full">
                    <span>User Management</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">Live</span>
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/logs"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="HTTP Action Stream"
              >
                <Terminal size={18} className="shrink-0" />
                {(!desktopCollapsed || mobileOpen) && <span className="truncate">HTTP Action Stream</span>}
              </NavLink>
            </div>
          </div>

          {/* Inventory & Product Catalog Section */}
          <div>
            {(!desktopCollapsed || mobileOpen) && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Inventory & Catalog</p>
            )}
            <div className="space-y-1">
              <NavLink
                to="/admin/properties"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="Property Postings"
              >
                <Home size={18} className="shrink-0 text-cyan-400" />
                {(!desktopCollapsed || mobileOpen) && (
                  <span className="truncate flex items-center justify-between w-full">
                    <span>Property Postings</span>
                    <span className="bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">Admin</span>
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/access"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="Manage Access & Permissions"
              >
                <Lock size={18} className="shrink-0 text-purple-400" />
                {(!desktopCollapsed || mobileOpen) && <span className="truncate">Manage Tier Access</span>}
              </NavLink>

              <NavLink
                to="/admin/catalog"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="Plan Catalog SKUs"
              >
                <Layers size={18} className="shrink-0" />
                {(!desktopCollapsed || mobileOpen) && <span className="truncate">Plan Catalog SKUs</span>}
              </NavLink>

              <NavLink
                to="/admin/flags"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="Catalog System Flags"
              >
                <ShieldAlert size={18} className="shrink-0" />
                {(!desktopCollapsed || mobileOpen) && <span className="truncate">Catalog System Flags</span>}
              </NavLink>

              <NavLink
                to="/admin/settings"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  } ${desktopCollapsed && !mobileOpen ? 'justify-center px-0' : ''}`
                }
                title="System & Payment Settings"
              >
                <Settings size={18} className="shrink-0 text-amber-400" />
                {(!desktopCollapsed || mobileOpen) && (
                  <span className="truncate flex items-center justify-between w-full">
                    <span>Payment & Email Settings</span>
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">New</span>
                  </span>
                )}
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer Profile */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 mb-2 border border-slate-800 ${
              desktopCollapsed && !mobileOpen ? 'justify-center p-1.5' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              SA
            </div>
            {(!desktopCollapsed || mobileOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">Super Admin</p>
                <p className="text-[11px] text-slate-400 truncate">admin@brokersim.com</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/40 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50 ${
              desktopCollapsed && !mobileOpen ? 'px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut size={16} className="shrink-0" />
            {(!desktopCollapsed || mobileOpen) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper (Dynamic Margin Transition) */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          desktopCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        {/* Top Header with Glassmorphism */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Sidebar Trigger Toggle (Hidden on Desktop) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate">
              Super Admin Control Center
            </h1>

            <div className="hidden md:block relative w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search plans, rules, or logs..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200"
            >
              <RefreshCw size={13} />
              <span className="hidden sm:inline">Reset System</span>
            </button>

            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Outlet Main Content */}
        <main className="p-4 sm:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
