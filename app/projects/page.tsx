import { getPage } from '@/lib/db';
import { projectsDefaults } from '@/lib/defaults';
import Link from 'next/link';
import ProjectImage from './ProjectImage';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let data = { ...projectsDefaults };

  try {
    const saved = await getPage('sudd-projects');
    if (saved) data = { ...projectsDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Projects, using defaults:', err);
  }

  const { hero, methodology, completed, stats, cta } = data;

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

      {/* ========== METHODOLOGY ========== */}
      <section id="methodology" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{methodology.eyebrow}</span>
            <h2 className="section-title">
              {methodology.title}{' '}
              <span className="accent">{methodology.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{methodology.subtitle}</p>
          </div>

          <div className="grid-4" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(methodology.items || []).map((m: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{ textAlign: 'center' }}
              >
                <div
                  className={`card-icon card-icon-${m.iconBg}`}
                  style={{ margin: '0 auto 16px' }}
                >
                  <i className={m.icon} />
                </div>
                <h4>{m.title}</h4>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPLETED PROJECTS ========== */}
      <section id="completed" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{completed.eyebrow}</span>
            <h2 className="section-title">
              {completed.title}{' '}
              <span className="accent">{completed.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{completed.subtitle}</p>
          </div>

          <div className="grid-3">
            {(completed.items || []).map((p: any, i: number) => (
              <article
                key={i}
                className={`highlight-card reveal reveal-delay-${i % 3}`}
              >
                <div className="highlight-img">
                  <ProjectImage
                    src={p.image}
                    alt={p.title}
                    fallbackIcon={p.fallbackIcon || 'fa-solid fa-leaf'}
                  />
                </div>
                <div style={{ padding: '24px 22px 26px' }}>
                  <div className="project-date">
                    <i className="fa-regular fa-calendar" /> {p.date}
                  </div>
                  <h3
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: 'var(--navy)',
                      marginBottom: 10,
                      lineHeight: 1.35,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      color: 'var(--gray-600)',
                      fontSize: '0.88rem',
                      lineHeight: 1.65,
                      margin: '0 0 18px',
                    }}
                  >
                    {p.text}
                  </p>
                  <div className="project-meta">
                    <span className="project-donor">Donor: {p.donor}</span>
                    <span className="project-budget">{p.budget}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PROJECT STATS ========== */}
      <section
        id="stats"
        className="section-lg section-navy"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,40,61,0.78) 0%, rgba(6,40,61,0.85) 100%), url(${stats.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          position: 'relative',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="section-head-center reveal"
            style={{ marginBottom: 60 }}
          >
            <span className="eyebrow">{stats.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {stats.title}{' '}
              <span className="accent" style={{ color: 'var(--gold)' }}>
                {stats.titleAccent}
              </span>
            </h2>
          </div>

          <div className="stats-grid">
            {(stats.items || []).map((s: any, i: number) => (
              <div key={i} className={`stat-item reveal reveal-delay-${i}`}>
                {s.animated && s.value && !isNaN(Number(s.value)) ? (
                  <div
                    className="stat-value counter"
                    data-target={s.value}
                    data-suffix={s.suffix || ''}
                  >
                    0
                  </div>
                ) : (
                  <div className="stat-value">{s.value}</div>
                )}
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
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
                <i className="fa-solid fa-handshake" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}