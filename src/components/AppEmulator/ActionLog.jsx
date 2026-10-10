import React from 'react';
import { Terminal, Trash2, CheckCircle2, AlertOctagon, XCircle } from 'lucide-react';
import { useEmulatorAction } from '../../hooks/useEmulatorAction';

export default function ActionLog() {
  const { actionLogs, clearLogs } = useEmulatorAction();

  const getStatusBadge = (statusCode) => {
    if (statusCode === 200) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
          <CheckCircle2 size={11} /> 200 OK
        </span>
      );
    }
    if (statusCode === 403) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
          <AlertOctagon size={11} /> 403 FORBIDDEN
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
        <XCircle size={11} /> {statusCode} BAD REQUEST
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
            <Terminal size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-900">HTTP Action Stream & Audit Log</h3>
        </div>

        <button
          onClick={() => clearLogs()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-all"
        >
          <Trash2 size={12} />
          <span>Clear</span>
        </button>
      </div>

      <div className="p-5">
        {actionLogs.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">
            No simulator operations recorded yet. Perform actions in the emulator panel above.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {actionLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border-l-4 bg-slate-50/70 border border-slate-200/80 ${
                  log.statusCode === 200
                    ? 'border-l-emerald-500'
                    : log.statusCode === 403
                    ? 'border-l-rose-500'
                    : 'border-l-amber-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(log.statusCode)}
                    <span className="font-mono text-xs font-bold text-slate-900">{log.action}</span>
                    {log.errorCode && log.errorCode !== 'NONE' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 text-purple-800 border border-purple-200">
                        {log.errorCode}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-700 mt-1.5">{log.message}</p>

                {log.targetTab && (
                  <p className="text-[11px] font-medium text-amber-700 mt-1">
                    ↳ Auto-routed tab: <code className="bg-amber-100 px-1 py-0.5 rounded text-[10px]">{log.targetTab}</code>
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
