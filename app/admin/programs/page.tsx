'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminProgramsPage() {
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
    fetch('/api/programs')
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
      const res = await fetch('/api/programs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Programs page saved successfully!' });
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

  if (loading) {
    return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Programs page…</div>;
  }

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

  const tabs = ['hero', 'objectives', 'themes', 'model', 'highlights', 'connect', 'cta'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Programs Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage every section of the SEA Programs page.</p>

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

        {/* OBJECTIVES */}
        {activeTab === 'objectives' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.objectives?.eyebrow || ''} onChange={(e) => update('objectives', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.objectives?.title || ''} onChange={(e) => update('objectives', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.objectives?.titleAccent || ''} onChange={(e) => update('objectives', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Objective Cards</h4>
            {(data.objectives?.items || []).map((o: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={o.icon || ''} onChange={(e) => arrChange('objectives', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={o.iconBg || ''} onChange={(e) => arrChange('objectives', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={o.text || ''} onChange={(e) => arrChange('objectives', 'items', i, 'text', e.target.value)} rows={3} style={inputStyle} />
                <button onClick={() => arrRemove('objectives', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('objectives', 'items', { icon: 'fa-solid fa-star', iconBg: 'navy', text: '' })} style={goldBtn}>+ Add Objective</button>
          </div>
        )}

        {/* THEMES */}
        {activeTab === 'themes' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.themes?.eyebrow || ''} onChange={(e) => update('themes', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.themes?.title || ''} onChange={(e) => update('themes', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.themes?.titleAccent || ''} onChange={(e) => update('themes', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.themes?.ctaText || ''} onChange={(e) => update('themes', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.themes?.ctaLink || ''} onChange={(e) => update('themes', 'ctaLink', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Thematic Programs</h4>
            {(data.themes?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Anchor ID</label>
                <input value={p.id || ''} onChange={(e) => arrChange('themes', 'items', i, 'id', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon</label>
                <input value={p.icon || ''} onChange={(e) => arrChange('themes', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={p.iconBg || ''} onChange={(e) => arrChange('themes', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={p.title || ''} onChange={(e) => arrChange('themes', 'items', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={p.text || ''} onChange={(e) => arrChange('themes', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('themes', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('themes', 'items', { id: '', icon: 'fa-solid fa-star', iconBg: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Theme</button>
          </div>
        )}

        {/* MODEL */}
        {activeTab === 'model' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.model?.eyebrow || ''} onChange={(e) => update('model', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.model?.title || ''} onChange={(e) => update('model', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.model?.titleAccent || ''} onChange={(e) => update('model', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.model?.subtitle || ''} onChange={(e) => update('model', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Steps</h4>
            {(data.model?.steps || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Number</label>
                <input value={s.number || ''} onChange={(e) => arrChange('model', 'steps', i, 'number', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('model', 'steps', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={s.iconBg || ''} onChange={(e) => arrChange('model', 'steps', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={s.title || ''} onChange={(e) => arrChange('model', 'steps', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={s.text || ''} onChange={(e) => arrChange('model', 'steps', i, 'text', e.target.value)} rows={3} style={inputStyle} />
                <button onClick={() => arrRemove('model', 'steps', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('model', 'steps', { number: '', icon: 'fa-solid fa-star', iconBg: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Step</button>
          </div>
        )}

        {/* HIGHLIGHTS */}
        {activeTab === 'highlights' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.highlights?.eyebrow || ''} onChange={(e) => update('highlights', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.highlights?.title || ''} onChange={(e) => update('highlights', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.highlights?.titleAccent || ''} onChange={(e) => update('highlights', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.highlights?.subtitle || ''} onChange={(e) => update('highlights', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.highlights?.ctaText || ''} onChange={(e) => update('highlights', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.highlights?.ctaLink || ''} onChange={(e) => update('highlights', 'ctaLink', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Highlight Cards</h4>
            {(data.highlights?.items || []).map((h: any, i: number) => (
              <div key={i} style={rowBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#06283D' }}>Card {i + 1}: {h.title || 'Untitled'}</strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => arrMove('highlights', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => arrMove('highlights', 'items', i, 1)} disabled={i === (data.highlights?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.highlights?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => arrRemove('highlights', 'items', i)} style={dangerBtn}>Delete</button>
                  </div>
                </div>

                <label style={labelStyle}>Title</label>
                <input value={h.title || ''} onChange={(e) => arrChange('highlights', 'items', i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Text</label>
                <textarea value={h.text || ''} onChange={(e) => arrChange('highlights', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Icon</label>
                <input value={h.icon || ''} onChange={(e) => arrChange('highlights', 'items', i, 'icon', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={h.iconBg || ''} onChange={(e) => arrChange('highlights', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Image</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={h.image || ''} onChange={(e) => arrChange('highlights', 'items', i, 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  <button type="button" onClick={() => triggerUpload((url) => arrChange('highlights', 'items', i, 'image', url))} style={tealBtn}>Upload</button>
                </div>

                <label style={labelStyle}>Link Text</label>
                <input value={h.linkText || ''} onChange={(e) => arrChange('highlights', 'items', i, 'linkText', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Link URL</label>
                <input value={h.link || ''} onChange={(e) => arrChange('highlights', 'items', i, 'link', e.target.value)} style={inputStyle} />
              </div>
            ))}
            <button onClick={() => arrAdd('highlights', 'items', { image: '', icon: 'fa-solid fa-star', iconBg: 'navy', title: '', text: '', linkText: 'Learn more', link: '/' })} style={goldBtn}>+ Add Highlight</button>
          </div>
        )}

        {/* CONNECT */}
        {activeTab === 'connect' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.connect?.eyebrow || ''} onChange={(e) => update('connect', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.connect?.title || ''} onChange={(e) => update('connect', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.connect?.titleAccent || ''} onChange={(e) => update('connect', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.connect?.text || ''} onChange={(e) => update('connect', 'text', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.connect?.ctaText || ''} onChange={(e) => update('connect', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.connect?.ctaLink || ''} onChange={(e) => update('connect', 'ctaLink', e.target.value)} style={inputStyle} />
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
          {saving ? 'Saving…' : 'Save Programs Page'}
        </button>
      </div>
    </div>
  );
}