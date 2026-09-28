import React from 'react';
import { Code2, FolderGit2, AlertTriangle, FileCode, CheckCircle2 } from 'lucide-react';

export const SourceCodePage: React.FC = () => {
  const codeFindings = [
    {
      file: 'src/config/default.json',
      line: 42,
      pattern: "DEFAULT_SECRET_KEY = 'demo_secret_key_change_me'",
      confidence: 'High',
      risk: 'Fallback Hardcoded Secret Key',
      recommendation: 'Enforce secret injection strictly via process.env variables without weak static string fallbacks.'
    },
    {
      file: 'src/utils/storage.ts',
      line: 88,
      pattern: "window.localStorage.setItem('auth_token', token)",
      confidence: 'High',
      risk: 'Sensitive Token Client Storage',
      recommendation: 'Migrate session tokens to HttpOnly, Secure, SameSite cookies to mitigate XSS theft.'
    },
    {
      file: 'src/components/SearchBox.tsx',
      line: 114,
      pattern: 'dangerouslySetInnerHTML={{ __html: query }}',
      confidence: 'Medium',
      risk: 'Unsanitized HTML Element Injection',
      recommendation: 'Utilize React JSX automatic encoding or DOMPurify before dangerously setting inner HTML.'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Static Source Code Analysis</h2>
          <p className="text-xs text-slate-400 font-mono">AST & regex pattern match findings against local clone of World Monitor codebase (https://github.com/koala73/worldmonitor)</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono">
          <FolderGit2 className="w-4 h-4 text-cyan-400" />
          <span>Local Repo: ./worldmonitor</span>
        </div>
      </div>

      <div className="space-y-4">
        {codeFindings.map((cf, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-mono font-bold text-white text-xs">{cf.file}</span>
                <span className="text-xs font-mono text-slate-400">Line {cf.line}</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${cf.confidence === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'}`}>
                Confidence: {cf.confidence}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-rose-400 font-mono">{cf.risk}</p>
              <pre className="bg-slate-950 p-3 rounded border border-slate-900 font-mono text-[11px] text-amber-300 mt-1">
                {cf.pattern}
              </pre>
            </div>

            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-xs text-cyan-300 font-mono">
              <span className="font-bold text-white">Developer Action: </span>{cf.recommendation}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
