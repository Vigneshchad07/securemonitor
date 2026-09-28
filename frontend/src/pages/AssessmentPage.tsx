import React, { useState } from 'react';
import { Play, Shield, CheckSquare, Clock, AlertTriangle, Terminal, CheckCircle2 } from 'lucide-react';
import { Target } from '../types';

interface AssessmentPageProps {
  targets: Target[];
  selectedTargetId?: number;
  onRunScan: (config: any) => Promise<any>;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  targets,
  selectedTargetId,
  onRunScan
}) => {
  const [currentTargetId, setCurrentTargetId] = useState<number>(selectedTargetId || (targets[0]?.id || 1));
  const [mode, setMode] = useState('Safe Active');
  const [rateLimit, setRateLimit] = useState('Medium');
  const [timeout, setTimeoutVal] = useState(5);
  const [isScanning, setIsScanning] = useState(false);
  const [scanConsoleLogs, setScanConsoleLogs] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const availableDomains = [
    'Authentication',
    'Session Management',
    'Authorization',
    'Input Validation',
    'API Security',
    'Client-Side Security',
    'Secure Communication',
    'Data Storage & Privacy',
    'Source Code Analysis'
  ];

  const [selectedDomains, setSelectedDomains] = useState<string[]>(availableDomains);

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleStartScan = async () => {
    setShowConfirmModal(false);
    setIsScanning(true);
    setScanConsoleLogs([
      `[${new Date().toLocaleTimeString()}] Initializing SecureMonitor AI Assessment Engine...`,
      `[${new Date().toLocaleTimeString()}] Enforcing Non-Destructive Safe Active Baseline...`,
      `[${new Date().toLocaleTimeString()}] Target Reachability Verification: http://localhost:3001`
    ]);

    try {
      const res = await onRunScan({
        target_id: currentTargetId,
        mode,
        domains: selectedDomains,
        rate_limit: rateLimit,
        timeout,
        max_requests: 100
      });

      if (res.console_logs) {
        setScanConsoleLogs(res.console_logs);
      }
    } catch (err: any) {
      setScanConsoleLogs((prev) => [...prev, `[ERROR] Scan execution encountered error: ${err.message}`]);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Security Assessment Setup</h2>
          <p className="text-xs text-slate-400">Configure safe, rate-limited assessment parameters for the target</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-2 space-y-5">
          {/* Target Selector */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-200">1. Target Environment Selection</h3>
            <select
              value={currentTargetId}
              onChange={(e) => setCurrentTargetId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-cyan-500"
            >
              {targets.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.url}) - {t.environment}
                </option>
              ))}
            </select>
          </div>

          {/* Security Domains Grid */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200">2. Security Analysis Domains</h3>
              <button
                type="button"
                onClick={() => setSelectedDomains(selectedDomains.length === availableDomains.length ? [] : availableDomains)}
                className="text-xs text-cyan-400 hover:underline font-mono"
              >
                {selectedDomains.length === availableDomains.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {availableDomains.map((dom) => {
                const isSelected = selectedDomains.includes(dom);
                return (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => toggleDomain(dom)}
                    className={`p-3 rounded-lg border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{dom}</span>
                    <CheckSquare className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Execution Settings */}
          <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">3. Assessment Engine Mode & Controls</h3>

            <div className="grid grid-cols-3 gap-3">
              {['Safe Passive', 'Safe Active', 'Demo Vulnerability Validation'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`p-3 rounded-lg border text-center text-xs font-bold transition cursor-pointer ${
                    mode === m
                      ? 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 border-cyan-400 shadow-md'
                      : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Rate Limit Throttle</label>
                <select
                  value={rateLimit}
                  onChange={(e) => setRateLimit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono outline-none"
                >
                  <option value="Low">Low (10 req/sec)</option>
                  <option value="Medium">Medium (25 req/sec)</option>
                  <option value="High">High (50 req/sec)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Request Timeout</label>
                <select
                  value={timeout}
                  onChange={(e) => setTimeoutVal(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white font-mono outline-none"
                >
                  <option value={3}>3 Seconds</option>
                  <option value={5}>5 Seconds</option>
                  <option value={10}>10 Seconds</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            disabled={isScanning}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            <span>{isScanning ? 'ASSESSMENT IN PROGRESS...' : 'EXECUTE SAFE ASSESSMENT'}</span>
          </button>
        </div>

        {/* Right Column: Live Console Output */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-200 font-mono">Live Assessment Console</h3>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="mt-3 bg-slate-950 p-3 rounded-lg border border-slate-900 font-mono text-[11px] text-emerald-400 h-[400px] overflow-y-auto space-y-1.5 leading-relaxed">
              {scanConsoleLogs.length === 0 ? (
                <p className="text-slate-600 italic">Ready to start assessment. Logs will stream live here.</p>
              ) : (
                scanConsoleLogs.map((log, i) => (
                  <p key={i} className="whitespace-pre-wrap">{log}</p>
                ))
              )}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between">
            <span>Mode: {mode}</span>
            <span>Target: http://localhost:3001</span>
          </div>
        </div>
      </div>

      {/* Non-Destructive Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-xl border border-slate-700 space-y-4 text-center">
            <Shield className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Confirm Assessment Execution</h3>

            <p className="text-xs text-slate-300">
              This assessment is restricted to the configured authorized target (<span className="font-mono text-cyan-400">http://localhost:3001</span>) and uses strictly non-destructive validation techniques.
            </p>

            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-[11px] text-cyan-300 font-mono text-left">
              ✓ Read-Only & Non-Destructive<br />
              ✓ Rate Throttled Rate Limits<br />
              ✓ Safe Harmless Test Markers<br />
              ✓ Comprehensive Audit Logged
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartScan}
                className="w-1/2 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded shadow-lg shadow-cyan-500/20 transition cursor-pointer"
              >
                Start Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
