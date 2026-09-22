'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminPartnersPage() {
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
    fetch('/api/partners')
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
      const res = await fetch('/api/partners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Partners page saved successfully!' });
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

  const strChange = (section: string, field: string, idx: number, value: string) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      arr[idx] = value;
      return { ...prev, [section]: { ...(prev[section] || {}), [field]: arr } };
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
        setToast({ type: 'success', text: 'Logo uploaded!' });
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Partners page…</div>;

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

  const tabs = ['hero', 'carousel', 'why', 'active', 'benefits', 'cta'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Partners Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage the partner carousel, why-partnership cards, active partnerships, and CTA.</p>

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
            <textarea value={data.hero?.subtitle || ''} onChange={(e) => update('hero', 'subtitle', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.hero?.backgroundImage || ''} onChange={(e) => update('hero', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('hero', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>
          </div>
        )}

        {/* CAROUSEL */}
        {activeTab === 'carousel' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.carousel?.eyebrow || ''} onChange={(e) => update('carousel', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.carousel?.title || ''} onChange={(e) => update('carousel', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.carousel?.titleAccent || ''} onChange={(e) => update('carousel', 'titleAccent', e.target.value)} style={inputStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0 }}>Logos ({(data.carousel?.items || []).length})</h4>
              <button onClick={() => arrAdd('carousel', 'items', { logo: '', placeholder: 'fa-solid fa-handshake', name: '' })} style={goldBtn}>+ Add Partner</button>
            </div>

            {(data.carousel?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#06283D' }}>Partner {i + 1}: {p.name || 'Untitled'}</strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => arrMove('carousel', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => arrMove('carousel', 'items', i, 1)} disabled={i === (data.carousel?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.carousel?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => arrRemove('carousel', 'items', i)} style={dangerBtn}>Delete</button>
                  </div>
                </div>
                <label style={labelStyle}>Name</label>
                <input value={p.name || ''} onChange={(e) => arrChange('carousel', 'items', i, 'name', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Logo</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={p.logo || ''} onChange={(e) => arrChange('carousel', 'items', i, 'logo', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  <button type="button" onClick={() => triggerUpload((url) => arrChange('carousel', 'items', i, 'logo', url))} style={tealBtn}>Upload</button>
                </div>
                <label style={labelStyle}>Fallback Icon</label>
                <input value={p.placeholder || ''} onChange={(e) => arrChange('carousel', 'items', i, 'placeholder', e.target.value)} placeholder="fa-solid fa-handshake" style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* WHY */}
        {activeTab === 'why' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.why?.eyebrow || ''} onChange={(e) => update('why', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.why?.title || ''} onChange={(e) => update('why', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.why?.titleAccent || ''} onChange={(e) => update('why', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title End (text after accent)</label>
            <input value={data.why?.titleEnd || ''} onChange={(e) => update('why', 'titleEnd', e.target.value)} placeholder="Matters" style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.why?.subtitle || ''} onChange={(e) => update('why', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Cards</h4>
            {(data.why?.items || []).map((w: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={w.icon || ''} onChange={(e) => arrChange('why', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon Color (gold / forest / navy)</label>
                <input value={w.iconColor || ''} onChange={(e) => arrChange('why', 'items', i, 'iconColor', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={w.title || ''} onChange={(e) => arrChange('why', 'items', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={w.text || ''} onChange={(e) => arrChange('why', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('why', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('why', 'items', { icon: 'fa-solid fa-star', iconColor: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Card</button>
          </div>
        )}

        {/* ACTIVE */}
        {activeTab === 'active' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.active?.eyebrow || ''} onChange={(e) => update('active', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.active?.title || ''} onChange={(e) => update('active', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.active?.titleAccent || ''} onChange={(e) => update('active', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Partnerships</h4>
            {(data.active?.items || []).map((a: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={a.icon || ''} onChange={(e) => arrChange('active', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={a.iconBg || ''} onChange={(e) => arrChange('active', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Name</label>
                <input value={a.name || ''} onChange={(e) => arrChange('active', 'items', i, 'name', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={a.text || ''} onChange={(e) => arrChange('active', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('active', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('active', 'items', { icon: 'fa-solid fa-handshake', iconBg: 'navy', name: '', text: '' })} style={goldBtn}>+ Add Partnership</button>
          </div>
        )}

        {/* BENEFITS */}
        {activeTab === 'benefits' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.benefits?.eyebrow || ''} onChange={(e) => update('benefits', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.benefits?.title || ''} onChange={(e) => update('benefits', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.benefits?.titleAccent || ''} onChange={(e) => update('benefits', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input value={data.benefits?.backgroundImage || ''} onChange={(e) => update('benefits', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('benefits', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginBottom: 12 }}>Benefit Items</h4>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 10 }}>
              Use <code>**bold text**</code> for emphasis.
            </p>
            {(data.benefits?.items || []).map((item: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <textarea value={item} onChange={(e) => strChange('benefits', 'items', i, e.target.value)} rows={2} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                <button onClick={() => arrRemove('benefits', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('benefits', 'items', '**New Benefit** – description here.')} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Benefit</button>

            <h4 style={{ marginBottom: 12 }}>Side Panel</h4>
            <label style={labelStyle}>Panel Title</label>
            <input value={data.benefits?.panelTitle || ''} onChange={(e) => update('benefits', 'panelTitle', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Panel Text</label>
            <textarea value={data.benefits?.panelText || ''} onChange={(e) => update('benefits', 'panelText', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Panel Button Text</label>
            <input value={data.benefits?.panelButtonText || ''} onChange={(e) => update('benefits', 'panelButtonText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Panel Button Link</label>
            <input value={data.benefits?.panelButtonLink || ''} onChange={(e) => update('benefits', 'panelButtonLink', e.target.value)} style={inputStyle} />
          </div>
        )}

        {/* CTA */}
        {activeTab === 'cta' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.cta?.title || ''} onChange={(e) => update('cta', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Button 1 Text</label>
            <input value={data.cta?.button1Text || ''} onChange={(e) => update('cta', 'button1Text', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button 1 Link</label>
            <input value={data.cta?.button1Link || ''} onChange={(e) => update('cta', 'button1Link', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button 2 Text</label>
            <input value={data.cta?.button2Text || ''} onChange={(e) => update('cta', 'button2Text', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button 2 Link</label>
            <input value={data.cta?.button2Link || ''} onChange={(e) => update('cta', 'button2Link', e.target.value)} style={inputStyle} />
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
          {saving ? 'Saving…' : 'Save Partners Page'}
        </button>
      </div>
    </div>
  );
}