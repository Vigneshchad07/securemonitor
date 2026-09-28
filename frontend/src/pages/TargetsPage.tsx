import React, { useState } from 'react';
import { Target, ShieldCheck, AlertCircle, Plus, CheckCircle2, Lock } from 'lucide-react';
import { Target as TargetType } from '../types';

interface TargetsPageProps {
  targets: TargetType[];
  onAddTarget: (newTarget: any) => Promise<void>;
  onStartAssessmentForTarget: (targetId: number) => void;
}

export const TargetsPage: React.FC<TargetsPageProps> = ({
  targets,
  onAddTarget,
  onStartAssessmentForTarget
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: 'World Monitor Local Target',
    url: 'http://localhost:3001',
    environment: 'Local Staging Environment',
    description: 'Authorized local demo target of World Monitor application for NTRO SIH 2026 PS 26163',
    authorization_confirmed: true,
    scope: 'http://localhost:3001/*',
    excluded_paths: '/admin/destructive-mock'
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await onAddTarget(formData);
      setShowModal(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add target.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Target Management</h2>
          <p className="text-xs text-slate-400">Configure and verify authorized assessment targets</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>REGISTER NEW TARGET</span>
        </button>
      </div>

      {/* Security Enforcement Policy Banner */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 flex items-start gap-3">
        <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <p className="font-bold text-cyan-400">Target Restriction Security Policy Active</p>
          <p>
            SecureMonitor AI strictly enforces testing against localhost, 127.0.0.1, Docker containers, or authorized staging domains. External production scans without verified authorization are prohibited.
          </p>
        </div>
      </div>

      {/* Targets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {targets.map((t) => (
          <div key={t.id} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {t.environment}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{t.name}</h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{t.url}</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2">{t.description}</p>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Authorization:</span>
                <span className="text-emerald-400 font-bold">● Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Scope:</span>
                <span className="text-slate-200">{t.scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Excluded:</span>
                <span className="text-rose-400">{t.excluded_paths}</span>
              </div>
            </div>

            <button
              onClick={() => onStartAssessmentForTarget(t.id)}
              className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer shadow-md"
            >
              START NON-DESTRUCTIVE ASSESSMENT
            </button>
          </div>
        ))}
      </div>

      {/* Add Target Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-xl border border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-white">Register Target System</h3>

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-xs text-rose-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Target URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">Must be localhost, 127.0.0.1, Docker, or approved staging URL.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Environment</label>
                  <input
                    type="text"
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Scope</label>
                  <input
                    type="text"
                    value={formData.scope}
                    onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:border-cyan-500 outline-none"
                />
              </div>

              {/* Authorization Checkbox */}
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2">
                <input
                  type="checkbox"
                  id="auth_check"
                  required
                  checked={formData.authorization_confirmed}
                  onChange={(e) => setFormData({ ...formData, authorization_confirmed: e.target.checked })}
                  className="mt-0.5 accent-cyan-500 cursor-pointer"
                />
                <label htmlFor="auth_check" className="text-amber-300 font-semibold cursor-pointer">
                  I confirm explicit authorization to perform non-destructive security assessment against this target.
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded shadow-lg shadow-cyan-500/20 transition cursor-pointer"
                >
                  Register Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
