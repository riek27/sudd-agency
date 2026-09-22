'use client';

import { useState } from 'react';

export default function ContactForm({ form }: { form: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const accessKey = form?.web3formsKey || '';
  const hasKey = accessKey && !accessKey.includes('YOUR_WEB3FORMS');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    borderRadius: 12,
    border: '1.5px solid #E5E7EB',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    background: '#fff',
    color: '#06283D',
    boxSizing: 'border-box',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasKey) {
      setErrorMsg('Form is not configured yet. Please email us at info@seasouthsudan.org.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const fd = new FormData();
      fd.append('access_key', accessKey);
      fd.append('subject', `[SEA Contact] ${values.subject || 'New message'}`);
      fd.append('from_name', 'SEA Website Contact Form');
      fd.append('name', values.name);
      fd.append('email', values.email);
      fd.append('message', values.message);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (data.success) {
        setStatus('sent');
        setValues({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.message || form?.errorMessage || 'Failed to send.');
        setStatus('error');
      }
    } catch {
      setErrorMsg(form?.errorMessage || 'Network error. Please try again.');
      setStatus('error');
    }
  };

  /* ---------- SUCCESS ---------- */
  if (status === 'sent') {
    return (
      <div
        style={{
          padding: '50px 30px',
          background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
          border: '1.5px solid #A7F3D0',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 30,
            margin: '0 auto 18px',
            boxShadow: '0 12px 30px rgba(16,185,129,0.35)',
          }}
        >
          <i className="fa-solid fa-check" />
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 24,
            fontWeight: 700,
            color: '#065F46',
            margin: '0 0 10px',
          }}
        >
          {form?.successTitle || 'Message Sent!'}
        </h3>
        <p
          style={{
            color: '#047857',
            fontSize: 15,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {form?.successMessage || 'Thank you. We will respond soon.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          style={{
            marginTop: 24,
            padding: '12px 26px',
            background: '#06283D',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  /* ---------- FORM ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <div className="grid-2" style={{ gap: 16 }}>
        <input
          type="text"
          required
          placeholder={form?.fields?.namePlaceholder || 'Your Name'}
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          style={inputStyle}
        />
        <input
          type="email"
          required
          placeholder={form?.fields?.emailPlaceholder || 'Your Email'}
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          style={inputStyle}
        />
      </div>

      <input
        type="text"
        placeholder={form?.fields?.subjectPlaceholder || 'Subject'}
        value={values.subject}
        onChange={(e) => setValues({ ...values, subject: e.target.value })}
        style={inputStyle}
      />

      <textarea
        required
        rows={5}
        placeholder={form?.fields?.messagePlaceholder || 'Your Message'}
        value={values.message}
        onChange={(e) => setValues({ ...values, message: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
      />

      {status === 'error' && (
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
            padding: '14px 18px',
            background: '#FEF2F2',
            border: '1.5px solid #FECACA',
            borderRadius: 12,
            color: '#991B1B',
            fontSize: 13.5,
            lineHeight: 1.5,
          }}
        >
          <i
            className="fa-solid fa-exclamation-circle"
            style={{ color: '#DC2626', fontSize: 16, marginTop: 1 }}
          />
          <div>
            <strong style={{ display: 'block', marginBottom: 2 }}>
              {form?.errorTitle || 'Something went wrong'}
            </strong>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn btn-gold"
        style={{
          width: '100%',
          justifyContent: 'center',
          cursor: status === 'sending' ? 'wait' : 'pointer',
          padding: '16px 24px',
          fontSize: '1rem',
        }}
      >
        {status === 'sending' ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin" /> Sending…
          </>
        ) : (
          <>
            {form?.submitText || 'Send Message'}{' '}
            <i className="fa-solid fa-paper-plane" style={{ fontSize: '0.75rem' }} />
          </>
        )}
      </button>
    </form>
  );
}