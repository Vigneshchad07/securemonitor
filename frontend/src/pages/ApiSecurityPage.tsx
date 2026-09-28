import React from 'react';
import { Search, ShieldAlert, CheckCircle2, Globe, Lock } from 'lucide-react';

export const ApiSecurityPage: React.FC = () => {
  const apiInventory = [
    { endpoint: 'GET /api/demo/status', auth: 'None', authz: 'Public', status: '200 OK', risk: 'Low', header: 'Missing CSP Header' },
    { endpoint: 'GET /api/demo/auth/session', auth: 'Session Cookie', authz: 'Authenticated', status: '200 OK', risk: 'High', header: 'HttpOnly Flag Missing' },
    { endpoint: 'GET /api/demo/admin/telemetry', auth: 'Bearer Token', authz: 'Admin Only', status: '200 OK', risk: 'High', header: 'Broken Object Level Authorization' },
    { endpoint: 'GET /api/demo/search?q=...', auth: 'None', authz: 'Public', status: '200 OK', risk: 'Medium', header: 'Reflected Marker Parameter' },
    { endpoint: 'GET /api/demo/cors-test', auth: 'None', authz: 'Public', status: '200 OK', risk: 'Medium', header: 'Wildcard Access-Control-Allow-Origin' },
    { endpoint: 'GET /api/demo/events', auth: 'Bearer Token', authz: 'Analyst/Admin', status: '200 OK', risk: 'Safe', header: 'Configured Secure' },
    { endpoint: 'GET /api/demo/weather', auth: 'None', authz: 'Public', status: '200 OK', risk: 'Safe', header: 'Public Telemetry' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">API Security & CORS Policy Inventory</h2>
        <p className="text-xs text-slate-400 font-mono">Discovered REST API endpoints and CORS authorization headers for http://localhost:3001</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">API Endpoints Audited</span>
          <p className="text-2xl font-extrabold text-white font-mono mt-1">7 Endpoints</p>
          <p className="text-[11px] text-slate-500 mt-1">Local World Monitor staging route map</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">CORS Origin Policy</span>
          <p className="text-2xl font-extrabold text-amber-400 font-mono mt-1">Permissive (*)</p>
          <p className="text-[11px] text-amber-500/80 mt-1">SEC-003: Echoes request origin</p>
        </div>
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">RBAC Route Coverage</span>
          <p className="text-2xl font-extrabold text-rose-400 font-mono mt-1">1 Weakness</p>
          <p className="text-[11px] text-rose-500/80 mt-1">SEC-004: Admin route unverified</p>
        </div>
      </div>

      {/* API Inventory Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Discovered API Inventory & Risk Analysis</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Endpoint Route</th>
                <th className="p-3">Authentication</th>
                <th className="p-3">Authorization</th>
                <th className="p-3">Status</th>
                <th className="p-3">Primary Finding / Flag</th>
                <th className="p-3">Risk Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {apiInventory.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 font-mono transition">
                  <td className="p-3 text-cyan-400 font-bold">{item.endpoint}</td>
                  <td className="p-3 text-slate-300">{item.auth}</td>
                  <td className="p-3 text-slate-400">{item.authz}</td>
                  <td className="p-3 text-emerald-400 font-bold">{item.status}</td>
                  <td className="p-3 text-slate-200">{item.header}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.risk === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : item.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : item.risk === 'Low' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'}`}>
                      {item.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
