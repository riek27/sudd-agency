import { getPage } from '@/lib/db';
import { impactDefaults } from '@/lib/defaults';
import Link from 'next/link';

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

export default async function ImpactPage() {
  let data = { ...impactDefaults };

  try {
    const saved = await getPage('sudd-impact');
    if (saved) data = { ...impactDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Impact, using defaults:', err);
  }

  const { hero, figures, achievements, stories, partners, future, cta } = data;

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

      {/* ========== SEA IN FIGURES ========== */}
      <section id="figures" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{figures.eyebrow}</span>
            <h2 className="section-title">
              {figures.title}{' '}
              <span className="accent">{figures.titleAccent}</span>
            </h2>
          </div>

          {/* Row 1 */}
          <div className="stats-grid" style={{ marginBottom: 60 }}>
            {(figures.row1 || []).map((f: any, i: number) => (
              <div
                key={i}
                className={`stat-item reveal reveal-delay-${i}`}
              >
                <div
                  className="stat-value counter"
                  data-target={f.value}
                  data-suffix={f.suffix || ''}
                  style={{
                    color:
                      f.color === 'gold'
                        ? 'var(--gold)'
                        : f.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                  }}
                >
                  0
                </div>
                <div
                  className="stat-label"
                  style={{ color: 'var(--gray-600)' }}
                >
                  {f.label}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="stats-grid">
            {(figures.row2 || []).map((f: any, i: number) => (
              <div
                key={i}
                className={`stat-item reveal reveal-delay-${i}`}
              >
                <div
                  className={
                    f.value && !isNaN(Number(f.value))
                      ? 'stat-value counter'
                      : 'stat-value'
                  }
                  data-target={f.value}
                  data-suffix={f.suffix || ''}
                  style={{
                    color:
                      f.color === 'gold'
                        ? 'var(--gold)'
                        : f.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                  }}
                >
                  {f.value && !isNaN(Number(f.value)) ? '0' : f.value}
                </div>
                <div
                  className="stat-label"
                  style={{ color: 'var(--gray-600)' }}
                >
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== KEY ACHIEVEMENTS ========== */}
      <section id="achievements" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{achievements.eyebrow}</span>
            <h2 className="section-title">
              {achievements.title}{' '}
              <span className="accent">{achievements.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{achievements.subtitle}</p>
          </div>

          <div className="grid-3">
            {(achievements.items || []).map((a: any, i: number) => (
              <div key={i} className={`card reveal reveal-delay-${i}`}>
                <div className="project-date">
                  <i className="fa-regular fa-calendar" /> {a.date}
                </div>
                <h3>{a.title}</h3>
                <p>{a.text}</p>
                <div className="project-meta">
                  <span className="project-donor">Donor: {a.donor}</span>
                  <span className="project-budget">{a.budget}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href={achievements.ctaLink} className="btn btn-gold">
              {achievements.ctaText} <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== COMMUNITY STORIES ========== */}
      <section
        className="section-lg section-navy"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,40,61,0.82) 0%, rgba(6,40,61,0.9) 100%), url(${stories.backgroundImage})`,
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
              <span className="eyebrow">{stories.eyebrow}</span>
              <h2 className="section-title" style={{ color: '#fff' }}>
                {stories.title}{' '}
                <span className="accent" style={{ color: 'var(--gold)' }}>
                  {stories.titleAccent}
                </span>
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  margin: '24px 0 12px',
                  fontStyle: 'italic',
                }}
              >
                &ldquo;{stories.quote}&rdquo;
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontSize: '0.88rem',
                  marginBottom: 28,
                }}
              >
                — {stories.attribution}
              </p>
              <Link href={stories.ctaLink} className="btn btn-gold">
                {stories.ctaText} <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="reveal reveal-delay-2">
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: 22,
                  padding: '36px 32px',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#fff',
                    marginBottom: 24,
                  }}
                >
                  {stories.panelTitle}
                </h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 18,
                  }}
                >
                  {(stories.panelItems || []).map((item: string, i: number) => (
                    <li
                      key={i}
                      style={{
                        display: 'flex',
                        gap: 12,
                        alignItems: 'flex-start',
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                      }}
                    >
                      <i
                        className="fa-solid fa-check-circle"
                        style={{
                          color: 'var(--gold)',
                          fontSize: '1.05rem',
                          marginTop: 2,
                          flexShrink: 0,
                        }}
                      />
                      <span>{renderBold(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== PARTNERS ========== */}
      <section id="partners" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{partners.eyebrow}</span>
            <h2 className="section-title">
              {partners.title}{' '}
              <span className="accent">{partners.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{partners.subtitle}</p>
          </div>

          <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(partners.items || []).map((p: any, i: number) => (
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
                      p.iconBg === 'forest'
                        ? 'rgba(27,94,69,0.12)'
                        : p.iconBg === 'navy'
                        ? 'rgba(6,40,61,0.1)'
                        : 'rgba(212,160,23,0.15)',
                    color:
                      p.iconBg === 'forest'
                        ? 'var(--forest)'
                        : p.iconBg === 'navy'
                        ? 'var(--navy)'
                        : 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    margin: '0 auto 18px',
                  }}
                >
                  <i className={p.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    margin: '0 0 10px',
                    lineHeight: 1.35,
                  }}
                >
                  {p.name}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== LOOKING AHEAD ========== */}
      <section id="future" className="section-lg section-white">
        <div className="container">
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{future.eyebrow}</span>
              <h2 className="section-title">
                {future.title}{' '}
                <span className="accent">{future.titleAccent}</span>
              </h2>
              <p
                style={{
                  color: 'var(--gray-600)',
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  margin: '22px 0 24px',
                }}
              >
                {future.text}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                {(future.goals || []).map((g: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      color: 'var(--gray-600)',
                      fontSize: '0.95rem',
                      lineHeight: 1.65,
                    }}
                  >
                    <i
                      className="fa-solid fa-circle-check"
                      style={{
                        color: 'var(--gold)',
                        fontSize: '1rem',
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    />
                    <span>{renderBold(g)}</span>
                  </li>
                ))}
              </ul>

              <Link href={future.ctaLink} className="btn btn-gold">
                {future.ctaText} <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="two-col-img reveal reveal-delay-2">
              <img src={future.image} alt={future.title} />
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