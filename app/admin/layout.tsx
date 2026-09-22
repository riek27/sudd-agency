'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NAV = [
  { href: '/admin/homepage', label: 'Homepage', icon: '🏠' },
  { href: '/admin/about', label: 'About', icon: '📖' },
  { href: '/admin/programs', label: 'Programs', icon: '🎯' },
  { href: '/admin/impact', label: 'Impact', icon: '📊' },
  { href: '/admin/projects', label: 'Projects', icon: '🗂️' },
  { href: '/admin/partners', label: 'Partners', icon: '🤝' },
  { href: '/admin/news', label: 'News', icon: '📰' },
  { href: '/admin/get-involved', label: 'Get Involved', icon: '❤️' },
  { href: '/admin/contact', label: 'Contact', icon: '✉️' },
  { href: '/admin/donate', label: 'Donate', icon: '💛' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // The login page lives at exactly /admin — no sidebar there
  const isLogin = pathname === '/admin';

  // Auth guard — kick anyone without a session back to /admin
  useEffect(() => {
    if (isLogin) return;
    if (typeof window === 'undefined') return;
    const authed = localStorage.getItem('sea-admin-auth') === 'true';
    if (!authed) router.replace('/admin');
  }, [pathname, isLogin, router]);

  if (isLogin) return <>{children}</>;

  const logout = () => {
    localStorage.removeItem('sea-admin-auth');
    router.push('/admin');
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#F9FAFB',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ============ SIDEBAR ============ */}
      <aside
        style={{
          width: 250,
          flexShrink: 0,
          background: '#06283D',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: '22px 20px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #D4A017, #e8b830)',
                color: '#06283D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontFamily: 'Playfair Display, serif',
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              SEA
            </div>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  fontFamily: 'Playfair Display, serif',
                  lineHeight: 1.15,
                }}
              >
                Sudd Environment
              </div>
              <div
                style={{
                  fontSize: '0.66rem',
                  color: '#D4A017',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                  fontWeight: 700,
                }}
              >
                Admin Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '14px 12px',
            gap: 3,
            overflowY: 'auto',
          }}
        >
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 10,
                  color: active ? '#06283D' : 'rgba(255,255,255,0.75)',
                  background: active
                    ? 'linear-gradient(135deg, #D4A017, #e8b830)'
                    : 'transparent',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.87rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  boxShadow: active
                    ? '0 8px 18px rgba(212,160,23,0.25)'
                    : 'none',
                }}
              >
                <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div
          style={{
            padding: '14px 12px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            onClick={logout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.75)',
              fontWeight: 600,
              fontSize: '0.87rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textAlign: 'left',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220,38,38,0.18)';
              e.currentTarget.style.color = '#FCA5A5';
              e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            }}
          >
            <span style={{ fontSize: '1rem' }}>🔒</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          padding: '28px 32px 60px',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>

      {/* Small responsive rule for narrow screens */}
      <style>{`
        @media (max-width: 900px) {
          aside {
            width: 68px !important;
          }
          aside nav a span:last-child,
          aside > div:first-child > div > div > div:nth-child(2),
          aside button span:last-child {
            display: none !important;
          }
          main {
            padding: 20px 16px 50px !important;
          }
        }
      `}</style>
    </div>
  );
}