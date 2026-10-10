import React, { useState } from 'react';
import { Terminal, Trash2 } from 'lucide-react';
import { useEmulatorAction } from '../../hooks/useEmulatorAction';

export default function ActionLogsManager() {
  const { actionLogs, clearLogs } = useEmulatorAction();
  const [filterText, setFilterText] = useState('');

  const filteredLogs = actionLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(filterText.toLowerCase()) ||
      log.message.toLowerCase().includes(filterText.toLowerCase()) ||
      (log.errorCode && log.errorCode.toLowerCase().includes(filterText.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center">
            <Terminal size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">System-Wide HTTP Action Audit Log</h3>
            <p className="text-xs text-slate-500">Append-only audit trail of simulator API operations</p>
          </div>
        </div>

        <button
          onClick={() => clearLogs()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
        >
          <Trash2 size={13} />
          <span>Clear Logs</span>
        </button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Filter logs by action, error code, or message..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full px-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Error Code</th>
                <th className="py-3 px-4">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-xs text-slate-400">
                    No log records match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.statusCode === 200
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.statusCode === 403
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{log.action}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.errorCode || 'NONE'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{log.message}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
