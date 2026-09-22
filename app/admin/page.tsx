'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [blockedUntil, setBlockedUntil] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!blockedUntil) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((blockedUntil - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        setBlockedUntil(0);
        setError('');
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [blockedUntil]);

  const isBlocked = blockedUntil > 0 && countdown > 0;

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlocked) return;

    setLoading(true);
    setError('');
    setWarning('');

    try {
      const res = await fetch('/api/admin-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('sea-admin-auth', 'true');
        router.push('/admin/homepage');
        return;
      }

      if (data.blocked && data.retryAfterSeconds) {
        setBlockedUntil(Date.now() + data.retryAfterSeconds * 1000);
        setCountdown(data.retryAfterSeconds);
        setError(data.error || 'Too many failed attempts.');
      } else if (data.remainingAttempts !== undefined) {
        setError('Invalid username or password.');
        if (data.remainingAttempts <= 2) {
          setWarning(
            `⚠️ ${data.remainingAttempts} attempt${
              data.remainingAttempts === 1 ? '' : 's'
            } remaining before temporary block.`
          );
        }
      } else {
        setError(data.error || 'Invalid username or password.');
      }
    } catch {
      setError('Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #06283D 0%, #0a3d5c 55%, #1B5E45 100%)',
        fontFamily: 'Inter, sans-serif',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(27,94,69,0.5) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-25%',
          left: '-10%',
          width: 450,
          height: 450,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,160,23,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Login card */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 440,
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          padding: '44px 40px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: 'linear-gradient(135deg, #1B5E45, #06283D)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 18,
              boxShadow: '0 12px 32px rgba(27,94,69,0.5)',
              border: '1px solid rgba(212,160,23,0.25)',
              overflow: 'hidden',
            }}
          >
            <img
              src="/images/sea-logo-2025.jpg"
              alt="SEA Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginBottom: 6,
              fontFamily: 'Playfair Display, serif',
            }}
          >
            Sudd Environment Agency
          </h1>
          <p
            style={{
              fontSize: '0.7rem',
              letterSpacing: '0.25em',
              color: '#D4A017',
              fontWeight: 700,
              textTransform: 'uppercase',
            }}
          >
            Protecting Nature
          </p>
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.88rem',
              marginTop: 14,
            }}
          >
            Sign in to the admin panel
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label
            style={{
              display: 'block',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: 6,
              letterSpacing: '0.04em',
            }}
          >
            Username
          </label>
          <div style={{ position: 'relative', marginBottom: 18 }}>
            <i
              className="fa-solid fa-user"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
              }}
            />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              autoComplete="username"
              disabled={isBlocked}
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s, background 0.3s',
                opacity: isBlocked ? 0.5 : 1,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,160,23,0.6)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
            />
          </div>

          {/* Password */}
          <label
            style={{
              display: 'block',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: 6,
              letterSpacing: '0.04em',
            }}
          >
            Password
          </label>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <i
              className="fa-solid fa-lock"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.9rem',
              }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              autoComplete="current-password"
              disabled={isBlocked}
              style={{
                width: '100%',
                padding: '14px 44px 14px 44px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                transition: 'border-color 0.3s, background 0.3s',
                opacity: isBlocked ? 0.5 : 1,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212,160,23,0.6)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              disabled={isBlocked}
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: isBlocked ? 'not-allowed' : 'pointer',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.9rem',
                padding: 4,
                opacity: isBlocked ? 0.5 : 1,
              }}
            >
              <i className={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
            </button>
          </div>

          {/* Blocked banner */}
          {isBlocked && (
            <div
              style={{
                background: 'rgba(220,38,38,0.18)',
                border: '1px solid rgba(220,38,38,0.4)',
                borderRadius: 12,
                padding: '16px 18px',
                marginBottom: 18,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  color: '#FCA5A5',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                <i className="fa-solid fa-lock" />
                Account Temporarily Blocked
              </div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.8rem',
                  margin: '0 0 12px',
                  lineHeight: 1.5,
                }}
              >
                Too many failed login attempts. Please wait before trying again.
              </p>
              <div
                style={{
                  fontFamily: 'monospace',
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: '#FCA5A5',
                  letterSpacing: 2,
                }}
              >
                {formatCountdown(countdown)}
              </div>
            </div>
          )}

          {/* Warning banner */}
          {warning && !isBlocked && (
            <div
              style={{
                background: 'rgba(217,119,6,0.18)',
                color: '#FCD34D',
                padding: '12px 16px',
                borderRadius: 10,
                fontSize: '0.83rem',
                marginBottom: 16,
                fontWeight: 500,
                border: '1px solid rgba(217,119,6,0.4)',
                lineHeight: 1.5,
              }}
            >
              {warning}
            </div>
          )}

          {/* Error banner */}
          {error && !isBlocked && (
            <div
              style={{
                background: 'rgba(220,38,38,0.15)',
                color: '#FCA5A5',
                padding: '12px 16px',
                borderRadius: 10,
                fontSize: '0.85rem',
                marginBottom: 16,
                fontWeight: 500,
                border: '1px solid rgba(220,38,38,0.3)',
              }}
            >
              <i className="fa-solid fa-exclamation-circle" style={{ marginRight: 8 }} />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || isBlocked}
            style={{
              width: '100%',
              padding: 15,
              background: isBlocked
                ? 'rgba(107,114,128,0.4)'
                : loading
                ? 'rgba(212,160,23,0.5)'
                : 'linear-gradient(135deg, #D4A017, #e8b830)',
              color: isBlocked ? 'rgba(255,255,255,0.5)' : '#06283D',
              border: 'none',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: loading || isBlocked ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.3s',
              boxShadow: isBlocked ? 'none' : '0 10px 24px rgba(212,160,23,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              if (!loading && !isBlocked) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isBlocked ? (
              <>
                <i className="fa-solid fa-lock" /> Blocked ({formatCountdown(countdown)})
              </>
            ) : loading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" /> Signing in…
              </>
            ) : (
              <>
                <i className="fa-solid fa-sign-in-alt" /> Sign In
              </>
            )}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            color: 'rgba(255,255,255,0.35)',
            fontSize: '0.75rem',
            marginTop: 24,
            letterSpacing: '0.05em',
          }}
        >
          Protected area • Authorised personnel only
        </p>
      </div>
    </div>
  );
}