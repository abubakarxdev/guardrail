"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout-sidebar";

interface PolicyRule {
  id: string;
  name: string;
  description: string;
  severity: string;
  framework: string;
  category: string;
}

const SEVERITY_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  critical: { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.2)' },
  high:     { color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  medium:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  low:      { color: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.2)' },
};

const FRAMEWORK_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  terraform:  { label: 'Terraform',  color: '#818cf8', bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.15)' },
  kubernetes: { label: 'Kubernetes', color: '#22d3ee', bg: 'rgba(34,211,238,0.08)',  border: 'rgba(34,211,238,0.15)' },
};

export default function PoliciesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [policies, setPolicies] = useState<PolicyRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterFramework, setFilterFramework] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const u = await api.getMe();
        setUser(u);
        const p = await api.getPolicies();
        setPolicies(p);
      } catch {
        api.logout();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <svg className="animate-spin absolute inset-0" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(99,102,241,0.1)" strokeWidth="3"/>
              <path d="M24 4a20 20 0 0120 20" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="mono text-xs uppercase tracking-widest" style={{ color: '#334155' }}>Loading policies...</span>
        </div>
      </div>
    );
  }

  const filtered = policies.filter(p => {
    if (filterFramework !== "all" && p.framework !== filterFramework) return false;
    if (filterSeverity !== "all" && p.severity !== filterSeverity) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Group by category
  const grouped: Record<string, PolicyRule[]> = {};
  filtered.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const severityCounts = {
    critical: policies.filter(p => p.severity === 'critical').length,
    high: policies.filter(p => p.severity === 'high').length,
    medium: policies.filter(p => p.severity === 'medium').length,
    low: policies.filter(p => p.severity === 'low').length,
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar userEmail={user?.email} activeSection="rules" />

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 px-8 py-4 flex items-center justify-between" style={{
          background: 'rgba(2,4,8,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <div>
            <h1 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>Policy Rules Engine</h1>
            <p className="text-xs mt-0.5" style={{ color: '#334155' }}>
              {policies.length} active security policies across Terraform &amp; Kubernetes
            </p>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Summary stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(['critical', 'high', 'medium', 'low'] as const).map(sev => {
              const c = SEVERITY_CONFIG[sev];
              return (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(filterSeverity === sev ? 'all' : sev)}
                  className="stat-card rounded-2xl p-4 text-left transition-all"
                  style={{
                    border: filterSeverity === sev ? `1px solid ${c.border}` : undefined,
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#334155' }}>{sev}</div>
                  <div className="text-2xl font-black" style={{ color: c.color }}>{severityCounts[sev]}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: '#1e293b' }}>policies</div>
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="#334155" strokeWidth="1.3" strokeLinecap="round">
                <circle cx="5.5" cy="5.5" r="4.5"/>
                <path d="M9 9l3 3"/>
              </svg>
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                  outline: 'none',
                }}
              />
            </div>

            {/* Framework filters */}
            {['all', 'terraform', 'kubernetes'].map(fw => {
              const isActive = filterFramework === fw;
              const label = fw === 'all' ? 'All Frameworks' : FRAMEWORK_CONFIG[fw].label;
              const color = fw === 'all' ? '#94a3b8' : FRAMEWORK_CONFIG[fw].color;
              return (
                <button
                  key={fw}
                  onClick={() => setFilterFramework(fw)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    background: isActive ? `${color}15` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? `${color}30` : 'rgba(255,255,255,0.05)'}`,
                    color: isActive ? color : '#475569',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Policy cards grouped by category */}
          {Object.keys(grouped).length === 0 ? (
            <div className="py-16 text-center text-sm" style={{ color: '#334155' }}>
              No policies match your filters
            </div>
          ) : (
            Object.entries(grouped).map(([category, rules]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#475569' }}>{category}</h3>
                  <span className="mono text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', color: '#334155' }}>{rules.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {rules.map(rule => {
                    const sevConf = SEVERITY_CONFIG[rule.severity] || SEVERITY_CONFIG.medium;
                    const fwConf = FRAMEWORK_CONFIG[rule.framework] || FRAMEWORK_CONFIG.terraform;
                    return (
                      <div
                        key={rule.id}
                        className="glass-card rounded-2xl p-5 transition-all hover:border-opacity-40"
                        style={{ borderLeft: `3px solid ${sevConf.color}` }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <h4 className="text-sm font-bold" style={{ color: '#e2e8f0' }}>{rule.name}</h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="mono text-[9px] font-bold uppercase px-2 py-0.5 rounded-md" style={{
                              background: sevConf.bg, color: sevConf.color, border: `1px solid ${sevConf.border}`,
                            }}>
                              {rule.severity}
                            </span>
                            <span className="mono text-[9px] font-bold px-2 py-0.5 rounded-md" style={{
                              background: fwConf.bg, color: fwConf.color, border: `1px solid ${fwConf.border}`,
                            }}>
                              {fwConf.label}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748b' }}>
                          {rule.description}
                        </p>
                        <div className="mono text-[10px]" style={{ color: '#1e293b' }}>
                          Policy ID: <span style={{ color: '#334155' }}>{rule.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
