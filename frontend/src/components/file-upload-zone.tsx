"use client";

import React, { useState, useRef } from "react";
import { api } from "@/lib/api";

interface FileUploadZoneProps {
  onUploadSuccess: (audit: any) => void;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploadZone({ onUploadSuccess }: FileUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const processFile = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["tf", "yaml", "yml"].includes(ext || "")) {
      setStatus("error");
      setErrorMsg("Unsupported format. Upload a Terraform (.tf) or Kubernetes (.yaml) file.");
      return;
    }
    setStatus("uploading");
    setErrorMsg("");
    try {
      const res = await api.uploadFile(file);
      setStatus("success");
      onUploadSuccess(res);
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Upload failed. Please try again.");
    } finally {
      // Reset input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div
      onClick={() => status === "idle" && fileInputRef.current?.click()}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`upload-zone rounded-2xl p-8 flex flex-col items-center justify-center text-center select-none ${dragActive ? 'drag-active' : ''}`}
      style={{ minHeight: 180 }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".tf,.yaml,.yml"
        className="hidden"
        onChange={handleChange}
      />

      {status === "idle" && (
        <>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.15)',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 13l-3-3-3 3"/>
              <path d="M10 10v7"/>
              <path d="M17 16.7a4 4 0 00-1.4-7.7H14.2A6 6 0 103 15.3"/>
            </svg>
          </div>
          <p className="text-sm font-semibold mb-1.5" style={{ color: '#94a3b8' }}>
            Drop config file here
          </p>
          <p className="text-xs" style={{ color: '#334155' }}>
            Supports <span style={{ color: '#818cf8' }}>.tf</span> (Terraform) and <span style={{ color: '#22d3ee' }}>.yaml</span> (Kubernetes)
          </p>
          <div className="mt-4 px-4 py-1.5 rounded-lg text-xs font-medium cursor-pointer" style={{
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.15)',
            color: '#818cf8',
          }}>
            Browse files
          </div>
        </>
      )}

      {status === "uploading" && (
        <>
          <div className="relative w-12 h-12 mb-4">
            <svg className="animate-spin absolute inset-0" width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" stroke="rgba(99,102,241,0.15)" strokeWidth="3"/>
              <path d="M24 4a20 20 0 0120 20" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
            </div>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#818cf8' }}>Processing manifest...</p>
          <p className="text-xs" style={{ color: '#334155' }}>Queuing compliance analysis</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.2)',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#10b981" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10l4 4 8-8"/>
            </svg>
          </div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#10b981' }}>Audit scheduled</p>
          <p className="text-xs" style={{ color: '#334155' }}>Analysis is running in background</p>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
            background: 'rgba(244,63,94,0.08)',
            border: '1px solid rgba(244,63,94,0.2)',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#f43f5e" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 6v4M10 14h.01"/>
              <circle cx="10" cy="10" r="8"/>
            </svg>
          </div>
          <p className="text-sm font-semibold mb-1.5" style={{ color: '#fb7185' }}>Upload failed</p>
          <p className="text-xs max-w-xs" style={{ color: '#64748b' }}>{errorMsg}</p>
          <button
            onClick={e => { e.stopPropagation(); setStatus("idle"); }}
            className="mt-3 text-xs px-3 py-1 rounded-lg"
            style={{ color: '#818cf8', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
