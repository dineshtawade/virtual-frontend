import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '../services/adminService';
import DashboardCharts from '../components/Admin/DashboardCharts';
import PlanCatalogManager from '../components/Admin/PlanCatalogManager';
import CatalogFlagsManager from '../components/Admin/CatalogFlagsManager';
import BrokerAccountsManager from '../components/Admin/BrokerAccountsManager';

export default function AdminDashboard() {
  const { data: statsData } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const res = await adminService.getAdminStats();
      return res?.data;
    },
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Analytics Graphs & KPI Cards */}
      <DashboardCharts analyticsData={statsData} />

      {/* Global Catalog System Flags */}
      <CatalogFlagsManager />

      {/* Plan Catalog & Inclusions Manager */}
      <PlanCatalogManager />

      {/* Registered Broker Accounts */}
      <BrokerAccountsManager />
    </div>
  );
}
