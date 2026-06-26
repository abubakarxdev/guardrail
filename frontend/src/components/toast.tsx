"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDone={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDone }: { toast: Toast; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 4s
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300); // Wait for exit animation
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDone]);

  const configs: Record<ToastType, { icon: string; color: string; bg: string; border: string }> = {
    success: { icon: "✓", color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)" },
    error:   { icon: "✕", color: "#f43f5e", bg: "rgba(244,63,94,0.08)", border: "rgba(244,63,94,0.2)" },
    info:    { icon: "ℹ", color: "#818cf8", bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)" },
  };
  const c = configs[toast.type];

  return (
    <div
      style={{
        pointerEvents: "auto",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 16px",
        borderRadius: 14,
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.02)`,
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity: visible ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        maxWidth: 380,
        cursor: "pointer",
      }}
      onClick={() => {
        setVisible(false);
        setTimeout(onDone, 300);
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          color: c.color,
          background: `${c.color}15`,
          flexShrink: 0,
        }}
      >
        {c.icon}
      </span>
      <span style={{ fontSize: 12, fontWeight: 500, color: "#e2e8f0", lineHeight: "1.4" }}>
        {toast.message}
      </span>
    </div>
  );
}
