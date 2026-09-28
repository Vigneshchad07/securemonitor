import React from 'react';
import { Shield, Activity, Target, Search, FileText, Code2, AlertTriangle, History, Settings, PlayCircle, Lock, LogOut } from 'lucide-react';
import { User } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  onLogout: () => void;
  onStartSihDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  onStartSihDemo
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'targets', label: 'Targets', icon: Target },
    { id: 'assessments', label: 'Assessments', icon: PlayCircle },
    { id: 'findings', label: 'Findings', icon: AlertTriangle },
    { id: 'api-security', label: 'API Security', icon: Search },
    { id: 'source-code', label: 'Source Code Analysis', icon: Code2 },
    { id: 'security-tests', label: 'Security Tests', icon: Shield },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'audit-trail', label: 'Audit Trail', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg shadow-lg shadow-cyan-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              SECUREMONITOR <span className="text-cyan-400 font-mono text-xs">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400">NTRO PS 26163 • SIH 2026</p>
          </div>
        </div>

        {/* SIH Demo Mode Trigger Button */}
        <div className="p-3">
          <button
            onClick={onStartSihDemo}
            className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 fill-slate-950" />
            <span>SIH DEMO MODE</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status & User Info */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* System Status Indicators */}
        <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1 font-mono">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-slate-400">Scanner Engine</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online
            </span>
          </div>
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-slate-400">Demo Target</span>
            <span>Local :3001</span>
          </div>
        </div>

        {/* User Card */}
        {user && (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user.full_name}</p>
                <p className="text-[10px] text-cyan-400 font-mono">{user.role}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-md hover:bg-rose-500/10 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
