"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { api } from "@/lib/api";

export default function Home() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    api.getMe().then(() => setAuthed(true)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Background orbs */}
      <div className="orb" style={{ width: 700, height: 700, left: -200, top: -200, background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 600, height: 600, right: -150, top: 50, background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 400, height: 400, bottom: -100, left: '40%', background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)' }} />

      {/* Navigation */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-[#27272a]">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-purple shadow-[0_0_12px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8"/>
              </svg>
            </div>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-text-primary">
            Guard<span className="text-accent-purple">Rail</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {['Features', 'Docs', 'Changelog'].map(item => (
            <Link 
              key={item} 
              href={`/${item.toLowerCase()}`} 
              className="btn-ghost px-4 py-2 rounded-lg text-sm hover:scale-105"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {!loading && (
            authed ? (
              <Link href="/dashboard" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform">
                Open Dashboard
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost px-5 py-2.5 rounded-xl text-sm hover:scale-105">Sign In</Link>
                <Link href="/login?mode=register" className="btn-primary px-5 py-2.5 rounded-xl text-sm inline-flex items-center gap-2 hover:scale-105 transition-transform">
                  Get Started
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7H11M11 7L8 4M11 7L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
              </>
            )
          )}
        </div>
      </header>

      {/* Hero Section */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16"
      >
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-emerald/20 bg-accent-emerald/10 text-accent-emerald text-xs font-semibold mb-8 mx-auto w-fit shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald animate-pulse" />
            Cloud Security Intelligence Platform
          </div>
        </motion.div>

        <motion.h1 variants={itemVariants} className="max-w-4xl mx-auto mb-6 font-black leading-[1.05] tracking-tight text-text-primary" style={{ fontSize: 'clamp(42px, 7vw, 80px)' }}>
          Enforce Security
          <br />
          <span className="gradient-text-purple-cyan">Before Deployment</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="max-w-xl mx-auto mb-12 text-lg leading-relaxed text-text-muted">
          Audit Terraform and Kubernetes manifests for critical security misconfigurations. GuardRail catches compliance failures instantly — before they reach production.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <Link href={authed ? "/dashboard" : "/login?mode=register"} className="btn-primary px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2.5 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            Start Auditing Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
          <button onClick={() => setIsVideoModalOpen(true)} className="btn-ghost px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2.5 hover:scale-105 transition-transform group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" className="text-text-primary ml-0.5"><path d="M4 2v12l9-6-9-6z"/></svg>
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Terminal preview block */}
        <motion.div variants={itemVariants} className="w-full max-w-2xl mx-auto mb-24">
          <div className="surface-card overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#27272a]/50">
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
        </motion.div>

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
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="surface-card p-8 text-left hover:border-[#52525b] group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${card.bgClass} group-hover:scale-110 transition-transform duration-300`}>
                {card.icon}
              </div>
              <div className={`mono text-xs mb-3 font-medium tracking-widest uppercase ${card.color}`}>
                {card.label}
              </div>
              <h3 className="text-lg font-bold mb-3 text-text-primary">{card.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{card.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto surface-card p-8 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '12+', label: 'Compliance Rules' },
              { num: '2', label: 'IaC Frameworks' },
              { num: 'A–F', label: 'Posture Grading' },
              { num: '100%', label: 'Static Analysis' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black mb-2 gradient-text-purple-cyan">{s.num}</div>
                <div className="text-xs uppercase tracking-widest font-semibold text-text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#27272a] px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#09090b]">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md flex items-center justify-center bg-accent-purple">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-wider text-text-secondary">GUARDRAIL</span>
        </div>
        <div className="flex gap-4">
          <Link href="/features" className="text-xs text-text-muted hover:text-text-primary transition-colors">Features</Link>
          <Link href="/docs" className="text-xs text-text-muted hover:text-text-primary transition-colors">Documentation</Link>
          <Link href="/changelog" className="text-xs text-text-muted hover:text-text-primary transition-colors">Changelog</Link>
        </div>
        <span className="text-xs text-text-muted">© 2026 GuardRail. All rights reserved.</span>
      </footer>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsVideoModalOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-video bg-[#09090b] rounded-2xl border border-[#27272a] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
              <div className="absolute inset-0 flex flex-col bg-[#09090b] text-left p-6 font-mono text-sm overflow-hidden">
                {/* Fake terminal header */}
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-[#27272a]">
                  <div className="w-3 h-3 rounded-full bg-accent-rose" />
                  <div className="w-3 h-3 rounded-full bg-accent-amber" />
                  <div className="w-3 h-3 rounded-full bg-accent-emerald" />
                  <span className="text-text-muted text-xs ml-2">guardrail-cli — bash</span>
                </div>

                <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                    <span className="text-text-secondary">$</span> <span className="text-accent-purple">guardrail audit</span> <span className="text-text-primary">production-infra/</span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                    <span className="text-text-muted">⠋ Analyzing Terraform state...</span>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="text-accent-cyan">
                    ✓ Found 24 configuration files
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }} className="text-accent-cyan">
                    ✓ Evaluated 142 compliance policies
                  </motion.div>

                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 4.0 }} className="mt-4 border-l-2 border-accent-rose pl-4 py-2 bg-accent-rose/5 rounded-r">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-accent-rose text-white text-xs px-1.5 py-0.5 rounded font-bold">CRITICAL</span>
                      <span className="text-text-primary font-bold">Public S3 Bucket Detected</span>
                    </div>
                    <div className="text-text-muted text-xs mb-2">production-infra/storage.tf:L45</div>
                    <div className="text-text-secondary bg-[#18181b] p-3 rounded text-xs border border-[#27272a]">
                      <div><span className="text-accent-rose">- acl = "public-read"</span></div>
                      <div><span className="text-accent-emerald">+ acl = "private"</span></div>
                    </div>
                  </motion.div>
                  
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 5.5 }} className="mt-2 border-l-2 border-orange-500 pl-4 py-2 bg-orange-500/5 rounded-r">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">HIGH</span>
                      <span className="text-text-primary font-bold">RDS Instance Missing Encryption</span>
                    </div>
                    <div className="text-text-muted text-xs">production-infra/database.tf:L112</div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 7.0 }} className="mt-6 pt-4 border-t border-[#27272a] flex items-center justify-between">
                    <div>
                      <span className="text-text-muted">Scan complete in </span><span className="text-text-primary">1.24s</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-text-muted">Posture Score:</span>
                      <span className="text-accent-rose font-bold text-lg">72/100</span>
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 8.5 }} className="mt-8 text-center flex justify-center">
                    <Link href="/login?mode=register" className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105">
                      Try it on your infrastructure
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
