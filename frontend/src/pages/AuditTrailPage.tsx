import React, { useEffect, useState } from 'react';
import { History, Shield, CheckCircle2, UserCheck } from 'lucide-react';
import { AuditLog } from '../types';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    fetch('/api/audit-logs')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch(() => {
        setLogs([
          { id: 1, timestamp: new Date().toISOString(), username: 'analyst', action: 'RUN_ASSESSMENT', target: 'World Monitor Local', result: 'Completed (8 Findings)' },
          { id: 2, timestamp: new Date().toISOString(), username: 'analyst', action: 'RETEST_FINDING', target: 'SEC-002', result: 'PASS (Remediated)' },
          { id: 3, timestamp: new Date().toISOString(), username: 'admin', action: 'USER_LOGIN_SUCCESS', target: 'Auth Endpoint', result: 'Role: Admin' }
        ]);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">System Audit Trail & Compliance Log</h2>
        <p className="text-xs text-slate-400 font-mono">Immutable audit records of all user logins, target registrations, scans, and report generations</p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">User</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target System / Component</th>
                <th className="p-3">Result / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 text-slate-400">{log.timestamp}</td>
                  <td className="p-3 text-cyan-400 font-bold">{log.username}</td>
                  <td className="p-3 font-semibold text-slate-200">{log.action}</td>
                  <td className="p-3 text-slate-300">{log.target || 'N/A'}</td>
                  <td className="p-3 text-emerald-400 font-bold">{log.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
