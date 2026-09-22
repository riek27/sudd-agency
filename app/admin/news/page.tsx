'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminNewsPage() {
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
    fetch('/api/news')
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
      const res = await fetch('/api/news', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'News page saved successfully!' });
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading News page…</div>;

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

  const tabs = ['hero', 'featured', 'grid', 'newsletter', 'social'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit News Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage the featured article, news grid, newsletter and social links.</p>

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

                {/* FEATURED */}
        {activeTab === 'featured' && (
          <div>
            <label style={labelStyle}>Badge</label>
            <input value={data.featured?.badge || ''} onChange={(e) => update('featured', 'badge', e.target.value)} placeholder="Featured" style={inputStyle} />
            <label style={labelStyle}>Date</label>
            <input value={data.featured?.date || ''} onChange={(e) => update('featured', 'date', e.target.value)} placeholder="May 2023" style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.featured?.title || ''} onChange={(e) => update('featured', 'title', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Excerpt (short preview)</label>
            <textarea value={data.featured?.excerpt || ''} onChange={(e) => update('featured', 'excerpt', e.target.value)} rows={3} style={inputStyle} />

            <label style={labelStyle}>
              Full Article Body — use a blank line to separate paragraphs (shown on Read More)
            </label>
            <textarea value={data.featured?.body || ''} onChange={(e) => update('featured', 'body', e.target.value)} rows={8} style={inputStyle} />

            <label style={labelStyle}>CTA Text</label>
            <input value={data.featured?.ctaText || ''} onChange={(e) => update('featured', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.featured?.ctaLink || ''} onChange={(e) => update('featured', 'ctaLink', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={data.featured?.image || ''} onChange={(e) => update('featured', 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('featured', 'image', url))} style={tealBtn}>Upload</button>
            </div>
            <label style={labelStyle}>Fallback Icon (if image missing)</label>
            <input value={data.featured?.fallbackIcon || ''} onChange={(e) => update('featured', 'fallbackIcon', e.target.value)} placeholder="fa-solid fa-newspaper" style={inputStyle} />
          </div>
        )}

                {/* GRID */}
        {activeTab === 'grid' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.grid?.eyebrow || ''} onChange={(e) => update('grid', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.grid?.title || ''} onChange={(e) => update('grid', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.grid?.titleAccent || ''} onChange={(e) => update('grid', 'titleAccent', e.target.value)} style={inputStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0 }}>Articles ({(data.grid?.items || []).length})</h4>
              <button
                onClick={() =>
                  arrAdd('grid', 'items', {
                    image: '',
                    fallbackIcon: 'fa-solid fa-newspaper',
                    date: '',
                    title: '',
                    excerpt: '',
                    body: '',
                    linkText: 'Read more',
                    link: '/',
                  })
                }
                style={goldBtn}
              >
                + Add Article
              </button>
            </div>

            {(data.grid?.items || []).map((n: any, i: number) => (
              <div key={i} style={rowBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#06283D' }}>Article {i + 1}: {n.title || 'Untitled'}</strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => arrMove('grid', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => arrMove('grid', 'items', i, 1)} disabled={i === (data.grid?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.grid?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => arrRemove('grid', 'items', i)} style={dangerBtn}>Delete</button>
                  </div>
                </div>

                <label style={labelStyle}>Title</label>
                <input value={n.title || ''} onChange={(e) => arrChange('grid', 'items', i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Date</label>
                <input value={n.date || ''} onChange={(e) => arrChange('grid', 'items', i, 'date', e.target.value)} placeholder="February 2021" style={inputStyle} />

                <label style={labelStyle}>Excerpt (short preview shown on card)</label>
                <textarea value={n.excerpt || ''} onChange={(e) => arrChange('grid', 'items', i, 'excerpt', e.target.value)} rows={3} style={inputStyle} />

                <label style={labelStyle}>
                  Full Article Body — use a blank line to separate paragraphs (shown on Read More)
                </label>
                <textarea value={n.body || ''} onChange={(e) => arrChange('grid', 'items', i, 'body', e.target.value)} rows={6} style={inputStyle} />

                <label style={labelStyle}>Link Text</label>
                <input value={n.linkText || ''} onChange={(e) => arrChange('grid', 'items', i, 'linkText', e.target.value)} placeholder="Read more" style={inputStyle} />

                <label style={labelStyle}>Link URL</label>
                <input value={n.link || ''} onChange={(e) => arrChange('grid', 'items', i, 'link', e.target.value)} placeholder="/projects" style={inputStyle} />

                <label style={labelStyle}>Image</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={n.image || ''} onChange={(e) => arrChange('grid', 'items', i, 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  <button type="button" onClick={() => triggerUpload((url) => arrChange('grid', 'items', i, 'image', url))} style={tealBtn}>Upload</button>
                </div>

                <label style={labelStyle}>Fallback Icon</label>
                <input value={n.fallbackIcon || ''} onChange={(e) => arrChange('grid', 'items', i, 'fallbackIcon', e.target.value)} placeholder="fa-solid fa-newspaper" style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* NEWSLETTER */}
        {activeTab === 'newsletter' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.newsletter?.eyebrow || ''} onChange={(e) => update('newsletter', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.newsletter?.title || ''} onChange={(e) => update('newsletter', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.newsletter?.titleAccent || ''} onChange={(e) => update('newsletter', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.newsletter?.text || ''} onChange={(e) => update('newsletter', 'text', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Input Placeholder</label>
            <input value={data.newsletter?.placeholder || ''} onChange={(e) => update('newsletter', 'placeholder', e.target.value)} placeholder="Your email address" style={inputStyle} />
            <label style={labelStyle}>Button Text</label>
            <input value={data.newsletter?.buttonText || ''} onChange={(e) => update('newsletter', 'buttonText', e.target.value)} placeholder="Subscribe" style={inputStyle} />
            <label style={labelStyle}>Success Message</label>
            <input value={data.newsletter?.successMessage || ''} onChange={(e) => update('newsletter', 'successMessage', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Privacy Note</label>
            <input value={data.newsletter?.privacyNote || ''} onChange={(e) => update('newsletter', 'privacyNote', e.target.value)} style={inputStyle} />

            <div style={{ padding: 14, background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: 12, marginTop: 12, marginBottom: 14 }}>
              <label style={{ ...labelStyle, color: '#0F766E' }}>Web3Forms Access Key</label>
              <input
                value={data.newsletter?.web3formsKey || ''}
                onChange={(e) => update('newsletter', 'web3formsKey', e.target.value)}
                placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                style={{ ...inputStyle, marginBottom: 0, fontFamily: 'monospace' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#0F766E', margin: '8px 0 0' }}>
                Get a free key at web3forms.com — subscribers will be emailed to that address.
              </p>
            </div>

            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.newsletter?.backgroundImage || ''} onChange={(e) => update('newsletter', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('newsletter', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>
          </div>
        )}

        {/* SOCIAL */}
        {activeTab === 'social' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.social?.eyebrow || ''} onChange={(e) => update('social', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.social?.title || ''} onChange={(e) => update('social', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.social?.titleAccent || ''} onChange={(e) => update('social', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.social?.text || ''} onChange={(e) => update('social', 'text', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Social Links</h4>
            {(data.social?.links || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('social', 'links', i, 'icon', e.target.value)} placeholder="fa-brands fa-facebook-f" style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={s.iconBg || ''} onChange={(e) => arrChange('social', 'links', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>URL</label>
                <input value={s.url || ''} onChange={(e) => arrChange('social', 'links', i, 'url', e.target.value)} placeholder="https://..." style={inputStyle} />
                <button onClick={() => arrRemove('social', 'links', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('social', 'links', { icon: 'fa-brands fa-facebook-f', iconBg: 'navy', url: '' })} style={goldBtn}>+ Add Social</button>
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
          {saving ? 'Saving…' : 'Save News Page'}
        </button>
      </div>
    </div>
  );
}