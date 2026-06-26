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
    <aside className="w-56 flex flex-col h-screen sticky top-0 flex-shrink-0" style={{
      background: 'rgba(4, 9, 17, 0.95)',
      borderRight: '1px solid rgba(255,255,255,0.04)',
    }}>
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          boxShadow: '0 0 16px rgba(99,102,241,0.3)',
        }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z" fill="white" opacity="0.8"/>
          </svg>
        </div>
        <span className="font-black text-sm tracking-widest" style={{ color: '#e2e8f0', letterSpacing: '0.1em' }}>
          GUARD<span style={{ color: '#818cf8' }}>RAIL</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#1e293b' }}>
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
              <span style={{ opacity: activeSection === item.id ? 1 : 0.5 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div className="px-2 pt-5 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#1e293b' }}>
            Resources
          </span>
        </div>

        {[
          { label: 'Documentation', icon: '📄' },
          { label: 'Changelog', icon: '🔄' },
          { label: 'Support', icon: '💬' },
        ].map(item => (
          <button
            key={item.label}
            className="sidebar-link"
            onClick={() => {}}
          >
            <span className="text-xs">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        {/* User info */}
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl mb-2 cursor-pointer transition-colors"
          style={{ transition: 'background 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8',
          }}>
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate" style={{ color: '#e2e8f0' }}>{displayName}</div>
            <div className="text-[10px] truncate" style={{ color: '#334155' }}>{displayDomain}</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ color: '#475569', border: '1px solid rgba(255,255,255,0.04)' }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#fb7185';
            e.currentTarget.style.background = 'rgba(244,63,94,0.05)';
            e.currentTarget.style.borderColor = 'rgba(244,63,94,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
          }}
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
