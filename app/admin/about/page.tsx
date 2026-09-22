'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminAboutPage() {
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
    fetch('/api/about')
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
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'About page saved successfully!' });
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

  /* Array helpers */
  const arrChange = (section: string, field: string, idx: number, key: string | null, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      if (key === null) arr[idx] = value;
      else if (arr[idx]) arr[idx] = { ...arr[idx], [key]: value };
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

  /* Paragraphs (simple string array) */
  const paraChange = (idx: number, value: string) => {
    setData((prev: any) => {
      const arr = [...(prev.history?.paragraphs || [])];
      arr[idx] = value;
      return { ...prev, history: { ...(prev.history || {}), paragraphs: arr } };
    });
  };
  const paraAdd = () => {
    setData((prev: any) => ({
      ...prev,
      history: {
        ...(prev.history || {}),
        paragraphs: [...(prev.history?.paragraphs || []), ''],
      },
    }));
  };
  const paraRemove = (idx: number) => {
    setData((prev: any) => {
      const arr = [...(prev.history?.paragraphs || [])];
      arr.splice(idx, 1);
      return { ...prev, history: { ...(prev.history || {}), paragraphs: arr } };
    });
  };

  /* Team member helpers */
  const teamChange = (idx: number, key: string, value: any) => {
    setData((prev: any) => {
      const arr = [...(prev.team?.members || [])];
      if (arr[idx]) arr[idx] = { ...arr[idx], [key]: value };
      return { ...prev, team: { ...(prev.team || {}), members: arr } };
    });
  };
  const teamAdd = () => {
    setData((prev: any) => ({
      ...prev,
      team: {
        ...(prev.team || {}),
        members: [
          ...(prev.team?.members || []),
          {
            id: `member-${Date.now()}`,
            name: 'New Team Member',
            position: 'Position Title',
            photo: '',
            education: [],
            expertise: [],
            email: '',
            whatsapp: '',
            phone: '',
          },
        ],
      },
    }));
  };
  const teamRemove = (idx: number) => {
    const name = data.team?.members?.[idx]?.name || 'this member';
    if (!confirm(`Delete "${name}"?`)) return;
    setData((prev: any) => {
      const arr = [...(prev.team?.members || [])];
      arr.splice(idx, 1);
      return { ...prev, team: { ...(prev.team || {}), members: arr } };
    });
  };
  const teamMove = (idx: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const arr = [...(prev.team?.members || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      const [item] = arr.splice(idx, 1);
      arr.splice(newIdx, 0, item);
      return { ...prev, team: { ...(prev.team || {}), members: arr } };
    });
  };

  /* Nested list helpers (education, expertise) */
  const teamListChange = (memberIdx: number, listKey: string, itemIdx: number, value: string) => {
    setData((prev: any) => {
      const members = [...(prev.team?.members || [])];
      if (members[memberIdx]) {
        const list = [...(members[memberIdx][listKey] || [])];
        list[itemIdx] = value;
        members[memberIdx] = { ...members[memberIdx], [listKey]: list };
      }
      return { ...prev, team: { ...(prev.team || {}), members } };
    });
  };
  const teamListAdd = (memberIdx: number, listKey: string) => {
    setData((prev: any) => {
      const members = [...(prev.team?.members || [])];
      if (members[memberIdx]) {
        members[memberIdx] = {
          ...members[memberIdx],
          [listKey]: [...(members[memberIdx][listKey] || []), ''],
        };
      }
      return { ...prev, team: { ...(prev.team || {}), members } };
    });
  };
  const teamListRemove = (memberIdx: number, listKey: string, itemIdx: number) => {
    setData((prev: any) => {
      const members = [...(prev.team?.members || [])];
      if (members[memberIdx]) {
        const list = [...(members[memberIdx][listKey] || [])];
        list.splice(itemIdx, 1);
        members[memberIdx] = { ...members[memberIdx], [listKey]: list };
      }
      return { ...prev, team: { ...(prev.team || {}), members } };
    });
  };

  /* Upload */
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
    return (
      <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading About page…</div>
    );
  }

  /* Styles */
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

  const tabs = ['hero', 'history', 'mission', 'strategy', 'team', 'values', 'cta'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit About Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage every section of the SEA About page.</p>

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
            <label style={labelStyle}>Title Accent (gold italic)</label>
            <input value={data.hero?.titleAccent || ''} onChange={(e) => update('hero', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.hero?.subtitle || ''} onChange={(e) => update('hero', 'subtitle', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={data.hero?.backgroundImage || ''} onChange={(e) => update('hero', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('hero', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>
          </div>
        )}

        {/* HISTORY */}
        {activeTab === 'history' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.history?.eyebrow || ''} onChange={(e) => update('history', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.history?.title || ''} onChange={(e) => update('history', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.history?.titleAccent || ''} onChange={(e) => update('history', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Paragraphs</h4>
            {(data.history?.paragraphs || []).map((p: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <textarea
                  value={p}
                  onChange={(e) => paraChange(i, e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                <button onClick={() => paraRemove(i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={paraAdd} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Paragraph</button>

            <label style={labelStyle}>CTA Text</label>
            <input value={data.history?.ctaText || ''} onChange={(e) => update('history', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.history?.ctaLink || ''} onChange={(e) => update('history', 'ctaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={data.history?.image || ''} onChange={(e) => update('history', 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('history', 'image', url))} style={tealBtn}>Upload</button>
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

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Steps</h4>
            {(data.strategy?.steps || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Number</label>
                <input value={s.number || ''} onChange={(e) => arrChange('strategy', 'steps', i, 'number', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon (FontAwesome class)</label>
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
            <button onClick={() => arrAdd('strategy', 'steps', { number: '', icon: 'fa-solid fa-star', iconBg: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Step</button>
          </div>
        )}

        {/* TEAM */}
        {activeTab === 'team' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.team?.eyebrow || ''} onChange={(e) => update('team', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.team?.title || ''} onChange={(e) => update('team', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.team?.titleAccent || ''} onChange={(e) => update('team', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Text</label>
            <input value={data.team?.ctaText || ''} onChange={(e) => update('team', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.team?.ctaLink || ''} onChange={(e) => update('team', 'ctaLink', e.target.value)} style={inputStyle} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <h4 style={{ margin: 0 }}>Team Members ({(data.team?.members || []).length})</h4>
              <button onClick={teamAdd} style={goldBtn}>+ Add Member</button>
            </div>

            {(data.team?.members || []).map((m: any, mi: number) => (
              <div key={m.id || mi} style={rowBox}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
                  <strong style={{ color: '#06283D' }}>{mi + 1}. {m.name || 'Untitled'}</strong>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => teamMove(mi, -1)} disabled={mi === 0} style={{ ...smallBtn, opacity: mi === 0 ? 0.4 : 1 }}>↑</button>
                    <button onClick={() => teamMove(mi, 1)} disabled={mi === (data.team?.members || []).length - 1} style={{ ...smallBtn, opacity: mi === (data.team?.members || []).length - 1 ? 0.4 : 1 }}>↓</button>
                    <button onClick={() => teamRemove(mi)} style={dangerBtn}>Delete</button>
                  </div>
                </div>

                <label style={labelStyle}>Full Name</label>
                <input value={m.name || ''} onChange={(e) => teamChange(mi, 'name', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Position</label>
                <input value={m.position || ''} onChange={(e) => teamChange(mi, 'position', e.target.value)} style={inputStyle} />

                <label style={labelStyle}>Photo</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input value={m.photo || ''} onChange={(e) => teamChange(mi, 'photo', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                  <button type="button" onClick={() => triggerUpload((url) => teamChange(mi, 'photo', url))} style={tealBtn}>Upload</button>
                </div>

                {/* Education list */}
                <label style={labelStyle}>Education / Qualifications</label>
                {(m.education || []).map((e: string, ei: number) => (
                  <div key={ei} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={e} onChange={(ev) => teamListChange(mi, 'education', ei, ev.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                    <button onClick={() => teamListRemove(mi, 'education', ei)} style={dangerBtn}>×</button>
                  </div>
                ))}
                <button onClick={() => teamListAdd(mi, 'education')} style={{ ...smallBtn, marginBottom: 14 }}>+ Add Education</button>

                {/* Expertise list */}
                <label style={labelStyle}>Areas of Expertise</label>
                {(m.expertise || []).map((e: string, ei: number) => (
                  <div key={ei} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input value={e} onChange={(ev) => teamListChange(mi, 'expertise', ei, ev.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                    <button onClick={() => teamListRemove(mi, 'expertise', ei)} style={dangerBtn}>×</button>
                  </div>
                ))}
                <button onClick={() => teamListAdd(mi, 'expertise')} style={{ ...smallBtn, marginBottom: 14 }}>+ Add Expertise</button>

                {/* Contact */}
                <label style={labelStyle}>Email</label>
                <input value={m.email || ''} onChange={(e) => teamChange(mi, 'email', e.target.value)} placeholder="name@seasouthsudan.org" style={inputStyle} />

                <label style={labelStyle}>WhatsApp</label>
                <input value={m.whatsapp || ''} onChange={(e) => teamChange(mi, 'whatsapp', e.target.value)} placeholder="+211..." style={inputStyle} />

                <label style={labelStyle}>Phone (optional)</label>
                <input value={m.phone || ''} onChange={(e) => teamChange(mi, 'phone', e.target.value)} placeholder="+211..." style={inputStyle} />
              </div>
            ))}
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

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Values</h4>
            {(data.values?.items || []).map((v: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={v.icon || ''} onChange={(e) => arrChange('values', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Color (navy / forest / gold)</label>
                <input value={v.color || ''} onChange={(e) => arrChange('values', 'items', i, 'color', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={v.title || ''} onChange={(e) => arrChange('values', 'items', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={v.text || ''} onChange={(e) => arrChange('values', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <button onClick={() => arrRemove('values', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('values', 'items', { icon: 'fa-solid fa-star', color: 'navy', title: '', text: '' })} style={goldBtn}>+ Add Value</button>
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
          {saving ? 'Saving…' : 'Save About Page'}
        </button>
      </div>
    </div>
  );
}