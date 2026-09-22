'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminContactPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadRef = useRef<((url: string) => void) | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetch('/api/contact')
      .then((r) => r.json())
      .then((json) => {
        setData(json && Object.keys(json).length > 0 ? json : {});
        setLoading(false);
      })
      .catch(() => {
        setData({});
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setToast({ type: 'info', text: 'Saving changes…' });
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Contact page saved successfully!' });
      else setToast({ type: 'error', text: 'Save failed.' });
    } catch {
      setToast({ type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  const update = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  const arrChange = (section: string, field: string, idx: number, key: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      if (arr[idx]) arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, [section]: { ...(prev[section] || {}), [field]: arr } };
    });
  };

  const arrAdd = (section: string, field: string, item: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: [...(prev[section]?.[field] || []), item],
      },
    }));
  };

  const arrRemove = (section: string, field: string, idx: number) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      arr.splice(idx, 1);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const arrMove = (section: string, field: string, idx: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      const [item] = arr.splice(idx, 1);
      arr.splice(newIdx, 0, item);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  const triggerUpload = (cb: (url: string) => void) => {
    pendingUploadRef.current = cb;
    fileInputRef.current?.click();
  };

  const onFileChosen = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !pendingUploadRef.current) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const result = await res.json();
      if (result.url) {
        pendingUploadRef.current(result.url);
        setToast({ type: 'success', text: 'Image uploaded!' });
      } else {
        setToast({ type: 'error', text: result.error || 'Upload failed' });
      }
    } catch {
      setToast({ type: 'error', text: 'Upload failed' });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      pendingUploadRef.current = null;
    }
  };

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Contact page…</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', marginBottom: 14, borderRadius: 10,
    border: '1.5px solid #E5E7EB', fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.85rem',
    color: '#06283D', fontFamily: 'Inter, sans-serif',
  };
  const tabBtn = (tab: string): React.CSSProperties => ({
    padding: '8px 16px', borderRadius: 8,
    border: activeTab === tab ? '2px solid #D4A017' : '1px solid #E5E7EB',
    background: activeTab === tab ? '#D4A017' : 'white',
    color: activeTab === tab ? '#06283D' : '#374151',
    fontWeight: 600, cursor: 'pointer', marginRight: 8, marginBottom: 8,
    fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
  });
  const goldBtn: React.CSSProperties = {
    background: '#D4A017', color: '#06283D', border: 'none',
    padding: '10px 20px', borderRadius: 8, cursor: 'pointer',
    fontWeight: 700, fontFamily: 'Inter, sans-serif',
  };
  const tealBtn: React.CSSProperties = {
    background: '#1B5E45', color: '#fff', border: 'none',
    padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
    fontWeight: 600, whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
  };
  const smallBtn: React.CSSProperties = {
    background: 'none', border: '1px solid #E5E7EB', color: '#374151',
    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
    fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', fontWeight: 600,
  };
  const dangerBtn: React.CSSProperties = {
    background: 'none', border: '1px solid #EF4444', color: '#EF4444',
    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
    fontWeight: 600, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
  };
  const rowBox: React.CSSProperties = {
    border: '1px solid #E5E7EB', borderRadius: 12, padding: 16,
    marginBottom: 14, background: '#FAFAFA',
  };

  const tabs = ['hero', 'info', 'form'];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChosen} accept="image/*" />

      {toast && (
        <div
          style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            background: toast.type === 'success' ? '#059669' : toast.type === 'error' ? '#DC2626' : '#2563EB',
            color: '#fff', padding: '16px 22px', borderRadius: 14,
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)', fontWeight: 600, fontSize: '0.95rem',
          }}
        >
          {toast.text}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Contact Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage hero, contact cards, socials, map, and form.</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 20 }}>
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={tabBtn(t)}>
              {t.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
            </button>
          ))}
        </div>

        {/* HERO */}
        {activeTab === 'hero' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.hero?.eyebrow || ''} onChange={(e) => update('hero', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.hero?.title || ''} onChange={(e) => update('hero', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.hero?.titleAccent || ''} onChange={(e) => update('hero', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.hero?.subtitle || ''} onChange={(e) => update('hero', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.hero?.backgroundImage || ''} onChange={(e) => update('hero', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('hero', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>
          </div>
        )}

        {/* INFO */}
        {activeTab === 'info' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.info?.eyebrow || ''} onChange={(e) => update('info', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.info?.title || ''} onChange={(e) => update('info', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.info?.titleAccent || ''} onChange={(e) => update('info', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Contact Cards</h4>
            {(data.info?.cards || []).map((c: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={c.icon || ''} onChange={(e) => arrChange('info', 'cards', i, 'icon', e.target.value)} placeholder="fa-solid fa-location-dot" style={inputStyle} />
                <label style={labelStyle}>Icon BG (gold / forest / navy / green)</label>
                <select value={c.iconBg || 'gold'} onChange={(e) => arrChange('info', 'cards', i, 'iconBg', e.target.value)} style={inputStyle}>
                  <option value="gold">Gold</option>
                  <option value="forest">Forest</option>
                  <option value="navy">Navy</option>
                  <option value="green">Green (WhatsApp)</option>
                </select>
                <label style={labelStyle}>Title</label>
                <input value={c.title || ''} onChange={(e) => arrChange('info', 'cards', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={c.text || ''} onChange={(e) => arrChange('info', 'cards', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <label style={labelStyle}>Link (optional — tel:, mailto:, https:)</label>
                <input value={c.link || ''} onChange={(e) => arrChange('info', 'cards', i, 'link', e.target.value)} placeholder="tel:+211912511115" style={inputStyle} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => arrMove('info', 'cards', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                  <button onClick={() => arrMove('info', 'cards', i, 1)} disabled={i === (data.info?.cards || []).length - 1} style={{ ...smallBtn, opacity: i === (data.info?.cards || []).length - 1 ? 0.4 : 1 }}>↓</button>
                  <button onClick={() => arrRemove('info', 'cards', i)} style={dangerBtn}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => arrAdd('info', 'cards', { icon: 'fa-solid fa-star', iconBg: 'gold', title: '', text: '', link: '' })} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Card</button>

            <h4 style={{ marginBottom: 12 }}>Social Links</h4>
            {(data.info?.socials || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('info', 'socials', i, 'icon', e.target.value)} placeholder="fa-brands fa-facebook-f" style={inputStyle} />
                <label style={labelStyle}>Icon BG (gold / forest / navy)</label>
                <select value={s.iconBg || 'gold'} onChange={(e) => arrChange('info', 'socials', i, 'iconBg', e.target.value)} style={inputStyle}>
                  <option value="gold">Gold</option>
                  <option value="forest">Forest</option>
                  <option value="navy">Navy</option>
                </select>
                <label style={labelStyle}>URL</label>
                <input value={s.url || ''} onChange={(e) => arrChange('info', 'socials', i, 'url', e.target.value)} placeholder="https://..." style={inputStyle} />
                <button onClick={() => arrRemove('info', 'socials', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('info', 'socials', { icon: 'fa-brands fa-facebook-f', iconBg: 'gold', url: '' })} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Social</button>

            <h4 style={{ marginBottom: 12 }}>Map</h4>
            <label style={labelStyle}>Google Maps Embed URL</label>
            <textarea value={data.info?.map?.embedUrl || ''} onChange={(e) => update('info', 'map', { ...data.info?.map, embedUrl: e.target.value })} rows={3} style={inputStyle} />
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: -6, marginBottom: 14 }}>
              On Google Maps: search your location → Share → Embed a map → copy the src URL from the iframe.
            </p>
            <label style={labelStyle}>Map Caption</label>
            <input value={data.info?.map?.caption || ''} onChange={(e) => update('info', 'map', { ...data.info?.map, caption: e.target.value })} style={inputStyle} />
          </div>
        )}

        {/* FORM */}
        {activeTab === 'form' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.form?.eyebrow || ''} onChange={(e) => update('form', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.form?.title || ''} onChange={(e) => update('form', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.form?.titleAccent || ''} onChange={(e) => update('form', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Field Placeholders</h4>
            <label style={labelStyle}>Name Placeholder</label>
            <input value={data.form?.fields?.namePlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, namePlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Email Placeholder</label>
            <input value={data.form?.fields?.emailPlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, emailPlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Subject Placeholder</label>
            <input value={data.form?.fields?.subjectPlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, subjectPlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Message Placeholder</label>
            <input value={data.form?.fields?.messagePlaceholder || ''} onChange={(e) => update('form', 'fields', { ...data.form?.fields, messagePlaceholder: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Submit Button Text</label>
            <input value={data.form?.submitText || ''} onChange={(e) => update('form', 'submitText', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Success Message</h4>
            <label style={labelStyle}>Success Title</label>
            <input value={data.form?.successTitle || ''} onChange={(e) => update('form', 'successTitle', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Success Message</label>
            <textarea value={data.form?.successMessage || ''} onChange={(e) => update('form', 'successMessage', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Error Message</h4>
            <label style={labelStyle}>Error Title</label>
            <input value={data.form?.errorTitle || ''} onChange={(e) => update('form', 'errorTitle', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Error Message</label>
            <textarea value={data.form?.errorMessage || ''} onChange={(e) => update('form', 'errorMessage', e.target.value)} rows={2} style={inputStyle} />

            <div style={{ padding: 14, background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: 12, marginTop: 20 }}>
              <label style={{ ...labelStyle, color: '#0F766E' }}>Web3Forms Access Key</label>
              <input
                value={data.form?.web3formsKey || ''}
                onChange={(e) => update('form', 'web3formsKey', e.target.value)}
                placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                style={{ ...inputStyle, marginBottom: 0, fontFamily: 'monospace' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#0F766E', margin: '8px 0 0' }}>
                Get a free key at web3forms.com — messages will be emailed to that address.
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            marginTop: 30, width: '100%', padding: 16,
            background: saving ? 'rgba(212,160,23,0.5)' : '#D4A017',
            color: '#06283D', border: 'none', borderRadius: 12,
            fontSize: '1rem', fontWeight: 700,
            cursor: saving ? 'wait' : 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 10px 24px rgba(212,160,23,0.35)',
          }}
        >
          {saving ? 'Saving…' : 'Save Contact Page'}
        </button>
      </div>
    </div>
  );
}