import csv
import io
import json
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models import User, Audit

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{audit_id}/json")
def export_json_report(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audit = db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == current_user.id).first()
    if not audit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found.")

    report = {
        "audit_id": audit.id,
        "filename": audit.filename,
        "file_type": audit.file_type,
        "status": audit.status,
        "score": audit.score,
        "started_at": audit.started_at.isoformat() if audit.started_at else None,
        "completed_at": audit.completed_at.isoformat() if audit.completed_at else None,
        "violations_count": len(audit.violations),
        "violations": [
            {
                "policy_name": v.policy_name,
                "resource_id": v.resource_id,
                "severity": v.severity,
                "description": v.description,
                "line_number": v.line_number,
                "line_content": v.line_content,
            }
            for v in audit.violations
        ]
    }

    content = json.dumps(report, indent=2)
    safe_name = audit.filename.replace(" ", "_").split(".")[0]

    return StreamingResponse(
        io.BytesIO(content.encode("utf-8")),
        media_type="application/json",
        headers={
            "Content-Disposition": f'attachment; filename="guardrail_report_{safe_name}.json"'
        }
    )


@router.get("/{audit_id}/csv")
def export_csv_report(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audit = db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == current_user.id).first()
    if not audit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found.")

    output = io.StringIO()
    writer = csv.writer(output)

    # Header row
    writer.writerow([
        "Audit ID", "Filename", "Score", "Policy Name",
        "Severity", "Resource ID", "Line Number", "Description", "Line Content"
    ])

    for v in audit.violations:
        writer.writerow([
            audit.id, audit.filename, audit.score,
            v.policy_name, v.severity, v.resource_id,
            v.line_number or "", v.description, v.line_content or ""
        ])

    safe_name = audit.filename.replace(" ", "_").split(".")[0]

    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename="guardrail_report_{safe_name}.csv"'
        }
    )
