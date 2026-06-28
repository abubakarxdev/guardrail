from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator
import re

# Token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: Optional[str] = None

# User schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(v) > 72:
            raise ValueError("Password must be at most 72 characters long.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one digit.")
        return v

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(v) > 72:
            raise ValueError("Password must be at most 72 characters long.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number.")
        return v

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        if len(v) > 72:
            raise ValueError("Password must be at most 72 characters long.")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter.")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter.")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain at least one number.")
        return v

# Violation schemas
class ViolationResponse(BaseModel):
    id: str
    audit_id: str
    policy_name: str
    resource_id: str
    severity: str
    description: str
    line_number: Optional[int] = None
    line_content: Optional[str] = None

    class Config:
        from_attributes = True

# Audit schemas
class AuditResponse(BaseModel):
    id: str
    filename: str
    file_type: str
    status: str
    score: int
    started_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AuditDetailResponse(AuditResponse):
    raw_content: str
    violations: List[ViolationResponse]

    class Config:
        from_attributes = True

# Dashboard summary statistics schema
class SeverityCount(BaseModel):
    critical: int = 0
    high: int = 0
    medium: int = 0
    low: int = 0

class DashboardStats(BaseModel):
    total_audits: int
    average_score: float
    recent_audits: List[AuditResponse]
    severity_distribution: SeverityCount

# Policy rule schema (for Policy Rules page)
class PolicyRuleResponse(BaseModel):
    id: str
    name: str
    description: str
    severity: str
    framework: str  # 'terraform' or 'kubernetes'
    category: str

    class Config:
        from_attributes = True

# Support ticket schema
class SupportTicketCreate(BaseModel):
    subject: str
    message: str
