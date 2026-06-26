import time
from datetime import datetime
from app.tasks.worker import celery_app
from app.core.database import SessionLocal
from app.models import Audit, Violation
from app.tasks.parser_terraform import parse_terraform_violations
from app.tasks.parser_kubernetes import parse_kubernetes_violations

@celery_app.task(name="app.tasks.audit_orchestrator.run_audit_pipeline")
def run_audit_pipeline(audit_id: str):
    db = SessionLocal()
    try:
        # Fetch audit record
        audit = db.query(Audit).filter(Audit.id == audit_id).first()
        if not audit:
            return f"Audit with ID {audit_id} not found."

        # Update status to processing
        audit.status = "processing"
        db.commit()

        # Simulate execution processing delay (1.5 seconds)
        time.sleep(1.5)

        # Select parser
        violations_data = []
        if audit.file_type == "terraform":
            violations_data = parse_terraform_violations(audit.raw_content)
        elif audit.file_type == "kubernetes":
            violations_data = parse_kubernetes_violations(audit.raw_content)
        else:
            if audit.filename.endswith((".tf", ".tf.json")):
                violations_data = parse_terraform_violations(audit.raw_content)
            elif audit.filename.endswith((".yaml", ".yml")):
                violations_data = parse_kubernetes_violations(audit.raw_content)

        # Clear existing violations
        db.query(Violation).filter(Violation.audit_id == audit_id).delete()

        # Add violations
        for v in violations_data:
            violation = Violation(
                audit_id=audit_id,
                policy_name=v["policy_name"],
                resource_id=v["resource_id"],
                severity=v["severity"],
                description=v["description"],
                line_number=v.get("line_number"),
                line_content=v.get("line_content")
            )
            db.add(violation)

        # Calculate score (out of 100)
        # Deductions: Critical = 25, High = 15, Medium = 5, Low = 2
        score = 100
        for v in violations_data:
            severity = v["severity"].lower()
            if severity == "critical":
                score -= 25
            elif severity == "high":
                score -= 15
            elif severity == "medium":
                score -= 5
            elif severity == "low":
                score -= 2
        
        # Clamp score between 0 and 100
        audit.score = max(0, min(100, score))
        audit.status = "completed"
        audit.completed_at = datetime.utcnow()
        db.commit()
        
        return f"Audit {audit_id} completed successfully. Score: {audit.score}, Violations: {len(violations_data)}"

    except Exception as e:
        db.rollback()
        try:
            audit = db.query(Audit).filter(Audit.id == audit_id).first()
            if audit:
                audit.status = "failed"
                audit.completed_at = datetime.utcnow()
                db.commit()
        except Exception:
            pass
        return f"Audit {audit_id} failed: {str(e)}"
        
    finally:
        db.close()
