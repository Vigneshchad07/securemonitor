import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, FileJson, FileCode, Shield } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [generatingFormat, setGeneratingFormat] = useState<string | null>(null);

  const handleDownload = (format: string) => {
    setGeneratingFormat(format);
    setTimeout(() => {
      window.open(`/api/reports/generate?format=${format}`, '_blank');
      setGeneratingFormat(null);
    }, 800);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Security Assessment Report Generator</h2>
        <p className="text-xs text-slate-400 font-mono">Generate executive, developer, and compliance assessment reports in PDF, HTML, and JSON formats</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PDF Card */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4 text-center">
          <div className="p-4 bg-rose-500/10 text-rose-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-rose-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Executive PDF Report</h3>
            <p className="text-xs text-slate-400 mt-1">Full NTRO SIH 2026 assessment report with executive summary, domain readiness radar, safe PoCs, and developer remediation.</p>
          </div>

          <button
            onClick={() => handleDownload('pdf')}
            disabled={generatingFormat === 'pdf'}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{generatingFormat === 'pdf' ? 'GENERATING PDF...' : 'DOWNLOAD PDF REPORT'}</span>
          </button>
        </div>

        {/* HTML Card */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4 text-center">
          <div className="p-4 bg-cyan-500/10 text-cyan-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-cyan-500/20">
            <FileCode className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Interactive HTML Report</h3>
            <p className="text-xs text-slate-400 mt-1">Self-contained HTML report suitable for browser viewing, offline auditing, and team distribution.</p>
          </div>

          <button
            onClick={() => handleDownload('html')}
            disabled={generatingFormat === 'html'}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{generatingFormat === 'html' ? 'GENERATING HTML...' : 'VIEW HTML REPORT'}</span>
          </button>
        </div>

        {/* JSON Card */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4 text-center">
          <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full w-14 h-14 mx-auto flex items-center justify-center border border-amber-500/20">
            <FileJson className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Machine-Readable JSON</h3>
            <p className="text-xs text-slate-400 mt-1">Structured JSON findings export for SIEM integration, CI/CD pipelines, and automated reporting.</p>
          </div>

          <button
            onClick={() => handleDownload('json')}
            disabled={generatingFormat === 'json'}
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer shadow-lg flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{generatingFormat === 'json' ? 'EXPORTING JSON...' : 'EXPORT JSON DATA'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
