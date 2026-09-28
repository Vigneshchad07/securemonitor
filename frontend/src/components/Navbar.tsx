import React from 'react';
import { ShieldCheck, Lock, Radio, Bell } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab }) => {
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Security Executive Dashboard';
      case 'targets': return 'Target Environment Management';
      case 'assessments': return 'Security Assessment Launcher';
      case 'findings': return 'Vulnerability Findings Intelligence';
      case 'api-security': return 'API Security & CORS Analyzer';
      case 'source-code': return 'Static Source Code Security Analysis';
      case 'security-tests': return 'Security Scanner Test Library';
      case 'reports': return 'Assessment Report Generator';
      case 'audit-trail': return 'System Audit Trail & Compliance Log';
      case 'settings': return 'Platform Security Policy Settings';
      default: return 'SecureMonitor AI';
    }
  };

  return (
    <header className="h-16 glass-panel border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-slate-100">{getTabTitle(currentTab)}</h2>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
          STAGING / LOCAL TARGET
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Mandatory Security Banner */}
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AUTHORIZED TESTING ONLY • NON-DESTRUCTIVE</span>
        </div>

        <div className="h-4 w-[1px] bg-slate-800"></div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-1.5 right-1.5 animate-ping"></span>
          </button>
        </div>
      </div>
    </header>
  );
};
