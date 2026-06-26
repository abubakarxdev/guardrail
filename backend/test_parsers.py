import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.tasks.parser_terraform import parse_terraform_violations
from app.tasks.parser_kubernetes import parse_kubernetes_violations

def run_tests():
    print("==================================================")
    print("      GuardRail Rule Engine Validation Test       ")
    print("==================================================")

    tf_path = "../test_manifests/vulnerable_aws_infra.tf"
    k8s_path = "../test_manifests/unsafe_k8s_deployment.yaml"

    # Test Terraform parser
    if os.path.exists(tf_path):
        with open(tf_path, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"\n[+] Scanning Terraform config: {tf_path}")
        violations = parse_terraform_violations(content)
        print(f"[*] Found {len(violations)} security vulnerabilities:")
        for v in violations:
            print(f"    - [{v['severity'].upper()}] Rule: {v['policy_name']} | Line {v['line_number']}: '{v['line_content']}'")
            print(f"      Desc: {v['description']}")
    else:
        print(f"[-] Missing Terraform test manifest at {tf_path}")

    # Test Kubernetes parser
    if os.path.exists(k8s_path):
        with open(k8s_path, "r", encoding="utf-8") as f:
            content = f.read()
        print(f"\n[+] Scanning Kubernetes config: {k8s_path}")
        violations = parse_kubernetes_violations(content)
        print(f"[*] Found {len(violations)} security vulnerabilities:")
        for v in violations:
            print(f"    - [{v['severity'].upper()}] Rule: {v['policy_name']} | Line {v['line_number']}: '{v['line_content']}'")
            print(f"      Desc: {v['description']}")
    else:
        print(f"[-] Missing Kubernetes test manifest at {k8s_path}")

    print("\n==================================================")
    print("               Validation Complete                ")
    print("==================================================")

if __name__ == "__main__":
    run_tests()
