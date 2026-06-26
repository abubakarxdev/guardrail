"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/layout-sidebar";
import { useToast } from "@/components/toast";

export default function Settings() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Security form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!api.getToken()) {
      router.push("/login");
      return;
    }

    api.getMe()
      .then(setUser)
      .catch(() => {
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await api.updatePassword({
        current_password: currentPassword,
        new_password: newPassword
      });
      showToast("Password updated successfully", "success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040911]">
        <div className="w-8 h-8 rounded-full border-2 border-[#818cf8] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#040911] text-slate-300">
      <Sidebar userEmail={user?.email} activeSection="settings" />

      <main className="flex-1 overflow-y-auto relative p-8">
        <div className="orb" style={{ width: 500, height: 500, right: -100, top: -100, background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Settings</h1>
            <p className="text-slate-500">Manage your account profile and security preferences.</p>
          </header>

          <div className="flex gap-8">
            {/* Tabs sidebar */}
            <div className="w-48 flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "profile" 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === "security" 
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                Security
              </button>
            </div>

            {/* Content area */}
            <div className="flex-1">
              {activeTab === "profile" && (
                <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-semibold text-slate-100 mb-6">Profile Information</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                        Email Address
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user?.email || ""}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm opacity-70 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-2">Email address cannot be changed. Contact support if you need to migrate your account.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                        Account Created
                      </label>
                      <input
                        type="text"
                        disabled
                        value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ""}
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-sm opacity-70 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="p-6 rounded-xl border border-white/10 bg-white/[0.02]">
                  <h3 className="text-lg font-semibold text-slate-100 mb-6">Change Password</h3>
                  
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={currentPassword}
                          onChange={e => setCurrentPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="input-cyber w-full px-4 py-3 rounded-xl text-sm pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showCurrentPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="input-cyber w-full px-4 py-3 rounded-xl text-sm pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          {showNewPassword ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          )}
                        </button>
                      </div>
                      
                      {newPassword && (
                        <div className="mt-4 grid grid-cols-2 gap-3 p-4 rounded-lg bg-black/20 border border-white/5">
                          <div className="flex items-center gap-2 text-xs" style={{ color: newPassword.length >= 8 && newPassword.length <= 72 ? '#10b981' : '#64748b' }}>
                            <span className="w-3 flex justify-center">{newPassword.length >= 8 && newPassword.length <= 72 ? '✓' : '•'}</span>
                            8-72 characters
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: /[A-Z]/.test(newPassword) ? '#10b981' : '#64748b' }}>
                            <span className="w-3 flex justify-center">{/[A-Z]/.test(newPassword) ? '✓' : '•'}</span>
                            One uppercase letter
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: /[a-z]/.test(newPassword) ? '#10b981' : '#64748b' }}>
                            <span className="w-3 flex justify-center">{/[a-z]/.test(newPassword) ? '✓' : '•'}</span>
                            One lowercase letter
                          </div>
                          <div className="flex items-center gap-2 text-xs" style={{ color: /[0-9]/.test(newPassword) ? '#10b981' : '#64748b' }}>
                            <span className="w-3 flex justify-center">{/[0-9]/.test(newPassword) ? '✓' : '•'}</span>
                            One number
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={updating || !newPassword || !currentPassword}
                        className="btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                      >
                        {updating ? (
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3"/>
                            <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          "Update Password"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
