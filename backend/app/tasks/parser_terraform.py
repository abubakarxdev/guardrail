import re
import io
from typing import List, Dict, Any

# Try to import hcl2 for proper HCL parsing; fall back to regex if unavailable
try:
    import hcl2
    HCL2_AVAILABLE = True
except ImportError:
    HCL2_AVAILABLE = False


def parse_terraform_violations(raw_content: str) -> List[Dict[str, Any]]:
    """
    Parse a Terraform file for security policy violations.
    Uses python-hcl2 for structured parsing when available,
    with a regex fallback for edge cases and non-HCL content.
    """
    violations = []
    lines = raw_content.splitlines()

    # ─── Phase 1: Structured HCL2 Parsing ───
    if HCL2_AVAILABLE:
        try:
            parsed = hcl2.load(io.StringIO(raw_content))
            resources = parsed.get("resource", [])

            for resource_block in resources:
                for r_type, instances in resource_block.items():
                    for r_name, body in instances.items():
                        block_violations = _audit_hcl_resource(
                            r_type, r_name, body, lines, parsed
                        )
                        violations.extend(block_violations)

        except Exception:
            # HCL parse failed (malformed file) — fall through to regex
            violations = _parse_with_regex(raw_content, lines)
            return violations
    else:
        # No hcl2 — use pure regex parser
        violations = _parse_with_regex(raw_content, lines)
        return violations

    # ─── Phase 2: Fallback line-scan for patterns outside resource blocks ───
    _scan_backup_patterns(lines, violations)

    return violations


def _find_line(lines: List[str], pattern: str, start: int = 0) -> int:
    """Find the 1-based line number of the first occurrence of pattern."""
    for idx in range(start, len(lines)):
        if pattern in lines[idx]:
            return idx + 1
    # Search from beginning if not found after start
    for idx in range(0, min(start, len(lines))):
        if pattern in lines[idx]:
            return idx + 1
    return 1


