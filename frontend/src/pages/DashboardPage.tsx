import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Shield, AlertOctagon, AlertTriangle, AlertCircle, Info, CheckCircle2, PlayCircle, ExternalLink } from 'lucide-react';
import { DashboardMetrics, Finding } from '../types';

interface DashboardPageProps {
  metrics: DashboardMetrics | null;
  onSelectFinding: (finding: Finding) => void;
  onStartAssessment: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  metrics,
  onSelectFinding,
  onStartAssessment
}) => {
  if (!metrics) return <div className="p-8 text-center text-slate-400">Loading security dashboard metrics...</div>;

  const riskPieData = [
    { name: 'Critical', value: metrics.critical_findings, color: '#dc2626' },
    { name: 'High', value: metrics.high_findings, color: '#ea580c' },
    { name: 'Medium', value: metrics.medium_findings, color: '#d97706' },
    { name: 'Low', value: metrics.low_findings, color: '#16a34a' }
  ];

  const domainRadarData = Object.entries(metrics.domain_scores).map(([domain, score]) => ({
    domain,
    score
  }));

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'High': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner Alert & Assessment Trigger */}
      <div className="glass-panel p-5 rounded-xl flex items-center justify-between border-l-4 border-l-cyan-500">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
              DEMO ASSESSMENT
            </span>
            <h2 className="text-lg font-bold text-white">World Monitor Local Target Security Baseline</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authorized automated evaluation for NTRO SIH 2026 Problem Statement 26163 (http://localhost:3001)
          </p>
        </div>
        <button
          onClick={onStartAssessment}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition cursor-pointer"
        >
          <PlayCircle className="w-4 h-4 fill-slate-950" />
          <span>RUN NEW ASSESSMENT</span>
        </button>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Security Score */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Posture Score</span>
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.overall_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Good</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Calculated from 36 non-destructive checks</p>
        </div>

        {/* Critical & High Findings */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical / High Vulnerabilities</span>
            <AlertOctagon className="w-5 h-5 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-rose-400 font-mono">{metrics.critical_findings + metrics.high_findings}</span>
            <div className="text-[11px] space-x-2 font-mono">
              <span className="text-rose-400">{metrics.critical_findings} Critical</span>
              <span className="text-orange-400">{metrics.high_findings} High</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Requires developer remediation</p>
        </div>

        {/* Medium & Low Findings */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Medium / Low Risk</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-amber-400 font-mono">{metrics.medium_findings + metrics.low_findings}</span>
            <div className="text-[11px] space-x-2 font-mono">
              <span className="text-amber-400">{metrics.medium_findings} Med</span>
              <span className="text-emerald-400">{metrics.low_findings} Low</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">Header & configuration advisories</p>
        </div>

        {/* Tests Executed & Passed */}
        <div className="glass-card p-4 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tests Completed</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">{metrics.tests_executed}</span>
            <span className="text-xs text-emerald-400 font-mono">{metrics.tests_passed} Passed</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">{metrics.remediated_count} vulnerabilities remediated</p>
        </div>
      </div>

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-1">Vulnerability Risk Severity Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Breakdown of findings by CVSS Severity Rating</p>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
            {riskPieData.map((item) => (
              <div key={item.name} className="p-2 rounded bg-slate-900/50 border border-slate-800">
                <span className="block text-[10px] uppercase font-bold text-slate-400">{item.name}</span>
                <span className="text-sm font-bold font-mono" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Domain Radar Chart */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800">
          <h3 className="text-sm font-bold text-slate-200 mb-1">Security Domain Score Analysis</h3>
          <p className="text-xs text-slate-400 mb-4">Domain security readiness (%)</p>

          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainRadarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="domain" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Domain Security Score" dataKey="score" stroke="#0284c7" fill="#0284c7" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Findings Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-200">Discovered Vulnerabilities & Security Findings</h3>
            <p className="text-xs text-slate-400">Validated non-destructive security findings for local target</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">{metrics.recent_findings.length} Findings Active</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Vulnerability Title</th>
                <th className="p-3">Domain</th>
                <th className="p-3">Severity</th>
                <th className="p-3">CVSS</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {metrics.recent_findings.map((f) => (
                <tr key={f.finding_id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono font-bold text-cyan-400">{f.finding_id}</td>
                  <td className="p-3 font-semibold text-slate-100">{f.title}</td>
                  <td className="p-3 text-slate-400">{f.domain}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getSeverityBadge(f.severity)}`}>
                      {f.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold">{f.cvss}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${f.status === 'Remediated' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectFinding(f)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-cyan-500/20 text-cyan-400 rounded border border-slate-700 hover:border-cyan-500/40 font-mono text-[11px] transition cursor-pointer flex items-center gap-1 ml-auto"
                    >
                      <span>View Safe PoC</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
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
