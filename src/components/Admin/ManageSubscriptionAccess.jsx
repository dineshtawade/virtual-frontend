import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, Star, CheckCircle2, Lock, Save, AlertCircle, Sparkles } from 'lucide-react';
import { catalogService } from '../../services/catalogService';

export default function ManageSubscriptionAccess() {
  const queryClient = useQueryClient();

  const { data: catalogData, isLoading } = useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      const res = await catalogService.getCatalog();
      return res?.data;
    },
  });

  const [matrix, setMatrix] = useState({
    free: {
      canUnlockRegular: false,
      canUnlockExclusive: false,
      canViewFullPhotos: false,
      maxDailyUnlocks: 0,
    },
    baseDI: {
      canUnlockRegular: true,
      canUnlockExclusive: false,
      canViewFullPhotos: false,
      maxDailyUnlocks: 50,
    },
    proPlus: {
      canUnlockRegular: true,
      canUnlockExclusive: true,
      canViewFullPhotos: true,
      maxDailyUnlocks: 999,
    },
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (catalogData?.accessMatrix) {
      setMatrix(catalogData.accessMatrix);
    }
  }, [catalogData]);

  const updateMatrixMutation = useMutation({
    mutationFn: (updatedMatrix) => catalogService.updateAccessMatrix(updatedMatrix),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog'] });
      queryClient.invalidateQueries({ queryKey: ['brokerState'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleToggle = (tierKey, field) => {
    setMatrix((prev) => ({
      ...prev,
      [tierKey]: {
        ...prev[tierKey],
        [field]: !prev[tierKey][field],
      },
    }));
  };

  const handleNumberChange = (tierKey, field, val) => {
    setMatrix((prev) => ({
      ...prev,
      [tierKey]: {
        ...prev[tierKey],
        [field]: Number(val),
      },
    }));
  };

  const handleSave = () => {
    updateMatrixMutation.mutate(matrix);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-6">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
            <Lock size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Manage Subscription Access & Permissions Matrix</h3>
            <p className="text-xs text-slate-500">Configure feature access rights & limits across Free, Base DI, and Pro Plus tiers</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={updateMatrixMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
        >
          <Save size={14} />
          <span>{updateMatrixMutation.isPending ? 'Saving Matrix...' : 'Save Permissions Matrix'}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="mx-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Access Matrix updated successfully! Rule engine will enforce updated permissions live.</span>
        </div>
      )}

      {/* 3 Tier Permissions Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1: Free / Explorer Tier */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">Tier 1</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Free / Explorer Tier</h4>
            </div>
            <Lock size={18} className="text-slate-400" />
          </div>

          <p className="text-xs text-slate-500">Default permissions for non-subscribing or trial brokers.</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Regular Owner Contacts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.free?.canUnlockRegular}
                  onChange={() => handleToggle('free', 'canUnlockRegular')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Exclusive Listing Unlocks</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.free?.canUnlockExclusive}
                  onChange={() => handleToggle('free', 'canUnlockExclusive')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Full HD Photo View</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.free?.canViewFullPhotos}
                  onChange={() => handleToggle('free', 'canViewFullPhotos')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Daily Contact Unlocks</label>
              <input
                type="number"
                value={matrix.free?.maxDailyUnlocks || 0}
                onChange={(e) => handleNumberChange('free', 'maxDailyUnlocks', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Tier 2: Base Plan (Direct Inventory - DI) */}
        <div className="rounded-2xl border border-blue-200 bg-blue-50/30 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Tier 2</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Base Plan (DI Access)</h4>
            </div>
            <Shield size={18} className="text-blue-600" />
          </div>

          <p className="text-xs text-slate-500">Requires active Direct Inventory base subscription.</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Regular Owner Contacts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.baseDI?.canUnlockRegular}
                  onChange={() => handleToggle('baseDI', 'canUnlockRegular')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Exclusive Listing Unlocks</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.baseDI?.canUnlockExclusive}
                  onChange={() => handleToggle('baseDI', 'canUnlockExclusive')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Full HD Photo View</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.baseDI?.canViewFullPhotos}
                  onChange={() => handleToggle('baseDI', 'canViewFullPhotos')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Daily Contact Unlocks</label>
              <input
                type="number"
                value={matrix.baseDI?.maxDailyUnlocks || 50}
                onChange={(e) => handleNumberChange('baseDI', 'maxDailyUnlocks', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Tier 3: Pro Plus / Combined Tier */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Tier 3</span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Pro Plus / Combined Tier</h4>
            </div>
            <Star size={18} className="text-indigo-600" />
          </div>

          <p className="text-xs text-slate-500">Requires active Pro Plus add-on or Combined Bundle.</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Regular Owner Contacts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.proPlus?.canUnlockRegular}
                  onChange={() => handleToggle('proPlus', 'canUnlockRegular')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Exclusive Listing Unlocks</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.proPlus?.canUnlockExclusive}
                  onChange={() => handleToggle('proPlus', 'canUnlockExclusive')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200">
              <span className="text-xs font-semibold text-slate-700">Full HD Photo View</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!matrix.proPlus?.canViewFullPhotos}
                  onChange={() => handleToggle('proPlus', 'canViewFullPhotos')}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Max Daily Contact Unlocks</label>
              <input
                type="number"
                value={matrix.proPlus?.maxDailyUnlocks || 999}
                onChange={(e) => handleNumberChange('proPlus', 'maxDailyUnlocks', e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
