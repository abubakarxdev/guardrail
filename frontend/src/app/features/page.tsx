"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export default function FeaturesPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b]">
      {/* Background orbs */}
      <div className="orb" style={{ width: 800, height: 800, left: -400, top: -200, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
      <div className="orb" style={{ width: 600, height: 600, right: -200, bottom: -100, background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />

      {/* Navigation */}
      <header className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-xl">
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

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-24 pb-16 max-w-6xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-24"
        >
          <motion.div variants={itemVariants} className="inline-block mb-6 px-3 py-1.5 rounded-full border border-accent-purple/20 bg-accent-purple/10 text-accent-purple text-xs font-bold tracking-widest uppercase">
            Platform Capabilities
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black mb-6 text-text-primary tracking-tight">
            Security embedded in your <br className="hidden md:block"/> <span className="gradient-text-purple-cyan">development lifecycle.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            From local development to CI/CD pipelines, GuardRail ensures your infrastructure is compliant before a single resource is provisioned.
          </motion.p>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
          {/* Main Large Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 surface-card p-8 flex flex-col justify-between overflow-hidden relative group hover:border-accent-purple/50 transition-colors"
          >
            <div className="relative z-10 w-full max-w-md">
              <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center mb-6 text-accent-purple group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Comprehensive IaC Scanning</h3>
              <p className="text-text-secondary leading-relaxed">
                Scan Terraform AWS modules and Kubernetes manifests for hundreds of known misconfigurations. Catch over-permissive IAM roles, public S3 buckets, and privileged pods in seconds.
              </p>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute -right-20 -bottom-20 w-[400px] h-[300px] bg-[#18181b] border border-[#27272a] rounded-xl transform rotate-12 group-hover:rotate-6 transition-transform duration-700 p-6 flex flex-col gap-3 opacity-50 group-hover:opacity-100">
               <div className="w-full h-8 bg-accent-rose/20 rounded border border-accent-rose/30" />
               <div className="w-3/4 h-8 bg-accent-emerald/20 rounded border border-accent-emerald/30" />
               <div className="w-5/6 h-8 bg-accent-amber/20 rounded border border-accent-amber/30" />
            </div>
          </motion.div>

          {/* Small Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="surface-card p-8 flex flex-col justify-between group hover:border-accent-cyan/50 transition-colors"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mb-6 text-accent-cyan group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">CI/CD Ready</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Integrate directly into GitHub Actions or GitLab CI. Fail builds automatically when severe compliance violations are detected.
              </p>
            </div>
          </motion.div>

          {/* Small Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="surface-card p-8 flex flex-col justify-between group hover:border-accent-emerald/50 transition-colors"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-accent-emerald/10 border border-accent-emerald/20 flex items-center justify-center mb-6 text-accent-emerald group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Contextual Guidance</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Not just alerts. GuardRail provides exact code remediation snippets and explains why a configuration is a security risk.
              </p>
            </div>
          </motion.div>

          {/* Wide Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 surface-card p-8 flex flex-col justify-center group hover:border-accent-amber/50 transition-colors"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="w-12 h-12 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center mb-6 text-accent-amber group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">Unified Dashboard</h3>
                <p className="text-text-secondary leading-relaxed">
                  Monitor your entire organization's compliance posture in one place. Track resolution times, view historical trends, and export audit reports for compliance frameworks like SOC2 and ISO27001.
                </p>
              </div>
              <div className="flex-1 w-full bg-[#18181b] border border-[#27272a] rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-muted font-bold">POSTURE SCORE</span>
                  <span className="text-xs text-accent-emerald font-bold">92/100</span>
                </div>
                <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: "92%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-accent-emerald"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl font-bold text-text-primary mb-6">Ready to secure your infrastructure?</h2>
          <Link href="/login?mode=register" className="btn-primary px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center gap-2.5 hover:scale-105 transition-transform">
            Start Auditing Free
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
