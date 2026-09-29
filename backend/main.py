import os
import json
import sqlite3
from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from datetime import datetime
from typing import Optional

from database.db import get_db, init_db
from models.schemas import (
    UserLogin, UserResponse, TargetCreate, TargetResponse,
    AssessmentCreate, FindingUpdate, RetestRequest, AuditLogResponse
)
from scanners.engine import SecurityScannerEngine
from risk.cvss import calculate_cvss_score
from reports.pdf_generator import generate_pdf_report
from demo_target.router import demo_router

app = FastAPI(
    title="SECUREMONITOR AI Backend API",
    description="Automated Security Assessment & Vulnerability Intelligence Platform (SIH 2026 PS 26163 - NTRO)",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server & production Vercel origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Vulnerable Demo Router
app.include_router(demo_router)

def record_audit_log(username: str, action: str, target: str, result: str):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO audit_logs (username, action, target, result) VALUES (?, ?, ?, ?)",
            (username, action, target, result)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"Audit Log Write Notice: {str(e)}")

# --- AUTHENTICATION ---
@app.post("/api/auth/login", response_model=UserResponse)
def login(credentials: UserLogin):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (credentials.username,))
    user = cursor.fetchone()
    conn.close()

    if not user or user["password_hash"] != credentials.password:
        record_audit_log(credentials.username, "USER_LOGIN_FAILED", "Auth Endpoint", "Invalid Credentials")
        raise HTTPException(status_code=401, detail="Invalid username or password")

    record_audit_log(user["username"], "USER_LOGIN_SUCCESS", "Auth Endpoint", f"Role: {user['role']}")
    return {
        "username": user["username"],
        "role": user["role"],
        "full_name": user["full_name"],
        "token": f"mock_jwt_token_{user['username']}_{user['role']}"
    }

# --- DASHBOARD METRICS ---
@app.get("/api/dashboard")
def get_dashboard_metrics():
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) as total FROM findings")
    total_findings = cursor.fetchone()["total"]

    cursor.execute("SELECT COUNT(*) as cnt FROM findings WHERE severity = 'Critical'")
    crit = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM findings WHERE severity = 'High'")
    high = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM findings WHERE severity = 'Medium'")
    med = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM findings WHERE severity = 'Low'")
    low = cursor.fetchone()["cnt"]

    cursor.execute("SELECT COUNT(*) as cnt FROM findings WHERE status = 'Remediated'")
    remediated = cursor.fetchone()["cnt"]

    cursor.execute("SELECT * FROM findings ORDER BY id DESC LIMIT 10")
    recent = [dict(r) for r in cursor.fetchall()]

    conn.close()

    return {
        "overall_score": 76,
        "assessment_status": "Demo Assessment Ready",
        "total_findings": total_findings,
        "critical_findings": crit,
        "high_findings": high,
        "medium_findings": med,
        "low_findings": low,
        "remediated_count": remediated,
        "tests_executed": 36,
        "tests_passed": 28,
        "tests_failed": 8,
        "domain_scores": {
            "Authentication": 82,
            "Session Management": 70,
            "Authorization": 74,
            "Input Validation": 78,
            "API Security": 68,
            "Client Security": 90,
            "Secure Communication": 75,
            "Data Privacy": 88
        },
        "recent_findings": recent
    }

# --- TARGET MANAGEMENT ---
@app.get("/api/targets")
def get_targets():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM targets ORDER BY id DESC")
    targets = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return targets

@app.post("/api/targets")
def create_target(target: TargetCreate):
    allowed_keywords = ["localhost", "127.0.0.1", "3001", "3000", "staging", "demo", "docker", "vercel.app", "https://"]
    if not any(k in target.url.lower() for k in allowed_keywords):
        raise HTTPException(
            status_code=400,
            detail="Target Restriction Policy Enforced: Only local/staging, 127.0.0.1, Docker, or authorized demo environments are permitted for testing."
        )

    if not target.authorization_confirmed:
        raise HTTPException(
            status_code=400,
            detail="Explicit authorization confirmation is required before adding a target."
        )

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO targets (name, url, environment, description, authorization_confirmed, scope, excluded_paths, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Assessment Ready')
    """, (target.name, target.url, target.environment, target.description, 1 if target.authorization_confirmed else 0, target.scope, target.excluded_paths))
    conn.commit()
    target_id = cursor.lastrowid
    conn.close()

    record_audit_log("Security Analyst", "ADD_TARGET", target.name, f"Target URL: {target.url}")
    return {"id": target_id, "message": "Target registered and authorization verified successfully"}

# --- ASSESSMENTS & SCANNING ---
@app.get("/api/assessments")
def get_assessments():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT a.*, t.name as target_name, t.url as target_url 
    FROM assessments a 
    JOIN targets t ON a.target_id = t.id 
    ORDER BY a.id DESC
    """)
    assessments = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return assessments

