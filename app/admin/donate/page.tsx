'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminDonatePage() {
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
    fetch('/api/donate')
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
      const res = await fetch('/api/donate', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Donate page saved successfully!' });
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

  if (loading) return <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>Loading Donate page…</div>;

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

  const tabs = ['hero', 'ways', 'bank', 'impact', 'faq', 'cta'];

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
        <h1 style={{ fontSize: '1.8rem', color: '#06283D', marginBottom: 6 }}>Edit Donate Page</h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>Manage hero, ways to give, bank details, impact tiers, FAQ and CTA.</p>

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
            <label style={labelStyle}>CTA Text</label>
            <input value={data.hero?.ctaText || ''} onChange={(e) => update('hero', 'ctaText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>CTA Link</label>
            <input value={data.hero?.ctaLink || ''} onChange={(e) => update('hero', 'ctaLink', e.target.value)} placeholder="#ways-to-give" style={inputStyle} />
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

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Ways to Give Cards</h4>
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

        {/* BANK */}
        {activeTab === 'bank' && (
          <div>
            <div style={{ padding: 14, background: '#FEF3C7', border: '1.5px solid #FDE68A', borderRadius: 12, marginBottom: 20 }}>
              <strong style={{ color: '#78350F' }}>⚠️ Verify all banking details before publishing.</strong>
            </div>

            <label style={labelStyle}>Eyebrow</label>
            <input value={data.bank?.eyebrow || ''} onChange={(e) => update('bank', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.bank?.title || ''} onChange={(e) => update('bank', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.bank?.titleAccent || ''} onChange={(e) => update('bank', 'titleAccent', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Subtitle</label>
            <textarea value={data.bank?.subtitle || ''} onChange={(e) => update('bank', 'subtitle', e.target.value)} rows={2} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Bank Fields</h4>
            {(data.bank?.fields || []).map((f: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Label</label>
                <input value={f.label || ''} onChange={(e) => arrChange('bank', 'fields', i, 'label', e.target.value)} placeholder="Account Name" style={inputStyle} />
                <label style={labelStyle}>Value</label>
                <input value={f.value || ''} onChange={(e) => arrChange('bank', 'fields', i, 'value', e.target.value)} placeholder="Sudd Environment Agency" style={inputStyle} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => arrMove('bank', 'fields', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                  <button onClick={() => arrMove('bank', 'fields', i, 1)} disabled={i === (data.bank?.fields || []).length - 1} style={{ ...smallBtn, opacity: i === (data.bank?.fields || []).length - 1 ? 0.4 : 1 }}>↓</button>
                  <button onClick={() => arrRemove('bank', 'fields', i)} style={dangerBtn}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => arrAdd('bank', 'fields', { label: '', value: '' })} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Field</button>

            <label style={labelStyle}>Mobile Money Section Title</label>
            <input value={data.bank?.mobileMoneyTitle || ''} onChange={(e) => update('bank', 'mobileMoneyTitle', e.target.value)} style={inputStyle} />

            <h4 style={{ marginBottom: 12 }}>Mobile Money Options</h4>
            {(data.bank?.mobileMoney || []).map((m: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Icon</label>
                <input value={m.icon || ''} onChange={(e) => arrChange('bank', 'mobileMoney', i, 'icon', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Label</label>
                <input value={m.label || ''} onChange={(e) => arrChange('bank', 'mobileMoney', i, 'label', e.target.value)} placeholder="MTN Mobile Money" style={inputStyle} />
                <label style={labelStyle}>Number</label>
                <input value={m.value || ''} onChange={(e) => arrChange('bank', 'mobileMoney', i, 'value', e.target.value)} placeholder="+211..." style={inputStyle} />
                <button onClick={() => arrRemove('bank', 'mobileMoney', i)} style={dangerBtn}>Remove</button>
              </div>
            ))}
            <button onClick={() => arrAdd('bank', 'mobileMoney', { icon: 'fa-solid fa-mobile-screen', label: '', value: '' })} style={{ ...goldBtn, marginBottom: 24 }}>+ Add Mobile Money</button>

            <h4 style={{ marginBottom: 12 }}>Copy Button</h4>
            <label style={labelStyle}>Copy Button Text</label>
            <input value={data.bank?.copyButtonText || ''} onChange={(e) => update('bank', 'copyButtonText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Copy Hint</label>
            <input value={data.bank?.copyHint || ''} onChange={(e) => update('bank', 'copyHint', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Success Message</label>
            <input value={data.bank?.copySuccessMessage || ''} onChange={(e) => update('bank', 'copySuccessMessage', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Error Message</label>
            <input value={data.bank?.copyErrorMessage || ''} onChange={(e) => update('bank', 'copyErrorMessage', e.target.value)} style={inputStyle} />
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

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>Impact Tiers</h4>
            {(data.impact?.items || []).map((d: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Amount</label>
                <input value={d.amount || ''} onChange={(e) => arrChange('impact', 'items', i, 'amount', e.target.value)} placeholder="$25" style={inputStyle} />
                <label style={labelStyle}>Color (navy / forest / gold)</label>
                <input value={d.color || ''} onChange={(e) => arrChange('impact', 'items', i, 'color', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Text</label>
                <textarea value={d.text || ''} onChange={(e) => arrChange('impact', 'items', i, 'text', e.target.value)} rows={2} style={inputStyle} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => arrMove('impact', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                  <button onClick={() => arrMove('impact', 'items', i, 1)} disabled={i === (data.impact?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.impact?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                  <button onClick={() => arrRemove('impact', 'items', i)} style={dangerBtn}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => arrAdd('impact', 'items', { amount: '', color: 'navy', text: '' })} style={goldBtn}>+ Add Tier</button>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div>
            <label style={labelStyle}>Eyebrow</label>
            <input value={data.faq?.eyebrow || ''} onChange={(e) => update('faq', 'eyebrow', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title</label>
            <input value={data.faq?.title || ''} onChange={(e) => update('faq', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Title Accent</label>
            <input value={data.faq?.titleAccent || ''} onChange={(e) => update('faq', 'titleAccent', e.target.value)} style={inputStyle} />

            <h4 style={{ marginTop: 20, marginBottom: 12 }}>FAQ Items</h4>
            {(data.faq?.items || []).map((item: any, i: number) => (
              <div key={i} style={rowBox}>
                <label style={labelStyle}>Question</label>
                <input value={item.question || ''} onChange={(e) => arrChange('faq', 'items', i, 'question', e.target.value)} style={inputStyle} />
                <label style={labelStyle}>Answer</label>
                <textarea value={item.answer || ''} onChange={(e) => arrChange('faq', 'items', i, 'answer', e.target.value)} rows={3} style={inputStyle} />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => arrMove('faq', 'items', i, -1)} disabled={i === 0} style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}>↑</button>
                  <button onClick={() => arrMove('faq', 'items', i, 1)} disabled={i === (data.faq?.items || []).length - 1} style={{ ...smallBtn, opacity: i === (data.faq?.items || []).length - 1 ? 0.4 : 1 }}>↓</button>
                  <button onClick={() => arrRemove('faq', 'items', i)} style={dangerBtn}>Remove</button>
                </div>
              </div>
            ))}
            <button onClick={() => arrAdd('faq', 'items', { question: '', answer: '' })} style={goldBtn}>+ Add FAQ</button>
          </div>
        )}

        {/* CTA */}
        {activeTab === 'cta' && (
          <div>
            <label style={labelStyle}>Title</label>
            <input value={data.cta?.title || ''} onChange={(e) => update('cta', 'title', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Text</label>
            <textarea value={data.cta?.text || ''} onChange={(e) => update('cta', 'text', e.target.value)} rows={2} style={inputStyle} />
            <label style={labelStyle}>Button Text</label>
            <input value={data.cta?.buttonText || ''} onChange={(e) => update('cta', 'buttonText', e.target.value)} style={inputStyle} />
            <label style={labelStyle}>Button Link</label>
            <input value={data.cta?.buttonLink || ''} onChange={(e) => update('cta', 'buttonLink', e.target.value)} style={inputStyle} />
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
          {saving ? 'Saving…' : 'Save Donate Page'}
        </button>
      </div>
    </div>
  );
}