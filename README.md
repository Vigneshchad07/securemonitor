# SECUREMONITOR AI
## Automated Security Assessment & Vulnerability Intelligence Platform
### Smart India Hackathon 2026 • Problem Statement 26163 • NTRO

---

## Executive Overview
**SECUREMONITOR AI** is an enterprise-grade, automated security assessment and vulnerability intelligence platform built specifically for **Smart India Hackathon 2026 Problem Statement 26163 (National Technical Research Organisation - NTRO)**.

The platform provides authorized security analysts with a safe, non-destructive, rate-limited framework to assess local and staging instances of mission-critical web applications (such as the reference **World Monitor** application at `http://localhost:3000` / `http://localhost:3001`).

---

## Key Features & Capabilities

1. **Target Authorization & Scope Control**:
   - Enforces target restrictions (`localhost`, `127.0.0.1`, Docker containers, staging domains).
   - Requires explicit authorization confirmation prior to scan initialization.

2. **Modular Non-Destructive Security Scanner Engine**:
   - **Authentication**: Inspects CSP headers, HSTS, authentication endpoint consistency.
   - **Session Management**: Verifies `HttpOnly`, `Secure`, and `SameSite` cookie security flags.
   - **Authorization (RBAC)**: Validates role access control matrix (`Admin`, `Analyst`, `User`).
   - **Input Validation**: Uses safe markers (`SECURITY_TEST_MARKER_26163`) for reflected input testing.
   - **API Security & CORS**: Analyzes origin headers, credentials flags, and API route security.
   - **Client-Side Security**: Detects sensitive tokens stored in `window.localStorage`.
   - **Secure Communication**: Evaluates transport layer TLS/HTTPS configuration.
   - **Static Source Code Analysis**: AST pattern scanning against local repository clones.

3. **CVSS v3.1 Risk Metric Engine**:
   - Calculates exact CVSS v3.1 scores (0.0 to 10.0) based on Attack Vector, Complexity, Privileges, Interaction, Scope, and CIA Triad Impact.

4. **Safe Proof-of-Concept (PoC) & Remediation**:
   - Provides reproducible, non-destructive steps and developer-focused code remediation.

5. **Automated Retest & Lifecycle Verification**:
   - Verifies developer fixes and transitions vulnerability status from `Open` to `Remediated`.

6. **Executive & Technical PDF/HTML/JSON Report Generation**:
   - Generates publication-ready PDF reports formatted for executive leadership and NTRO evaluation.

---

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons
- **Backend**: Python 3.14, FastAPI, Pydantic v2, SQLite3, ReportLab (PDF Engine)
- **Demo Vulnerable Target**: Integrated FastAPI demo router (`/api/demo/*`) listening on port 3001
- **Orchestration**: Docker & Docker Compose

---

## Quick Start & Installation

### Prerequisites
- Python 3.10+
- Node.js v18+ & npm

### 1. Launch Backend API & Demo Server
```bash
cd backend
python -m pip install fastapi uvicorn pydantic requests httpx reportlab jinja2
python main.py
```
*Backend runs on `http://127.0.0.1:8000` with Swagger UI at `http://127.0.0.1:8000/docs`.*

### 2. Launch Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

---

## SIH 2026 Presentation Demonstration Flow (2–5 Minutes)

1. Open `http://localhost:3000` and login using Demo Analyst credentials (`analyst` / `analyst123`).
2. Click **"SIH DEMO MODE"** on the left sidebar.
3. The platform automatically selects the **World Monitor Local Target** (`http://localhost:3001`), verifies authorization, and triggers the non-destructive security assessment.
4. Watch the **Live Assessment Console** stream real-time execution logs.
5. Review the updated **Dashboard** showing the overall security posture score (76/100), domain radar, and risk pie chart.
6. Navigate to **Findings Intelligence**, select finding `SEC-002` (*Missing HttpOnly Cookie Flag*), and review the **Safe PoC** & **Remediation**.
7. Click **"EXECUTE RETEST VERIFICATION"** to demonstrate the automated retest lifecycle transitioning status to `Remediated`.
8. Navigate to **Reports** and click **"DOWNLOAD PDF REPORT"** to generate the executive PDF report.

---

## Ethical & Security Disclaimer
*SecureMonitor AI is built strictly for authorized security assessment, educational, and hackathon evaluation purposes. It prohibits intrusive exploitation, destructive attacks, denial-of-service, or unauthorized external targeting.*
