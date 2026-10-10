import React from 'react';
import { useSelector } from 'react-redux';
import { Clock, FastForward } from 'lucide-react';
import { useBrokerState } from '../../hooks/useBrokerState';

export default function ClockControl() {
  const simulatedTime = useSelector((state) => state.clock.simulatedTime);
  const { setSimulatedClock } = useBrokerState();

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSimulatedClock(new Date(val).toISOString());
    }
  };

  const advanceDays = (days) => {
    const current = new Date(simulatedTime);
    current.setDate(current.getDate() + days);
    setSimulatedClock(current.toISOString());
  };

  const formattedDate = new Date(simulatedTime).toISOString().slice(0, 16);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
          <Clock size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">A1. Simulated Clock</h3>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Date & Time</label>
          <input
            type="datetime-local"
            value={formattedDate}
            onChange={handleDateChange}
            className="w-full px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div>
          <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Advance Clock</span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => advanceDays(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
            >
              <FastForward size={12} /> +1 Day
            </button>
            <button
              onClick={() => advanceDays(7)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
            >
              <FastForward size={12} /> +7 Days
            </button>
            <button
              onClick={() => advanceDays(30)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-all"
            >
              <FastForward size={12} /> +30 Days
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
