'use client';

import { useState } from 'react';

export default function NewsletterForm({ newsletter }: { newsletter: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [email, setEmail] = useState('');

  const accessKey = newsletter?.web3formsKey || '';
  const hasKey = accessKey && !accessKey.includes('YOUR_WEB3FORMS');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      setErrorMsg('Newsletter not configured yet.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('access_key', accessKey);
      fd.append('subject', 'New Newsletter Subscriber — SEA');
      fd.append('from_name', 'SEA Newsletter');
      fd.append('email', email);
      fd.append('message', `New subscriber: ${email}`);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (data.success) {
        setStatus('sent');
        setEmail('');
      } else {
        setErrorMsg(data.message || 'Failed. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        style={{
          maxWidth: 620,
          margin: '32px auto 0',
          padding: '22px 26px',
          background: 'rgba(16,185,129,0.1)',
          border: '1.5px solid rgba(16,185,129,0.3)',
          borderRadius: 16,
          color: '#065F46',
          fontWeight: 600,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <i className="fa-solid fa-check-circle" style={{ fontSize: 18 }} />
        {newsletter?.successMessage || 'Thank you! You are now subscribed.'}
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 32,
          display: 'flex',
          gap: 14,
          maxWidth: 620,
          margin: '32px auto 0',
          flexWrap: 'wrap',
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={newsletter?.placeholder || 'Your email address'}
          required
          style={{
            flex: '1 1 280px',
            padding: '15px 20px',
            borderRadius: 12,
            border: '1.5px solid #E5E7EB',
            background: 'var(--cream)',
            color: '#06283D',
            fontSize: '0.95rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-gold"
          style={{
            padding: '15px 32px',
            whiteSpace: 'nowrap',
            cursor: status === 'sending' ? 'wait' : 'pointer',
          }}
        >
          {status === 'sending' ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin" /> Sending…
            </>
          ) : (
            <>
              {newsletter?.buttonText || 'Subscribe'}{' '}
              <i className="fa-solid fa-paper-plane" style={{ fontSize: '0.75rem' }} />
            </>
          )}
        </button>
      </form>

      {status === 'error' && (
        <p
          style={{
            color: '#B91C1C',
            fontSize: '0.85rem',
            marginTop: 14,
          }}
        >
          <i className="fa-solid fa-exclamation-circle" style={{ marginRight: 8 }} />
          {errorMsg}
        </p>
      )}
    </>
  );
}