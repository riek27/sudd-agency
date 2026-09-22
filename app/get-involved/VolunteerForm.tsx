'use client';

import { useState } from 'react';

export default function VolunteerForm({ form }: { form: any }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    message: '',
  });

  const accessKey = form?.web3formsKey || '';
  const hasKey = accessKey && !accessKey.includes('YOUR_WEB3FORMS');

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 12,
    border: '1.5px solid #E5E7EB',
    fontSize: '0.95rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    background: '#fff',
    color: '#06283D',
    boxSizing: 'border-box',
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
      fd.append('subject', 'New Volunteer Application — SEA');
      fd.append('from_name', 'SEA Volunteer Form');
      fd.append('name', values.name);
      fd.append('email', values.email);
      fd.append('phone', values.phone);
      fd.append('location', values.location);
      fd.append('message', values.message);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (data.success) {
        setStatus('sent');
        setValues({ name: '', email: '', phone: '', location: '', message: '' });
      } else {
        setErrorMsg(data.message || 'Failed. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        style={{
          padding: '40px 30px',
          background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
          border: '1.5px solid #A7F3D0',
          borderRadius: 20,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            margin: '0 auto 16px',
            boxShadow: '0 12px 30px rgba(16,185,129,0.35)',
          }}
        >
          <i className="fa-solid fa-check" />
        </div>
        <h3
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#065F46',
            margin: '0 0 8px',
          }}
        >
          Application Sent!
        </h3>
        <p
          style={{
            color: '#047857',
            fontSize: 15,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          {form?.successMessage || 'Thank you! We will get back to you soon.'}
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          style={{
            marginTop: 22,
            padding: '11px 24px',
            background: '#06283D',
            color: '#fff',
            border: 'none',
            borderRadius: 999,
            fontFamily: 'Inter, sans-serif',
            fontSize: 13.5,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="grid-2" style={{ gap: 16 }}>
        <input
          type="text"
          placeholder={form?.namePlaceholder || 'Full Name'}
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder={form?.emailPlaceholder || 'Email Address'}
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          required
          style={inputStyle}
        />
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <input
          type="tel"
          placeholder={form?.phonePlaceholder || 'Phone Number'}
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          style={inputStyle}
        />
        <select
          value={values.location}
          onChange={(e) => setValues({ ...values, location: e.target.value })}
          style={inputStyle}
        >
          <option value="">{form?.locationPlaceholder || 'Preferred Location'}</option>
          {(form?.locationOptions || []).map((opt: string, i: number) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <textarea
        rows={3}
        placeholder={form?.messagePlaceholder || 'Why do you want to volunteer with SEA?'}
        value={values.message}
        onChange={(e) => setValues({ ...values, message: e.target.value })}
        style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
      />

      {status === 'error' && (
        <div
          style={{
            padding: '12px 16px',
            background: '#FEF2F2',
            border: '1.5px solid #FECACA',
            borderRadius: 10,
            color: '#991B1B',
            fontSize: 13.5,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <i className="fa-solid fa-exclamation-circle" style={{ marginTop: 2 }} />
          <span>{errorMsg}</span>
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
        }}
      >
        {status === 'sending' ? (
          <>
            <i className="fa-solid fa-circle-notch fa-spin" /> Sending…
          </>
        ) : (
          <>
            {form?.submitText || 'Submit Application'}{' '}
            <i className="fa-solid fa-paper-plane" style={{ fontSize: '0.75rem' }} />
          </>
        )}
      </button>
    </form>
  );
}