'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminImpactPage() {
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
    fetch('/api/impact')
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
      const res = await fetch('/api/impact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Impact page saved successfully!' });
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

  /* String array helpers (panel items, goals) */
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Impact page…</div>;

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
  const dangerBtn: React.CSSProperties = {
    background: 'none', border: '1px solid #EF4444', color: '#EF4444',
    borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
    fontWeight: 600, fontFamily: 'Inter, sans-serif', fontSize: '0.8rem',
  };
  const rowBox: React.CSSProperties = {
    border: '1px solid #E5E7EB', borderRadius: 12, padding: 16,
    marginBottom: 14, background: '#FAFAFA',
  };

  const tabs = ['hero', 'figures', 'achievements', 'stories', 'partners', 'future', 'cta'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Impact Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage every section of the SEA Impact page.</p>

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

        {/* FIGURES */}
        {activeTab === 'figures' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.figures?.eyebrow || ''} onChange={(e) => update('figures', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.figures?.title || ''} onChange={(e) => update('figures', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.figures?.titleAccent || ''} onChange={(e) => update('figures', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Row 1 (big numbers)</h4>
            {(data.figures?.row1 || []).map((f: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Value</label>
                <input value={f.value || ''} onChange={(e) => arrChange('figures', 'row1', i, 'value', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Label</label>
                <input value={f.label || ''} onChange={(e) => arrChange('figures', 'row1', i, 'label', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Color (navy / forest / gold)</label>
                <input value={f.color || ''} onChange={(e) => arrChange('figures', 'row1', i, 'color', e.target.value)} style={inputStyle} />
              </div>
            ))}

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Row 2 (smaller numbers)</h4>
            {(data.figures?.row2 || []).map((f: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Value</label>
                <input value={f.value || ''} onChange={(e) => arrChange('figures', 'row2', i, 'value', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Label</label>
                <input value={f.label || ''} onChange={(e) => arrChange('figures', 'row2', i, 'label', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Color</label>
                <input value={f.color || ''} onChange={(e) => arrChange('figures', 'row2', i, 'color', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Suffix (e.g. +)</label>
                <input value={f.suffix || ''} onChange={(e) => arrChange('figures', 'row2', i, 'suffix', e.target.value)} style={inputStyle} />
              </div>
            ))}
          </div>
        )}

        {/* ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.achievements?.eyebrow || ''} onChange={(e) => update('achievements', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.achievements?.title || ''} onChange={(e) => update('achievements', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.achievements?.titleAccent || ''} onChange={(e) => update('achievements', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.achievements?.subtitle || ''} onChange={(e) => update('achievements', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.achievements?.ctaText || ''} onChange={(e) => update('achievements', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.achievements?.ctaLink || ''} onChange={(e) => update('achievements', 'ctaLink', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Achievement Cards</h4>
            {(data.achievements?.items || []).map((a: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Date</label>
                <input value={a.date || ''} onChange={(e) => arrChange('achievements', 'items', i, 'date', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={a.title || ''} onChange={(e) => arrChange('achievements', 'items', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={a.text || ''} onChange={(e) => arrChange('achievements', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <label style={labelStyle}>Donor</label>
                <input value={a.donor || ''} onChange={(e) => arrChange('achievements', 'items', i, 'donor', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Budget</label>
                <input value={a.budget || ''} onChange={(e) => arrChange('achievements', 'items', i, 'budget', e.target.value)} style={inputStyle} />
                <button onClick={() => arrRemove('achievements', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('achievements', 'items', { date: '', title: '', text: '', donor: '', budget: '' })} style={goldBtn}>+ Add Achievement</button>
          </div>
        )}

        {/* STORIES */}
        {activeTab === 'stories' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.stories?.eyebrow || ''} onChange={(e) => update('stories', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.stories?.title || ''} onChange={(e) => update('stories', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.stories?.titleAccent || ''} onChange={(e) => update('stories', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Quote</label>
            <textarea value={data.stories?.quote || ''} onChange={(e) => update('stories', 'quote', e.target.value)} rows={4} style={inputStyle} />
            <label style={labelStyle}>Attribution</label>
            <input value={data.stories?.attribution || ''} onChange={(e) => update('stories', 'attribution', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.stories?.ctaText || ''} onChange={(e) => update('stories', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.stories?.ctaLink || ''} onChange={(e) => update('stories', 'ctaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input value={data.stories?.backgroundImage || ''} onChange={(e) => update('stories', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('stories', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>
            <label style={labelStyle}>Panel Title</label>
            <input value={data.stories?.panelTitle || ''} onChange={(e) => update('stories', 'panelTitle', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Panel Items</h4>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 10 }}>
              Use <code>**bold text**</code> to make parts bold.
            </p>
            {(data.stories?.panelItems || []).map((item: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input value={item} onChange={(e) => strChange('stories', 'panelItems', i, e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                <button onClick={() => arrRemove('stories', 'panelItems', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('stories', 'panelItems', '')} style={{ ...goldBtn, marginTop: 4 }}>+ Add Item</button>
          </div>
        )}

        {/* PARTNERS */}
        {activeTab === 'partners' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.partners?.eyebrow || ''} onChange={(e) => update('partners', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.partners?.title || ''} onChange={(e) => update('partners', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.partners?.titleAccent || ''} onChange={(e) => update('partners', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.partners?.subtitle || ''} onChange={(e) => update('partners', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Partner Cards</h4>
            {(data.partners?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={p.icon || ''} onChange={(e) => arrChange('partners', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={p.iconBg || ''} onChange={(e) => arrChange('partners', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Name</label>
                <input value={p.name || ''} onChange={(e) => arrChange('partners', 'items', i, 'name', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={p.text || ''} onChange={(e) => arrChange('partners', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('partners', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('partners', 'items', { icon: 'fa-solid fa-handshake', iconBg: 'navy', name: '', text: '' })} style={goldBtn}>+ Add Partner</button>
          </div>
        )}

        {/* FUTURE */}
        {activeTab === 'future' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.future?.eyebrow || ''} onChange={(e) => update('future', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.future?.title || ''} onChange={(e) => update('future', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.future?.titleAccent || ''} onChange={(e) => update('future', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.future?.text || ''} onChange={(e) => update('future', 'text', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.future?.ctaText || ''} onChange={(e) => update('future', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.future?.ctaLink || ''} onChange={(e) => update('future', 'ctaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input value={data.future?.image || ''} onChange={(e) => update('future', 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('future', 'image', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Goals</h4>
            <p style={{ fontSize: '0.78rem', color: '#6B7280', marginBottom: 10 }}>
              Use <code>**bold text**</code> for emphasis.
            </p>
            {(data.future?.goals || []).map((g: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input value={g} onChange={(e) => strChange('future', 'goals', i, e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                <button onClick={() => arrRemove('future', 'goals', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('future', 'goals', '')} style={{ ...goldBtn, marginTop: 4 }}>+ Add Goal</button>
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
          {saving ? 'Saving…' : 'Save Impact Page'}
        </button>
      </div>
    </div>
  );
}