from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.auth import get_current_user
from app.models import User, Audit, Violation
from app.schemas import AuditResponse, AuditDetailResponse
from app.tasks.audit_orchestrator import run_audit_pipeline

router = APIRouter(prefix="/audits", tags=["audits"])

@router.post("/upload", response_model=AuditResponse, status_code=status.HTTP_201_CREATED)
async def upload_config(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Validate extension and determine file type
    filename = file.filename
    lower_filename = filename.lower()
    
    if lower_filename.endswith((".tf", ".tf.json")):
        file_type = "terraform"
    elif lower_filename.endswith((".yaml", ".yml")):
        file_type = "kubernetes"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a Terraform (.tf) or Kubernetes (.yaml) configuration file."
        )

    # Read file content safely
    try:
        content_bytes = await file.read()
        raw_content = content_bytes.decode("utf-8")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read file contents: {str(e)}"
        )

    # Create DB entry
    audit = Audit(
        user_id=current_user.id,
        filename=filename,
        file_type=file_type,
        raw_content=raw_content,
        status="pending",
        score=100
    )
    db.add(audit)
    db.commit()
    db.refresh(audit)

    # Trigger Celery background task
    run_audit_pipeline.delay(audit.id)

    return audit


@router.get("", response_model=List[AuditResponse])
def list_audits(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(50, ge=1, le=200, description="Max records to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audits = db.query(Audit)\
        .filter(Audit.user_id == current_user.id)\
        .order_by(Audit.started_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    return audits


@router.get("/{audit_id}", response_model=AuditDetailResponse)
def get_audit_detail(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audit = db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == current_user.id).first()
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit configuration report not found."
        )
    return audit


@router.delete("/{audit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_audit(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audit = db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == current_user.id).first()
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit not found or you do not have permission to delete it."
        )
    db.delete(audit)
    db.commit()
    return None


@router.post("/{audit_id}/rerun", response_model=AuditResponse)
def rerun_audit(
    audit_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    audit = db.query(Audit).filter(Audit.id == audit_id, Audit.user_id == current_user.id).first()
    if not audit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Audit not found or you do not have permission to re-run it."
        )

    # Clear existing violations
    db.query(Violation).filter(Violation.audit_id == audit_id).delete()

    # Reset audit state
    audit.status = "pending"
    audit.score = 100
    audit.completed_at = None
    db.commit()
    db.refresh(audit)

    # Re-dispatch Celery task
    run_audit_pipeline.delay(audit.id)

    return audit
