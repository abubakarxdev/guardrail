from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import Dict

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models import User, Audit, Violation
from app.schemas import DashboardStats, SeverityCount

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Get total audits
    total_audits = db.query(Audit).filter(Audit.user_id == current_user.id).count()

    # Get average score of completed audits
    avg_score_query = db.query(func.avg(Audit.score))\
        .filter(Audit.user_id == current_user.id, Audit.status == "completed")\
        .scalar()
    
    average_score = float(round(avg_score_query, 1)) if avg_score_query is not None else 100.0

    # Get recent 5 audits
    recent_audits = db.query(Audit)\
        .filter(Audit.user_id == current_user.id)\
        .order_by(Audit.started_at.desc())\
        .limit(5)\
        .all()

    # Get severity distribution of violations
    # Query join on Audit to limit to current user
    severity_distribution = SeverityCount(critical=0, high=0, medium=0, low=0)
    
    severity_counts = db.query(Violation.severity, func.count(Violation.id))\
        .join(Audit, Violation.audit_id == Audit.id)\
        .filter(Audit.user_id == current_user.id)\
        .group_by(Violation.severity)\
        .all()
        
    counts_map = {sev.lower(): count for sev, count in severity_counts}
    
    severity_distribution.critical = counts_map.get("critical", 0)
    severity_distribution.high = counts_map.get("high", 0)
    severity_distribution.medium = counts_map.get("medium", 0)
    severity_distribution.low = counts_map.get("low", 0)

    return DashboardStats(
        total_audits=total_audits,
        average_score=average_score,
        recent_audits=recent_audits,
        severity_distribution=severity_distribution
    )
