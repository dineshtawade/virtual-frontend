import React from 'react';
import { Zap, Play } from 'lucide-react';
import { useCatalog } from '../../hooks/useCatalog';
import { useBrokerState } from '../../hooks/useBrokerState';

export default function PresetSelector() {
  const { catalog } = useCatalog();
  const { applyPreset, isApplyingPreset } = useBrokerState();
  const presets = catalog?.presets || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
          <Zap size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">A5. Quick Presets (1-Click Scenario Loaders)</h3>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {presets.map((preset) => (
            <div
              key={preset.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="mb-3">
                <h4 className="text-xs font-bold text-slate-900 mb-1">{preset.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{preset.description}</p>
              </div>

              <button
                disabled={isApplyingPreset}
                onClick={() => applyPreset(preset.id)}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded-lg transition-all"
              >
                <Play size={12} />
                <span>Load Scenario</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
