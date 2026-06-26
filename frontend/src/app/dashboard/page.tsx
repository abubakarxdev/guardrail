"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout-sidebar";
import FileUploadZone from "@/components/file-upload-zone";
import CodeViolationsViewer from "@/components/code-violations-viewer";
import ViolationsList from "@/components/violations-list";
import ErrorBoundary from "@/components/error-boundary";
import { useToast } from "@/components/toast";

interface Audit {
  id: string;
  filename: string;
  file_type: string;
  status: string;
  score: number;
  started_at: string;
  completed_at?: string;
}

interface Violation {
  id: string;
  policy_name: string;
  resource_id: string;
  severity: string;
  description: string;
  line_number?: number;
  line_content?: string;
}

interface AuditDetail extends Audit {
  raw_content: string;
  violations: Violation[];
}

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const fill = ((100 - score) / 100) * circ;
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#f43f5e';
  const glow = score >= 80 ? 'rgba(16,185,129,0.4)' : score >= 60 ? 'rgba(245,158,11,0.4)' : 'rgba(244,63,94,0.4)';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: 130, height: 130 }}>
        <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8"/>
          <circle
            cx="65" cy="65" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={fill}
            style={{ filter: `drop-shadow(0 0 8px ${glow})`, transition: 'all 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black leading-none" style={{ color }}>{grade}</span>
          <span className="mono text-xs mt-0.5" style={{ color: '#94a3b8' }}>{score}/100</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; color: string; bg: string; border: string }> = {
    pending:    { label: 'Queued',     color: '#fbbf24', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)' },
    processing: { label: 'Analyzing', color: '#818cf8', bg: 'rgba(99,102,241,0.08)',   border: 'rgba(99,102,241,0.2)' },
    completed:  { label: 'Completed', color: '#10b981', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.2)' },
    failed:     { label: 'Failed',    color: '#fb7185', bg: 'rgba(244,63,94,0.08)',    border: 'rgba(244,63,94,0.2)' },
  };
  const c = configs[status] || configs.pending;
  const isLive = status === 'pending' || status === 'processing';
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg mono text-[10px] font-bold uppercase tracking-widest" style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`
    }}>
      <span className="status-dot" style={{ background: c.color, width: 5, height: 5, boxShadow: isLive ? `0 0 6px ${c.color}` : 'none', animation: isLive ? 'pulse-glow 1.2s infinite' : 'none' }} />
      {c.label}
    </span>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [allAudits, setAllAudits] = useState<Audit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<AuditDetail | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Use ref to avoid stale closures
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  const loadAudits = useCallback(async () => {
    try {
      const audits = await api.listAudits(0, 100);
      setAllAudits(audits);
      // Auto-select first audit if none selected
      if (!selectedIdRef.current && audits.length > 0) {
        setSelectedId(audits[0].id);
      }
    } catch {}
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const s = await api.getStats();
      setStats(s);
    } catch {}
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadAudits(), loadStats()]);
  }, [loadAudits, loadStats]);

  useEffect(() => {
    const init = async () => {
      try {
        const u = await api.getMe();
        setUser(u);
        await refreshAll();
      } catch {
        api.logout();
        router.push("/login");
      } finally {
        setPageLoading(false);
      }
    };
    init();
  }, []);

  // Poll selected audit detail
  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      if (!detail) setDetailLoading(true);
      try {
        const d = await api.getAudit(selectedId);
        if (!cancelled) {
          setDetail(d);
          setDetailLoading(false);
          if (d.status === 'pending' || d.status === 'processing') {
            timer = setTimeout(poll, 2500);
          } else {
            refreshAll();
          }
        }
      } catch { setDetailLoading(false); }
    };

    poll();
    return () => { cancelled = true; clearTimeout(timer); };
  }, [selectedId]);

  const handleUploadSuccess = (audit: Audit) => {
    setAllAudits(prev => [audit, ...prev]);
    setSelectedId(audit.id);
    setDetail(null);
    showToast(`Audit queued for ${audit.filename}`, "success");
  };

  const handleDelete = async (auditId: string) => {
    try {
      await api.deleteAudit(auditId);
      setAllAudits(prev => prev.filter(a => a.id !== auditId));
      if (selectedId === auditId) {
        setSelectedId(null);
        setDetail(null);
      }
      setConfirmDeleteId(null);
      showToast("Audit deleted", "success");
      loadStats();
    } catch (err: any) {
      showToast(err.message || "Failed to delete audit", "error");
    }
  };

  const handleRerun = async (auditId: string) => {
    try {
      const updated = await api.rerunAudit(auditId);
      setAllAudits(prev => prev.map(a => a.id === auditId ? updated : a));
      setDetail(null);
      setSelectedId(auditId); // triggers re-poll
      showToast("Re-audit started", "info");
    } catch (err: any) {
      showToast(err.message || "Failed to re-run audit", "error");
    }
  };

  const handleExport = async (auditId: string, format: "json" | "csv") => {
    try {
      await api.downloadReport(auditId, format);
      showToast(`Report exported as ${format.toUpperCase()}`, "success");
    } catch {
      showToast("Export failed", "error");
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <svg className="animate-spin absolute inset-0" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(99,102,241,0.1)" strokeWidth="3"/>
              <path d="M24 4a20 20 0 0120 20" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="mono text-xs uppercase tracking-widest text-text-muted">Loading...</span>
        </div>
      </div>
    );
  }

  const severityDist = stats?.severity_distribution || { critical: 0, high: 0, medium: 0, low: 0 };
  const totalViolations = severityDist.critical + severityDist.high + severityDist.medium + severityDist.low;

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b]">
      <Sidebar userEmail={user?.email} activeSection="dashboard" />

      <div className="flex-1 overflow-y-auto">
        {/* Top header */}
        <div className="sticky top-0 z-20 px-8 py-4 flex items-center justify-between bg-[#09090b] border-b border-[#27272a]">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Compliance Dashboard</h1>
            <p className="text-xs mt-0.5 text-text-muted">Infrastructure as Code security posture analysis</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="nav-pill">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
              Engine Active
            </div>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="surface-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-text-muted">Total Audits</div>
              <div className="text-3xl font-black mb-1 text-accent-purple">{stats?.total_audits ?? 0}</div>
              <div className="text-xs text-text-secondary">manifests scanned</div>
            </div>
            <div className="surface-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-text-muted">Avg Posture Score</div>
              <div className="text-3xl font-black mb-1 text-accent-cyan">
                {stats?.average_score != null ? `${stats.average_score}%` : '—'}
              </div>
              <div className="text-xs text-text-secondary">compliance rate</div>
            </div>
            <div className="surface-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-text-muted">Total Violations</div>
              <div className="text-3xl font-black mb-1 text-accent-rose">{totalViolations}</div>
              <div className="flex items-center gap-2 text-[10px] mono mt-1 font-semibold">
                <span className="text-accent-rose">{severityDist.critical}C</span>
                <span className="text-orange-400">{severityDist.high}H</span>
                <span className="text-accent-amber">{severityDist.medium}M</span>
                <span className="text-accent-purple">{severityDist.low}L</span>
              </div>
            </div>
            <div className="surface-card p-6">
              <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-text-muted">Frameworks</div>
              <div className="flex gap-2 mt-2">
                <div className="flex-1 py-2 rounded-lg text-center text-xs font-bold bg-accent-purple/10 border border-accent-purple/20 text-accent-purple">TF</div>
                <div className="flex-1 py-2 rounded-lg text-center text-xs font-bold bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">K8S</div>
              </div>
            </div>
          </div>

          {/* Main workspace */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left column */}
            <div className="col-span-12 lg:col-span-3 space-y-5">
              {/* Upload */}
              <div className="surface-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-sm font-bold text-text-primary">New Audit</h2>
                </div>
                <FileUploadZone onUploadSuccess={handleUploadSuccess} />
              </div>

              {/* History */}
              <div className="surface-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-bold text-text-primary">Audit History</h2>
                  <span className="mono text-[10px] px-1.5 py-0.5 rounded bg-[#27272a] text-text-muted">
                    {allAudits.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {allAudits.length === 0 ? (
                    <div className="py-8 text-center text-xs text-text-muted">No audits yet</div>
                  ) : (
                    allAudits.map((a) => {
                      const isSelected = selectedId === a.id;
                      const isLive = a.status === 'pending' || a.status === 'processing';
                      const isDeleting = confirmDeleteId === a.id;
                      return (
                        <div
                          key={a.id}
                          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 border ${isSelected ? 'bg-accent-purple/10 border-accent-purple/30' : 'bg-[#18181b] border-[#27272a] hover:border-[#3f3f46]'}`}
                          onClick={() => setSelectedId(a.id)}
                        >
                          {/* file type indicator */}
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mono text-[9px] font-bold border ${a.file_type === 'terraform' ? 'bg-accent-purple/10 border-accent-purple/20 text-accent-purple' : 'bg-accent-cyan/10 border-accent-cyan/20 text-accent-cyan'}`}>
                            {a.file_type === 'terraform' ? 'TF' : 'K8'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-semibold truncate ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>
                              {a.filename}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className={`status-dot ${a.status} ${isLive ? 'animate-pulse' : ''}`} />
                              <span className="mono text-[9px] uppercase text-text-muted">{a.status}</span>
                            </div>
                          </div>
                          {a.status === 'completed' && (
                            <span className={`mono text-xs font-black flex-shrink-0 ${a.score >= 80 ? 'text-emerald-500' : a.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                              {a.score}%
                            </span>
                          )}
                          {/* Delete button */}
                          {isDeleting ? (
                            <div className="flex gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleDelete(a.id)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-text-secondary border border-zinc-700"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className="opacity-0 group-hover:opacity-100 flex-shrink-0 transition-opacity"
                              onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(a.id); }}
                              title="Delete audit"
                            >
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#475569" strokeWidth="1.2" strokeLinecap="round">
                                <path d="M2 3h8M4.5 3V2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M9.5 3v7a1 1 0 01-1 1h-5a1 1 0 01-1-1V3"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div className="col-span-12 lg:col-span-9 space-y-5">
              {detailLoading ? (
                <div className="flex items-center justify-center rounded-2xl h-[400px] bg-[#18181b] border border-[#27272a]">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="13" stroke="rgba(99,102,241,0.15)" strokeWidth="2.5"/>
                      <path d="M16 3a13 13 0 0113 13" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                    <span className="mono text-xs uppercase tracking-widest text-text-muted">Retrieving results...</span>
                  </div>
                </div>
              ) : detail ? (
                <>
                  {/* Audit header card */}
                  <div className="surface-card p-5 flex flex-col md:flex-row md:items-center gap-5">
                    {/* Score ring */}
                    {detail.status === 'completed' && (
                      <div className="flex-shrink-0">
                        <ScoreRing score={detail.score} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h2 className="text-base font-bold truncate text-text-primary max-w-[300px]">
                          {detail.filename}
                        </h2>
                        <StatusBadge status={detail.status} />
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="mono text-[10px] text-text-secondary">
                          ID: <span className="text-text-muted">{detail.id.slice(0, 8)}</span>
                        </span>
                        <span className="mono text-[10px] text-text-secondary">
                          Type: <span className="text-text-muted">{detail.file_type.toUpperCase()}</span>
                        </span>
                        {detail.completed_at && (
                          <span className="mono text-[10px] text-text-secondary">
                            Completed: <span className="text-text-muted">{new Date(detail.completed_at).toLocaleTimeString()}</span>
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      {detail.status === 'completed' && (
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handleRerun(detail.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all bg-accent-purple/10 border border-accent-purple/20 text-accent-purple hover:bg-accent-purple/20"
                          >
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                              <path d="M1 1v4h4M11 11V7H7"/>
                              <path d="M9.5 4.5A5 5 0 002.1 3L1 5M2.5 7.5A5 5 0 009.9 9L11 7"/>
                            </svg>
                            Re-audit
                          </button>
                          <button
                            onClick={() => handleExport(detail.id, "json")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all bg-accent-emerald/10 border border-accent-emerald/20 text-accent-emerald hover:bg-accent-emerald/20"
                          >
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                              <path d="M6 1v7M3 6l3 3 3-3M1 10h10"/>
                            </svg>
                            JSON
                          </button>
                          <button
                            onClick={() => handleExport(detail.id, "csv")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/20"
                          >
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                              <path d="M6 1v7M3 6l3 3 3-3M1 10h10"/>
                            </svg>
                            CSV
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Severity breakdown */}
                    {detail.status === 'completed' && detail.violations.length > 0 && (
                      <div className="flex flex-shrink-0 gap-2">
                        {([['critical', '#f43f5e'], ['high', '#f97316'], ['medium', '#f59e0b'], ['low', '#6366f1']] as [string, string][]).map(([sev, color]) => {
                          const cnt = detail.violations.filter(v => v.severity.toLowerCase() === sev).length;
                          if (cnt === 0) return null;
                          return (
                            <div key={sev} className="flex flex-col items-center justify-center px-3 py-2 rounded-xl" style={{
                              background: `${color}15`, border: `1px solid ${color}30`,
                            }}>
                              <span className="text-lg font-black leading-none" style={{ color }}>{cnt}</span>
                              <span className="mono text-[9px] uppercase mt-0.5 text-text-muted">{sev}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Violations + Code viewer */}
                  {detail.status === 'completed' && (
                    <div className="grid grid-cols-12 gap-5 h-[600px]">
                      {/* Violations list */}
                      <div className="col-span-12 md:col-span-4 surface-card p-4 overflow-hidden flex flex-col">
                        <ErrorBoundary fallbackMessage="Failed to render violations">
                          <ViolationsList violations={detail.violations} />
                        </ErrorBoundary>
                      </div>

                      {/* Code viewer */}
                      <div className="col-span-12 md:col-span-8 overflow-hidden">
                        <ErrorBoundary fallbackMessage="Failed to render code viewer">
                          <CodeViolationsViewer
                            filename={detail.filename}
                            rawContent={detail.raw_content}
                            violations={detail.violations}
                          />
                        </ErrorBoundary>
                      </div>
                    </div>
                  )}

                  {(detail.status === 'pending' || detail.status === 'processing') && (
                    <div className="surface-card p-12 flex flex-col items-center justify-center text-center">
                      <div className="relative w-16 h-16 mb-6">
                        <svg className="animate-spin absolute inset-0" width="64" height="64" viewBox="0 0 64 64" fill="none">
                          <circle cx="32" cy="32" r="27" stroke="rgba(99,102,241,0.1)" strokeWidth="3.5"/>
                          <path d="M32 5a27 27 0 0127 27" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round"/>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 rounded-full animate-pulse bg-accent-purple" />
                        </div>
                      </div>
                      <p className="text-sm font-bold mb-1.5 text-accent-purple">
                        {detail.status === 'pending' ? 'Queued for analysis...' : 'Running compliance checks...'}
                      </p>
                      <p className="text-xs text-text-muted">
                        Results will appear automatically when complete
                      </p>
                    </div>
                  )}

                  {detail.status === 'failed' && (
                    <div className="surface-card p-12 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-rose-500/10 border border-rose-500/20">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#f43f5e" strokeWidth="1.75" strokeLinecap="round">
                          <path d="M14 9v5M14 19h.01"/>
                          <circle cx="14" cy="14" r="12"/>
                        </svg>
                      </div>
                      <p className="text-sm font-bold mb-2 text-rose-500">Analysis Failed</p>
                      <p className="text-xs mb-4 text-text-muted">The audit pipeline encountered an error processing this file.</p>
                      <button
                        onClick={() => handleRerun(detail.id)}
                        className="px-4 py-1.5 rounded-lg text-xs font-medium text-accent-purple bg-accent-purple/10 border border-accent-purple/20 hover:bg-accent-purple/20"
                      >
                        Retry Audit
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center rounded-2xl text-center p-16 h-[400px] bg-[#18181b] border-2 border-dashed border-[#27272a]">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-accent-purple/10 border border-accent-purple/20">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3L23 8v12L14 25L5 20V8L14 3z"/>
                      <path d="M14 10L19 13v6L14 22L9 19v-6L14 10z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold mb-2 text-text-secondary">No audit selected</p>
                  <p className="text-xs leading-relaxed text-text-muted">
                    Upload a Terraform or Kubernetes manifest<br />to begin compliance analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
