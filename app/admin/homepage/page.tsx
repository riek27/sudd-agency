'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminHomepagePage() {
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
    fetch('/api/homepage')
      .then((res) => res.json())
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
      const res = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Homepage saved successfully!' });
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading…</div>;

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', marginBottom: 14, borderRadius: 10,
    border: '1.5px solid #E5E7EB', fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif', outline: 'none', background: '#fff',
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
    border: '1px solid #E5E7EB', borderRadius: 12, padding: 14,
    marginBottom: 12, background: '#FAFAFA',
  };

  const tabs = ['hero', 'story', 'mission', 'strategy', 'values', 'programs', 'impact', 'projects', 'news', 'partners', 'getInvolved', 'contact'];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={onFileChosen} accept="image/*" />

      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          background: toast.type === 'success' ? '#059669' : toast.type === 'error' ? '#DC2626' : '#2563EB',
          color: '#fff', padding: '16px 22px', borderRadius: 14,
          boxShadow: '0 20px 50px rgba(0,0,0,0.25)', fontWeight: 600, fontSize: '0.95rem',
        }}>
          {toast.text}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 16, padding: 32, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Homepage</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage every section of the Sudd homepage.</p>

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
            <label style={labelStyle}>Badge</label>
            <input value={data.hero?.badge || ''} onChange={(e) => update('hero', 'badge', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Line 1</label>
            <input value={data.hero?.titleLine1 || ''} onChange={(e) => update('hero', 'titleLine1', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Line 2</label>
            <input value={data.hero?.titleLine2 || ''} onChange={(e) => update('hero', 'titleLine2', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Line 3 (gold italic)</label>
            <input value={data.hero?.titleLine3 || ''} onChange={(e) => update('hero', 'titleLine3', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.hero?.subtitle || ''} onChange={(e) => update('hero', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <label style={labelStyle}>Primary CTA Text</label>
            <input value={data.hero?.primaryCtaText || ''} onChange={(e) => update('hero', 'primaryCtaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Primary CTA Link</label>
            <input value={data.hero?.primaryCtaLink || ''} onChange={(e) => update('hero', 'primaryCtaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Secondary CTA Text</label>
            <input value={data.hero?.secondaryCtaText || ''} onChange={(e) => update('hero', 'secondaryCtaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Secondary CTA Link</label>
            <input value={data.hero?.secondaryCtaLink || ''} onChange={(e) => update('hero', 'secondaryCtaLink', e.target.value)} style={inputStyle} />

            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={data.hero?.backgroundImage || ''} onChange={(e) => update('hero', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('hero', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Floating Cards</h4>
            {(data.hero?.floats || []).map((f: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={f.value || ''} onChange={(e) => arrChange('hero', 'floats', i, 'value', e.target.value)} placeholder="Value" style={inputStyle} />
                <input value={f.label || ''} onChange={(e) => arrChange('hero', 'floats', i, 'label', e.target.value)} placeholder="Label" style={inputStyle} />
                <button onClick={() => arrRemove('hero', 'floats', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('hero', 'floats', { value: '', label: '' })} style={goldBtn}>+ Add Float</button>
          </div>
        )}

        {/* STORY */}
        {activeTab === 'story' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.story?.eyebrow || ''} onChange={(e) => update('story', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.story?.title || ''} onChange={(e) => update('story', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.story?.titleAccent || ''} onChange={(e) => update('story', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.story?.text || ''} onChange={(e) => update('story', 'text', e.target.value)} rows={4} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.story?.ctaText || ''} onChange={(e) => update('story', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.story?.ctaLink || ''} onChange={(e) => update('story', 'ctaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.story?.image || ''} onChange={(e) => update('story', 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('story', 'image', url))} style={tealBtn}>Upload</button>
            </div>
          </div>
        )}

        {/* MISSION */}
        {activeTab === 'mission' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.mission?.eyebrow || ''} onChange={(e) => update('mission', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.mission?.title || ''} onChange={(e) => update('mission', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.mission?.titleAccent || ''} onChange={(e) => update('mission', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Vision Title</label>
            <input value={data.mission?.visionTitle || ''} onChange={(e) => update('mission', 'visionTitle', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Vision Text</label>
            <textarea value={data.mission?.visionText || ''} onChange={(e) => update('mission', 'visionText', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>Mission Title</label>
            <input value={data.mission?.missionTitle || ''} onChange={(e) => update('mission', 'missionTitle', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Mission Text</label>
            <textarea value={data.mission?.missionText || ''} onChange={(e) => update('mission', 'missionText', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.mission?.ctaText || ''} onChange={(e) => update('mission', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.mission?.ctaLink || ''} onChange={(e) => update('mission', 'ctaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.mission?.image || ''} onChange={(e) => update('mission', 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('mission', 'image', url))} style={tealBtn}>Upload</button>
            </div>
          </div>
        )}

        {/* STRATEGY */}
        {activeTab === 'strategy' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.strategy?.eyebrow || ''} onChange={(e) => update('strategy', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.strategy?.title || ''} onChange={(e) => update('strategy', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.strategy?.titleAccent || ''} onChange={(e) => update('strategy', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.strategy?.subtitle || ''} onChange={(e) => update('strategy', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Steps</h4>
            {(data.strategy?.steps || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Number</label>
                <input value={s.number || ''} onChange={(e) => arrChange('strategy', 'steps', i, 'number', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('strategy', 'steps', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={s.iconBg || ''} onChange={(e) => arrChange('strategy', 'steps', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={s.title || ''} onChange={(e) => arrChange('strategy', 'steps', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={s.text || ''} onChange={(e) => arrChange('strategy', 'steps', i, 'text', e.target.value)} rows={3} style={inputStyle} />
                <button onClick={() => arrRemove('strategy', 'steps', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('strategy', 'steps', { number: '', icon: '', iconBg: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Step</button>
          </div>
        )}

        {/* VALUES */}
        {activeTab === 'values' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.values?.eyebrow || ''} onChange={(e) => update('values', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.values?.title || ''} onChange={(e) => update('values', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.values?.titleAccent || ''} onChange={(e) => update('values', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Values</h4>
            {(data.values?.items || []).map((v: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={v.icon || ''} onChange={(e) => arrChange('values', 'items', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={v.color || ''} onChange={(e) => arrChange('values', 'items', i, 'color', e.target.value)} placeholder="navy / forest / gold" style={inputStyle} />
                <input value={v.title || ''} onChange={(e) => arrChange('values', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={v.text || ''} onChange={(e) => arrChange('values', 'items', i, 'text', e.target.value)} placeholder="Description" rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('values', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('values', 'items', { icon: '', color: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Value</button>
          </div>
        )}

        {/* PROGRAMS */}
        {activeTab === 'programs' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.programs?.eyebrow || ''} onChange={(e) => update('programs', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.programs?.title || ''} onChange={(e) => update('programs', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.programs?.titleAccent || ''} onChange={(e) => update('programs', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.programs?.ctaText || ''} onChange={(e) => update('programs', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.programs?.ctaLink || ''} onChange={(e) => update('programs', 'ctaLink', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Programs</h4>
            {(data.programs?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={p.id || ''} onChange={(e) => arrChange('programs', 'items', i, 'id', e.target.value)} placeholder="Anchor ID (e.g. wetlands-advocacy)" style={inputStyle} />
                <input value={p.icon || ''} onChange={(e) => arrChange('programs', 'items', i, 'icon', e.target.value)} placeholder="Icon class" style={inputStyle} />
                <input value={p.iconBg || ''} onChange={(e) => arrChange('programs', 'items', i, 'iconBg', e.target.value)} placeholder="navy / forest / gold" style={inputStyle} />
                <input value={p.title || ''} onChange={(e) => arrChange('programs', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={p.text || ''} onChange={(e) => arrChange('programs', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('programs', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('programs', 'items', { id: '', icon: '', iconBg: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Program</button>
          </div>
        )}

        {/* IMPACT */}
        {activeTab === 'impact' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.impact?.eyebrow || ''} onChange={(e) => update('impact', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.impact?.title || ''} onChange={(e) => update('impact', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.impact?.titleAccent || ''} onChange={(e) => update('impact', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title End</label>
            <input value={data.impact?.titleEnd || ''} onChange={(e) => update('impact', 'titleEnd', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <input value={data.impact?.backgroundImage || ''} onChange={(e) => update('impact', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('impact', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginBottom: 12 }}>Stats</h4>
            {(data.impact?.items || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={s.value || ''} onChange={(e) => arrChange('impact', 'items', i, 'value', e.target.value)} placeholder="Value" style={inputStyle} />
                <input value={s.label || ''} onChange={(e) => arrChange('impact', 'items', i, 'label', e.target.value)} placeholder="Label" style={inputStyle} />
                <button onClick={() => arrRemove('impact', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('impact', 'items', { value: '', label: '' })} style={goldBtn}>+ Add Stat</button>
          </div>
        )}

        {/* PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.projects?.eyebrow || ''} onChange={(e) => update('projects', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.projects?.title || ''} onChange={(e) => update('projects', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.projects?.titleAccent || ''} onChange={(e) => update('projects', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.projects?.subtitle || ''} onChange={(e) => update('projects', 'subtitle', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.projects?.ctaText || ''} onChange={(e) => update('projects', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.projects?.ctaLink || ''} onChange={(e) => update('projects', 'ctaLink', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Projects</h4>
            {(data.projects?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={p.date || ''} onChange={(e) => arrChange('projects', 'items', i, 'date', e.target.value)} placeholder="Date" style={inputStyle} />
                <input value={p.title || ''} onChange={(e) => arrChange('projects', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={p.text || ''} onChange={(e) => arrChange('projects', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <input value={p.donor || ''} onChange={(e) => arrChange('projects', 'items', i, 'donor', e.target.value)} placeholder="Donor" style={inputStyle} />
                <input value={p.budget || ''} onChange={(e) => arrChange('projects', 'items', i, 'budget', e.target.value)} placeholder="Budget (e.g. $800)" style={inputStyle} />
                <button onClick={() => arrRemove('projects', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('projects', 'items', { date: '', title: '', text: '', donor: '', budget: '' })} style={goldBtn}>+ Add Project</button>
          </div>
        )}

        {/* NEWS */}
        {activeTab === 'news' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.news?.eyebrow || ''} onChange={(e) => update('news', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.news?.title || ''} onChange={(e) => update('news', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.news?.titleAccent || ''} onChange={(e) => update('news', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.news?.ctaText || ''} onChange={(e) => update('news', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.news?.ctaLink || ''} onChange={(e) => update('news', 'ctaLink', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>News Items</h4>
            {(data.news?.items || []).map((n: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={n.date || ''} onChange={(e) => arrChange('news', 'items', i, 'date', e.target.value)} placeholder="Date" style={inputStyle} />
                <input value={n.title || ''} onChange={(e) => arrChange('news', 'items', i, 'title', e.target.value)} placeholder="Title" style={inputStyle} />
                <textarea value={n.text || ''} onChange={(e) => arrChange('news', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('news', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('news', 'items', { date: '', title: '', text: '' })} style={goldBtn}>+ Add News</button>
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

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Partners</h4>
            {(data.partners?.items || []).map((p: any, i: number) => (
              <div key={i} style={rowBox}>
                <input value={p.name || ''} onChange={(e) => arrChange('partners', 'items', i, 'name', e.target.value)} placeholder="Partner name" style={inputStyle} />
                <label style={labelStyle}>Logo URL</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={p.logo || ''} onChange={(e) => arrChange('partners', 'items', i, 'logo', e.target.value)} placeholder="/images/partner.png" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  <button type="button" onClick={() => triggerUpload((url) => arrChange('partners', 'items', i, 'logo', url))} style={tealBtn}>Upload</button>
                </div>
                <input value={p.placeholder || ''} onChange={(e) => arrChange('partners', 'items', i, 'placeholder', e.target.value)} placeholder="Fallback icon class (fas fa-leaf)" style={inputStyle} />
                <button onClick={() => arrRemove('partners', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('partners', 'items', { name: '', logo: '', placeholder: 'fa-solid fa-handshake' })} style={goldBtn}>+ Add Partner</button>
          </div>
        )}

                {/* GET INVOLVED */}
        {activeTab === 'getInvolved' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.getInvolved?.eyebrow || ''} onChange={(e) => update('getInvolved', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.getInvolved?.title || ''} onChange={(e) => update('getInvolved', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.getInvolved?.titleAccent || ''} onChange={(e) => update('getInvolved', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Cards</h4>
            {(data.getInvolved?.items || []).map((g: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={g.icon || ''} onChange={(e) => arrChange('getInvolved', 'items', i, 'icon', e.target.value)} placeholder="fa-solid fa-hand-holding-heart" style={inputStyle} />

                <label style={labelStyle}>Color (navy / forest / gold)</label>
                <input value={g.color || ''} onChange={(e) => arrChange('getInvolved', 'items', i, 'color', e.target.value)} placeholder="gold" style={inputStyle} />

                <label style={labelStyle}>Title</label>
                <input value={g.title || ''} onChange={(e) => arrChange('getInvolved', 'items', i, 'title', e.target.value)} placeholder="Volunteer" style={inputStyle} />

                <label style={labelStyle}>Description (shown under title)</label>
                <textarea
                  value={g.text || ''}
                  onChange={(e) => arrChange('getInvolved', 'items', i, 'text', e.target.value)}
                  placeholder="Join our field teams and community mobilizers..."
                  rows={2}
                  style={inputStyle}
                />

                <label style={labelStyle}>Button Text</label>
                <input value={g.buttonText || ''} onChange={(e) => arrChange('getInvolved', 'items', i, 'buttonText', e.target.value)} placeholder="Volunteer Now" style={inputStyle} />

                <label style={labelStyle}>Button Link</label>
                <input value={g.link || ''} onChange={(e) => arrChange('getInvolved', 'items', i, 'link', e.target.value)} placeholder="/get-involved#volunteer" style={inputStyle} />

                <button onClick={() => arrRemove('getInvolved', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button
              onClick={() =>
                arrAdd('getInvolved', 'items', {
                  icon: 'fa-solid fa-star',
                  color: 'gold',
                  title: 'New Item',
                  text: 'Short description…',
                  buttonText: 'Learn More',
                  link: '/',
                })
              }
              style={goldBtn}
            >
              + Add Card
            </button>
          </div>
        )}

                {/* CONTACT */}
        {activeTab === 'contact' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input
              value={data.contact?.eyebrow || ''}
              onChange={(e) => update('contact', 'eyebrow', e.target.value)}
              style={inputStyle}
            />
            <label style={labelStyle}>Title</label>
            <input
              value={data.contact?.title || ''}
              onChange={(e) => update('contact', 'title', e.target.value)}
              style={inputStyle}
            />
            <label style={labelStyle}>Title Accent</label>
            <input
              value={data.contact?.titleAccent || ''}
              onChange={(e) => update('contact', 'titleAccent', e.target.value)}
              style={inputStyle}
            />
            <label style={labelStyle}>Intro Text</label>
            <textarea
              value={data.contact?.intro || ''}
              onChange={(e) => update('contact', 'intro', e.target.value)}
              rows={2}
              style={inputStyle}
            />

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>
              Contact Cards ({(data.contact?.cards || []).length})
            </h4>

            {(data.contact?.cards || []).map((c: any, i: number) => (
              <div
                key={i}
                style={{
                  ...rowBox,
                  position: 'relative',
                  paddingTop: 20,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      background: '#06283D',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: 6,
                      letterSpacing: '0.5px',
                    }}
                  >
                    CARD {i + 1}
                  </span>
                  <strong style={{ color: '#06283D', fontSize: '0.9rem' }}>
                    {c.label || 'Untitled'}
                  </strong>
                </div>

                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input
                    value={c.icon || ''}
                    onChange={(e) =>
                      arrChange('contact', 'cards', i, 'icon', e.target.value)
                    }
                    placeholder="fa-solid fa-location-dot"
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                  />
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      background: '#F0FDFA',
                      border: '1.5px solid #99F6E4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0D9488',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                    title="Icon preview"
                  >
                    <i className={c.icon || 'fa-solid fa-star'} />
                  </div>
                </div>

                <label style={labelStyle}>Icon Background Color</label>
                <select
                  value={c.iconBg || 'gold'}
                  onChange={(e) =>
                    arrChange('contact', 'cards', i, 'iconBg', e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="gold">Gold (yellow)</option>
                  <option value="forest">Forest (green)</option>
                  <option value="navy">Navy (dark blue)</option>
                </select>

                <label style={labelStyle}>Label</label>
                <input
                  value={c.label || ''}
                  onChange={(e) =>
                    arrChange('contact', 'cards', i, 'label', e.target.value)
                  }
                  placeholder="Visit Us"
                  style={inputStyle}
                />

                <label style={labelStyle}>Text</label>
                <textarea
                  value={c.text || ''}
                  onChange={(e) =>
                    arrChange('contact', 'cards', i, 'text', e.target.value)
                  }
                  rows={2}
                  style={inputStyle}
                />

                <label style={labelStyle}>
                  Link (optional — mailto:, tel:, https:, or /path)
                </label>
                <input
                  value={c.link || ''}
                  onChange={(e) =>
                    arrChange('contact', 'cards', i, 'link', e.target.value)
                  }
                  placeholder="mailto:info@seasouthsudan.org"
                  style={inputStyle}
                />

                <label style={labelStyle}>Link Text</label>
                <input
                  value={c.linkText || ''}
                  onChange={(e) =>
                    arrChange('contact', 'cards', i, 'linkText', e.target.value)
                  }
                  placeholder="Send an Email"
                  style={inputStyle}
                />

                <button
                  onClick={() => arrRemove('contact', 'cards', i)}
                  style={dangerBtn}
                >
                  Remove Card
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                arrAdd('contact', 'cards', {
                  icon: 'fa-solid fa-star',
                  iconBg: 'gold',
                  label: 'New Card',
                  text: '',
                  link: '',
                  linkText: '',
                })
              }
              style={{ ...goldBtn, marginBottom: 24 }}
            >
              + Add Card
            </button>

            <h4 style={{ marginBottom: 12 }}>
              Social Links ({(data.contact?.socials || []).length})
            </h4>

            {(data.contact?.socials || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input
                    value={s.icon || ''}
                    onChange={(e) =>
                      arrChange('contact', 'socials', i, 'icon', e.target.value)
                    }
                    placeholder="fa-brands fa-facebook-f"
                    style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                  />
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      background: '#F9FAFB',
                      border: '1.5px solid #E5E7EB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#06283D',
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                    title="Icon preview"
                  >
                    <i className={s.icon || 'fa-solid fa-link'} />
                  </div>
                </div>

                <label style={labelStyle}>URL</label>
                <input
                  value={s.url || ''}
                  onChange={(e) =>
                    arrChange('contact', 'socials', i, 'url', e.target.value)
                  }
                  placeholder="https://..."
                  style={inputStyle}
                />

                <button
                  onClick={() => arrRemove('contact', 'socials', i)}
                  style={dangerBtn}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                arrAdd('contact', 'socials', {
                  icon: 'fa-brands fa-facebook-f',
                  url: '',
                })
              }
              style={{ ...goldBtn, marginBottom: 24 }}
            >
              + Add Social Link
            </button>
          </div>
        )}

        <button
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
          {saving ? 'Saving…' : 'Save Homepage'}
        </button>
      </div>
    </div>
  );
}