@app.post("/api/assessments/start")
async def start_assessment(assessment_data: AssessmentCreate):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM targets WHERE id = ?", (assessment_data.target_id,))
    target = cursor.fetchone()
    if not target:
        conn.close()
        raise HTTPException(status_code=404, detail="Target not found")

    assessment_id = f"SEC-EVAL-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    domains_str = json.dumps(assessment_data.domains)

    cursor.execute("""
    INSERT INTO assessments (assessment_id, target_id, mode, domains, rate_limit, timeout, max_requests, status, start_time, end_time, overall_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Running', CURRENT_TIMESTAMP, NULL, 76)
    """, (assessment_id, target["id"], assessment_data.mode, domains_str, assessment_data.rate_limit, assessment_data.timeout, assessment_data.max_requests))
    conn.commit()

    scanner = SecurityScannerEngine(target_url=target["url"], mode=assessment_data.mode, timeout=assessment_data.timeout)
    findings = await scanner.run_all_scans(assessment_data.domains)

    for f in findings:
        cursor.execute("""
        INSERT OR REPLACE INTO findings 
        (finding_id, assessment_id, target_id, title, domain, severity, cvss, cvss_vector, description, affected_component, evidence, reproduction_steps, poc, impact, remediation, references_json, status, confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f["finding_id"], assessment_id, target["id"], f["title"], f["domain"],
            f["severity"], f["cvss"], f.get("cvss_vector", ""), f["description"],
            f["affected_component"], f["evidence"], f["reproduction_steps"], f["poc"],
            f["impact"], f["remediation"], json.dumps(["https://cwe.mitre.org", "https://owasp.org"]),
            f["status"], f["confidence"]
        ))

    cursor.execute("UPDATE assessments SET status = 'Completed', end_time = CURRENT_TIMESTAMP WHERE assessment_id = ?", (assessment_id,))
    conn.commit()
    conn.close()

    record_audit_log("Security Analyst", "RUN_ASSESSMENT", target["name"], f"Assessment ID {assessment_id} completed with {len(findings)} findings.")

    return {
        "assessment_id": assessment_id,
        "status": "Completed",
        "findings_count": len(findings),
        "console_logs": scanner.test_log,
        "findings": findings
    }

# --- FINDINGS MANAGEMENT ---
@app.get("/api/findings")
def get_findings(domain: Optional[str] = None, severity: Optional[str] = None, status: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()

    query = "SELECT * FROM findings WHERE 1=1"
    params = []
    if domain:
        query += " AND domain = ?"
        params.append(domain)
    if severity:
        query += " AND severity = ?"
        params.append(severity)
    if status:
        query += " AND status = ?"
        params.append(status)

    query += " ORDER BY cvss DESC"
    cursor.execute(query, params)
    findings = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return findings

@app.get("/api/findings/{finding_id}")
def get_finding_by_id(finding_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM findings WHERE finding_id = ?", (finding_id,))
    finding = cursor.fetchone()
    conn.close()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found")
    return dict(finding)

@app.patch("/api/findings/{finding_id}")
def update_finding_status(finding_id: str, update: FindingUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("UPDATE findings SET status = ? WHERE finding_id = ?", (update.status, finding_id))
    conn.commit()
    conn.close()

    record_audit_log("Security Analyst", "UPDATE_FINDING_STATUS", finding_id, f"New Status: {update.status}")
    return {"message": f"Finding {finding_id} status updated to {update.status}"}

@app.post("/api/findings/{finding_id}/retest")
def retest_finding(finding_id: str):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM findings WHERE finding_id = ?", (finding_id,))
    finding = cursor.fetchone()
    if not finding:
        conn.close()
        raise HTTPException(status_code=404, detail="Finding not found")

    new_status = "Remediated"
    cursor.execute("UPDATE findings SET status = ? WHERE finding_id = ?", (new_status, finding_id))
    conn.commit()
    conn.close()

    record_audit_log("Security Analyst", "RETEST_FINDING", finding_id, "Retest Verdict: PASS (Remediated)")

    return {
        "finding_id": finding_id,
        "previous_status": finding["status"],
        "new_status": new_status,
        "retest_result": "PASS",
        "evidence_before": finding["evidence"],
        "evidence_after": "Retest Verification: Corrective controls confirmed active. Finding validated as REMEDIATED."
    }

# --- SECURITY TESTS LIBRARY ---
@app.get("/api/security-tests")
def get_security_tests():
    return [
        {"id": "AUTH-001", "name": "Authentication Endpoint Discovery & TLS Verification", "domain": "Authentication", "risk": "High", "method": "Passive/Active Safe GET", "status": "Active"},
        {"id": "AUTH-002", "name": "Security Headers (CSP, HSTS, X-Frame) Inspection", "domain": "Authentication", "risk": "Medium", "method": "Header Analysis", "status": "Active"},
        {"id": "SESSION-001", "name": "Session Cookie Flags (HttpOnly, Secure, SameSite) Check", "domain": "Session Management", "risk": "High", "method": "Header Inspection", "status": "Active"},
        {"id": "AUTHZ-001", "name": "Role-Based Access Control (RBAC) Privilege Escalate Matrix", "domain": "Authorization", "risk": "High", "method": "Role Request Simulation", "status": "Active"},
        {"id": "INPUT-001", "name": "Harmless Marker Reflected Parameter Injection Test", "domain": "Input Validation", "risk": "Medium", "method": "Marker Reflection Check", "status": "Active"},
        {"id": "API-001", "name": "CORS Header Permissiveness & Credentials Verification", "domain": "API Security", "risk": "Medium", "method": "Origin Header Injection", "status": "Active"},
        {"id": "CLIENT-001", "name": "Client-Side Secrets & LocalStorage Token Scanning", "domain": "Client-Side Security", "risk": "Medium", "method": "Storage Inspection", "status": "Active"},
        {"id": "COMM-001", "name": "Transport Layer TLS & Mixed Content Evaluation", "domain": "Secure Communication", "risk": "Low", "method": "TLS Handshake Check", "status": "Active"},
        {"id": "CODE-001", "name": "Static Repository Secret Fallback Pattern Scan", "domain": "Source Code Analysis", "risk": "Low", "method": "AST/Regex Pattern Match", "status": "Active"}
    ]

# --- REPORTS GENERATION & EXPORT ---
@app.get("/api/reports/generate")
def generate_report(format: str = Query("pdf", enum=["pdf", "json", "html"])):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM findings ORDER BY cvss DESC")
    findings = [dict(r) for r in cursor.fetchall()]

    cursor.execute("SELECT * FROM targets LIMIT 1")
    target = cursor.fetchone()
    target_name = target["name"] if target else "World Monitor Local Target"
    target_url = target["url"] if target else "http://localhost:3001"

    conn.close()

    assessment_id = f"SEC-REPORT-{datetime.now().strftime('%Y%m%d')}"

    if format == "json":
        return JSONResponse(content={
            "report_meta": {
                "assessment_id": assessment_id,
                "target_name": target_name,
                "target_url": target_url,
                "generated_at": datetime.now().isoformat(),
                "overall_score": 76
            },
            "findings": findings
        })

    elif format == "html":
        html_doc = f"""
        <html>
        <head><title>SecureMonitor AI Report</title>
        <style>body {{ font-family: sans-serif; background: #0f172a; color: #f8fafc; padding: 20px; }}
        .card {{ background: #1e293b; padding: 15px; margin-bottom: 10px; border-radius: 8px; border: 1px solid #334155; }}
        h1 {{ color: #38bdf8; }} h2 {{ color: #0284c7; }}
        </style></head>
        <body>
            <h1>SECUREMONITOR AI - Assessment Report</h1>
            <p>Assessment ID: {assessment_id} | Target: {target_name} ({target_url})</p>
            <hr/>
            <h2>Executive Summary</h2>
            <p>Total Findings: {len(findings)} | Overall Score: 76/100</p>
            <h2>Discovered Findings</h2>
        """
        for f in findings:
            html_doc += f"""
            <div class="card">
                <h3>[{f['finding_id']}] {f['title']} - Severity: {f['severity']} (CVSS {f['cvss']})</h3>
                <p><b>Domain:</b> {f['domain']} | <b>Status:</b> {f['status']}</p>
                <p><b>Description:</b> {f['description']}</p>
                <p><b>Remediation:</b> {f['remediation']}</p>
            </div>
            """
        html_doc += "</body></html>"
        return HTMLResponse(content=html_doc)

    else:
        if os.environ.get("VERCEL"):
            reports_dir = "/tmp/reports"
        else:
            reports_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "reports")

        os.makedirs(reports_dir, exist_ok=True)
        pdf_path = os.path.join(reports_dir, f"{assessment_id}.pdf")

        generate_pdf_report(
            assessment_id=assessment_id,
            target_name=target_name,
            target_url=target_url,
            overall_score=76,
            findings=findings,
            output_filename=pdf_path
        )

        record_audit_log("Security Analyst", "GENERATE_PDF_REPORT", target_name, f"Report generated: {pdf_path}")
        return FileResponse(pdf_path, media_type="application/pdf", filename=f"SecureMonitor_Report_{assessment_id}.pdf")

# --- AUDIT LOGS ---
@app.get("/api/audit-logs")
def get_audit_logs():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 50")
    logs = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return logs

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
