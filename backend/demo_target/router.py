from fastapi import APIRouter, Request, Response, Header
from fastapi.responses import HTMLResponse, JSONResponse
from typing import Optional

demo_router = APIRouter(prefix="/api/demo", tags=["Demo Vulnerable Target"])

@demo_router.get("/status")
async def demo_status():
    # Vulnerability: Missing Content-Security-Policy header
    return JSONResponse(
        content={
            "status": "online",
            "environment": "World Monitor Authorized Demo Environment",
            "version": "1.4.2-staging",
            "security_status": "Non-destructive testing mode"
        }
    )

@demo_router.get("/auth/session")
async def demo_auth_session(response: Response):
    # Vulnerability: Missing HttpOnly flag on session cookie
    response.set_cookie(
        key="session_token",
        value="demo_token_6142_sec_test",
        samesite="lax",
        # httponly=False intentionally to demonstrate finding SEC-002
        httponly=False
    )
    return {"message": "Session established", "session_id": "demo_token_6142_sec_test"}

@demo_router.get("/admin/telemetry")
async def demo_admin_telemetry(authorization: Optional[str] = Header(None)):
    # Vulnerability: Broken Object / Role-Based Access Control (SEC-004)
    # Allows low-privileged or unauthenticated requests to read sensitive telemetry
    return {
        "access": "Granted",
        "role_checked": "User (Low Privilege)",
        "telemetry": {
            "internal_ip": "10.0.4.12",
            "node_count": 8,
            "database_status": "Connected (SQLite Demo)",
            "secret_key_loaded": "demo_secret_key_change_me"
        }
    }

@demo_router.get("/search", response_class=HTMLResponse)
async def demo_search(q: str = "SECURITY_TEST_MARKER_26163"):
    # Vulnerability: Reflected unescaped parameter (SEC-006)
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><title>World Monitor Demo Search</title></head>
    <body>
        <h2>World Monitor Search Results</h2>
        <div id="results">Search results for: {q}</div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@demo_router.get("/cors-test")
async def demo_cors_test(request: Request):
    # Vulnerability: Overly Permissive CORS (SEC-003)
    origin = request.headers.get("origin", "*")
    headers = {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Credentials": "true"
    }
    return JSONResponse(
        content={"status": "CORS policy response", "origin_evaluated": origin},
        headers=headers
    )

@demo_router.get("/events")
async def demo_events():
    return [
        {"id": "EVT-101", "type": "Geopolitical Alert", "region": "Asia-Pacific", "severity": "High", "timestamp": "2026-09-28T22:00:00Z"},
        {"id": "EVT-102", "type": "Cyber Incident Watch", "region": "Global", "severity": "Medium", "timestamp": "2026-09-28T21:45:00Z"}
    ]

@demo_router.get("/weather")
async def demo_weather():
    return {"location": "New Delhi", "temperature": "28C", "condition": "Clear"}

@demo_router.get("/news")
async def demo_news():
    return [{"id": 1, "headline": "NTRO Announces SIH 2026 Security Assessment Challenge", "source": "NTRO News"}]
