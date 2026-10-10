import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Search, Calendar, Shield, Star, CheckCircle2, Clock, Filter } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function BrokerAccountsManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('ALL');

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const res = await adminService.getAllUsers();
      return res?.data || [];
    },
  });

  const usersList = usersData || [];

  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (planFilter === 'ALL') return true;
    if (planFilter === 'COMBINED') return user.currentPlanLabel.includes('Combined');
    if (planFilter === 'DI') return user.currentPlanLabel.includes('Direct Inventory') && !user.currentPlanLabel.includes('Combined');
    if (planFilter === 'PRO') return user.currentPlanLabel.includes('Pro Plus');
    if (planFilter === 'FREE') return user.currentPlanLabel.includes('Free') || user.currentPlanLabel.includes('No Active');

    return true;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Module Header */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">User & Subscription Management Module</h3>
            <p className="text-xs text-slate-500">Track user registrations, purchased subscription packages, and entitlement statuses</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          {usersList.length} Registered Accounts
        </span>
      </div>

      <div className="p-6 space-y-4">
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search user, email, or firm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={14} className="text-slate-400 shrink-0" />
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="ALL">All Subscription Packages</option>
              <option value="COMBINED">Combined DI + Pro Bundle</option>
              <option value="DI">Direct Inventory (DI Base)</option>
              <option value="PRO">Pro Plus Standalone</option>
              <option value="FREE">Free / No Plan</option>
            </select>
          </div>
        </div>

        {/* Styled User Management Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">User Profile</th>
                <th className="py-3.5 px-4">Agency / Firm</th>
                <th className="py-3.5 px-4">Registration Date & Time</th>
                <th className="py-3.5 px-4">Purchased Subscription Package</th>
                <th className="py-3.5 px-4">Access Entitlements</th>
                <th className="py-3.5 px-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400 font-medium">
                    Loading registered user accounts...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-slate-400 font-medium">
                    No registered user accounts match your search filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const base = user.brokerState?.baseSubscription;
                  const pro = user.brokerState?.proPlusAddon;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* User Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {user.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight">{user.name}</p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Agency / Firm */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">{user.company || 'Independent'}</td>

                      {/* Registration Timestamp */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-600">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{formatDate(user.createdAt)}</span>
                        </div>
                      </td>

                      {/* Purchased Subscription Package */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            user.currentPlanLabel.includes('Combined')
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : user.currentPlanLabel.includes('Direct Inventory')
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : user.currentPlanLabel.includes('Pro Plus')
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <CheckCircle2 size={12} />
                          <span>{user.currentPlanLabel}</span>
                        </span>
                      </td>

                      {/* Access Entitlements */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {base?.active ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              <Shield size={10} /> DI Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">
                              DI Inactive
                            </span>
                          )}

                          {pro?.active && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              <Star size={10} /> Pro Plus Active
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            user.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
