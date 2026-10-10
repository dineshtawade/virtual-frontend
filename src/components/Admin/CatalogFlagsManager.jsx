import React from 'react';
import { ShieldAlert, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';

export default function CatalogFlagsManager() {
  const { catalog, updateFlags, isUpdatingFlags } = useCatalog();
  const flags = catalog?.flags || {};

  const handleToggle = (key, val) => {
    updateFlags({ [key]: !val });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <ShieldAlert size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Global Catalog System Flags</h3>
            <p className="text-xs text-slate-500">Configure administrative system behavior and rules</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/30">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">pro_plus_auto_pay_plans_available</h4>
            <p className="text-xs text-slate-500 max-w-xl">
              Global switch allowing brokers to initiate standalone Pro Plus auto-pay subscriptions.
            </p>
          </div>
          <button
            disabled={isUpdatingFlags}
            onClick={() => handleToggle('proPlusAutoPayPlansAvailable', flags.proPlusAutoPayPlansAvailable)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              flags.proPlusAutoPayPlansAvailable
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {flags.proPlusAutoPayPlansAvailable ? <CheckCircle2 size={14} /> : <AlertOctagon size={14} />}
            <span>{flags.proPlusAutoPayPlansAvailable ? 'ENABLED (True)' : 'DISABLED (False)'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/30">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-0.5">disallowExceedingOneTimeSkus</h4>
            <p className="text-xs text-slate-500 max-w-xl">
              Strictly reject Pro Plus one-time purchases when pack duration extends beyond Direct Inventory expiry date.
            </p>
          </div>
          <button
            disabled={isUpdatingFlags}
            onClick={() => handleToggle('disallowExceedingOneTimeSkus', flags.disallowExceedingOneTimeSkus)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
              flags.disallowExceedingOneTimeSkus
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
            }`}
          >
            {flags.disallowExceedingOneTimeSkus ? <AlertOctagon size={14} /> : <CheckCircle2 size={14} />}
            <span>{flags.disallowExceedingOneTimeSkus ? 'STRICT REJECT (True)' : 'CAP EXPIRY (False)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
