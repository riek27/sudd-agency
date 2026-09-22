import { getPage } from '@/lib/db';
import { partnersDefaults } from '@/lib/defaults';
import Link from 'next/link';
import PartnerLogo from './PartnerLogo';

export const dynamic = 'force-dynamic';

/* Renders "**bold** text" inline */
function renderBold(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('**') && p.endsWith('**')) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <span key={i}>{p}</span>;
  });
}

export default async function PartnersPage() {
  let data = { ...partnersDefaults };

  try {
    const saved = await getPage('sudd-partners');
    if (saved) data = { ...partnersDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Partners, using defaults:', err);
  }

  const { hero, carousel, why, active, benefits, cta } = data;

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

      {/* ========== CAROUSEL ========== */}
      <section id="carousel" className="section-lg section-white" style={{ overflow: 'hidden' }}>
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{carousel.eyebrow}</span>
            <h2 className="section-title">
              {carousel.title}{' '}
              <span className="accent">{carousel.titleAccent}</span>
            </h2>
          </div>
        </div>

        <div className="partner-carousel-wrapper reveal">
          <div className="partner-carousel-track-right">
            {[...(carousel.items || []), ...(carousel.items || [])].map(
              (p: any, i: number) => (
                <div key={i} className="partner-card">
                  <PartnerLogo
                    src={p.logo}
                    alt={p.name}
                    fallbackIcon={p.placeholder}
                  />
                  <span className="partner-name">{p.name}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========== WHY ========== */}
      <section id="why" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{why.eyebrow}</span>
            <h2 className="section-title">
              {why.title}{' '}
              <span className="accent">{why.titleAccent}</span>{' '}
              {why.titleEnd}
            </h2>
            <p className="section-subtitle">{why.subtitle}</p>
          </div>

          <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(why.items || []).map((w: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{ textAlign: 'center', background: '#fff' }}
              >
                <i
                  className={w.icon}
                  style={{
                    fontSize: '2.4rem',
                    color:
                      w.iconColor === 'gold'
                        ? 'var(--gold)'
                        : w.iconColor === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    display: 'block',
                    marginBottom: 20,
                  }}
                />
                <h4
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    marginBottom: 10,
                  }}
                >
                  {w.title}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {w.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== ACTIVE PARTNERSHIPS ========== */}
      <section id="active" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{active.eyebrow}</span>
            <h2 className="section-title">
              {active.title}{' '}
              <span className="accent">{active.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-4">
            {(active.items || []).map((a: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{ textAlign: 'center' }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background:
                      a.iconBg === 'forest'
                        ? 'rgba(27,94,69,0.12)'
                        : a.iconBg === 'navy'
                        ? 'rgba(6,40,61,0.1)'
                        : 'rgba(212,160,23,0.15)',
                    color:
                      a.iconBg === 'forest'
                        ? 'var(--forest)'
                        : a.iconBg === 'navy'
                        ? 'var(--navy)'
                        : 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    margin: '0 auto 18px',
                  }}
                >
                  <i className={a.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    marginBottom: 10,
                    lineHeight: 1.35,
                  }}
                >
                  {a.name}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {a.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BENEFITS ========== */}
      <section
        id="benefits"
        className="section-lg section-navy"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,40,61,0.82) 0%, rgba(6,40,61,0.9) 100%), url(${benefits.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          position: 'relative',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{benefits.eyebrow}</span>
              <h2 className="section-title" style={{ color: '#fff' }}>
                {benefits.title}{' '}
                <span className="accent" style={{ color: 'var(--gold)' }}>
                  {benefits.titleAccent}
                </span>
              </h2>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '28px 0 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                {(benefits.items || []).map((item: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '0.95rem',
                      lineHeight: 1.65,
                    }}
                  >
                    <i
                      className="fa-solid fa-check-circle"
                      style={{
                        color: 'var(--gold)',
                        fontSize: '1.1rem',
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    />
                    <span>{renderBold(item)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="reveal reveal-delay-2">
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: 22,
                  padding: '44px 34px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  textAlign: 'center',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.6rem',
                    fontWeight: 700,
                    color: '#fff',
                    marginBottom: 16,
                  }}
                >
                  {benefits.panelTitle}
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.72)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    marginBottom: 26,
                  }}
                >
                  {benefits.panelText}
                </p>
                <Link
                  href={benefits.panelButtonLink}
                  className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {benefits.panelButtonText}{' '}
                  <i className="fa-solid fa-handshake" />
                </Link>
              </div>
            </div>
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
                {cta.button1Text}{' '}
                <i className="fa-solid fa-paper-plane" />
              </Link>
              <Link href={cta.button2Link} className="btn btn-outline-navy">
                {cta.button2Text}{' '}
                <i className="fa-solid fa-heart" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}