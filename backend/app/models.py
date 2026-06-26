import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    reset_password_token = Column(String, nullable=True, index=True)
    reset_password_expires = Column(DateTime, nullable=True)

    audits = relationship("Audit", back_populates="user", cascade="all, delete-orphan")


class Audit(Base):
    __tablename__ = "audits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, nullable=False) # 'terraform' or 'kubernetes'
    raw_content = Column(Text, nullable=False)
    status = Column(String, default="pending") # 'pending', 'processing', 'completed', 'failed'
    score = Column(Integer, default=100) # 0 to 100
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="audits")
    violations = relationship("Violation", back_populates="audit", cascade="all, delete-orphan")


class Violation(Base):
    __tablename__ = "violations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    audit_id = Column(String, ForeignKey("audits.id", ondelete="CASCADE"), nullable=False)
    policy_name = Column(String, nullable=False)
    resource_id = Column(String, nullable=False) # e.g., aws_security_group.ingress
    severity = Column(String, nullable=False) # 'critical', 'high', 'medium', 'low'
    description = Column(Text, nullable=False)
    line_number = Column(Integer, nullable=True)
    line_content = Column(String, nullable=True)

    audit = relationship("Audit", back_populates="violations")
