import React, { useState } from 'react';
import { AlertTriangle, Filter, Search, CheckCircle2, RotateCcw, ShieldCheck, ChevronRight, X } from 'lucide-react';
import { Finding } from '../types';

interface FindingsPageProps {
  findings: Finding[];
  selectedFinding: Finding | null;
  onSelectFinding: (f: Finding | null) => void;
  onUpdateStatus: (findingId: string, status: string) => Promise<void>;
  onRetest: (findingId: string) => Promise<any>;
}

export const FindingsPage: React.FC<FindingsPageProps> = ({
  findings,
  selectedFinding,
  onSelectFinding,
  onUpdateStatus,
  onRetest
}) => {
  const [filterDomain, setFilterDomain] = useState<string>('All');
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [retestMessage, setRetestMessage] = useState<string>('');

  const filtered = findings.filter((f) => {
    const matchesDomain = filterDomain === 'All' || f.domain === filterDomain;
    const matchesSeverity = filterSeverity === 'All' || f.severity === filterSeverity;
    const matchesSearch = f.title.toLowerCase().includes(searchTerm.toLowerCase()) || f.finding_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSeverity && matchesSearch;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  const handleRetestClick = async (findingId: string) => {
    setRetestMessage('Running automated retest check...');
    try {
      const res = await onRetest(findingId);
      setRetestMessage(res.evidence_after || 'Retest passed: Finding remediated successfully!');
    } catch (err: any) {
      setRetestMessage(`Retest failed: ${err.message}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Vulnerability Findings Intelligence</h2>
          <p className="text-xs text-slate-400">Validated security findings, safe proofs-of-concept, and remediation guidance</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search findings by ID or Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 w-64"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none"
            >
              <option value="All">All Security Domains</option>
              <option value="Authentication">Authentication</option>
              <option value="Session Management">Session Management</option>
              <option value="Authorization">Authorization</option>
              <option value="Input Validation">Input Validation</option>
              <option value="API Security">API Security</option>
              <option value="Client-Side Security">Client-Side Security</option>
              <option value="Secure Communication">Secure Communication</option>
              <option value="Source Code Analysis">Source Code Analysis</option>
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white outline-none"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">{filtered.length} Findings Displayed</span>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Findings List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map((f) => (
            <div
              key={f.finding_id}
              onClick={() => {
                onSelectFinding(f);
                setRetestMessage('');
              }}
              className={`glass-panel p-4 rounded-xl border transition cursor-pointer ${
                selectedFinding?.finding_id === f.finding_id
                  ? 'border-cyan-500 bg-cyan-500/5 shadow-lg shadow-cyan-500/10'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-xs">{f.finding_id}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSeverityBadge(f.severity)}`}>
                      {f.severity} (CVSS {f.cvss})
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {f.domain}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">{f.title}</h3>
                </div>

                <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${f.status === 'Remediated' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                  {f.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-2 line-clamp-2">{f.description}</p>
              <p className="text-[11px] font-mono text-slate-500 mt-2">Component: {f.affected_component}</p>
            </div>
          ))}
        </div>

        {/* Right Col: Detailed Finding Drawer */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4 h-[650px] overflow-y-auto">
          {selectedFinding ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="font-mono font-bold text-cyan-400 text-xs">{selectedFinding.finding_id}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedFinding.title}</h3>
                </div>
                <button
                  onClick={() => onSelectFinding(null)}
                  className="text-slate-400 hover:text-white p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status Update & Retest Controls */}
              <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status Management:</span>
                  <select
                    value={selectedFinding.status}
                    onChange={(e) => onUpdateStatus(selectedFinding.finding_id, e.target.value)}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white font-mono text-xs outline-none"
                  >
                    <option value="Open">Open</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="False Positive">False Positive</option>
                    <option value="Accepted Risk">Accepted Risk</option>
                    <option value="Remediated">Remediated</option>
                    <option value="Retest Required">Retest Required</option>
                  </select>
                </div>

                <button
                  onClick={() => handleRetestClick(selectedFinding.finding_id)}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-bold text-xs rounded transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5 stroke-[3]" />
                  <span>EXECUTE RETEST VERIFICATION</span>
                </button>

                {retestMessage && (
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-[11px] text-emerald-300 font-mono">
                    {retestMessage}
                  </div>
                )}
              </div>

              {/* Technical Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-300">Technical Description</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">{selectedFinding.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300">Safe Proof of Concept (PoC)</h4>
                  <pre className="bg-slate-950 p-3 rounded border border-slate-900 font-mono text-[11px] text-cyan-300 whitespace-pre-wrap mt-1">
                    {selectedFinding.poc}
                  </pre>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300">Business & Technical Impact</h4>
                  <p className="text-slate-400 mt-1 leading-relaxed">{selectedFinding.impact}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-300">Developer Remediation Guidance</h4>
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-300 font-mono text-[11px] mt-1 leading-relaxed">
                    {selectedFinding.remediation}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-2">
              <ShieldCheck className="w-10 h-10 stroke-1" />
              <p className="text-xs">Select a vulnerability finding from the list to view technical evidence, safe PoCs, and remediation controls.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
