import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2, Play, AlertCircle } from 'lucide-react';
import { SecurityTest } from '../types';

export const SecurityTestsPage: React.FC = () => {
  const [tests, setTests] = useState<SecurityTest[]>([]);

  useEffect(() => {
    fetch('/api/security-tests')
      .then((res) => res.json())
      .then((data) => setTests(data))
      .catch(() => {
        setTests([
          { id: 'AUTH-001', name: 'Authentication Endpoint Discovery & TLS Verification', domain: 'Authentication', risk: 'High', method: 'Passive/Active Safe GET', status: 'Active' },
          { id: 'AUTH-002', name: 'Security Headers (CSP, HSTS, X-Frame) Inspection', domain: 'Authentication', risk: 'Medium', method: 'Header Analysis', status: 'Active' },
          { id: 'SESSION-001', name: 'Session Cookie Flags (HttpOnly, Secure, SameSite) Check', domain: 'Session Management', risk: 'High', method: 'Header Inspection', status: 'Active' },
          { id: 'AUTHZ-001', name: 'Role-Based Access Control (RBAC) Privilege Escalate Matrix', domain: 'Authorization', risk: 'High', method: 'Role Request Simulation', status: 'Active' },
          { id: 'INPUT-001', name: 'Harmless Marker Reflected Parameter Injection Test', domain: 'Input Validation', risk: 'Medium', method: 'Marker Reflection Check', status: 'Active' },
          { id: 'API-001', name: 'CORS Header Permissiveness & Credentials Verification', domain: 'API Security', risk: 'Medium', method: 'Origin Header Injection', status: 'Active' },
          { id: 'CLIENT-001', name: 'Client-Side Secrets & LocalStorage Token Scanning', domain: 'Client-Side Security', risk: 'Medium', method: 'Storage Inspection', status: 'Active' },
          { id: 'COMM-001', name: 'Transport Layer TLS & Mixed Content Evaluation', domain: 'Secure Communication', risk: 'Low', method: 'TLS Handshake Check', status: 'Active' },
          { id: 'CODE-001', name: 'Static Repository Secret Fallback Pattern Scan', domain: 'Source Code Analysis', risk: 'Low', method: 'AST/Regex Pattern Match', status: 'Active' }
        ]);
      });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Security Test Library</h2>
        <p className="text-xs text-slate-400 font-mono">Catalog of active non-destructive security checks and scanner rules</p>
      </div>

      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Test ID</th>
                <th className="p-3">Test Name & Scope</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Execution Method</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {tests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-cyan-400">{t.id}</td>
                  <td className="p-3 font-semibold text-slate-100">{t.name}</td>
                  <td className="p-3 text-slate-400">{t.domain}</td>
                  <td className="p-3 text-amber-400 font-bold">{t.risk}</td>
                  <td className="p-3 text-slate-300">{t.method}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      ● {t.status}
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
