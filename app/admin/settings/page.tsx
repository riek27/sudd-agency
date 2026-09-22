'use client';

import { useState, useEffect, useRef } from 'react';

export default function AdminSettingsPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState('account');

  const [credentials, setCredentials] = useState({
    currentPassword: '',
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingUploadRef = useRef<((url: string) => void) | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((json) => {
        setData(json && Object.keys(json).length > 0 ? json : {});
        setCredentials((c) => ({
          ...c,
          newUsername: json?.account?.username || '',
        }));
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
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setToast({ type: 'success', text: 'Settings saved successfully!' });
      else setToast({ type: 'error', text: 'Save failed.' });
    } catch {
      setToast({ type: 'error', text: 'Network error.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCredentialsSave = async () => {
    setSavingCredentials(true);
    setToast({ type: 'info', text: 'Updating credentials…' });
    try {
      const res = await fetch('/api/auth/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const json = await res.json();
      if (json.success) {
        setToast({ type: 'success', text: 'Credentials updated successfully!' });
        setCredentials({
          currentPassword: '',
          newUsername: json.username || credentials.newUsername,
          newPassword: '',
          confirmPassword: '',
        });
        setData((prev: any) => ({
          ...prev,
          account: {
            ...(prev.account || {}),
            username: credentials.newUsername || prev.account?.username,
          },
        }));
      } else {
        setToast({ type: 'error', text: json.error || 'Failed to update.' });
      }
    } catch {
      setToast({ type: 'error', text: 'Network error.' });
    } finally {
      setSavingCredentials(false);
    }
  };

  const update = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: value },
    }));
  };

  /* Array helpers */
  const arrChange = (
    section: string,
    field: string,
    idx: number,
    key: string | null,
    value: any
  ) => {
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

  const arrMove = (
    section: string,
    field: string,
    idx: number,
    dir: -1 | 1
  ) => {
    setData((prev: any) => {
      const arr = [...(prev[section]?.[field] || [])];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      const [item] = arr.splice(idx, 1);
      arr.splice(newIdx, 0, item);
      return { ...prev, [section]: { ...prev[section], [field]: arr } };
    });
  };

  /* Footer column helpers */
  const colTitleChange = (colIdx: number, value: string) => {
    setData((prev: any) => {
      const columns = [...(prev.footer?.columns || [])];
      if (columns[colIdx]) columns[colIdx] = { ...columns[colIdx], title: value };
      return { ...prev, footer: { ...(prev.footer || {}), columns } };
    });
  };

  const colLinkChange = (
    colIdx: number,
    linkIdx: number,
    key: string,
    value: string
  ) => {
    setData((prev: any) => {
      const columns = [...(prev.footer?.columns || [])];
      if (columns[colIdx]) {
        const links = [...(columns[colIdx].links || [])];
        if (links[linkIdx]) links[linkIdx] = { ...links[linkIdx], [key]: value };
        columns[colIdx] = { ...columns[colIdx], links };
      }
      return { ...prev, footer: { ...(prev.footer || {}), columns } };
    });
  };

  const colLinkAdd = (colIdx: number) => {
    setData((prev: any) => {
      const columns = [...(prev.footer?.columns || [])];
      if (columns[colIdx]) {
        columns[colIdx] = {
          ...columns[colIdx],
          links: [...(columns[colIdx].links || []), { label: 'New Link', href: '/' }],
        };
      }
      return { ...prev, footer: { ...(prev.footer || {}), columns } };
    });
  };

  const colLinkRemove = (colIdx: number, linkIdx: number) => {
    setData((prev: any) => {
      const columns = [...(prev.footer?.columns || [])];
      if (columns[colIdx]) {
        const links = [...(columns[colIdx].links || [])];
        links.splice(linkIdx, 1);
        columns[colIdx] = { ...columns[colIdx], links };
      }
      return { ...prev, footer: { ...(prev.footer || {}), columns } };
    });
  };

  const colAdd = () => {
    setData((prev: any) => ({
      ...prev,
      footer: {
        ...(prev.footer || {}),
        columns: [
          ...(prev.footer?.columns || []),
          { title: 'New Column', links: [{ label: 'Link', href: '/' }] },
        ],
      },
    }));
  };

  const colRemove = (colIdx: number) => {
    if (!confirm('Delete this column and all its links?')) return;
    setData((prev: any) => {
      const columns = [...(prev.footer?.columns || [])];
      columns.splice(colIdx, 1);
      return { ...prev, footer: { ...(prev.footer || {}), columns } };
    });
  };

  const colMove = (colIdx: number, dir: -1 | 1) => {
    setData((prev: any) => {
      const columns = [...(prev.footer?.columns || [])];
      const newIdx = colIdx + dir;
      if (newIdx < 0 || newIdx >= columns.length) return prev;
      const [item] = columns.splice(colIdx, 1);
      columns.splice(newIdx, 0, item);
      return { ...prev, footer: { ...(prev.footer || {}), columns } };
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
      <div style={{ padding: 40, fontFamily: 'Inter, sans-serif' }}>
        Loading Settings…
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 14,
    borderRadius: 10,
    border: '1.5px solid #E5E7EB',
    fontSize: '0.9rem',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    background: '#fff',
    boxSizing: 'border-box',
  };
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 6,
    fontWeight: 600,
    fontSize: '0.85rem',
    color: '#06283D',
    fontFamily: 'Inter, sans-serif',
  };
  const tabBtn = (tab: string): React.CSSProperties => ({
    padding: '10px 18px',
    borderRadius: 10,
    border: activeTab === tab ? '2px solid #D4A017' : '1px solid #E5E7EB',
    background: activeTab === tab ? '#D4A017' : 'white',
    color: activeTab === tab ? '#06283D' : '#374151',
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: 8,
    marginBottom: 8,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.85rem',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  });
  const goldBtn: React.CSSProperties = {
    background: '#D4A017',
    color: '#06283D',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    fontFamily: 'Inter, sans-serif',
  };
  const tealBtn: React.CSSProperties = {
    background: '#1B5E45',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    fontFamily: 'Inter, sans-serif',
  };
  const smallBtn: React.CSSProperties = {
    background: 'none',
    border: '1px solid #E5E7EB',
    color: '#374151',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 600,
  };
  const dangerBtn: React.CSSProperties = {
    background: 'none',
    border: '1px solid #EF4444',
    color: '#EF4444',
    borderRadius: 8,
    padding: '6px 12px',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8rem',
  };
  const rowBox: React.CSSProperties = {
    border: '1px solid #E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    background: '#FAFAFA',
  };

  const tabs: { id: string; label: string; icon: string }[] = [
    { id: 'account', label: 'Account', icon: '🔒' },
    { id: 'site', label: 'Site', icon: '🌐' },
    { id: 'header', label: 'Header', icon: '📌' },
    { id: 'footer', label: 'Footer', icon: '📎' },
  ];

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChosen}
        accept="image/*"
      />

      {toast && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 24,
            zIndex: 9999,
            background:
              toast.type === 'success'
                ? 'linear-gradient(135deg, #10B981, #059669)'
                : toast.type === 'error'
                ? 'linear-gradient(135deg, #EF4444, #B91C1C)'
                : 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
            color: '#fff',
            padding: '16px 22px',
            borderRadius: 14,
            boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontWeight: 600,
            fontSize: '0.95rem',
            minWidth: 260,
            maxWidth: 400,
          }}
        >
          <span>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : '⏳'}
          </span>
          <span style={{ flex: 1 }}>{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              width: 22,
              height: 22,
              borderRadius: '50%',
              fontSize: '0.7rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 32,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.05)',
        }}
      >
        <h1
          style={{
            fontSize: '1.8rem',
            color: '#06283D',
            marginBottom: 6,
            fontFamily: 'Playfair Display, serif',
          }}
        >
          Settings
        </h1>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: 20 }}>
          Manage your credentials, site identity, header, and footer.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 24 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={tabBtn(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ================= ACCOUNT ================= */}
        {activeTab === 'account' && (
          <div>
            <div
              style={{
                padding: 16,
                background: '#FEF3C7',
                border: '1.5px solid #FDE68A',
                borderRadius: 12,
                marginBottom: 24,
                fontSize: '0.85rem',
                color: '#78350F',
                lineHeight: 1.6,
              }}
            >
              <strong>⚠️ Important:</strong> Changing your username or password
              will affect how you log in. Remember the new credentials before
              clicking Update.
            </div>

            <h4 style={{ marginTop: 0, marginBottom: 14, color: '#06283D' }}>
              Current Credentials
            </h4>

            <label style={labelStyle}>Username (current)</label>
            <input
              value={data.account?.username || ''}
              readOnly
              style={{ ...inputStyle, background: '#F3F4F6', color: '#6B7280' }}
            />

            <h4 style={{ marginTop: 24, marginBottom: 14, color: '#06283D' }}>
              Update Credentials
            </h4>

            <label style={labelStyle}>Current Password *</label>
            <input
              type="password"
              value={credentials.currentPassword}
              onChange={(e) =>
                setCredentials({
                  ...credentials,
                  currentPassword: e.target.value,
                })
              }
              placeholder="Enter your current password"
              style={inputStyle}
            />

            <label style={labelStyle}>
              New Username (leave blank to keep current)
            </label>
            <input
              value={credentials.newUsername}
              onChange={(e) =>
                setCredentials({ ...credentials, newUsername: e.target.value })
              }
              placeholder={data.account?.username || 'suddagency'}
              style={inputStyle}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <input
                  type="password"
                  value={credentials.newPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      newPassword: e.target.value,
                    })
                  }
                  placeholder="Min 6 characters"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input
                  type="password"
                  value={credentials.confirmPassword}
                  onChange={(e) =>
                    setCredentials({
                      ...credentials,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Repeat new password"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleCredentialsSave}
              disabled={savingCredentials}
              style={{
                marginTop: 12,
                padding: '14px 28px',
                background: savingCredentials
                  ? 'rgba(27,94,69,0.5)'
                  : 'linear-gradient(135deg, #1B5E45, #0F766E)',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: '0.95rem',
                fontWeight: 700,
                cursor: savingCredentials ? 'wait' : 'pointer',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 10px 24px rgba(27,94,69,0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              {savingCredentials ? (
                <>
                  <i className="fas fa-circle-notch fa-spin" /> Updating…
                </>
              ) : (
                <>
                  <i className="fas fa-key" /> Update Credentials
                </>
              )}
            </button>
          </div>
        )}

        {/* ================= SITE ================= */}
        {activeTab === 'site' && (
          <div>
            <label style={labelStyle}>Organization Name</label>
            <input
              value={data.site?.name || ''}
              onChange={(e) => update('site', 'name', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Short Name</label>
            <input
              value={data.site?.shortName || ''}
              onChange={(e) => update('site', 'shortName', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Tagline</label>
            <input
              value={data.site?.tagline || ''}
              onChange={(e) => update('site', 'tagline', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Description (SEO)</label>
            <textarea
              value={data.site?.description || ''}
              onChange={(e) => update('site', 'description', e.target.value)}
              rows={3}
              style={inputStyle}
            />

            <label style={labelStyle}>Logo</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={data.site?.logo || ''}
                onChange={(e) => update('site', 'logo', e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <button
                type="button"
                onClick={() =>
                  triggerUpload((url) => update('site', 'logo', url))
                }
                style={tealBtn}
              >
                <i className="fas fa-upload" style={{ marginRight: 6 }} /> Upload
              </button>
            </div>
            {data.site?.logo && (
              <img
                src={data.site.logo}
                alt=""
                style={{
                  maxWidth: 140,
                  marginBottom: 20,
                  background: '#F3F4F6',
                  padding: 8,
                  borderRadius: 8,
                }}
              />
            )}

            <label style={labelStyle}>Favicon Path</label>
            <input
              value={data.site?.favicon || ''}
              onChange={(e) => update('site', 'favicon', e.target.value)}
              placeholder="/favicon.ico"
              style={inputStyle}
            />

            <label style={labelStyle}>Contact Email</label>
            <input
              value={data.site?.contactEmail || ''}
              onChange={(e) => update('site', 'contactEmail', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Phone</label>
            <input
              value={data.site?.phone || ''}
              onChange={(e) => update('site', 'phone', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>WhatsApp</label>
            <input
              value={data.site?.whatsapp || ''}
              onChange={(e) => update('site', 'whatsapp', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Address</label>
            <textarea
              value={data.site?.address || ''}
              onChange={(e) => update('site', 'address', e.target.value)}
              rows={2}
              style={inputStyle}
            />

            <label style={labelStyle}>Registration Line</label>
            <input
              value={data.site?.registration || ''}
              onChange={(e) => update('site', 'registration', e.target.value)}
              style={inputStyle}
            />
          </div>
        )}

        {/* ================= HEADER ================= */}
        {activeTab === 'header' && (
          <div>
            <label style={labelStyle}>Header Logo</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <input
                value={data.header?.logo || ''}
                onChange={(e) => update('header', 'logo', e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              <button
                type="button"
                onClick={() =>
                  triggerUpload((url) => update('header', 'logo', url))
                }
                style={tealBtn}
              >
                Upload
              </button>
            </div>

            <label style={labelStyle}>Brand Name (line 1)</label>
            <input
              value={data.header?.brandName || ''}
              onChange={(e) => update('header', 'brandName', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Brand Tagline (line 2)</label>
            <input
              value={data.header?.brandTagline || ''}
              onChange={(e) =>
                update('header', 'brandTagline', e.target.value)
              }
              style={inputStyle}
            />

            <label style={labelStyle}>Top Bar Phone</label>
            <input
              value={data.header?.topBarPhone || ''}
              onChange={(e) => update('header', 'topBarPhone', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Top Bar Email</label>
            <input
              value={data.header?.topBarEmail || ''}
              onChange={(e) => update('header', 'topBarEmail', e.target.value)}
              style={inputStyle}
            />

            <h4 style={{ marginTop: 24, marginBottom: 12, color: '#06283D' }}>
              Top Bar Extra Links
            </h4>
            {(data.header?.topBarLinks || []).map((l: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  value={l.label || ''}
                  onChange={(e) =>
                    arrChange('header', 'topBarLinks', i, 'label', e.target.value)
                  }
                  placeholder="Label"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <input
                  value={l.href || ''}
                  onChange={(e) =>
                    arrChange('header', 'topBarLinks', i, 'href', e.target.value)
                  }
                  placeholder="/href"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <button
                  onClick={() => arrRemove('header', 'topBarLinks', i)}
                  style={dangerBtn}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                arrAdd('header', 'topBarLinks', { label: 'Careers', href: '/' })
              }
              style={{ ...smallBtn, marginBottom: 24 }}
            >
              + Add Top Bar Link
            </button>

            <h4 style={{ marginBottom: 12, color: '#06283D' }}>
              Main Navigation Links
            </h4>
            {(data.header?.navLinks || []).map((l: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto auto auto',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <input
                  value={l.label || ''}
                  onChange={(e) =>
                    arrChange('header', 'navLinks', i, 'label', e.target.value)
                  }
                  placeholder="Label"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <input
                  value={l.href || ''}
                  onChange={(e) =>
                    arrChange('header', 'navLinks', i, 'href', e.target.value)
                  }
                  placeholder="/href"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <button
                  onClick={() => arrMove('header', 'navLinks', i, -1)}
                  disabled={i === 0}
                  style={{ ...smallBtn, opacity: i === 0 ? 0.4 : 1 }}
                >
                  ↑
                </button>
                <button
                  onClick={() => arrMove('header', 'navLinks', i, 1)}
                  disabled={i === (data.header?.navLinks || []).length - 1}
                  style={{
                    ...smallBtn,
                    opacity:
                      i === (data.header?.navLinks || []).length - 1 ? 0.4 : 1,
                  }}
                >
                  ↓
                </button>
                <button
                  onClick={() => arrRemove('header', 'navLinks', i)}
                  style={dangerBtn}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                arrAdd('header', 'navLinks', { label: 'New Link', href: '/' })
              }
              style={{ ...goldBtn, marginBottom: 24 }}
            >
              + Add Nav Link
            </button>

            <h4 style={{ marginTop: 24, marginBottom: 12, color: '#06283D' }}>
              Header CTA Button
            </h4>

            <label style={labelStyle}>Button Text</label>
            <input
              value={data.header?.ctaText || ''}
              onChange={(e) => update('header', 'ctaText', e.target.value)}
              placeholder="Donate"
              style={inputStyle}
            />

            <label style={labelStyle}>Button Link</label>
            <input
              value={data.header?.ctaLink || ''}
              onChange={(e) => update('header', 'ctaLink', e.target.value)}
              placeholder="/donate"
              style={inputStyle}
            />
          </div>
        )}

        {/* ================= FOOTER ================= */}
        {activeTab === 'footer' && (
          <div>
            <label style={labelStyle}>About Text (footer brand column)</label>
            <textarea
              value={data.footer?.aboutText || ''}
              onChange={(e) => update('footer', 'aboutText', e.target.value)}
              rows={3}
              style={inputStyle}
            />

            <h4 style={{ marginTop: 24, marginBottom: 12, color: '#06283D' }}>
              Footer Columns
            </h4>

            {(data.footer?.columns || []).map((col: any, ci: number) => (
              <div
                key={ci}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 14,
                  background: '#FAFAFA',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <input
                    value={col.title || ''}
                    onChange={(e) => colTitleChange(ci, e.target.value)}
                    placeholder="Column title"
                    style={{
                      ...inputStyle,
                      marginBottom: 0,
                      flex: 1,
                      fontWeight: 700,
                    }}
                  />
                  <button
                    onClick={() => colMove(ci, -1)}
                    disabled={ci === 0}
                    style={{ ...smallBtn, opacity: ci === 0 ? 0.4 : 1 }}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => colMove(ci, 1)}
                    disabled={ci === (data.footer?.columns || []).length - 1}
                    style={{
                      ...smallBtn,
                      opacity:
                        ci === (data.footer?.columns || []).length - 1 ? 0.4 : 1,
                    }}
                  >
                    ↓
                  </button>
                  <button onClick={() => colRemove(ci)} style={dangerBtn}>
                    Delete Column
                  </button>
                </div>

                {(col.links || []).map((link: any, li: number) => (
                  <div
                    key={li}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr auto',
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <input
                      value={link.icon || ''}
                      onChange={(e) =>
                        colLinkChange(ci, li, 'icon', e.target.value)
                      }
                      placeholder="Optional icon"
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                    <input
                      value={link.label || ''}
                      onChange={(e) =>
                        colLinkChange(ci, li, 'label', e.target.value)
                      }
                      placeholder="Label"
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                    <input
                      value={link.href || ''}
                      onChange={(e) =>
                        colLinkChange(ci, li, 'href', e.target.value)
                      }
                      placeholder="/href"
                      style={{ ...inputStyle, marginBottom: 0 }}
                    />
                    <button
                      onClick={() => colLinkRemove(ci, li)}
                      style={dangerBtn}
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button onClick={() => colLinkAdd(ci)} style={smallBtn}>
                  + Add Link
                </button>
              </div>
            ))}

            <button
              onClick={colAdd}
              style={{ ...goldBtn, marginBottom: 24 }}
            >
              + Add Footer Column
            </button>

            <h4 style={{ marginTop: 24, marginBottom: 12, color: '#06283D' }}>
              Social Links
            </h4>

            {(data.footer?.socialLinks || []).map((s: any, i: number) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 2fr auto',
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <input
                  value={s.icon || ''}
                  onChange={(e) =>
                    arrChange('footer', 'socialLinks', i, 'icon', e.target.value)
                  }
                  placeholder="fab fa-facebook-f"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <input
                  value={s.label || ''}
                  onChange={(e) =>
                    arrChange('footer', 'socialLinks', i, 'label', e.target.value)
                  }
                  placeholder="Facebook"
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <input
                  value={s.url || ''}
                  onChange={(e) =>
                    arrChange('footer', 'socialLinks', i, 'url', e.target.value)
                  }
                  placeholder="https://..."
                  style={{ ...inputStyle, marginBottom: 0 }}
                />
                <button
                  onClick={() => arrRemove('footer', 'socialLinks', i)}
                  style={dangerBtn}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                arrAdd('footer', 'socialLinks', {
                  icon: 'fa-brands fa-facebook-f',
                  label: 'Facebook',
                  url: '',
                  className: '',
                })
              }
              style={{ ...goldBtn, marginBottom: 24 }}
            >
              + Add Social Link
            </button>

            <h4 style={{ marginTop: 24, marginBottom: 12, color: '#06283D' }}>
              Bottom Bar
            </h4>

            <label style={labelStyle}>Copyright Text</label>
            <input
              value={data.footer?.copyrightText || ''}
              onChange={(e) =>
                update('footer', 'copyrightText', e.target.value)
              }
              style={inputStyle}
            />

            <label style={labelStyle}>Credit / Tagline (right)</label>
            <input
              value={data.footer?.creditText || ''}
              onChange={(e) => update('footer', 'creditText', e.target.value)}
              style={inputStyle}
            />

            <label style={labelStyle}>Credit Link</label>
            <input
              value={data.footer?.creditLink || ''}
              onChange={(e) => update('footer', 'creditLink', e.target.value)}
              placeholder="/about"
              style={inputStyle}
            />
          </div>
        )}

        {/* SAVE — only for non-account tabs */}
        {activeTab !== 'account' && (
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            style={{
              marginTop: 30,
              width: '100%',
              padding: 16,
              background: saving ? 'rgba(212,160,23,0.5)' : '#D4A017',
              color: '#06283D',
              border: 'none',
              borderRadius: 12,
              fontSize: '1rem',
              fontWeight: 700,
              cursor: saving ? 'wait' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 10px 24px rgba(212,160,23,0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            {saving ? (
              <>
                <i className="fas fa-circle-notch fa-spin" /> Saving…
              </>
            ) : (
              <>
                <i className="fas fa-save" /> Save Settings
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}