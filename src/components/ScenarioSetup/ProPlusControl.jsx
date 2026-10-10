import React from 'react';
import { useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { useBrokerState } from '../../hooks/useBrokerState';

export default function ProPlusControl() {
  const { brokerState } = useSelector((state) => state.broker);
  const { updateBrokerState } = useBrokerState();

  const pro = brokerState?.proPlusAddon || {};

  const handleChange = (field, value) => {
    updateBrokerState({
      proPlusAddon: {
        ...pro,
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
          <Star size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">A3. Pro Plus Add-On</h3>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pro Plus Access Active?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!pro.active}
                onChange={(e) => handleChange('active', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {pro.active ? 'ON (Active)' : 'OFF (Inactive)'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pro Plus Expires At</label>
            <input
              type="datetime-local"
              value={pro.expiresAt ? new Date(pro.expiresAt).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('expiresAt', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Pro Plus Auto-Pay Active?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!pro.autoPayActive}
                onChange={(e) => handleChange('autoPayActive', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {pro.autoPayActive ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bundled with DI Auto-Pay?</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={!!pro.isBundledWithDI}
                onChange={(e) => handleChange('isBundledWithDI', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-700">
                {pro.isBundledWithDI ? 'Bundled (Cannot cancel alone)' : 'Standalone'}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