def _audit_hcl_resource(
    r_type: str, r_name: str, body: dict, lines: List[str], parsed: dict = None
) -> List[Dict[str, Any]]:
    """Audit a single parsed HCL resource block for violations."""
    violations = []
    resource_id = f"{r_type}.{r_name}"
    start_line = _find_line(lines, f'"{r_name}"')

    # ─── AWS Security Group ───
    if r_type in ("aws_security_group", "aws_security_group_rule"):
        ingress_blocks = body.get("ingress", [])
        if isinstance(ingress_blocks, dict):
            ingress_blocks = [ingress_blocks]

        for ingress in ingress_blocks:
            if not isinstance(ingress, dict):
                continue

            cidr_blocks = ingress.get("cidr_blocks", [])
            from_port = ingress.get("from_port", None)
            to_port = ingress.get("to_port", None)

            has_public = "0.0.0.0/0" in cidr_blocks
            is_admin_port = False

            if from_port is not None and to_port is not None:
                port_range = range(int(from_port), int(to_port) + 1)
                if 22 in port_range or 3389 in port_range:
                    is_admin_port = True

            if has_public and is_admin_port:
                cidr_line = _find_line(lines, "0.0.0.0/0", start_line - 1)
                violations.append({
                    "policy_name": "public_admin_port_exposure",
                    "resource_id": resource_id,
                    "severity": "critical",
                    "description": f"Security Group rule exposes port 22/3389 directly to the public internet (0.0.0.0/0). Limit access to corporate network subdomains or trusted IPs.",
                    "line_number": cidr_line,
                    "line_content": lines[cidr_line - 1].strip() if cidr_line <= len(lines) else "",
                })

    # ─── S3 Bucket ───
    elif r_type == "aws_s3_bucket":
        acl = body.get("acl", "")
        if acl in ("public-read", "public-read-write"):
            acl_line = _find_line(lines, "acl", start_line - 1)
            violations.append({
                "policy_name": "s3_public_acl",
                "resource_id": resource_id,
                "severity": "high",
                "description": f"S3 Bucket {r_name} is configured with a {acl} ACL. This permits anyone on the internet to read or write contents.",
                "line_number": acl_line,
                "line_content": lines[acl_line - 1].strip() if acl_line <= len(lines) else "",
            })

        # Check for missing encryption config (either inline or as a separate resource)
        has_sse = "server_side_encryption_configuration" in body
        if not has_sse and parsed:
            # Look for aws_s3_bucket_server_side_encryption_configuration referencing this bucket
            for resource_block in parsed.get("resource", []):
                for sse_type, sse_instances in resource_block.items():
                    if sse_type == "aws_s3_bucket_server_side_encryption_configuration":
                        for _, sse_body in sse_instances.items():
                            bucket_ref = str(sse_body.get("bucket", ""))
                            # Check if it references our bucket (e.g. aws_s3_bucket.secure_data.id)
                            if f"aws_s3_bucket.{r_name}.id" in bucket_ref or f"aws_s3_bucket.{r_name}.bucket" in bucket_ref or r_name in bucket_ref:
                                has_sse = True
                                break

        if not has_sse:
            violations.append({
                "policy_name": "s3_bucket_encryption_missing",
                "resource_id": resource_id,
                "severity": "high",
                "description": f"S3 Bucket {r_name} is missing a server-side encryption configuration block. Objects written to the bucket will remain unencrypted at rest.",
                "line_number": start_line,
                "line_content": lines[start_line - 1].strip() if start_line <= len(lines) else "",
            })

    # ─── RDS DB Instance ───
    elif r_type == "aws_db_instance":
        publicly_accessible = body.get("publicly_accessible", False)
        if publicly_accessible is True:
            pa_line = _find_line(lines, "publicly_accessible", start_line - 1)
            violations.append({
                "policy_name": "rds_publicly_accessible",
                "resource_id": resource_id,
                "severity": "critical",
                "description": f"RDS DB instance {r_name} is configured with publicly_accessible=true. Databases must be placed in private subnets with no public IP.",
                "line_number": pa_line,
                "line_content": lines[pa_line - 1].strip() if pa_line <= len(lines) else "",
            })

    # ─── IAM Policy ───
    elif r_type in ("aws_iam_policy", "aws_iam_role_policy", "aws_iam_group_policy", "aws_iam_user_policy"):
        policy_str = str(body.get("policy", ""))
        if '"Action": "*"' in policy_str or '"Action": ["*"]' in policy_str:
            action_line = _find_line(lines, "Action", start_line - 1)
            violations.append({
                "policy_name": "iam_wildcard_action",
                "resource_id": resource_id,
                "severity": "high",
                "description": "IAM Policy permits administrative wildcard actions ('*'). Ensure permissions are limited to specific actions required.",
                "line_number": action_line,
                "line_content": lines[action_line - 1].strip() if action_line <= len(lines) else "",
            })
        if '"Resource": "*"' in policy_str or '"Resource": ["*"]' in policy_str:
            res_line = _find_line(lines, "Resource", start_line - 1)
            violations.append({
                "policy_name": "iam_wildcard_resource",
                "resource_id": resource_id,
                "severity": "medium",
                "description": "IAM Policy allows access to all resources ('*'). Bind policies to specific resource ARNs to prevent privilege escalation.",
                "line_number": res_line,
                "line_content": lines[res_line - 1].strip() if res_line <= len(lines) else "",
            })

    return violations


def _scan_backup_patterns(lines: List[str], violations: List[Dict[str, Any]]):
    """Backup line-by-line scan for patterns that might be missed by structured parsing."""
    for idx, line in enumerate(lines):
        line_num = idx + 1
        stripped = line.strip()

        # Skip comment lines
        if stripped.startswith("#") or stripped.startswith("//"):
            continue

        # Check for wide-open security group ingress ports
        if "0.0.0.0/0" in stripped and ("port" in stripped or "22" in stripped or "3389" in stripped):
            if not any(v["line_number"] == line_num for v in violations):
                if "22" in stripped or "ssh" in line.lower():
                    violations.append({
                        "policy_name": "public_ssh_access",
                        "resource_id": "network_rules",
                        "severity": "critical",
                        "description": "Port 22 (SSH) is exposed directly to the internet (0.0.0.0/0). Use a bastion host or restricted VPN subnet instead.",
                        "line_number": line_num,
                        "line_content": stripped[:200],
                    })
                elif "3389" in stripped or "rdp" in line.lower():
                    violations.append({
                        "policy_name": "public_rdp_access",
                        "resource_id": "network_rules",
                        "severity": "critical",
                        "description": "Port 3389 (RDP) is exposed directly to the internet (0.0.0.0/0). Remote management interfaces should never be publicly exposed.",
                        "line_number": line_num,
                        "line_content": stripped[:200],
                    })

        # Check for IAM wildcards in inline JSON
        if '"Action": "*"' in stripped or '"Action": ["*"]' in stripped:
            if not any(v["line_number"] == line_num for v in violations):
                violations.append({
                    "policy_name": "iam_wildcard_action",
                    "resource_id": "iam_policy",
                    "severity": "high",
                    "description": "IAM Policy Statement permits administrative wildcard actions ('*'). Ensure permissions are limited to specific actions required.",
                    "line_number": line_num,
                    "line_content": stripped[:200],
                })
        if '"Resource": "*"' in stripped or '"Resource": ["*"]' in stripped:
            if not any(v["line_number"] == line_num for v in violations):
                violations.append({
                    "policy_name": "iam_wildcard_resource",
                    "resource_id": "iam_policy",
                    "severity": "medium",
                    "description": "IAM Policy Statement allows access to all resources ('*'). Bind policies to specific resource ARNs to prevent privilege escalation.",
                    "line_number": line_num,
                    "line_content": stripped[:200],
                })


