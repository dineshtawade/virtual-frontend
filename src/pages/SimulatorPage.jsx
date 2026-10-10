import React from 'react';
import ClockControl from '../components/ScenarioSetup/ClockControl';
import DirectInventoryControl from '../components/ScenarioSetup/DirectInventoryControl';
import ProPlusControl from '../components/ScenarioSetup/ProPlusControl';
import CatalogControl from '../components/ScenarioSetup/CatalogControl';
import PresetSelector from '../components/ScenarioSetup/PresetSelector';

import MockInventory from '../components/AppEmulator/MockInventory';
import PricingShop from '../components/AppEmulator/PricingShop';
import ActionLog from '../components/AppEmulator/ActionLog';

export default function SimulatorPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6 max-w-[1700px] mx-auto min-h-[calc(100vh-64px)]">
      {/* Left Pane — Scenario Setup Panel (Part A) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/50 border-b border-slate-200/80 sticky top-0 z-10">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Part A — Scenario Setup Panel</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Configure broker subscription state, catalog flags, and simulated time.
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <PresetSelector />
          <ClockControl />
          <DirectInventoryControl />
          <ProPlusControl />
          <CatalogControl />
        </div>
      </section>

      {/* Right Pane — App Emulator Panel (Part B) */}
      <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col overflow-hidden">
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/50 border-b border-slate-200/80 sticky top-0 z-10">
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Part B — App Emulator Panel</h2>
          <p className="text-[11px] sm:text-xs text-slate-500">
            Mobile-adjacent broker experience & live action audit stream.
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          <MockInventory />
          <PricingShop />
          <ActionLog />
        </div>
      </section>
    </div>
  );
}
