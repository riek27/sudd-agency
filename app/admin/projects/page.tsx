'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminProjectsPage() {
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
    fetch('/api/projects')
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
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Projects page saved successfully!' });
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Projects page…</div>;

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

  const tabs = ['hero', 'methodology', 'completed', 'stats', 'cta'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Projects Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage every section of the SEA Projects page.</p>

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

        {/* METHODOLOGY */}
        {activeTab === 'methodology' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.methodology?.eyebrow || ''} onChange={(e) => update('methodology', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.methodology?.title || ''} onChange={(e) => update('methodology', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.methodology?.titleAccent || ''} onChange={(e) => update('methodology', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.methodology?.subtitle || ''} onChange={(e) => update('methodology', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Methodology Steps</h4>
            {(data.methodology?.items || []).map((m: any, i: number) => (
              <div key={i} style={rowBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#06283D' }}>Step {i + 1}: {m.title || 'Untitled'}</strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => arrMove('methodology', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => arrMove('methodology', 'items', i, 1)} disabled={i === (data.methodology?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.methodology?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => arrRemove('methodology', 'items', i)} style={dangerBtn}>Delete</button>
                  </div>
                </div>
                <label style={labelStyle}>Icon (FontAwesome)</label>
                <input value={m.icon || ''} onChange={(e) => arrChange('methodology', 'items', i, 'icon', e.target.value)} placeholder="fa-solid fa-magnifying-glass-chart" style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={m.iconBg || ''} onChange={(e) => arrChange('methodology', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={m.title || ''} onChange={(e) => arrChange('methodology', 'items', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={m.text || ''} onChange={(e) => arrChange('methodology', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
              </div>
            ))}
            <button onClick={() => arrAdd('methodology', 'items', { icon: 'fa-solid fa-star', iconBg: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Step</button>
          </div>
        )}

        {/* COMPLETED */}
        {activeTab === 'completed' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.completed?.eyebrow || ''} onChange={(e) => update('completed', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.completed?.title || ''} onChange={(e) => update('completed', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.completed?.titleAccent || ''} onChange={(e) => update('completed', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.completed?.subtitle || ''} onChange={(e) => update('completed', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0 }}>Projects ({(data.completed?.items || []).length})</h4>
              <button onClick={() => arrAdd('completed', 'items', { image: '', fallbackIcon: 'fa-solid fa-leaf', date: '', title: '', text: '', donor: 'SEA', budget: '' })} style={goldBtn}>+ Add Project</button>
            </div>

            {(data.completed?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#06283D' }}>Project {i + 1}: {p.title || 'Untitled'}</strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => arrMove('completed', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => arrMove('completed', 'items', i, 1)} disabled={i === (data.completed?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.completed?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => arrRemove('completed', 'items', i)} style={dangerBtn}>Delete</button>
                  </div>
                </div>

                <label style={labelStyle}>Title</label>
                <input value={p.title || ''} onChange={(e) => arrChange('completed', 'items', i, 'title', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Date</label>
                <input value={p.date || ''} onChange={(e) => arrChange('completed', 'items', i, 'date', e.target.value)} placeholder="January 29, 2021" style={inputStyle} />

                <label style={labelStyle}>Description</label>
                <textarea value={p.text || ''} onChange={(e) => arrChange('completed', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />

                <label style={labelStyle}>Donor</label>
                <input value={p.donor || ''} onChange={(e) => arrChange('completed', 'items', i, 'donor', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Budget</label>
                <input value={p.budget || ''} onChange={(e) => arrChange('completed', 'items', i, 'budget', e.target.value)} placeholder="$800" style={inputStyle} />

                <label style={labelStyle}>Image</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={p.image || ''} onChange={(e) => arrChange('completed', 'items', i, 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  <button type="button" onClick={() => triggerUpload((url) => arrChange('completed', 'items', i, 'image', url))} style={tealBtn}>Upload</button>
                </div>

                <label style={labelStyle}>Fallback Icon (shown if image missing)</label>
                <input value={p.fallbackIcon || ''} onChange={(e) => arrChange('completed', 'items', i, 'fallbackIcon', e.target.value)} placeholder="fa-solid fa-leaf" style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* STATS */}
        {activeTab === 'stats' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.stats?.eyebrow || ''} onChange={(e) => update('stats', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.stats?.title || ''} onChange={(e) => update('stats', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.stats?.titleAccent || ''} onChange={(e) => update('stats', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <input value={data.stats?.backgroundImage || ''} onChange={(e) => update('stats', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('stats', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginBottom: 12 }}>Stats</h4>
            {(data.stats?.items || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Value</label>
                <input value={s.value || ''} onChange={(e) => arrChange('stats', 'items', i, 'value', e.target.value)} placeholder="2019 or $2,500" style={inputStyle} />
                <label style={labelStyle}>Label</label>
                <input value={s.label || ''} onChange={(e) => arrChange('stats', 'items', i, 'label', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Animate? (yes / no)</label>
                <select
                  value={s.animated ? 'yes' : 'no'}
                  onChange={(e) => arrChange('stats', 'items', i, 'animated', e.target.value === 'yes')}
                  style={inputStyle}
                >
                  <option value="no">No — show static text</option>
                  <option value="yes">Yes — count up animation</option>
                </select>
                {s.animated && (
                  <>
                    <label style={labelStyle}>Suffix (e.g. +)</label>
                    <input value={s.suffix || ''} onChange={(e) => arrChange('stats', 'items', i, 'suffix', e.target.value)} style={inputStyle} />
                  </>
                )}
              </div>
            ))}
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
          {saving ? 'Saving…' : 'Save Projects Page'}
        </button>
      </div>
    </div>
  );
}