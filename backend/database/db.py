import sqlite3
import os
import json
from datetime import datetime

# Vercel and AWS Lambda serverless read-only environment check
if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or os.environ.get("VERCEL_ENV"):
    DB_PATH = "/tmp/securemonitor.db"
else:
    DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "securemonitor.db")

def get_db():
    if not os.path.exists(DB_PATH):
        init_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Users Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Analyst',
        full_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Targets Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS targets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        url TEXT NOT NULL,
        environment TEXT NOT NULL,
        description TEXT,
        authorization_confirmed INTEGER NOT NULL DEFAULT 0,
        scope TEXT,
        excluded_paths TEXT,
        status TEXT DEFAULT 'Assessment Ready',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Assessments Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        assessment_id TEXT UNIQUE NOT NULL,
        target_id INTEGER NOT NULL,
        mode TEXT DEFAULT 'Safe Active',
        domains TEXT NOT NULL,
        rate_limit TEXT DEFAULT 'Medium',
        timeout INTEGER DEFAULT 5,
        max_requests INTEGER DEFAULT 100,
        status TEXT DEFAULT 'Completed',
        overall_score INTEGER DEFAULT 76,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        tester TEXT DEFAULT 'Security Analyst',
        FOREIGN KEY (target_id) REFERENCES targets (id)
    );
    """)

    # Findings Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS findings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        finding_id TEXT UNIQUE NOT NULL,
        assessment_id TEXT NOT NULL,
        target_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        severity TEXT NOT NULL,
        cvss REAL NOT NULL,
        cvss_vector TEXT,
        description TEXT NOT NULL,
        affected_component TEXT NOT NULL,
        evidence TEXT NOT NULL,
        reproduction_steps TEXT NOT NULL,
        poc TEXT NOT NULL,
        impact TEXT NOT NULL,
        remediation TEXT NOT NULL,
        references_json TEXT,
        status TEXT DEFAULT 'Open',
        confidence TEXT DEFAULT 'High',
        discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # Audit Logs Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        username TEXT NOT NULL,
        action TEXT NOT NULL,
        target TEXT,
        result TEXT NOT NULL
    );
    """)

    # Seed Default Admin & Analyst User if empty
    cursor.execute("SELECT COUNT(*) as count FROM users")
    if cursor.fetchone()["count"] == 0:
        cursor.execute("INSERT INTO users (username, password_hash, role, full_name) VALUES ('admin', 'admin123', 'Admin', 'Lead Security Admin')")
        cursor.execute("INSERT INTO users (username, password_hash, role, full_name) VALUES ('analyst', 'analyst123', 'Security Analyst', 'NTRO Security Analyst')")
        cursor.execute("INSERT INTO users (username, password_hash, role, full_name) VALUES ('viewer', 'viewer123', 'Viewer', 'Auditor / Viewer')")

    # Seed Default Target if empty
    cursor.execute("SELECT COUNT(*) as count FROM targets")
    if cursor.fetchone()["count"] == 0:
        cursor.execute("""
        INSERT INTO targets (name, url, environment, description, authorization_confirmed, scope, excluded_paths, status)
        VALUES (
            'World Monitor Local Target',
            'http://localhost:3001',
            'Local Demo Testing',
            'Authorized staging copy / local vulnerable demo environment of World Monitor app (SIH PS 26163)',
            1,
            'http://localhost:3001/*',
            '/admin/destructive-mock',
            'Assessment Ready'
        )
        """)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print(f"Database initialized successfully at {DB_PATH}.")
