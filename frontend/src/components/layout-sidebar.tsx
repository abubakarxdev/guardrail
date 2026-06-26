"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface SidebarProps {
  userEmail?: string;
  activeSection?: string;
}

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="1" width="6" height="6" rx="1.5"/>
        <rect x="8" y="1" width="6" height="6" rx="1.5"/>
        <rect x="1" y="8" width="6" height="6" rx="1.5"/>
        <rect x="8" y="8" width="6" height="6" rx="1.5"/>
      </svg>
    ),
  },
  {
    id: 'rules',
    label: 'Policy Rules',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7.5 1L13 4.25v6.5L7.5 14 2 10.75V4.25L7.5 1z"/>
        <path d="M7.5 4L10.5 5.75v3.5L7.5 11 4.5 9.25V5.75L7.5 4z"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7.5" cy="7.5" r="2.5"/>
        <path d="M12.5 7.5a5 5 0 01-1.3 3.3l1.8 1.8-1.4 1.4-1.8-1.8A5 5 0 017.5 12.5v2h-2v-2a5 5 0 01-3.3-1.3l-1.8 1.8-1.4-1.4 1.8-1.8A5 5 0 012.5 7.5h-2v-2h2a5 5 0 011.3-3.3L2 1.4 3.4 0l1.8 1.8A5 5 0 017.5 2.5v-2h2v2a5 5 0 013.3 1.3l1.8-1.8L15 2.4l-1.8 1.8A5 5 0 0112.5 7.5z"/>
      </svg>
    ),
  },
];

export default function Sidebar({ userEmail = "", activeSection = "dashboard" }: SidebarProps) {
  const router = useRouter();

  const handleLogout = () => {
    api.logout();
    router.push("/login");
  };

  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : 'U';
  const displayName = userEmail ? userEmail.split("@")[0] : 'User';
  const displayDomain = userEmail ? userEmail.split("@")[1] : '';

  return (
    <aside className="w-56 flex flex-col h-screen sticky top-0 flex-shrink-0 bg-[#09090b] border-r border-[#27272a]">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[#27272a]">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent-purple shadow-[0_0_12px_rgba(99,102,241,0.2)]">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8"/>
          </svg>
        </div>
        <span className="font-bold text-sm tracking-widest text-text-primary">
          GUARD<span className="text-accent-purple">RAIL</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Operations
          </span>
        </div>

        {NAV_ITEMS.map(item => {
          const routes: Record<string, string> = {
            dashboard: '/dashboard',
            rules: '/policies',
            settings: '/settings',
          };
          return (
            <button
              key={item.id}
              className={`sidebar-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => router.push(routes[item.id] || '/dashboard')}
            >
              <span style={{ opacity: activeSection === item.id ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div className="px-2 mb-3 mt-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Resources
          </span>
        </div>

        <button className="sidebar-link">
          <span className="opacity-60">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v11h9V5.5L8.5 2H3z"/><path d="M8.5 2v3.5H12"/></svg>
          </span>
          Documentation
        </button>

        <button className="sidebar-link">
          <span className="opacity-60 text-accent-cyan">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="7.5" cy="7.5" r="5.5"/><path d="M7.5 4v4l2 2"/></svg>
          </span>
          Changelog
        </button>

        <button className="sidebar-link">
          <span className="opacity-60">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 13l2.5-2.5A6.5 6.5 0 117.5 14a6.4 6.4 0 01-3.5-1z"/></svg>
          </span>
          Support
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-[#27272a]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/20 flex items-center justify-center flex-shrink-0 border border-accent-purple/30">
            <span className="text-xs font-bold text-accent-purple">{avatarLetter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-text-primary truncate">{displayName}</div>
            {displayDomain && <div className="text-[11px] text-text-muted truncate">@{displayDomain}</div>}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#27272a] bg-transparent text-[#71717a] hover:text-text-primary hover:bg-[#18181b] transition-all text-[12px] font-medium"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M8.5 4V2a1 1 0 00-1-1H2a1 1 0 00-1 1v9a1 1 0 001 1h5.5a1 1 0 001-1V9"/>
            <path d="M5 6.5H12M12 6.5L10 4.5M12 6.5L10 8.5"/>
          </svg>
          Disconnect
        </button>
      </div>
    </aside>
  );
}
