'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Link from 'next/link';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname.startsWith('/admin');
  const isPaused = pathname === '/paused';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (isAdmin && pathname !== '/admin') {
      const auth = localStorage.getItem('sea-admin-auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/admin');
      }
    } else if (isAdmin && pathname === '/admin') {
      setIsAuthenticated(null);
    } else {
      setIsAuthenticated(null);
    }
  }, [pathname, isAdmin, router]);

  const handleLogout = () => {
    localStorage.removeItem('sea-admin-auth');
    setIsAuthenticated(false);
    router.push('/admin');
  };

  // ---------- PAUSE ----------
  if (isPaused) return <>{children}</>;

  // ---------- LOGIN ----------
  if (isAdmin && pathname === '/admin') return <>{children}</>;

  // ---------- ADMIN AUTH LOADING ----------
  if (isAdmin && isAuthenticated === null) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'Inter, sans-serif',
          color: '#06283D',
          background: '#F9FAFB',
        }}
      >
        Loading…
      </div>
    );
  }

  // ---------- ADMIN LAYOUT ----------
  if (isAdmin && isAuthenticated === true) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Sidebar */}
        <aside
          style={{
            width: '260px',
            background: '#06283D',
            color: '#fff',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '28px',
            }}
          >
            <img
              src="/images/sea-logo-2025.jpg"
              alt="SEA Logo"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                objectFit: 'cover',
                border: '1px solid rgba(212,160,23,0.3)',
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#fff',
                  lineHeight: 1.1,
                  fontFamily: 'Playfair Display, serif',
                }}
              >
                SEA Admin
              </div>
              <div
                style={{
                  fontSize: '0.55rem',
                  letterSpacing: '0.15em',
                  color: '#D4A017',
                  fontWeight: 700,
                }}
              >
                PROTECTING NATURE
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              overflowY: 'auto',
            }}
          >
            <SidebarLink href="/admin/homepage" label="Homepage" icon="🏠" currentPath={pathname} />
            <SidebarLink href="/admin/about" label="About" icon="📖" currentPath={pathname} />
            <SidebarLink href="/admin/programs" label="Programs" icon="🎯" currentPath={pathname} />
            <SidebarLink href="/admin/impact" label="Impact" icon="📊" currentPath={pathname} />
            <SidebarLink href="/admin/projects" label="Projects" icon="🗂️" currentPath={pathname} />
            <SidebarLink href="/admin/partners" label="Partners" icon="🤝" currentPath={pathname} />
            <SidebarLink href="/admin/news" label="News" icon="📰" currentPath={pathname} />
            <SidebarLink href="/admin/get-involved" label="Get Involved" icon="❤️" currentPath={pathname} />
            <SidebarLink href="/admin/contact" label="Contact" icon="✉️" currentPath={pathname} />
            <SidebarLink href="/admin/donate" label="Donate" icon="💛" currentPath={pathname} />
            <SidebarLink href="/admin/settings" label="Settings" icon="⚙️" currentPath={pathname} />
          </nav>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 'auto',
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              color: '#fff',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = 'rgba(212,160,23,0.6)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')
            }
          >
            🔒 Logout
          </button>
        </aside>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: '32px',
            background: '#F9FAFB',
            minHeight: '100vh',
          }}
        >
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>{children}</div>
        </main>
      </div>
    );
  }

  // ---------- PUBLIC ----------
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  currentPath,
}: {
  href: string;
  label: string;
  icon: string;
  currentPath: string;
}) {
  const isActive = currentPath === href;
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        borderRadius: '8px',
        color: isActive ? '#D4A017' : 'rgba(255,255,255,0.75)',
        background: isActive ? 'rgba(212,160,23,0.18)' : 'transparent',
        fontWeight: isActive ? 700 : 500,
        textDecoration: 'none',
        transition: 'all 0.2s',
        fontSize: '0.9rem',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <span>{icon}</span> {label}
    </Link>
  );
}