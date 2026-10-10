import React, { useState } from 'react';
import { Plus, Check, Layers, ListChecks, ShieldCheck } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';

export default function PlanCatalogManager() {
  const { catalog, upsertPlan, isUpsertingPlan } = useCatalog();
  const plans = catalog?.plans || [];

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    planId: '',
    label: '',
    category: 'DI_AUTO_PAY',
    price: 1999,
    durationMonths: 1,
    isBasePlan: true,
    requiresBasePlan: false,
    featuresText: 'Unlock Regular Owner Contacts, Monthly Auto-Pay, Pro Plus Add-On Ready',
    isActive: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const featuresList = formData.featuresText
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const payload = {
      planId: formData.planId,
      label: formData.label,
      category: formData.category,
      price: Number(formData.price),
      durationMonths: Number(formData.durationMonths),
      isBasePlan: formData.isBasePlan,
      requiresBasePlan: formData.requiresBasePlan,
      features: featuresList,
      isActive: formData.isActive,
    };

    upsertPlan(payload, {
      onSuccess: () => {
        setFormOpen(false);
        setFormData({
          planId: '',
          label: '',
          category: 'DI_AUTO_PAY',
          price: 1999,
          durationMonths: 1,
          isBasePlan: true,
          requiresBasePlan: false,
          featuresText: '',
          isActive: true,
        });
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
            <Layers size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Super Admin — Plan Catalog & Inclusions Manager</h3>
            <p className="text-xs text-slate-500">Configure base plans, add-on prerequisites, inclusions, and prices</p>
          </div>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs"
        >
          <Plus size={14} />
          <span>{formOpen ? 'Close Form' : 'Create New Plan SKU'}</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {formOpen && (
          <form onSubmit={handleSubmit} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add / Configure Plan Definition</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan ID SKU *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. di_base_monthly"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Plan Display Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Direct Inventory Base Plan"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="DI_AUTO_PAY">DI_AUTO_PAY (Base Plan)</option>
                  <option value="DI_ONE_TIME">DI_ONE_TIME (Fixed Pack Base)</option>
                  <option value="PRO_PLUS_AUTO_PAY">PRO_PLUS_AUTO_PAY (Add-On)</option>
                  <option value="PRO_PLUS_ONE_TIME">PRO_PLUS_ONE_TIME (Add-On Pack)</option>
                  <option value="COMBINED_AUTO_PAY">COMBINED_AUTO_PAY (Bundle)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Price (₹)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Included Features (Comma Separated) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Included Features (Comma-Separated)</label>
              <textarea
                rows="2"
                placeholder="e.g. Unlock Regular Owner Contacts, Monthly Auto-Pay, HD Photos Access"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
              />
            </div>

            {/* Prerequisite & Base Plan Rules */}
            <div className="flex flex-wrap items-center gap-6 p-3 rounded-lg bg-white border border-slate-200">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isBasePlan}
                  onChange={(e) => setFormData({ ...formData, isBasePlan: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-2 text-xs font-semibold text-slate-700">Is Base Subscription Plan</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.requiresBasePlan}
                  onChange={(e) => setFormData({ ...formData, requiresBasePlan: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                <span className="ml-2 text-xs font-semibold text-slate-700">Requires Base Subscription First (Prerequisite)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isUpsertingPlan}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
            >
              <Check size={14} />
              <span>Save Plan Definition to Catalog</span>
            </button>
          </form>
        )}

        {/* Clean Styled Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Plan SKU</th>
                <th className="py-3 px-4">Display Name</th>
                <th className="py-3 px-4">Type / Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Included Features</th>
                <th className="py-3 px-4">Prerequisites</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {plans.map((p) => (
                <tr key={p.planId} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-900">{p.planId}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{p.label}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      p.isBasePlan ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-extrabold text-slate-900">₹{p.price || p.combinedPrice}</td>
                  <td className="py-3 px-4">
                    <ul className="space-y-0.5 text-[11px] text-slate-600">
                      {p.features?.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <Check size={12} className="text-emerald-500 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4">
                    {p.requiresBasePlan ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        <ShieldCheck size={10} /> Base Sub Required
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">None (Base Plan)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
