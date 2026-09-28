from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    username: str
    role: str
    full_name: str
    token: str

class TargetCreate(BaseModel):
    name: str
    url: str
    environment: str
    description: Optional[str] = ""
    authorization_confirmed: bool
    scope: Optional[str] = ""
    excluded_paths: Optional[str] = ""

class TargetResponse(BaseModel):
    id: int
    name: str
    url: str
    environment: str
    description: str
    authorization_confirmed: bool
    scope: str
    excluded_paths: str
    status: str
    created_at: str

class AssessmentCreate(BaseModel):
    target_id: int
    mode: str = "Safe Active"
    domains: List[str]
    rate_limit: str = "Medium"
    timeout: int = 5
    max_requests: int = 100

class FindingUpdate(BaseModel):
    status: str

class RetestRequest(BaseModel):
    finding_id: str

class AuditLogResponse(BaseModel):
    id: int
    timestamp: str
    username: str
    action: str
    target: Optional[str]
    result: str
