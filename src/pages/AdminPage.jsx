import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Database, ListFilter, Activity } from 'lucide-react';
import { adminService } from '../services/adminService';
import PlanCatalogManager from '../components/Admin/PlanCatalogManager';
import CatalogFlagsManager from '../components/Admin/CatalogFlagsManager';

export default function AdminPage() {
  const { data: statsData } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await adminService.getAdminStats();
      return res?.data;
    },
  });

  const stats = statsData || { totalPlans: 0, totalPresets: 0, totalActionLogs: 0 };

  return (
    <div className="admin-page-container">
      <div className="admin-header-banner mb-4">
        <div className="flex items-center gap-3">
          <Shield size={28} className="text-primary" />
          <div>
            <h2 className="text-xl font-bold">Super Admin Control Center</h2>
            <p className="text-xs text-muted">Manage global catalog plans, feature flags, system parameters, and audit streams.</p>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-3 gap-3 mb-4">
        <div className="stat-card">
          <Database size={20} className="text-primary mb-2" />
          <div className="stat-value">{stats.totalPlans}</div>
          <div className="stat-label">Catalog Plans</div>
        </div>

        <div className="stat-card">
          <ListFilter size={20} className="text-warning mb-2" />
          <div className="stat-value">{stats.totalPresets}</div>
          <div className="stat-label">Configured Presets</div>
        </div>

        <div className="stat-card">
          <Activity size={20} className="text-success mb-2" />
          <div className="stat-value">{stats.totalActionLogs}</div>
          <div className="stat-label">Recorded Actions</div>
        </div>
      </div>

      <div className="space-y-4">
        <CatalogFlagsManager />
        <PlanCatalogManager />
      </div>
    </div>
  );
}
