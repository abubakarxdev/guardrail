"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe().then(() => setAuthed(true)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Background orbs */}
      <div className="orb" style={{ width: 700, height: 700, left: -200, top: -200, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 600, height: 600, right: -150, top: 50, background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: -100, left: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

      {/* Navigation */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-purple shadow-[0_0_12px_rgba(99,102,241,0.2)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8"/>
              </svg>
            </div>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-text-primary">
            Guard<span className="text-accent-purple">Rail</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {['Features', 'Docs', 'Changelog'].map(item => (
            <button key={item} className="btn-ghost px-4 py-2 rounded-lg text-sm">{item}</button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            authed ? (
              <Link href="/dashboard" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                Open Dashboard
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost px-5 py-2.5 rounded-xl text-sm">Sign In</Link>
                <Link href="/login" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </>
            )
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="animate-fade-up" style={{ animationFillMode: 'both' }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-emerald/20 bg-accent-emerald/10 text-accent-emerald text-xs font-semibold mb-8 mx-auto w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
            Cloud Security Intelligence Platform
          </div>
        </div>

        <h1 className="animate-fade-up delay-100 max-w-4xl mx-auto mb-6 font-black leading-[1.05] tracking-tight text-text-primary" style={{ fontSize: 'clamp(42px, 7vw, 80px)', animationFillMode: 'both' }}>
          Enforce Security
          <br />
          <span className="gradient-text-purple-cyan">Before Deployment</span>
        </h1>

        <p className="animate-fade-up delay-200 max-w-xl mx-auto mb-12 text-lg leading-relaxed text-text-muted" style={{ animationFillMode: 'both' }}>
          Audit Terraform and Kubernetes manifests for critical security misconfigurations. GuardRail catches compliance failures instantly — before they reach production.
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center mb-20" style={{ animationFillMode: 'both' }}>
          <Link href={authed ? "/dashboard" : "/login"} className="btn-primary px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2.5">
            Start Auditing Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <button className="btn-ghost px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"/><path d="M6.271 5.055a.5.5 0 01.52.038l3.5 2.5a.5.5 0 010 .814l-3.5 2.5A.5.5 0 016 10.5v-5a.5.5 0 01.271-.445z"/></svg>
            Watch Demo
          </button>
        </div>

        {/* Terminal preview block */}
        <div className="animate-fade-up delay-400 w-full max-w-2xl mx-auto mb-24" style={{ animationFillMode: 'both' }}>
          <div className="surface-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272a] bg-[#18181b]">
              <div className="w-3 h-3 rounded-full bg-accent-rose" />
              <div className="w-3 h-3 rounded-full bg-accent-amber" />
              <div className="w-3 h-3 rounded-full bg-accent-emerald" />
              <span className="mono text-xs ml-3 text-text-muted">guardrail ~ audit scan</span>
            </div>
            <div className="p-6 text-left mono text-sm bg-[#09090b]">
              <div className="text-text-secondary">$ guardrail audit <span className="text-accent-purple">vulnerable_aws_infra.tf</span></div>
              <div className="mt-2 text-text-muted">↳ Parsing Terraform manifest...</div>
              <div className="text-text-muted">↳ Running <span className="text-accent-cyan">12</span> compliance checks...</div>
              <div className="mt-2">
                <span className="text-accent-rose">✗ CRITICAL</span>
                <span className="text-text-muted"> aws_security_group.allow_ssh — Port 22 exposed 0.0.0.0/0 </span>
                <span className="text-text-secondary">L18</span>
              </div>
              <div>
                <span className="text-accent-rose">✗ CRITICAL</span>
                <span className="text-text-muted"> aws_db_instance.prod_db — publicly_accessible=true </span>
                <span className="text-text-secondary">L37</span>
              </div>
              <div>
                <span className="text-orange-400">✗ HIGH   </span>
                <span className="text-text-muted"> aws_s3_bucket.public — ACL public-read, no SSE </span>
                <span className="text-text-secondary">L7</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-text-muted">Score: </span>
                <span className="text-accent-rose font-bold">35/100 — Grade F</span>
                <span className="animate-blink text-accent-purple">_</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {[
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              color: 'text-accent-purple',
              bgClass: 'bg-accent-purple/10 border-accent-purple/20',
              label: 'Terraform',
              title: 'AWS Policy Enforcement',
              desc: 'Detect open ingress rules (SSH/RDP), unencrypted S3 buckets, overly permissive IAM wildcards, and public RDS instances before deployment.',
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07M8.46 8.46a5 5 0 0 0 0 7.07"/>
                </svg>
              ),
              color: 'text-accent-cyan',
              bgClass: 'bg-accent-cyan/10 border-accent-cyan/20',
              label: 'Kubernetes',
              title: 'Container Security Audit',
              desc: 'Identify privileged container executions, root UID violations, missing resource limits, and insecure runtime security contexts.',
            },
            {
              icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"/>
                  <polyline points="8 6 2 12 8 18"/>
                </svg>
              ),
              color: 'text-accent-emerald',
              bgClass: 'bg-accent-emerald/10 border-accent-emerald/20',
              label: 'Inline Viewer',
              title: 'Code-Level Diagnostics',
              desc: 'Browse violations highlighted line-by-line in the raw source code — with embedded remediation advice and exact fix recommendations.',
            },
          ].map((card, i) => (
            <div key={i} className="surface-card p-8 text-left animate-fade-up" style={{ animationDelay: `${0.1 * i + 0.5}s`, animationFillMode: 'both' }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${card.bgClass}`}>
                {card.icon}
              </div>
              <div className={`mono text-xs mb-3 font-medium tracking-widest uppercase ${card.color}`}>
                {card.label}
              </div>
              <h3 className="text-lg font-bold mb-3 text-text-primary">{card.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="w-full max-w-5xl mx-auto surface-card p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '12+', label: 'Compliance Rules' },
              { num: '2', label: 'IaC Frameworks' },
              { num: 'A–F', label: 'Posture Grading' },
              { num: '100%', label: 'Static Analysis' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black mb-1 gradient-text-purple-cyan">{s.num}</div>
                <div className="text-xs uppercase tracking-widest font-semibold text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#27272a] px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-accent-purple">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider text-text-secondary">GUARDRAIL</span>
        </div>
        <span className="text-xs text-text-muted">© 2026 GuardRail. Cloud Infrastructure Compliance.</span>
      </footer>
    </div>
  );
}
