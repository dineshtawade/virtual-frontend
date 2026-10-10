import React from 'react';
import { Settings, CheckCircle2, XCircle } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';

export default function CatalogControl() {
  const { catalog, updateFlags } = useCatalog();
  const flags = catalog?.flags || {};
  const plans = catalog?.plans || [];

  const handleFlagToggle = (key, currentVal) => {
    updateFlags({ [key]: !currentVal });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
          <Settings size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">A4. Plan Catalog & Admin System Flags</h3>
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Catalog System Flags</span>
          
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/40">
            <div>
              <p className="text-xs font-bold text-slate-900">pro_plus_auto_pay_plans_available</p>
              <p className="text-[11px] text-slate-500">Allow standalone Pro Plus auto-pay plans</p>
            </div>
            <button
              onClick={() => handleFlagToggle('proPlusAutoPayPlansAvailable', flags.proPlusAutoPayPlansAvailable)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                flags.proPlusAutoPayPlansAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {flags.proPlusAutoPayPlansAvailable ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
              <span>{flags.proPlusAutoPayPlansAvailable ? 'Enabled' : 'Disabled'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/40">
            <div>
              <p className="text-xs font-bold text-slate-900">disallowExceedingOneTimeSkus</p>
              <p className="text-[11px] text-slate-500">Reject Pro Plus pack if duration exceeds DI expiry</p>
            </div>
            <button
              onClick={() => handleFlagToggle('disallowExceedingOneTimeSkus', flags.disallowExceedingOneTimeSkus)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                flags.disallowExceedingOneTimeSkus ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {flags.disallowExceedingOneTimeSkus ? <XCircle size={13} /> : <CheckCircle2 size={13} />}
              <span>{flags.disallowExceedingOneTimeSkus ? 'Strict Reject' : 'Cap Expiry'}</span>
            </button>
          </div>
        </div>

        {/* Catalog Plans Overview */}
        <div>
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Configured SKUs ({plans.length})</span>
          <div className="grid grid-cols-2 gap-2">
            {plans.map((p) => (
              <div key={p.planId} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  {p.category}
                </span>
                <p className="text-xs font-bold text-slate-800 mt-1 truncate">{p.label}</p>
                <p className="text-xs font-extrabold text-blue-600 mt-0.5">₹{p.price || p.combinedPrice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
