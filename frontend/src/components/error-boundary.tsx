"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[GuardRail ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center rounded-2xl text-center p-10"
          style={{
            background: "rgba(244,63,94,0.04)",
            border: "1px solid rgba(244,63,94,0.1)",
            minHeight: 200,
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{
              background: "rgba(244,63,94,0.08)",
              border: "1px solid rgba(244,63,94,0.15)",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 6v4M10 14h.01" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          </div>
          <p className="text-sm font-bold mb-2" style={{ color: "#fb7185" }}>
            {this.props.fallbackMessage || "Something went wrong"}
          </p>
          <p className="text-xs mb-4" style={{ color: "#475569" }}>
            {this.state.error?.message || "An unexpected error occurred in this component."}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="px-4 py-1.5 rounded-lg text-xs font-medium"
            style={{
              color: "#818cf8",
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.15)",
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
