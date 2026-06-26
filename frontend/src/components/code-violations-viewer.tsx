"use client";

import React, { useRef } from "react";

interface Violation {
  id: string;
  policy_name: string;
  resource_id: string;
  severity: string;
  description: string;
  line_number?: number;
  line_content?: string;
}

interface CodeViolationsViewerProps {
  filename: string;
  rawContent: string;
  violations: Violation[];
}

function getRemediation(policyName: string, resourceId: string): string {
  const p = policyName.toLowerCase();
  if (p.includes('ssh') || p.includes('rdp') || p.includes('admin_port')) {
    return `# Restrict ingress to internal network CIDR only\ningress {\n  from_port   = 22\n  to_port     = 22\n  protocol    = "tcp"\n  cidr_blocks = ["10.0.0.0/8"]  # VPC CIDR only\n  # Prefer: AWS Session Manager or Bastion host pattern\n}`;
  }
  if (p.includes('s3_public_acl')) {
    return `# Remove public ACL - default to private\nacl = "private"\n\n# Block all public access\nresource "aws_s3_bucket_public_access_block" "block" {\n  bucket                  = aws_s3_bucket.${resourceId.split('.')[1] || 'bucket'}.id\n  block_public_acls       = true\n  block_public_policy     = true\n  ignore_public_acls      = true\n  restrict_public_buckets = true\n}`;
  }
  if (p.includes('encryption')) {
    return `# Add server-side encryption to S3 bucket\nresource "aws_s3_bucket_server_side_encryption_configuration" "sse" {\n  bucket = aws_s3_bucket.${resourceId.split('.')[1] || 'bucket'}.id\n  rule {\n    apply_server_side_encryption_by_default {\n      sse_algorithm = "aws:kms"  # or "AES256"\n    }\n  }\n}`;
  }
  if (p.includes('rds') || p.includes('publicly_accessible')) {
    return `# Disable public accessibility for RDS\npublicly_accessible = false\n\n# Place DB in private subnet group\ndb_subnet_group_name = aws_db_subnet_group.private.name`;
  }
  if (p.includes('privileged')) {
    return `# Disable privileged mode\nsecurityContext:\n  privileged: false\n  allowPrivilegeEscalation: false\n  capabilities:\n    drop: ["ALL"]`;
  }
  if (p.includes('root')) {
    return `# Force non-root execution\nsecurityContext:\n  runAsNonRoot: true\n  runAsUser: 10001  # Use non-privileged UID\n  runAsGroup: 10001\n  fsGroup: 10001`;
  }
  if (p.includes('limits')) {
    return `# Set resource limits to prevent node starvation\nresources:\n  requests:\n    cpu: "100m"\n    memory: "128Mi"\n  limits:\n    cpu: "500m"\n    memory: "512Mi"`;
  }
  return `# Review and restrict this configuration\n# Ensure principle of least privilege is applied\n# Consult your security team for organization-specific policy`;
}

const SEVERITY_LINE_CLASSES: Record<string, string> = {
  critical: 'violation-critical',
  high: 'violation-high',
  medium: 'violation-medium',
  low: 'violation-low',
};

