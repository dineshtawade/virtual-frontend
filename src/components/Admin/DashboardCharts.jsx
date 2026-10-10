import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, ArrowUpRight } from 'lucide-react';

export default function DashboardCharts({ analyticsData }) {
  const revenueTrend = analyticsData?.revenueTrend || [];
  const subscriptionDistribution = analyticsData?.subscriptionDistribution || [];
  const activityTrend = analyticsData?.activityTrend || [];

  return (
    <div className="space-y-6">
      {/* KPI Highlight Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monthly Recurring Revenue</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <ArrowUpRight size={12} /> {analyticsData?.mrrGrowth || '+14.8%'}
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.mrr || '₹2,41,000'}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">vs ₹2,13,000 last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pro Plus Attach Rate</span>
            <span className="inline-flex items-center text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              <ArrowUpRight size={12} /> +5.2%
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.proPlusAttachRate || '68.4%'}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Base DI brokers with Pro Plus</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Average Revenue Per User</span>
            <span className="inline-flex items-center text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
              ARPU
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.arpu || '₹2,450'}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Per active subscribing broker</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Registered Brokers</span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">{analyticsData?.totalUsers || 2}</h3>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">Configured accounts</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend Area Chart (Spans 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Subscription MRR Revenue Growth</h3>
                <p className="text-xs text-slate-500">Base DI vs Pro Plus vs Combined monthly revenue</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Live Revenue
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCombined" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="combined" name="Combined Bundle" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCombined)" />
                <Area type="monotone" dataKey="baseDI" name="Base DI Only" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBase)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Distribution Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <PieIcon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Subscription Share</h3>
              <p className="text-xs text-slate-500">Plan distribution breakdown</p>
            </div>
          </div>

          <div className="h-52 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {subscriptionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900">48%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bundled</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {subscriptionDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operations & Action Log Activity Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <BarChart3 size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Simulator Activity & Unlocks Stream</h3>
              <p className="text-xs text-slate-500">Daily contact unlocks vs plan upgrades vs cancellations</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
            Last 7 Days
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="unlocks" name="Contact Unlocks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="upgrades" name="Bundle Upgrades" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancels" name="Cancellations" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
