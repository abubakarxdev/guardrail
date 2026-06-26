"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    setLoading(true);
    try {
      await api.resetPassword({ token, new_password: password });
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full max-w-sm relative z-10 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <h3 className="text-2xl font-bold mb-2" style={{ color: '#f1f5f9' }}>
        Reset your password
      </h3>
      <p className="text-sm mb-8" style={{ color: '#475569' }}>
        Enter your new password below.
      </p>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{
          background: 'rgba(244,63,94,0.06)',
          border: '1px solid rgba(244,63,94,0.2)'
        }}>
          <svg className="mt-0.5 flex-shrink-0" width="14" height="14" viewBox="0 0 16 16" fill="#f43f5e">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.5.5 0 01.5.5v3a.5.5 0 01-1 0v-3A.5.5 0 018 4zm0 7a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
          </svg>
          <span className="text-sm" style={{ color: '#fb7185' }}>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6" style={{
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.2)'
        }}>
          <span className="text-sm" style={{ color: '#10b981' }}>Password reset successfully! Redirecting to login...</span>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: '#475569' }}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-cyber w-full px-4 py-3.5 rounded-xl text-sm pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
            
            {password && (
              <div className="mt-3 space-y-1.5 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748b' }}>Password Requirements</div>
                <div className="flex items-center gap-2 text-xs" style={{ color: password.length >= 8 && password.length <= 72 ? '#10b981' : '#64748b' }}>
                  <span className="w-3 flex justify-center">{password.length >= 8 && password.length <= 72 ? '✓' : '•'}</span>
                  8-72 characters
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: /[A-Z]/.test(password) ? '#10b981' : '#64748b' }}>
                  <span className="w-3 flex justify-center">{/[A-Z]/.test(password) ? '✓' : '•'}</span>
                  One uppercase letter
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: /[a-z]/.test(password) ? '#10b981' : '#64748b' }}>
                  <span className="w-3 flex justify-center">{/[a-z]/.test(password) ? '✓' : '•'}</span>
                  One lowercase letter
                </div>
                <div className="flex items-center gap-2 text-xs" style={{ color: /[0-9]/.test(password) ? '#10b981' : '#64748b' }}>
                  <span className="w-3 flex justify-center">{/[0-9]/.test(password) ? '✓' : '•'}</span>
                  One number
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="btn-primary w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            ) : (
              <>Reset password</>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => router.push("/login")}
          className="text-sm w-full text-center transition-colors"
          style={{ color: '#475569' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
          onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
        >
          Return to <span style={{ color: '#818cf8', fontWeight: 600 }}>Sign in</span>
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <div className="relative min-h-screen flex overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-16" style={{
        background: 'linear-gradient(135deg, rgba(6,13,24,1) 0%, rgba(8,18,32,1) 100%)',
        borderRight: '1px solid rgba(255,255,255,0.04)'
      }}>
        <div className="orb" style={{ width: 400, height: 400, left: -100, top: -100, background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        <div className="orb" style={{ width: 300, height: 300, right: 0, bottom: 50, background: 'radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)' }} />

        <div className="relative z-10 max-w-sm">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 24px rgba(99,102,241,0.4)'
            }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.7"/>
              </svg>
            </div>
            <span className="font-black text-xl tracking-widest" style={{ color: '#e2e8f0', letterSpacing: '0.1em' }}>
              GUARD<span style={{ color: '#818cf8' }}>RAIL</span>
            </span>
          </div>
          <h2 className="text-4xl font-black mb-4 leading-tight" style={{ color: '#f1f5f9' }}>
            Secure Your Cloud
            <br />
            <span className="gradient-text-purple-cyan">Infrastructure</span>
          </h2>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16 relative">
        <div className="orb" style={{ width: 300, height: 300, right: -50, top: -50, background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
        
        <Suspense fallback={<div className="text-white">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
