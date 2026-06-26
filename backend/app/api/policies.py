from typing import List
from fastapi import APIRouter
from app.schemas import PolicyRuleResponse

router = APIRouter(prefix="/policies", tags=["policies"])

# Registry of all security policies checked by the GuardRail engine
POLICY_REGISTRY: List[dict] = [
    # ─── Kubernetes Policies ───
    {
        "id": "k8s_privileged_container",
        "name": "Privileged Container",
        "description": "Detects containers running with privileged: true. Privileged containers can access all host devices and bypass container namespace controls, effectively giving root-level access to the host.",
        "severity": "critical",
        "framework": "kubernetes",
        "category": "Container Security",
    },
    {
        "id": "k8s_run_as_root",
        "name": "Run as Root (Implicit)",
        "description": "Detects containers that do not explicitly set securityContext.runAsNonRoot: true. Without this constraint, the container process may run as UID 0 (root), which increases the blast radius of container escapes.",
        "severity": "high",
        "framework": "kubernetes",
        "category": "Container Security",
    },
    {
        "id": "k8s_run_as_root_explicit",
        "name": "Run as Root (Explicit UID 0)",
        "description": "Detects containers that explicitly set runAsUser: 0. Root processes inside containers have root abilities on host kernels via shared namespaces.",
        "severity": "high",
        "framework": "kubernetes",
        "category": "Container Security",
    },
    {
        "id": "k8s_missing_limits",
        "name": "Missing Resource Limits",
        "description": "Detects containers without resources.limits (CPU/memory). An unconstrained container could consume all available host node resources, causing denial-of-service for co-located workloads.",
        "severity": "medium",
        "framework": "kubernetes",
        "category": "Resource Management",
    },
    # ─── Terraform Policies ───
    {
        "id": "public_admin_port_exposure",
        "name": "Public Admin Port Exposure",
        "description": "Detects AWS Security Group rules that expose administrative ports (22/SSH, 3389/RDP) to the public internet (0.0.0.0/0). These ports should be restricted to trusted IP ranges or accessed via bastion hosts.",
        "severity": "critical",
        "framework": "terraform",
        "category": "Network Security",
    },
    {
        "id": "public_ssh_access",
        "name": "Public SSH Access",
        "description": "Fallback detection for SSH port 22 exposed to 0.0.0.0/0 outside of structured resource blocks. Use AWS Session Manager or VPN instead of direct SSH.",
        "severity": "critical",
        "framework": "terraform",
        "category": "Network Security",
    },
    {
        "id": "public_rdp_access",
        "name": "Public RDP Access",
        "description": "Fallback detection for RDP port 3389 exposed to 0.0.0.0/0. Remote desktop management interfaces should never be publicly exposed.",
        "severity": "critical",
        "framework": "terraform",
        "category": "Network Security",
    },
    {
        "id": "s3_public_acl",
        "name": "S3 Bucket Public ACL",
        "description": "Detects S3 buckets configured with public-read or public-read-write ACLs. This permits anyone on the internet to read or write bucket contents, risking data exfiltration.",
        "severity": "high",
        "framework": "terraform",
        "category": "Storage Security",
    },
    {
        "id": "s3_bucket_encryption_missing",
        "name": "S3 Bucket Encryption Missing",
        "description": "Detects S3 buckets without server-side encryption configuration. Objects written to the bucket will remain unencrypted at rest, violating data protection compliance requirements.",
        "severity": "high",
        "framework": "terraform",
        "category": "Data Protection",
    },
    {
        "id": "rds_publicly_accessible",
        "name": "RDS Publicly Accessible",
        "description": "Detects RDS database instances with publicly_accessible=true. Databases must be placed in private subnets with no public IP to prevent unauthorized access from the internet.",
        "severity": "critical",
        "framework": "terraform",
        "category": "Database Security",
    },
    {
        "id": "iam_wildcard_action",
        "name": "IAM Wildcard Action",
        "description": "Detects IAM policy statements with Action set to '*' (wildcard). This grants full administrative permissions, violating the principle of least privilege.",
        "severity": "high",
        "framework": "terraform",
        "category": "Identity & Access",
    },
    {
        "id": "iam_wildcard_resource",
        "name": "IAM Wildcard Resource",
        "description": "Detects IAM policy statements with Resource set to '*'. Policies should be bound to specific resource ARNs to prevent privilege escalation.",
        "severity": "medium",
        "framework": "terraform",
        "category": "Identity & Access",
    },
]


@router.get("", response_model=List[PolicyRuleResponse])
def list_policies():
    """Return all security policies checked by the GuardRail engine."""
    return POLICY_REGISTRY


@router.get("/{framework}", response_model=List[PolicyRuleResponse])
def list_policies_by_framework(framework: str):
    """Return policies filtered by framework (terraform or kubernetes)."""
    filtered = [p for p in POLICY_REGISTRY if p["framework"] == framework.lower()]
    return filtered
