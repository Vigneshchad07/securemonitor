import React, { useState } from 'react';
import { Shield, Lock, AlertCircle, LogIn } from 'lucide-react';
import { User } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('analyst');
  const [password, setPassword] = useState('analyst123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }

      const userData: User = await res.json();
      onLoginSuccess(userData);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-2xl border border-slate-800 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-xl w-14 h-14 mx-auto flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">SECUREMONITOR AI</h1>
          <p className="text-xs text-slate-400">Automated Security Assessment & Vulnerability Intelligence</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            SIH 2026 • PS 26163 • NTRO
          </span>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-mono focus:border-cyan-500 outline-none transition"
              placeholder="analyst / admin / viewer"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-white font-mono focus:border-cyan-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>AUTHENTICATE & ENTER PLATFORM</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center space-y-1.5 font-mono text-[11px] text-slate-500">
          <p className="font-semibold text-slate-400">Demo Role Credentials:</p>
          <p><span className="text-cyan-400">analyst</span> / analyst123 (Security Analyst)</p>
          <p><span className="text-cyan-400">admin</span> / admin123 (Lead Security Admin)</p>
        </div>
      </div>
    </div>
  );
};
