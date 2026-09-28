import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TargetsPage } from './pages/TargetsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { FindingsPage } from './pages/FindingsPage';
import { ApiSecurityPage } from './pages/ApiSecurityPage';
import { SourceCodePage } from './pages/SourceCodePage';
import { SecurityTestsPage } from './pages/SecurityTestsPage';
import { ReportsPage } from './pages/ReportsPage';
import { AuditTrailPage } from './pages/AuditTrailPage';
import { SettingsPage } from './pages/SettingsPage';
import { User, Target, Finding, DashboardMetrics } from './types';

export function App() {
  const [user, setUser] = useState<User | null>({
    username: 'analyst',
    role: 'Security Analyst',
    full_name: 'NTRO Security Analyst',
    token: 'mock_jwt_token_analyst'
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [targets, setTargets] = useState<Target[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // Fetch Dashboard Metrics
  const fetchDashboard = () => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error('Dashboard fetch error:', err));
  };

  // Fetch Targets List
  const fetchTargets = () => {
    fetch('/api/targets')
      .then((res) => res.json())
      .then((data) => setTargets(data))
      .catch((err) => console.error('Targets fetch error:', err));
  };

  // Fetch Findings List
  const fetchFindings = () => {
    fetch('/api/findings')
      .then((res) => res.json())
      .then((data) => {
        setFindings(data);
        if (data.length > 0 && !selectedFinding) {
          setSelectedFinding(data[0]);
        }
      })
      .catch((err) => console.error('Findings fetch error:', err));
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
      fetchTargets();
      fetchFindings();
    }
  }, [user]);

  const handleAddTarget = async (newTargetData: any) => {
    const res = await fetch('/api/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTargetData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to add target');
    }

    fetchTargets();
  };

  const handleRunScan = async (scanConfig: any) => {
    const res = await fetch('/api/assessments/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanConfig)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Assessment failed');
    }

    const data = await res.json();
    fetchDashboard();
    fetchFindings();
    return data;
  };

  const handleUpdateFindingStatus = async (findingId: string, status: string) => {
    await fetch(`/api/findings/${findingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchFindings();
    fetchDashboard();
  };

  const handleRetestFinding = async (findingId: string) => {
    const res = await fetch(`/api/findings/${findingId}/retest`, {
      method: 'POST'
    });
    const data = await res.json();
    fetchFindings();
    fetchDashboard();
    return data;
  };

  // Guided 11-step SIH 2026 Presentation Demo Mode
  const handleStartSihDemo = async () => {
    setCurrentTab('assessments');
    setTimeout(() => {
      handleRunScan({
        target_id: targets[0]?.id || 1,
        mode: 'Safe Active',
        domains: ['All'],
        rate_limit: 'Medium',
        timeout: 5,
        max_requests: 100
      }).then(() => {
        setTimeout(() => setCurrentTab('findings'), 1500);
      });
    }, 500);
  };

  if (!user) {
    return <LoginPage onLoginSuccess={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onLogout={() => setUser(null)}
        onStartSihDemo={handleStartSihDemo}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar currentTab={currentTab} />

        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardPage
              metrics={metrics}
              onSelectFinding={(f) => {
                setSelectedFinding(f);
                setCurrentTab('findings');
              }}
              onStartAssessment={() => setCurrentTab('assessments')}
            />
          )}

          {currentTab === 'targets' && (
            <TargetsPage
              targets={targets}
              onAddTarget={handleAddTarget}
              onStartAssessmentForTarget={(id) => {
                setCurrentTab('assessments');
              }}
            />
          )}

          {currentTab === 'assessments' && (
            <AssessmentPage
              targets={targets}
              onRunScan={handleRunScan}
            />
          )}

          {currentTab === 'findings' && (
            <FindingsPage
              findings={findings}
              selectedFinding={selectedFinding}
              onSelectFinding={setSelectedFinding}
              onUpdateStatus={handleUpdateFindingStatus}
              onRetest={handleRetestFinding}
            />
          )}

          {currentTab === 'api-security' && <ApiSecurityPage />}
          {currentTab === 'source-code' && <SourceCodePage />}
          {currentTab === 'security-tests' && <SecurityTestsPage />}
          {currentTab === 'reports' && <ReportsPage />}
          {currentTab === 'audit-trail' && <AuditTrailPage />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}

export default App;
