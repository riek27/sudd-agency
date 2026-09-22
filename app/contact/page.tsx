import { getPage } from '@/lib/db';
import { contactDefaults } from '@/lib/defaults';
import ContactForm from './ContactForm';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  let data: any = { ...contactDefaults };

  try {
    const saved = await getPage('sudd-contact');
    if (saved) data = { ...contactDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Contact, using defaults:', err);
  }

  // GUARD: fall back to defaults if any section is missing
  const hero = data.hero || contactDefaults.hero;
  const info = data.info || contactDefaults.info;
  const form = data.form || contactDefaults.form;

  return (
    <>
      {/* ========== HERO ========== */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          minHeight: '60vh',
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
            <span className="hero-badge reveal">{hero.eyebrow}</span>
            <h1
              className="hero-title reveal reveal-delay-1"
              style={{ margin: '0 auto 24px' }}
            >
              {hero.title}{' '}
              <span className="accent">{hero.titleAccent}</span>
            </h1>
            <p
              className="hero-subtitle reveal reveal-delay-2"
              style={{ margin: '0 auto' }}
            >
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ========== CONTACT INFO + MAP ========== */}
      <section id="office" className="section-lg section-cream">
        <div className="container">
          <div className="two-col" style={{ alignItems: 'stretch' }}>
            {/* Left: cards + socials */}
            <div className="reveal" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="eyebrow">{info.eyebrow}</span>
              <h2 className="section-title" style={{ marginBottom: 30 }}>
                {info.title}{' '}
                <span className="accent">{info.titleAccent}</span>
              </h2>

              <div className="grid-2" style={{ gap: 16 }}>
                {(info.cards || []).map((c: any, i: number) => {
                  const bg =
                    c.iconBg === 'forest'
                      ? 'rgba(27,94,69,0.12)'
                      : c.iconBg === 'navy'
                      ? 'rgba(6,40,61,0.1)'
                      : c.iconBg === 'green'
                      ? 'rgba(34,197,94,0.15)'
                      : 'rgba(212,160,23,0.15)';
                  const fg =
                    c.iconBg === 'forest'
                      ? 'var(--forest)'
                      : c.iconBg === 'navy'
                      ? 'var(--navy)'
                      : c.iconBg === 'green'
                      ? '#16A34A'
                      : 'var(--gold)';
                  const inner = (
                    <>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: bg,
                          color: fg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          fontSize: 16,
                        }}
                      >
                        <i className={c.icon} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <h4
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            color: 'var(--navy)',
                            margin: '0 0 6px',
                          }}
                        >
                          {c.title}
                        </h4>
                        <p
                          style={{
                            color: 'var(--gray-600)',
                            fontSize: '0.85rem',
                            lineHeight: 1.55,
                            margin: 0,
                            wordBreak: 'break-word',
                          }}
                        >
                          {c.text}
                        </p>
                      </div>
                    </>
                  );
                  return c.link ? (
                    <a
                      key={i}
                      href={c.link}
                      target={c.link.startsWith('http') ? '_blank' : undefined}
                      rel={c.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="card"
                      style={{
                        padding: '20px 18px',
                        display: 'flex',
                        gap: 14,
                        alignItems: 'flex-start',
                        textDecoration: 'none',
                        color: 'inherit',
                      }}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div
                      key={i}
                      className="card"
                      style={{
                        padding: '20px 18px',
                        display: 'flex',
                        gap: 14,
                        alignItems: 'flex-start',
                      }}
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>

              {/* Social row */}
              {(info.socials || []).length > 0 && (
                <div style={{ display: 'flex', gap: 12, paddingTop: 30 }}>
                  {(info.socials || []).map((s: any, i: number) => {
                    const bg =
                      s.iconBg === 'forest'
                        ? 'rgba(27,94,69,0.12)'
                        : s.iconBg === 'navy'
                        ? 'rgba(6,40,61,0.1)'
                        : 'rgba(212,160,23,0.15)';
                    const fg =
                      s.iconBg === 'forest'
                        ? 'var(--forest)'
                        : s.iconBg === 'navy'
                        ? 'var(--navy)'
                        : 'var(--gold)';
                    return (
                      <a
                        key={i}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 14,
                          background: bg,
                          color: fg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 17,
                          transition: 'all 0.25s',
                          textDecoration: 'none',
                        }}
                      >
                        <i className={s.icon} />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: map */}
            <div className="reveal reveal-delay-2">
              <div
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(6,40,61,0.14)',
                  height: '100%',
                  minHeight: 420,
                  background: '#fff',
                }}
              >
                <iframe
                  src={info.map?.embedUrl}
                  title="SEA Office Location"
                  style={{ border: 0, width: '100%', height: '100%' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              {info.map?.caption && (
                <p
                  style={{
                    textAlign: 'center',
                    color: 'var(--gray-600)',
                    fontSize: '0.8rem',
                    marginTop: 10,
                  }}
                >
                  {info.map.caption}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTACT FORM ========== */}
      <section id="form" className="section-lg section-white">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="section-head-center reveal">
            <span className="eyebrow">{form.eyebrow}</span>
            <h2 className="section-title">
              {form.title}{' '}
              <span className="accent">{form.titleAccent}</span>
            </h2>
          </div>

          <div
            className="reveal"
            style={{
              background: 'var(--cream)',
              borderRadius: 22,
              padding: '38px 34px',
              border: '1px solid rgba(6,40,61,0.06)',
              boxShadow: '0 12px 40px rgba(6,40,61,0.06)',
            }}
          >
            <ContactForm form={form} />
          </div>
        </div>
      </section>
    </>
  );
}