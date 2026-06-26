import yaml
from typing import List, Dict, Any

def parse_kubernetes_violations(raw_content: str) -> List[Dict[str, Any]]:
    violations = []
    lines = raw_content.splitlines()

    try:
        docs = list(yaml.safe_load_all(raw_content))
    except Exception:
        docs = []

    def find_line_number(pattern_str: str, start_search_from: int = 1) -> int:
        for idx in range(start_search_from - 1, len(lines)):
            if pattern_str in lines[idx]:
                return idx + 1
        for idx, line in enumerate(lines):
            if pattern_str in line:
                return idx + 1
        return 1

    if docs:
        for doc in docs:
            if not doc or not isinstance(doc, dict):
                continue
            
            kind = doc.get("kind", "")
            metadata = doc.get("metadata", {})
            name = metadata.get("name", "unnamed")
            
            spec = None
            if kind == "Pod":
                spec = doc.get("spec", {})
            elif kind in ["Deployment", "StatefulSet", "DaemonSet", "ReplicaSet", "Job"]:
                spec = doc.get("spec", {}).get("template", {}).get("spec", {})
            elif kind == "CronJob":
                spec = doc.get("spec", {}).get("jobTemplate", {}).get("spec", {}).get("template", {}).get("spec", {})

            if not spec:
                continue

            containers = spec.get("containers", [])
            for container in containers:
                c_name = container.get("name", "unnamed-container")
                resource_id = f"{kind}/{name}:{c_name}"

                container_start_line = find_line_number(f"name: {c_name}")
                if container_start_line == 1:
                    container_start_line = find_line_number(f"- name: \"{c_name}\"")

                security_context = container.get("securityContext", {})
                if security_context and security_context.get("privileged") is True:
                    line_num = find_line_number("privileged: true", container_start_line)
                    violations.append({
                        "policy_name": "k8s_privileged_container",
                        "resource_id": resource_id,
                        "severity": "critical",
                        "description": f"Container '{c_name}' in {kind}/{name} is running as privileged. Privileged containers can access all host devices and bypass container namespace controls.",
                        "line_number": line_num,
                        "line_content": lines[line_num - 1].strip() if line_num <= len(lines) else "privileged: true"
                    })

                run_as_non_root = security_context.get("runAsNonRoot")
                run_as_user = security_context.get("runAsUser")
                
                pod_security_context = spec.get("securityContext", {})
                pod_run_as_non_root = pod_security_context.get("runAsNonRoot") if pod_security_context else None
                pod_run_as_user = pod_security_context.get("runAsUser") if pod_security_context else None

                is_root = False
                root_line_num = container_start_line

                if run_as_user == 0:
                    is_root = True
                    root_line_num = find_line_number("runAsUser: 0", container_start_line)
                elif run_as_user is None and pod_run_as_user == 0:
                    is_root = True
                    root_line_num = find_line_number("runAsUser: 0")

                if (run_as_non_root is False) or (run_as_non_root is None and pod_run_as_non_root is not True and not is_root):
                    violations.append({
                        "policy_name": "k8s_run_as_root",
                        "resource_id": resource_id,
                        "severity": "high",
                        "description": f"Container '{c_name}' in {kind}/{name} allows execution as root. Set securityContext.runAsNonRoot: true to enforce non-root execution.",
                        "line_number": container_start_line,
                        "line_content": lines[container_start_line - 1].strip() if container_start_line <= len(lines) else ""
                    })
                elif is_root:
                    violations.append({
                        "policy_name": "k8s_run_as_root_explicit",
                        "resource_id": resource_id,
                        "severity": "high",
                        "description": f"Container '{c_name}' in {kind}/{name} explicitly sets runAsUser: 0 (root). Root processes inside containers have root abilities on host kernels.",
                        "line_number": root_line_num,
                        "line_content": lines[root_line_num - 1].strip() if root_line_num <= len(lines) else "runAsUser: 0"
                    })

                resources = container.get("resources", {})
                limits = resources.get("limits", {}) if resources else None
                if not resources or not limits or not (limits.get("cpu") or limits.get("memory")):
                    violations.append({
                        "policy_name": "k8s_missing_limits",
                        "resource_id": resource_id,
                        "severity": "medium",
                        "description": f"Container '{c_name}' in {kind}/{name} has no resources.limits configured. An unconstrained container could consume all host node resources.",
                        "line_number": container_start_line,
                        "line_content": lines[container_start_line - 1].strip() if container_start_line <= len(lines) else ""
                    })

    else:
        for idx, line in enumerate(lines):
            line_num = idx + 1
            stripped = line.strip()
            if "privileged: true" in stripped:
                violations.append({
                    "policy_name": "k8s_privileged_container",
                    "resource_id": "k8s_container",
                    "severity": "critical",
                    "description": "Container running in privileged mode. Enables full capability mappings to host interfaces.",
                    "line_number": line_num,
                    "line_content": stripped
                })
            if "runAsUser: 0" in stripped:
                violations.append({
                    "policy_name": "k8s_run_as_root",
                    "resource_id": "k8s_container",
                    "severity": "high",
                    "description": "Container process running explicitly as UID 0 (root).",
                    "line_number": line_num,
                    "line_content": stripped
                })

    return violations
