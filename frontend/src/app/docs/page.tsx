"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function DocsPage() {
  return (
    <div className="relative min-h-screen bg-[#09090b] flex flex-col">
      {/* Navigation */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl sticky top-0">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent-purple shadow-[0_0_12px_rgba(99,102,241,0.2)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
              <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8"/>
            </svg>
          </div>
          <span className="text-sm font-bold tracking-widest uppercase text-text-primary">
            Guard<span className="text-accent-purple">Rail</span>
          </span>
        </Link>
        <div className="flex gap-4">
          <Link href="/" className="btn-ghost px-4 py-2 rounded-lg text-sm hover:scale-105">Home</Link>
          <Link href="/login?mode=register" className="btn-primary px-4 py-2 rounded-lg text-sm hover:scale-105">Get Started</Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row px-4">
        
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0 border-r border-[#27272a] py-8 pr-6 hidden md:block">
          <nav className="sticky top-24 space-y-8">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-3">Getting Started</h4>
              <ul className="space-y-2">
                <li><a href="#introduction" className="text-sm text-accent-purple font-medium">Introduction</a></li>
                <li><a href="#quickstart" className="text-sm text-text-muted hover:text-text-primary transition-colors">Quickstart</a></li>
                <li><a href="#installation" className="text-sm text-text-muted hover:text-text-primary transition-colors">Installation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-text-primary mb-3">Core Concepts</h4>
              <ul className="space-y-2">
                <li><a href="#rules" className="text-sm text-text-muted hover:text-text-primary transition-colors">Rules Engine</a></li>
                <li><a href="#grading" className="text-sm text-text-muted hover:text-text-primary transition-colors">Posture Grading</a></li>
                <li><a href="#ci-cd" className="text-sm text-text-muted hover:text-text-primary transition-colors">CI/CD Integration</a></li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Documentation Body */}
        <main className="flex-1 py-8 md:pl-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-[#27272a] bg-[#18181b] text-text-muted text-xs font-bold">
              v1.0 Documentation
            </div>
            <h1 className="text-4xl font-black text-text-primary mb-4" id="introduction">Introduction to GuardRail</h1>
            <p className="text-lg text-text-secondary leading-relaxed mb-10">
              GuardRail is a Static Application Security Testing (SAST) platform tailored exclusively for Infrastructure as Code (IaC). It analyzes your Terraform and Kubernetes configurations to identify security misconfigurations before they reach production environments.
            </p>

            <h2 className="text-2xl font-bold text-text-primary mb-4 border-b border-[#27272a] pb-2" id="quickstart">Quickstart</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              To begin auditing your infrastructure, you can use our Command Line Interface (CLI) or integrate directly with your GitHub Actions. Here is how you can perform a manual scan locally.
            </p>
            
            <div className="mb-10 rounded-xl overflow-hidden border border-[#27272a]">
              <div className="bg-[#18181b] px-4 py-2 border-b border-[#27272a] flex gap-2">
                <div className="w-3 h-3 rounded-full bg-accent-rose/50" />
                <div className="w-3 h-3 rounded-full bg-accent-amber/50" />
                <div className="w-3 h-3 rounded-full bg-accent-emerald/50" />
              </div>
              <div className="bg-[#09090b] p-4 overflow-x-auto">
                <pre className="mono text-sm">
                  <code className="text-accent-purple">npm</code> <code className="text-text-primary">install -g @guardrail/cli</code>{"\n"}
                  <code className="text-text-muted"># Navigate to your terraform directory</code>{"\n"}
                  <code className="text-accent-purple">cd</code> <code className="text-text-primary">infrastructure/aws</code>{"\n"}
                  <code className="text-text-muted"># Run an audit scan</code>{"\n"}
                  <code className="text-accent-purple">guardrail</code> <code className="text-text-primary">audit .</code>
                </pre>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-4 border-b border-[#27272a] pb-2" id="rules">Rules Engine</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              Our rules engine is powered by Rego (OPA) and checks against hundreds of industry-standard security benchmarks (CIS, SOC2, PCI-DSS).
            </p>

            <div className="surface-card p-6 mb-10">
              <h3 className="text-lg font-bold text-text-primary mb-2">Example: Enforcing S3 Encryption</h3>
              <p className="text-sm text-text-muted mb-4">GuardRail automatically flags any AWS S3 bucket that lacks server-side encryption.</p>
              
              <div className="bg-[#09090b] rounded-lg border border-accent-rose/30 p-4 font-mono text-sm">
                <div className="flex gap-4">
                  <div className="text-text-muted text-right select-none border-r border-[#27272a] pr-4">1<br/>2<br/>3<br/>4</div>
                  <div>
                    <span className="text-text-primary">resource </span><span className="text-accent-cyan">"aws_s3_bucket" "unencrypted_bucket" </span>{"{"}<br/>
                    &nbsp;&nbsp;<span className="text-text-primary">bucket = </span><span className="text-accent-amber">"my-bucket"</span><br/>
                    &nbsp;&nbsp;<span className="text-accent-rose bg-accent-rose/10 inline-block px-1"># Missing aws_s3_bucket_server_side_encryption_configuration</span><br/>
                    {"}"}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-text-primary mb-4 border-b border-[#27272a] pb-2" id="ci-cd">CI/CD Integration</h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              The true power of GuardRail comes from stopping bad deployments. You can easily add GuardRail to your GitHub Actions workflow.
            </p>
            
            <div className="mb-16 rounded-xl overflow-hidden border border-[#27272a]">
              <div className="bg-[#18181b] px-4 py-2 border-b border-[#27272a] flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                <span className="text-xs text-text-muted font-medium">.github/workflows/guardrail.yml</span>
              </div>
              <div className="bg-[#09090b] p-4 overflow-x-auto">
                <pre className="mono text-sm">
                  <code className="text-accent-rose">name:</code> <code className="text-text-primary">GuardRail Audit</code>{"\n"}
                  <code className="text-accent-rose">on:</code> <code className="text-text-primary">[push, pull_request]</code>{"\n\n"}
                  <code className="text-accent-rose">jobs:</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;audit:</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;runs-on: ubuntu-latest</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;steps:</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- uses: actions/checkout@v3</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- name: Run GuardRail</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uses: guardrail-security/action@v1</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;with:</code>{"\n"}
                  <code className="text-text-primary">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;api-token: {"$"}{"{{ secrets.GUARDRAIL_TOKEN }}"}</code>{"\n"}
                </pre>
              </div>
            </div>

          </motion.div>
        </main>
      </div>
    </div>
  );
}
