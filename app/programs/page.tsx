import { getPage } from '@/lib/db';
import { programsDefaults } from '@/lib/defaults';
import Link from 'next/link';
import ProgramImage from './ProgramImage';

export const dynamic = 'force-dynamic';

export default async function ProgramsPage() {
  let data = { ...programsDefaults };

  try {
    const saved = await getPage('sudd-programs');
    if (saved) data = { ...programsDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Programs, using defaults:', err);
  }

  const { hero, objectives, themes, model, highlights, connect, cta } = data;

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
              {hero.title} <span className="accent">{hero.titleAccent}</span>
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

      {/* ========== SPECIFIC OBJECTIVES ========== */}
      <section id="objectives" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{objectives.eyebrow}</span>
            <h2 className="section-title">
              {objectives.title}{' '}
              <span className="accent">{objectives.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(objectives.items || []).map((o: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i % 3}`}
                style={{ background: '#fff' }}
              >
                <div className={`card-icon card-icon-${o.iconBg}`}>
                  <i className={o.icon} />
                </div>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                  }}
                >
                  {o.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== THEMATIC PROGRAMS ========== */}
      <section id="themes" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{themes.eyebrow}</span>
            <h2 className="section-title">
              {themes.title} <span className="accent">{themes.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(themes.items || []).map((p: any, i: number) => (
              <div
                key={i}
                id={p.id}
                className={`program-card reveal reveal-delay-${i % 3}`}
              >
                <div className={`program-icon ${p.iconBg !== 'navy' ? `bg-${p.iconBg}` : ''}`}>
                  <i className={p.icon} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    color: 'var(--navy)',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {p.text}
                </p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href={themes.ctaLink} className="btn btn-gold">
              {themes.ctaText} <i className="fa-solid fa-heart" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== IMPLEMENTATION MODEL ========== */}
      <section id="model" className="section section-gray">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{model.eyebrow}</span>
            <h2 className="section-title">
              {model.title} <span className="accent">{model.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{model.subtitle}</p>
          </div>

          <div className="strategy-wrap">
            <div className="strategy-line" />

            {(model.steps || []).map((s: any, i: number) => {
              const reversed = i % 2 === 1;
              const isLast = i === model.steps.length - 1;

              const card = (
                <div className="strategy-card">
                  <div className={`icon card-icon-${s.iconBg}`}>
                    <i className={s.icon} />
                  </div>
                  <h4>
                    {s.number}. {s.title}
                  </h4>
                  <p>{s.text}</p>
                </div>
              );

              return (
                <div
                  key={i}
                  className={`strategy-step reveal reveal-delay-${i % 4}`}
                  style={{ marginBottom: isLast ? 0 : 50 }}
                >
                  {!reversed && card}
                  <div className="strategy-num">{s.number}</div>
                  {reversed && card}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== PROGRAM HIGHLIGHTS ========== */}
      <section id="highlights" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{highlights.eyebrow}</span>
            <h2 className="section-title">
              {highlights.title}{' '}
              <span className="accent">{highlights.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{highlights.subtitle}</p>
          </div>

          <div className="grid-3">
            {(highlights.items || []).map((h: any, i: number) => (
              <div
                key={i}
                className={`highlight-card reveal reveal-delay-${i % 3}`}
              >
                <div className="highlight-img">
                  <ProgramImage
                    src={h.image}
                    alt={h.title}
                    fallbackIcon={h.icon}
                  />
                </div>
                <div style={{ padding: '24px 22px 24px' }}>
                  <div className={`card-icon card-icon-${h.iconBg}`}>
                    <i className={h.icon} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      color: 'var(--navy)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      marginBottom: 8,
                    }}
                  >
                    {h.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--gray-600)',
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      marginBottom: 12,
                    }}
                  >
                    {h.text}
                  </p>
                  {h.linkText && (
                    <Link
                      href={h.link || '#'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        color: 'var(--gold)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {h.linkText} <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href={highlights.ctaLink} className="btn btn-gold">
              {highlights.ctaText} <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== PROGRAMS CONNECT ========== */}
      <section
        id="connect"
        className="section-lg section-navy"
        style={{ textAlign: 'center' }}
      >
        <div className="container" style={{ maxWidth: 780 }}>
          <div className="reveal">
            <span className="eyebrow">{connect.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {connect.title}{' '}
              <span className="accent" style={{ color: 'var(--gold)' }}>
                {connect.titleAccent}
              </span>
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginTop: 20,
                marginBottom: 34,
              }}
            >
              {connect.text}
            </p>
            <Link href={connect.ctaLink} className="btn btn-outline-white">
              {connect.ctaText} <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="section-lg section-cream">
        <div className="container" style={{ maxWidth: 780, textAlign: 'center' }}>
          <div className="reveal">
            <h2 className="section-title">{cta.title}</h2>
            <p
              style={{
                color: 'var(--gray-600)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginTop: 16,
                marginBottom: 34,
              }}
            >
              {cta.text}
            </p>
            <div
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Link href={cta.button1Link} className="btn btn-gold">
                {cta.button1Text} <i className="fa-solid fa-heart" />
              </Link>
              <Link href={cta.button2Link} className="btn btn-outline-navy">
                {cta.button2Text}{' '}
                <i className="fa-solid fa-hand-holding-heart" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}