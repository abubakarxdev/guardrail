"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout-sidebar";
import { useToast } from "@/components/toast";
import { motion, AnimatePresence } from "framer-motion";

function AccordionItem({ q, a, index }: { q: string, a: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      className="border border-[#27272a] rounded-xl bg-[#18181b]/50 overflow-hidden"
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#27272a]/50 transition-colors"
      >
        <span className="font-medium text-sm text-text-primary">{q}</span>
        <svg 
          className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="p-4 pt-0 text-sm text-text-secondary leading-relaxed border-t border-[#27272a]/50 mt-2">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SupportPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    api.getMe()
      .then(setUser)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast("Please fill in all fields", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.submitSupportTicket(ticketSubject, ticketMessage);
      showToast("Ticket submitted successfully. We'll be in touch soon.", "success");
      setTicketSubject("");
      setTicketMessage("");
    } catch (err: any) {
      showToast(err.message || "Failed to submit ticket. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#09090b]">
        <div className="w-8 h-8 rounded-full border-2 border-accent-purple border-t-transparent animate-spin" />
      </div>
    );
  }

  const faqs = [
    {
      q: "How often are the compliance rules updated?",
      a: "Our Rego policy engine is updated weekly with new CIS benchmarks and community-driven security standards for AWS and Kubernetes."
    },
    {
      q: "Can I run GuardRail in my CI/CD pipeline?",
      a: "Yes! You can use our official GitHub Action or invoke the guardrail-cli directly in your Jenkins/GitLab pipelines. See the Documentation for setup instructions."
    },
    {
      q: "What does the Posture Score mean?",
      a: "The Posture Score is calculated based on the ratio of passed checks vs failed checks, weighted by the severity (Critical, High, Medium, Low) of any violations found in your scan."
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-text-primary selection:bg-accent-purple/30">
      <Sidebar userEmail={user?.email} activeSection="support" />

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative p-8 md:p-12">
        <div className="orb" style={{ width: 800, height: 800, right: -300, top: -200, background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 60%)' }} />

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="mb-12">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-bold uppercase tracking-widest mb-6"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              Help Center
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black text-text-primary mb-4 tracking-tight"
            >
              How can we help you?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-text-secondary max-w-2xl"
            >
              Whether you're experiencing technical issues or have questions about your posture score, our engineering team is here to assist.
            </motion.p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#18181b]/30 border border-[#27272a] rounded-2xl p-6 md:p-8 backdrop-blur-xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[80px] rounded-full pointer-events-none" />
                
                <h2 className="text-xl font-bold mb-8 text-text-primary flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  Submit a Ticket
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Subject</label>
                    <input 
                      type="text" 
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all"
                      placeholder="E.g. False positive on AWS S3 Bucket rule"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Message</label>
                    <textarea 
                      className="w-full bg-[#09090b] border border-[#27272a] rounded-xl px-4 py-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-all min-h-[200px] resize-y"
                      placeholder="Please describe the issue you're facing in detail. Include any relevant resource IDs or rule names..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      className="w-full sm:w-auto bg-accent-purple text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-accent-purple/90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Submitting Ticket...
                        </>
                      ) : (
                        <>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Right Column: Status & FAQs */}
            <div className="lg:col-span-5 space-y-8">
              {/* System Status */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-accent-emerald/5 border border-accent-emerald/20 rounded-2xl p-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-emerald/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="flex items-start gap-4">
                  <div className="relative mt-1">
                    <div className="w-3 h-3 rounded-full bg-accent-emerald shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                    <div className="absolute inset-0 rounded-full bg-accent-emerald animate-ping opacity-75" />
                  </div>
                  <div>
                    <h3 className="font-bold text-accent-emerald text-sm uppercase tracking-wider mb-2">All Systems Operational</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      The GuardRail API, Rego processing engine, and Web Dashboard are currently running perfectly with zero latency.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* FAQs */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#18181b]/30 border border-[#27272a] rounded-2xl p-6 backdrop-blur-xl"
              >
                <h3 className="font-bold text-lg mb-6 text-text-primary flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} q={faq.q} a={faq.a} index={i} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