def _parse_with_regex(raw_content: str, lines: List[str]) -> List[Dict[str, Any]]:
    """Pure regex-based parser as fallback when HCL2 is unavailable or parsing fails."""
    violations = []

    in_resource = False
    resource_type = ""
    resource_name = ""
    brace_count = 0
    resource_lines = []
    resource_start_line = 0

    resource_pattern = re.compile(r'^\s*resource\s+"([^"]+)"\s+"([^"]+)"\s*\{')

    for idx, line in enumerate(lines):
        line_num = idx + 1
        stripped = line.strip()

        match = resource_pattern.match(stripped) or re.match(r'^\s*resource\s+"([^"]+)"\s+"([^"]+)"', stripped)
        if match:
            in_resource = True
            resource_type = match.group(1)
            resource_name = match.group(2)
            brace_count = stripped.count('{') - stripped.count('}')
            resource_lines = [(line_num, line)]
            resource_start_line = line_num
            continue

        if in_resource:
            resource_lines.append((line_num, line))
            brace_count += line.count('{') - line.count('}')

            if brace_count <= 0:
                in_resource = False
                block_violations = _audit_regex_resource_block(
                    resource_type, resource_name, resource_lines, resource_start_line
                )
                violations.extend(block_violations)
                resource_lines = []

    # Backup line scan
    _scan_backup_patterns(lines, violations)

    return violations


def _audit_regex_resource_block(
    r_type: str, r_name: str, block_lines: List[tuple], start_line: int
) -> List[Dict[str, Any]]:
    """Audit a resource block found via regex parsing."""
    violations = []
    resource_id = f"{r_type}.{r_name}"
    full_block_text = "\n".join([line for _, line in block_lines])

    if r_type in ("aws_security_group", "aws_security_group_rule"):
        has_public_cidr = False
        has_ssh_rdp = False
        cidr_line = start_line

        for line_num, line in block_lines:
            stripped = line.strip()
            if "0.0.0.0/0" in stripped:
                has_public_cidr = True
                cidr_line = line_num
            if "22" in stripped or "3389" in stripped:
                has_ssh_rdp = True

        if has_public_cidr and has_ssh_rdp:
            violations.append({
                "policy_name": "public_admin_port_exposure",
                "resource_id": resource_id,
                "severity": "critical",
                "description": "Security Group rule exposes port 22/3389 directly to the public internet (0.0.0.0/0). Limit access to corporate network subdomains or trusted IPs.",
                "line_number": cidr_line,
                "line_content": block_lines[cidr_line - start_line][1].strip() if (cidr_line - start_line) < len(block_lines) else "",
            })

    elif r_type == "aws_s3_bucket":
        for line_num, line in block_lines:
            stripped = line.strip()
            if 'acl' in stripped and ('public-read' in stripped or 'public-read-write' in stripped):
                violations.append({
                    "policy_name": "s3_public_acl",
                    "resource_id": resource_id,
                    "severity": "high",
                    "description": f"S3 Bucket {r_name} is configured with a public-read or public-read-write ACL. This permits anyone on the internet to read or write contents.",
                    "line_number": line_num,
                    "line_content": stripped,
                })

        if "server_side_encryption_configuration" not in full_block_text:
            violations.append({
                "policy_name": "s3_bucket_encryption_missing",
                "resource_id": resource_id,
                "severity": "high",
                "description": f"S3 Bucket {r_name} is missing a server-side encryption configuration block. Objects written to the bucket will remain unencrypted at rest.",
                "line_number": start_line,
                "line_content": block_lines[0][1].strip(),
            })

    elif r_type == "aws_db_instance":
        for line_num, line in block_lines:
            stripped = line.strip()
            if "publicly_accessible" in stripped and "true" in stripped:
                violations.append({
                    "policy_name": "rds_publicly_accessible",
                    "resource_id": resource_id,
                    "severity": "critical",
                    "description": f"RDS DB instance {r_name} is configured with publicly_accessible=true. Databases must be placed in private subnets with no public IP.",
                    "line_number": line_num,
                    "line_content": stripped,
                })

    return violations
