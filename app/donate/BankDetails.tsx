'use client';

import { useState } from 'react';

export default function BankDetails({ bank }: { bank: any }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const lines: string[] = [];
    lines.push('SUDD ENVIRONMENT AGENCY — DONATION DETAILS');
    lines.push('');
    (bank?.fields || []).forEach((f: any) => {
      lines.push(`${f.label}: ${f.value}`);
    });
    if (bank?.mobileMoney?.length) {
      lines.push('');
      lines.push(bank.mobileMoneyTitle || 'Mobile Money');
      bank.mobileMoney.forEach((m: any) => {
        lines.push(`${m.label}: ${m.value}`);
      });
    }
    const text = lines.join('\n');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert(bank?.copyErrorMessage || 'Could not copy. Please select the text manually.');
    }
  };

  return (
    <div className="card reveal" style={{ background: '#fff', padding: '44px 40px' }}>
      {/* Bank fields grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}
      >
        {(bank?.fields || []).map((f: any, i: number) => (
          <div key={i}>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '1.6px',
                textTransform: 'uppercase',
                color: 'var(--navy)',
                margin: '0 0 6px',
              }}
            >
              {f.label}
            </p>
            <p
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                color: 'var(--gray-600)',
                margin: 0,
                fontWeight: 500,
              }}
            >
              {f.value}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Money box */}
      {(bank?.mobileMoney?.length || 0) > 0 && (
        <div
          style={{
            marginTop: 30,
            padding: '24px 26px',
            background: 'rgba(6,40,61,0.04)',
            borderRadius: 16,
            border: '1px solid rgba(6,40,61,0.08)',
          }}
        >
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '1.6px',
              textTransform: 'uppercase',
              color: 'var(--navy)',
              marginBottom: 16,
            }}
          >
            {bank.mobileMoneyTitle || 'Mobile Money Details'}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            {bank.mobileMoney.map((m: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'var(--gray-600)',
                  fontSize: '0.9rem',
                }}
              >
                <i
                  className={m.icon}
                  style={{ color: 'var(--gold)', fontSize: 15 }}
                />
                <span>
                  {m.label}:{' '}
                  <strong style={{ color: 'var(--navy)' }}>{m.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Copy button */}
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <button
          type="button"
          onClick={handleCopy}
          className={`copy-btn ${copied ? 'is-copied' : ''}`}
        >
          {copied ? (
            <>
              <i className="fa-solid fa-check" /> Copied!
            </>
          ) : (
            <>
              <i className="fa-solid fa-copy" />{' '}
              {bank?.copyButtonText || 'Copy Details'}
            </>
          )}
        </button>
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--gray-600)',
            marginTop: 10,
          }}
        >
          {bank?.copyHint}
        </p>
      </div>

      <style>{`
        .copy-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: transparent;
          border: 1.5px solid var(--gold);
          color: #B8860B;
          border-radius: 999px;
          font-family: 'Inter', sans-serif;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
        }
        .copy-btn:hover {
          background: var(--gold);
          color: #06283D;
          box-shadow: 0 12px 30px rgba(212,160,23,0.35);
          transform: translateY(-2px);
        }
        .copy-btn.is-copied {
          background: linear-gradient(135deg, #10B981, #059669);
          color: #fff;
          border-color: #059669;
          box-shadow: 0 12px 30px rgba(16,185,129,0.35);
        }
        .copy-btn i { font-size: 0.85rem; }
      `}</style>
    </div>
  );
}