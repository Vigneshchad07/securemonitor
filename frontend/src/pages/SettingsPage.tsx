import React from 'react';
import { Settings, Shield, Lock, Sliders, AlertTriangle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Platform Security Policy & Scanner Settings</h2>
        <p className="text-xs text-slate-400 font-mono">Configure global safety boundaries, rate limits, and reporting preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Target Policy Settings */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">Target Restriction Enforcement</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="accent-cyan-500" />
                <span>Enforce Local/Staging Domain Whitelist</span>
              </label>
              <p className="text-[11px] text-slate-400 pl-5">
                Restricts assessment execution strictly to localhost, 127.0.0.1, Docker, or verified staging targets.
              </p>
            </div>

            <div className="p-3 bg-slate-900/60 rounded border border-slate-800 space-y-2">
              <label className="flex items-center gap-2 text-slate-300 font-semibold cursor-pointer">
                <input type="checkbox" defaultChecked disabled className="accent-cyan-500" />
                <span>Require Explicit Authorization Checkbox</span>
              </label>
              <p className="text-[11px] text-slate-400 pl-5">
                Blocks scan execution unless the analyst confirms explicit authorization.
              </p>
            </div>
          </div>
        </div>

        {/* Scanner Engine Limits */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-200">Scanner Engine Limits</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1">Default Request Rate Limit</label>
              <select defaultValue="Medium" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none">
                <option value="Low">Low (10 req/s)</option>
                <option value="Medium">Medium (25 req/s)</option>
                <option value="High">High (50 req/s)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Max Scan Duration Timeout</label>
              <select defaultValue="300" className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white outline-none">
                <option value="120">2 Minutes</option>
                <option value="300">5 Minutes</option>
                <option value="600">10 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
