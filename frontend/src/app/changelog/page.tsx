"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function ChangelogPage() {
  const changelogs = [
    {
      version: "v1.0.0",
      date: "August 15, 2026",
      tag: "Major Release",
      title: "GuardRail Official 1.0 Release",
      description: "We are thrilled to announce the official 1.0 release of GuardRail. This update brings massive improvements to the core rules engine and introduces the long-awaited unified dashboard.",
      highlights: [
        "Brand new high-contrast Linear-style UI across all public and internal pages.",
        "Added over 45 new CIS benchmark checks for AWS Terraform modules.",
        "Introduced the Posture Grading system (A-F) on the dashboard.",
        "Full support for Kubernetes 1.30 runtime manifests."
      ]
    },
    {
      version: "v0.9.5",
      date: "July 22, 2026",
      tag: "Feature",
      title: "GitHub Actions CI/CD Integration",
      description: "You can now integrate GuardRail directly into your continuous integration pipelines to fail builds automatically when critical misconfigurations are detected.",
      highlights: [
        "Released the official `guardrail-security/action` for GitHub Actions.",
        "Added `--fail-on-critical` flag to the CLI.",
        "Improved parsing speed for large Terraform monolithic state files by 40%."
      ]
    },
    {
      version: "v0.9.0",
      date: "June 05, 2026",
      tag: "Beta",
      title: "Initial Public Beta",
      description: "GuardRail is now open for public beta! Start analyzing your cloud infrastructure for free.",
      highlights: [
        "Core Rego engine implementation.",
        "Support for basic AWS services (S3, EC2, RDS, IAM).",
        "Interactive CLI output with violation code blocks."
      ]
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#09090b]">
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

      {/* Header */}
      <div className="relative z-10 px-6 pt-24 pb-16 max-w-3xl mx-auto text-center border-b border-[#27272a] mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-black mb-6 text-text-primary tracking-tight"
        >
          Changelog
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-text-muted leading-relaxed"
        >
          Stay up to date with the latest features, enhancements, and bug fixes for the GuardRail platform.
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <div className="relative border-l border-[#27272a] ml-4 md:ml-8 pl-8 md:pl-12 space-y-24">
          {changelogs.map((log, index) => (
            <motion.div 
              key={log.version}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Node */}
              <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-5 h-5 rounded-full bg-[#09090b] border-2 border-accent-purple flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-accent-purple" />
              </div>

              {/* Version & Date */}
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4 mb-4">
                <h2 className="text-2xl font-black text-text-primary">{log.version}</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-text-muted">{log.date}</span>
                  <span className="inline-block px-2 py-0.5 rounded border border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan text-[10px] font-bold uppercase tracking-wider">
                    {log.tag}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="surface-card p-6 md:p-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">{log.title}</h3>
                <p className="text-text-secondary leading-relaxed mb-6">
                  {log.description}
                </p>
                <ul className="space-y-3">
                  {log.highlights.map((highlight, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="mt-1 flex-shrink-0 text-accent-purple" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                      <span className="text-sm text-text-secondary">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
