import React from 'react';
import { useSelector } from 'react-redux';
import { Database, AlertTriangle } from 'lucide-react';
import { useBrokerState } from '../../hooks/useBrokerState';

export default function DirectInventoryControl() {
  const { brokerState, warnings } = useSelector((state) => state.broker);
  const { updateBrokerState } = useBrokerState();

  const di = brokerState?.baseSubscription || {};

  const handleChange = (field, value) => {
    updateBrokerState({
      baseSubscription: {
        ...di,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
          <Database size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">A2. Base Subscription (Direct Inventory)</h3>
      </div>

      <div className="p-5 space-y-4">
        {/* Warnings */}
        {warnings && warnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1 text-amber-800">
              <AlertTriangle size={15} />
              <span>Consistency Warnings</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 font-medium text-[11px]">
              {warnings.map((w, idx) => (
                <li key={idx}>{w.message}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">DI Access Active?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!di.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {di.active ? 'ON (Active)' : 'OFF (Inactive)'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Access Source</label>
            <select
              value={di.accessSource || 'none'}
              onChange={(e) => handleChange('accessSource', e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="none">none (No Access)</option>
              <option value="one_time">one_time (Fixed Pack)</option>
              <option value="auto_pay">auto_pay (Recurring Subscription)</option>
              <option value="admin_grant">admin_grant (Manual Access)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">DI Expires At (One-Time)</label>
            <input
              type="datetime-local"
              value={di.expiresAt ? new Date(di.expiresAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Paid Through At (Auto-Pay)</label>
            <input
              type="datetime-local"
              value={di.paidThroughAt ? new Date(di.paidThroughAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('paidThroughAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">DI Auto-Pay Active?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!di.autoPayActive}
                onChange={(e) => handleChange('autoPayActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {di.autoPayActive ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pending Cancellation?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!di.autoPayPendingCancellation}
                onChange={(e) => handleChange('autoPayPendingCancellation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {di.autoPayPendingCancellation ? 'Pending Cancel' : 'Normal'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