const CARD_COLORS: Record<string, { bg: string; border: string; accent: string; text: string }> = {
  critical: { bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.2)', accent: '#f43f5e', text: '#fb7185' },
  high:     { bg: 'rgba(249,115,22,0.06)', border: 'rgba(249,115,22,0.2)', accent: '#f97316', text: '#fb923c' },
  medium:   { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', accent: '#f59e0b', text: '#fbbf24' },
  low:      { bg: 'rgba(99,102,241,0.06)',  border: 'rgba(99,102,241,0.2)',  accent: '#6366f1', text: '#818cf8' },
};

export default function CodeViolationsViewer({ filename, rawContent, violations }: CodeViolationsViewerProps) {
  const lines = rawContent.split(/\r?\n/);

  const violationsByLine: Record<number, Violation[]> = {};
  violations.forEach(v => {
    if (v.line_number) {
      if (!violationsByLine[v.line_number]) violationsByLine[v.line_number] = [];
      violationsByLine[v.line_number].push(v);
    }
  });

  const ext = filename.split('.').pop()?.toUpperCase() || 'TF';
  const extColor = ext === 'TF' ? '#818cf8' : '#22d3ee';

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden h-full bg-[#000000] border border-[#27272a]">
      {/* Editor header */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 bg-[#09090b] border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="mono text-xs font-medium text-text-secondary">{filename}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="mono text-xs text-text-muted">{lines.length} lines</span>
          <span className="mono text-[10px] px-2 py-0.5 rounded font-bold border" style={{
            background: `${extColor}15`,
            color: extColor,
            borderColor: `${extColor}30`,
          }}>
            {ext}
          </span>
          {violations.length > 0 && (
            <span className="mono text-[10px] px-2 py-0.5 rounded font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {violations.length} issues
            </span>
          )}
        </div>
      </div>

      {/* Code area */}
      <div className="flex-1 overflow-auto">
        {lines.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted">
            <span className="mono text-sm">No content</span>
          </div>
        ) : (
          <div className="py-3">
            {lines.map((line, idx) => {
              const lineNum = idx + 1;
              const lineViolations = violationsByLine[lineNum];
              const hasSev = lineViolations?.[0]?.severity.toLowerCase();
              const lineClass = hasSev ? SEVERITY_LINE_CLASSES[hasSev] || '' : '';

              return (
                <React.Fragment key={lineNum}>
                  <div className={`code-line ${lineClass}`}>
                    <span className="code-line-num">{lineNum}</span>
                    <span className="code-line-content">{line || ' '}</span>
                    {hasSev && (
                      <span className="flex-shrink-0 flex items-center px-3">
                        <span className="mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase" style={{
                          background: CARD_COLORS[hasSev]?.bg,
                          color: CARD_COLORS[hasSev]?.text,
                          border: `1px solid ${CARD_COLORS[hasSev]?.border}`,
                          letterSpacing: '0.08em',
                        }}>
                          {hasSev}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Inline violation cards */}
                  {lineViolations?.map(v => {
                    const sev = v.severity.toLowerCase();
                    const c = CARD_COLORS[sev] || CARD_COLORS.low;
                    return (
                      <div key={v.id} className="mx-4 my-2 rounded-xl overflow-hidden" style={{
                        background: c.bg,
                        border: `1px solid ${c.border}`,
                      }}>
                        {/* Card header */}
                        <div className="flex items-center justify-between px-4 py-2.5" style={{
                          borderBottom: `1px solid ${c.border}`,
                          background: `${c.bg}`,
                        }}>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: c.accent }} />
                            <span className="mono text-xs font-semibold" style={{ color: c.text }}>
                              {v.policy_name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest" style={{
                              background: `${c.accent}20`,
                              color: c.text,
                              border: `1px solid ${c.border}`,
                            }}>
                              {sev}
                            </span>
                          </div>
                        </div>

                        {/* Card body */}
                        <div className="px-4 py-3">
                          <p className="text-xs leading-relaxed mb-3 text-text-secondary">
                            {v.description}
                          </p>
                          <div className="text-[10px] mb-3 mono text-text-muted">
                            Resource: <span className="text-text-secondary">{v.resource_id}</span>
                          </div>

                          {/* Remediation */}
                          <div className="rounded-xl overflow-hidden bg-[#09090b] border border-[#27272a]">
                            <div className="flex items-center gap-2 px-3 py-2 border-b border-[#27272a]">
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1.5 5.5l2.5 2.5 5-5"/>
                              </svg>
                              <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-500">
                                Recommended Fix
                              </span>
                            </div>
                            <pre className="px-3 py-3 mono text-[11px] leading-relaxed overflow-x-auto text-text-secondary">
                              {getRemediation(v.policy_name, v.resource_id)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
