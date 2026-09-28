export interface User {
  username: string;
  role: string;
  full_name: string;
  token: string;
}

export interface Target {
  id: number;
  name: string;
  url: string;
  environment: string;
  description: string;
  authorization_confirmed: boolean;
  scope: string;
  excluded_paths: string;
  status: string;
  created_at: string;
}

export interface Finding {
  id: number;
  finding_id: string;
  assessment_id: string;
  target_id: number;
  title: string;
  domain: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  cvss: number;
  cvss_vector?: string;
  description: string;
  affected_component: string;
  evidence: string;
  reproduction_steps: string;
  poc: string;
  impact: string;
  remediation: string;
  references_json?: string;
  status: 'Open' | 'Confirmed' | 'False Positive' | 'Accepted Risk' | 'Remediated' | 'Retest Required';
  confidence: 'High' | 'Medium' | 'Low';
  discovered_at?: string;
}

export interface SecurityTest {
  id: string;
  name: string;
  domain: string;
  risk: string;
  method: string;
  status: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  username: string;
  action: string;
  target?: string;
  result: string;
}

export interface DashboardMetrics {
  overall_score: number;
  assessment_status: string;
  total_findings: number;
  critical_findings: number;
  high_findings: number;
  medium_findings: number;
  low_findings: number;
  remediated_count: number;
  tests_executed: number;
  tests_passed: number;
  tests_failed: number;
  domain_scores: Record<string, number>;
  recent_findings: Finding[];
}
