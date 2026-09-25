import { getPage } from '@/lib/db';
import { resourcesDefaults } from '@/lib/defaults';
import Link from 'next/link';
import ResourceLibrary from './ResourceLibrary';

export const dynamic = 'force-dynamic';

export default async function ResourcesPage() {
  let data = { ...resourcesDefaults };

  try {
    const saved = await getPage('sudd-resources');
    if (saved) data = { ...resourcesDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Resources, using defaults:', err);
  }

  const {
    hero,
    categories,
    library,
    transparency,
    cta,
    resources = [],
  } = data;

  return (
    <>
      {/* ========== HERO ========== */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          minHeight: '55vh',
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
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: 'clamp(13px, 1.3vw, 16px)',
                maxWidth: 780,
                margin: '18px auto 0',
                lineHeight: 1.7,
              }}
              className="reveal reveal-delay-3"
            >
              {hero.description}
            </p>
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES ========== */}
      <section id="categories" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{categories.eyebrow}</span>
            <h2 className="section-title">{categories.title}</h2>
            <p className="section-subtitle">{categories.subtitle}</p>
          </div>

          <div className="grid-4" style={{ maxWidth: 1200, margin: '0 auto' }}>
            {(categories.items || []).map((c: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{
                  textAlign: 'center',
                  padding: '34px 24px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: `linear-gradient(135deg, ${c.accent}22, ${c.accent}0A)`,
                    color: c.accent,
                    border: `1.5px solid ${c.accent}33`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    margin: '0 auto 18px',
                  }}
                >
                  <i className={c.icon} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    marginBottom: 10,
                  }}
                >
                  {c.title}
                </h3>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LIBRARY ========== */}
      <section id="library" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{library.eyebrow}</span>
            <h2 className="section-title">{library.title}</h2>
            <p className="section-subtitle">{library.subtitle}</p>
          </div>

          <div className="reveal">
            <ResourceLibrary
              resources={resources}
              categories={categories.items}
              library={library}
            />
          </div>
        </div>
      </section>

      {/* ========== TRANSPARENCY ========== */}
      <section id="transparency" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{transparency.eyebrow}</span>
            <h2 className="section-title">{transparency.title}</h2>
            <p className="section-subtitle">{transparency.text}</p>
          </div>

          <div className="grid-3" style={{ maxWidth: 1000, margin: '0 auto' }}>
            {(transparency.items || []).map((t: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{
                  textAlign: 'center',
                  padding: '34px 24px',
                  borderTop: '4px solid var(--teal)',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: '#E0F2F1',
                    color: 'var(--teal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    margin: '0 auto 18px',
                  }}
                >
                  <i className={t.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    marginBottom: 8,
                  }}
                >
                  {t.title}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section-lg section-navy">
        <div className="container" style={{ maxWidth: 780, textAlign: 'center' }}>
          <div className="reveal">
            <h2 className="section-title" style={{ color: '#fff' }}>
              {cta.title}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.78)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginTop: 16,
                marginBottom: 34,
              }}
            >
              {cta.text}
            </p>
            <Link href={cta.buttonLink} className="btn btn-gold">
              {cta.buttonText}{' '}
              <i className="fa-solid fa-paper-plane" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}