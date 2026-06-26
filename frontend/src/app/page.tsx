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
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Background orbs */}
      <div className="orb" style={{ width: 700, height: 700, left: -200, top: -200, background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 600, height: 600, right: -150, top: 50, background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: -100, left: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />

      {/* Scanline decoration */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.005) 2px, rgba(255,255,255,0.005) 4px)',
      }} />

      {/* Navigation */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase" style={{ color: '#e2e8f0', letterSpacing: '0.12em' }}>
            Guard<span style={{ color: '#818cf8' }}>Rail</span>
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
          <div className="nav-pill mb-8 mx-auto w-fit">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.8)', display: 'inline-block' }} />
            Cloud Security Intelligence Platform
          </div>
        </div>

        <h1 className="animate-fade-up delay-100 max-w-4xl mx-auto mb-6 font-black leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(42px, 7vw, 80px)', animationFillMode: 'both' }}>
          <span style={{ color: '#f1f5f9' }}>Enforce Security</span>
          <br />
          <span className="gradient-text-purple-cyan">Before Deployment</span>
        </h1>

        <p className="animate-fade-up delay-200 max-w-xl mx-auto mb-12 text-lg leading-relaxed" style={{ color: '#64748b', animationFillMode: 'both' }}>
          Audit Terraform and Kubernetes manifests for critical security misconfigurations. GuardRail catches compliance failures instantly — before they reach production.
        </p>

        <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center mb-20" style={{ animationFillMode: 'both' }}>
          <Link href={authed ? "/dashboard" : "/login"} className="btn-primary px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2.5">
            Start Auditing Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <button className="btn-ghost px-8 py-4 rounded-2xl text-base font-semibold inline-flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"/><path d="M6.271 5.055a.5.5 0 01.52.038l3.5 2.5a.5.5 0 010 .814l-3.5 2.5A.5.5 0 016 10.5v-5a.5.5 0 01.271-.445z"/></svg>
            Watch Demo
          </button>
        </div>

        {/* Terminal preview block */}
        <div className="animate-fade-up delay-400 w-full max-w-2xl mx-auto mb-24" style={{ animationFillMode: 'both' }}>
          <div className="glass rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)' }}>
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: 'rgba(5,10,18,0.8)' }}>
              <div className="w-3 h-3 rounded-full" style={{ background: '#f43f5e' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#f59e0b' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#10b981' }} />
              <span className="mono text-xs ml-3" style={{ color: '#334155' }}>guardrail ~ audit scan</span>
            </div>
            <div className="p-6 text-left mono text-sm" style={{ background: 'rgba(3,8,15,0.9)' }}>
              <div style={{ color: '#334155' }}>$ guardrail audit <span style={{ color: '#818cf8' }}>vulnerable_aws_infra.tf</span></div>
              <div className="mt-2" style={{ color: '#64748b' }}>↳ Parsing Terraform manifest...</div>
              <div style={{ color: '#64748b' }}>↳ Running <span style={{ color: '#22d3ee' }}>12</span> compliance checks...</div>
              <div className="mt-2">
                <span style={{ color: '#f43f5e' }}>✗ CRITICAL</span>
                <span style={{ color: '#64748b' }}> aws_security_group.allow_ssh — Port 22 exposed 0.0.0.0/0 </span>
                <span style={{ color: '#334155' }}>L18</span>
              </div>
              <div>
                <span style={{ color: '#f43f5e' }}>✗ CRITICAL</span>
                <span style={{ color: '#64748b' }}> aws_db_instance.prod_db — publicly_accessible=true </span>
                <span style={{ color: '#334155' }}>L37</span>
              </div>
              <div>
                <span style={{ color: '#fb923c' }}>✗ HIGH   </span>
                <span style={{ color: '#64748b' }}> aws_s3_bucket.public — ACL public-read, no SSE </span>
                <span style={{ color: '#334155' }}>L7</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span style={{ color: '#64748b' }}>Score: </span>
                <span style={{ color: '#f43f5e', fontWeight: 700 }}>35/100 — Grade F</span>
                <span className="animate-blink" style={{ color: '#6366f1' }}>_</span>
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
              color: '#6366f1',
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
              color: '#22d3ee',
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
              color: '#10b981',
              label: 'Inline Viewer',
              title: 'Code-Level Diagnostics',
              desc: 'Browse violations highlighted line-by-line in the raw source code — with embedded remediation advice and exact fix recommendations.',
            },
          ].map((card, i) => (
            <div key={i} className="feature-card text-left animate-fade-up" style={{ animationDelay: `${0.1 * i + 0.5}s`, animationFillMode: 'both' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${card.color}12`, border: `1px solid ${card.color}22` }}>
                {card.icon}
              </div>
              <div className="mono text-xs mb-3 font-medium tracking-widest uppercase" style={{ color: card.color }}>
                {card.label}
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ color: '#e2e8f0' }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div className="w-full max-w-5xl mx-auto glass rounded-3xl p-8 mb-16" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '12+', label: 'Compliance Rules' },
              { num: '2', label: 'IaC Frameworks' },
              { num: 'A–F', label: 'Posture Grading' },
              { num: '100%', label: 'Static Analysis' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black mb-1 gradient-text-purple-cyan">{s.num}</div>
                <div className="text-xs uppercase tracking-widest font-semibold" style={{ color: '#334155' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t px-8 py-6 flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider" style={{ color: '#334155' }}>GUARDRAIL</span>
        </div>
        <span className="text-xs" style={{ color: '#1e293b' }}>© 2026 GuardRail. Cloud Infrastructure Compliance.</span>
      </footer>
    </div>
  );
}
