"use client";

import React, { useState } from "react";

interface Violation {
  id: string;
  policy_name: string;
  resource_id: string;
  severity: string;
  description: string;
  line_number?: number;
  line_content?: string;
}

interface ViolationsListProps {
  violations: Violation[];
  onSelectViolation?: (lineNumber?: number) => void;
}

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'];

function SeverityIcon({ severity }: { severity: string }) {
  if (severity === 'critical') return (
    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,63,94,0.12)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="#f43f5e">
        <path d="M6 1L11 10H1L6 1z"/>
        <rect x="5.5" y="4" width="1" height="3.5" rx="0.5"/>
        <rect x="5.5" y="8.25" width="1" height="1" rx="0.5"/>
      </svg>
    </div>
  );
  if (severity === 'high') return (
    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.12)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="#fb923c">
        <path d="M6 1L11 10H1L6 1z"/>
        <rect x="5.5" y="4" width="1" height="3.5" rx="0.5"/>
        <rect x="5.5" y="8.25" width="1" height="1" rx="0.5"/>
      </svg>
    </div>
  );
  if (severity === 'medium') return (
    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="#fbbf24">
        <circle cx="6" cy="6" r="5" fill="none" stroke="#fbbf24" strokeWidth="1.5"/>
        <rect x="5.5" y="3" width="1" height="4" rx="0.5"/>
        <rect x="5.5" y="8" width="1" height="1" rx="0.5"/>
      </svg>
    </div>
  );
  return (
    <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.12)' }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="6" cy="6" r="5"/>
        <path d="M6 5.5v3"/>
        <circle cx="6" cy="3.5" r="0.5" fill="#818cf8"/>
      </svg>
    </div>
  );
}

export default function ViolationsList({ violations, onSelectViolation }: ViolationsListProps) {
  const [filter, setFilter] = useState<string | null>(null);
  
  const sorted = [...violations].sort((a, b) =>
    SEVERITY_ORDER.indexOf(a.severity.toLowerCase()) - SEVERITY_ORDER.indexOf(b.severity.toLowerCase())
  );
  
  const filtered = filter ? sorted.filter(v => v.severity.toLowerCase() === filter) : sorted;
  
  const counts = { critical: 0, high: 0, medium: 0, low: 0 };
  violations.forEach(v => { const s = v.severity.toLowerCase() as keyof typeof counts; if (s in counts) counts[s]++; });

  const badgeColors: Record<string, { bg: string; color: string; border: string }> = {
    critical: { bg: 'rgba(244,63,94,0.08)', color: '#fb7185', border: 'rgba(244,63,94,0.2)' },
    high:     { bg: 'rgba(249,115,22,0.08)', color: '#fb923c', border: 'rgba(249,115,22,0.2)' },
    medium:   { bg: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: 'rgba(245,158,11,0.2)' },
    low:      { bg: 'rgba(99,102,241,0.08)',  color: '#818cf8', border: 'rgba(99,102,241,0.2)' },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>Violations</h3>
          <span className="mono text-xs px-2 py-0.5 rounded-md font-semibold" style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b' }}>
            {violations.length}
          </span>
        </div>
        {filter && (
          <button onClick={() => setFilter(null)} className="text-xs" style={{ color: '#6366f1' }}>
            Clear filter
          </button>
        )}
      </div>

      {/* Severity filters */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {Object.entries(counts).map(([sev, count]) => {
          if (count === 0) return null;
          const c = badgeColors[sev];
          const active = filter === sev;
          return (
            <button
              key={sev}
              onClick={() => setFilter(active ? null : sev)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
              style={{
                background: active ? c.bg : 'transparent',
                color: active ? c.color : '#334155',
                border: `1px solid ${active ? c.border : 'rgba(255,255,255,0.05)'}`,
              }}
            >
              {count} {sev}
            </button>
          );
        })}
      </div>

      {/* Violations list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-0.5">
        {violations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9l3 3 7-7"/>
              </svg>
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#10b981' }}>All Clear</p>
            <p className="text-xs" style={{ color: '#1e293b' }}>No policy violations detected</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-8 text-center text-xs" style={{ color: '#334155' }}>No {filter} violations found</div>
        ) : (
          filtered.map((v) => {
            const sev = v.severity.toLowerCase();
            const c = badgeColors[sev] || badgeColors.low;
            return (
              <div
                key={v.id}
                onClick={() => onSelectViolation?.(v.line_number)}
                className="group p-3 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  background: 'rgba(8,15,26,0.6)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = c.border;
                  (e.currentTarget as HTMLElement).style.background = `${c.bg}`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(8,15,26,0.6)';
                }}
              >
                <div className="flex items-start gap-2.5">
                  <SeverityIcon severity={sev} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="mono text-[10px] font-semibold truncate" style={{ color: '#94a3b8' }}>
                        {v.policy_name}
                      </span>
                      <span className="mono text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0" style={{
                        background: c.bg, color: c.color, border: `1px solid ${c.border}`
                      }}>
                        {sev}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: '#475569' }}>
                      {v.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="mono text-[10px] truncate" style={{ color: '#1e293b' }}>
                        {v.resource_id.split(':')[0]}
                      </span>
                      {v.line_number && (
                        <span className="mono text-[10px] flex-shrink-0" style={{
                          background: 'rgba(255,255,255,0.04)', color: '#334155', padding: '0 4px', borderRadius: 4
                        }}>
                          L{v.line_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
