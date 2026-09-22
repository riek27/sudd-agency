'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminGetInvolvedPage() {
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
    fetch('/api/get-involved')
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
      const res = await fetch('/api/get-involved', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Get Involved page saved successfully!' });
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Get Involved page…</div>;

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

  const tabs = ['hero', 'ways', 'volunteer', 'donation', 'partner', 'newsletter'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Get Involved Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage volunteer, donation, partner and newsletter sections.</p>

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

        {/* WAYS */}
        {activeTab === 'ways' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.ways?.eyebrow || ''} onChange={(e) => update('ways', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.ways?.title || ''} onChange={(e) => update('ways', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.ways?.titleAccent || ''} onChange={(e) => update('ways', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Cards</h4>
            {(data.ways?.items || []).map((w: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={w.icon || ''} onChange={(e) => arrChange('ways', 'items', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={w.iconBg || ''} onChange={(e) => arrChange('ways', 'items', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Title</label>
                <input value={w.title || ''} onChange={(e) => arrChange('ways', 'items', i, 'title', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={w.text || ''} onChange={(e) => arrChange('ways', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <label style={labelStyle}>Button Text</label>
                <input value={w.buttonText || ''} onChange={(e) => arrChange('ways', 'items', i, 'buttonText', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Button Link</label>
                <input value={w.buttonLink || ''} onChange={(e) => arrChange('ways', 'items', i, 'buttonLink', e.target.value)} style={inputStyle} />
                <button onClick={() => arrRemove('ways', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('ways', 'items', { icon: 'fa-solid fa-star', iconBg: 'navy', title: '', text: '', buttonText: 'Learn More', buttonLink: '/' })} style={goldBtn}>+ Add Card</button>
          </div>
        )}

        {/* VOLUNTEER */}
        {activeTab === 'volunteer' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.volunteer?.eyebrow || ''} onChange={(e) => update('volunteer', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.volunteer?.title || ''} onChange={(e) => update('volunteer', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.volunteer?.titleAccent || ''} onChange={(e) => update('volunteer', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.volunteer?.text || ''} onChange={(e) => update('volunteer', 'text', e.target.value)} rows={3} style={inputStyle} />
            <label style={labelStyle}>Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input value={data.volunteer?.image || ''} onChange={(e) => update('volunteer', 'image', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('volunteer', 'image', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginBottom: 12 }}>Form Placeholders</h4>
            <label style={labelStyle}>Name Placeholder</label>
            <input value={data.volunteer?.form?.namePlaceholder || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, namePlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Email Placeholder</label>
            <input value={data.volunteer?.form?.emailPlaceholder || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, emailPlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Phone Placeholder</label>
            <input value={data.volunteer?.form?.phonePlaceholder || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, phonePlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Location Dropdown Label</label>
            <input value={data.volunteer?.form?.locationPlaceholder || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, locationPlaceholder: e.target.value })} style={inputStyle} />

            <label style={labelStyle}>Location Options (comma separated)</label>
            <input
              value={(data.volunteer?.form?.locationOptions || []).join(', ')}
              onChange={(e) =>
                update('volunteer', 'form', {
                  ...data.volunteer?.form,
                  locationOptions: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean),
                })
              }
              placeholder="Juba, Unity State, Upper Nile State, Remote"
              style={inputStyle}
            />

            <label style={labelStyle}>Message Placeholder</label>
            <input value={data.volunteer?.form?.messagePlaceholder || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, messagePlaceholder: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Submit Button Text</label>
            <input value={data.volunteer?.form?.submitText || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, submitText: e.target.value })} style={inputStyle} />
            <label style={labelStyle}>Success Message</label>
            <textarea value={data.volunteer?.form?.successMessage || ''} onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, successMessage: e.target.value })} rows={2} style={inputStyle} />

            <div style={{ padding: 14, background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: 12, marginTop: 12 }}>
              <label style={{ ...labelStyle, color: '#0F766E' }}>Web3Forms Access Key (Volunteer Form)</label>
              <input
                value={data.volunteer?.form?.web3formsKey || ''}
                onChange={(e) => update('volunteer', 'form', { ...data.volunteer?.form, web3formsKey: e.target.value })}
                placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                style={{ ...inputStyle, marginBottom: 0, fontFamily: 'monospace' }}
              />
              <p style={{ fontSize: '0.75rem', color: '#0F766E', margin: '8px 0 0' }}>
                Volunteer applications will be emailed to the address registered at web3forms.com.
              </p>
            </div>
          </div>
        )}

        {/* DONATION */}
        {activeTab === 'donation' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.donation?.eyebrow || ''} onChange={(e) => update('donation', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.donation?.title || ''} onChange={(e) => update('donation', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.donation?.titleAccent || ''} onChange={(e) => update('donation', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Donation Tiers</h4>
            {(data.donation?.items || []).map((d: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Amount</label>
                <input value={d.amount || ''} onChange={(e) => arrChange('donation', 'items', i, 'amount', e.target.value)} placeholder="$25" style={inputStyle} />
                <label style={labelStyle}>Color (navy / forest / gold)</label>
                <input value={d.color || ''} onChange={(e) => arrChange('donation', 'items', i, 'color', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={d.text || ''} onChange={(e) => arrChange('donation', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <label style={labelStyle}>Button Text</label>
                <input value={d.buttonText || ''} onChange={(e) => arrChange('donation', 'items', i, 'buttonText', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Button Link</label>
                <input value={d.buttonLink || ''} onChange={(e) => arrChange('donation', 'items', i, 'buttonLink', e.target.value)} style={inputStyle} />
                <button onClick={() => arrRemove('donation', 'items', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('donation', 'items', { amount: '', color: 'navy', text: '', buttonText: 'Give', buttonLink: '/donate' })} style={goldBtn}>+ Add Tier</button>
          </div>
        )}

        {/* PARTNER */}
        {activeTab === 'partner' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.partner?.eyebrow || ''} onChange={(e) => update('partner', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.partner?.title || ''} onChange={(e) => update('partner', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.partner?.titleAccent || ''} onChange={(e) => update('partner', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.partner?.text || ''} onChange={(e) => update('partner', 'text', e.target.value)} rows={3} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Bullet Points</h4>
            {(data.partner?.bulletPoints || []).map((b: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input value={b} onChange={(e) => strChange('partner', 'bulletPoints', i, e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                <button onClick={() => arrRemove('partner', 'bulletPoints', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('partner', 'bulletPoints', '')} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Bullet</button>

            <label style={labelStyle}>CTA Text</label>
            <input value={data.partner?.ctaText || ''} onChange={(e) => update('partner', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.partner?.ctaLink || ''} onChange={(e) => update('partner', 'ctaLink', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Background Image</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <input value={data.partner?.backgroundImage || ''} onChange={(e) => update('partner', 'backgroundImage', e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button type="button" onClick={() => triggerUpload((url) => update('partner', 'backgroundImage', url))} style={tealBtn}>Upload</button>
            </div>

            <h4 style={{ marginBottom: 12 }}>Glass Panel</h4>
            <label style={labelStyle}>Panel Title</label>
            <input value={data.partner?.panelTitle || ''} onChange={(e) => update('partner', 'panelTitle', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Panel Text</label>
            <textarea value={data.partner?.panelText || ''} onChange={(e) => update('partner', 'panelText', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Panel Button Text</label>
            <input value={data.partner?.panelButtonText || ''} onChange={(e) => update('partner', 'panelButtonText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Panel Button Link</label>
            <input value={data.partner?.panelButtonLink || ''} onChange={(e) => update('partner', 'panelButtonLink', e.target.value)} style={inputStyle} />
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
            <input value={data.newsletter?.placeholder || ''} onChange={(e) => update('newsletter', 'placeholder', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button Text</label>
            <input value={data.newsletter?.buttonText || ''} onChange={(e) => update('newsletter', 'buttonText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Success Message</label>
            <input value={data.newsletter?.successMessage || ''} onChange={(e) => update('newsletter', 'successMessage', e.target.value)} style={inputStyle} />

            <div style={{ padding: 14, background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: 12, marginTop: 12, marginBottom: 24 }}>
              <label style={{ ...labelStyle, color: '#0F766E' }}>Web3Forms Access Key (Newsletter)</label>
              <input
                value={data.newsletter?.web3formsKey || ''}
                onChange={(e) => update('newsletter', 'web3formsKey', e.target.value)}
                placeholder="a1b2c3d4-e5f6-7890-abcd-ef1234567890"
                style={{ ...inputStyle, marginBottom: 0, fontFamily: 'monospace' }}
              />
            </div>

            <h4 style={{ marginBottom: 12 }}>Social Links</h4>
            {(data.newsletter?.socials || []).map((s: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon (FontAwesome class)</label>
                <input value={s.icon || ''} onChange={(e) => arrChange('newsletter', 'socials', i, 'icon', e.target.value)} placeholder="fa-brands fa-facebook-f" style={inputStyle} />
                <label style={labelStyle}>Icon BG (navy / forest / gold)</label>
                <input value={s.iconBg || ''} onChange={(e) => arrChange('newsletter', 'socials', i, 'iconBg', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>URL</label>
                <input value={s.url || ''} onChange={(e) => arrChange('newsletter', 'socials', i, 'url', e.target.value)} placeholder="https://..." style={inputStyle} />
                <button onClick={() => arrRemove('newsletter', 'socials', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('newsletter', 'socials', { icon: 'fa-brands fa-facebook-f', iconBg: 'navy', url: '' })} style={goldBtn}>+ Add Social</button>
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
          {saving ? 'Saving…' : 'Save Get Involved Page'}
        </button>
      </div>
    </div>
  );
}