import { getPage } from '@/lib/db';
import { homepageDefaults } from '@/lib/defaults';
import Link from 'next/link';
import PartnerLogo from './PartnerLogo';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let data = { ...homepageDefaults };

  try {
    const saved = await getPage('sudd-homepage');
    if (saved) data = { ...homepageDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load homepage, using defaults:', err);
  }

  const {
    hero,
    story,
    mission,
    strategy,
    values,
    programs,
    impact,
    projects,
    news,
    partners,
    getInvolved,
    contact,
  } = data;

  return (
    <>
      {/* ============================================================
          HERO
          ============================================================ */}
      <section
        className="hero"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-grid">
            <div>
              <div className="reveal">
                <span className="hero-badge">{hero.badge}</span>
              </div>

              <h1 className="hero-title reveal reveal-delay-1">
                {hero.titleLine1}
                <br />
                {hero.titleLine2}
                <br />
                <span className="accent">{hero.titleLine3}</span>
              </h1>

              <p className="hero-subtitle reveal reveal-delay-2">
                {hero.subtitle}
              </p>

              <div className="hero-cta-row reveal reveal-delay-3">
                <Link href={hero.primaryCtaLink} className="btn btn-gold">
                  {hero.primaryCtaText}{' '}
                  <i className="fa-solid fa-arrow-right" />
                </Link>
                <Link href={hero.secondaryCtaLink} className="btn btn-outline-white">
                  {hero.secondaryCtaText}{' '}
                  <i className="fa-solid fa-heart" />
                </Link>
              </div>
            </div>

            <div className="hero-floats reveal reveal-delay-4">
              {(hero.floats || []).map((f: any, i: number) => (
                <div key={i} className="hero-float-card">
                  <div className="value">{f.value}</div>
                  <div className="label">{f.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          OUR STORY
          ============================================================ */}
      <section id="story" className="section section-cream">
        <div className="container">
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{story.eyebrow}</span>
              <h2 className="section-title">
                {story.title}{' '}
                <span className="accent">{story.titleAccent}</span>
              </h2>
              <p
                style={{
                  color: 'var(--gray-600)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  margin: '24px 0 32px',
                }}
              >
                {story.text}
              </p>
              <Link href={story.ctaLink} className="btn btn-navy">
                {story.ctaText}{' '}
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="two-col-img reveal reveal-delay-2">
              <img src={story.image} alt={story.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MISSION & VISION
          ============================================================ */}
      <section id="mission" className="section-lg section-white">
        <div className="container">
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{mission.eyebrow}</span>
              <h2 className="section-title">
                {mission.title}{' '}
                <span className="accent">{mission.titleAccent}</span>
              </h2>

              <div className="mission-card" style={{ marginTop: 30 }}>
                <h4>{mission.visionTitle}</h4>
                <p>{mission.visionText}</p>
              </div>

              <div className="mission-card">
                <h4>{mission.missionTitle}</h4>
                <p>{mission.missionText}</p>
              </div>

              <Link
                href={mission.ctaLink}
                className="btn btn-gold"
                style={{ marginTop: 14 }}
              >
                {mission.ctaText}{' '}
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="two-col-img reveal reveal-delay-2">
              <img src={mission.image} alt={mission.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STRATEGY
          ============================================================ */}
      <section id="strategy" className="section section-gray">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{strategy.eyebrow}</span>
            <h2 className="section-title">
              {strategy.title}{' '}
              <span className="accent">{strategy.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{strategy.subtitle}</p>
          </div>

          <div className="strategy-wrap">
            <div className="strategy-line" />

            {(strategy.steps || []).map((s: any, i: number) => {
              const reversed = i % 2 === 1;
              const isLast = i === strategy.steps.length - 1;

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
                  className={`strategy-step reveal reveal-delay-${i}`}
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

      {/* ============================================================
          CORE VALUES
          ============================================================ */}
      <section id="values" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{values.eyebrow}</span>
            <h2 className="section-title">
              {values.title}{' '}
              <span className="accent">{values.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-3">
            {(values.items || []).map((v: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i % 3}`}
              >
                <i
                  className={v.icon}
                  style={{
                    fontSize: '2rem',
                    color:
                      v.color === 'gold'
                        ? 'var(--gold)'
                        : v.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    marginBottom: 16,
                  }}
                />
                <h4>{v.title}</h4>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PROGRAMS
          ============================================================ */}
      <section id="programs" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{programs.eyebrow}</span>
            <h2 className="section-title">
              {programs.title}{' '}
              <span className="accent">{programs.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-3">
            {(programs.items || []).map((p: any, i: number) => (
              <div
                key={i}
                id={p.id}
                className={`card reveal reveal-delay-${i % 3}`}
              >
                <div className={`card-icon card-icon-${p.iconBg}`}>
                  <i className={p.icon} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href={programs.ctaLink} className="btn btn-gold">
              {programs.ctaText}{' '}
              <i className="fa-solid fa-heart" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          IMPACT
          ============================================================ */}
      <section
        id="impact"
        className="section-lg section-navy"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,40,61,0.78) 0%, rgba(6,40,61,0.85) 100%), url(${impact.backgroundImage})`,
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
            <span className="eyebrow">{impact.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {impact.title}{' '}
              <span className="accent" style={{ color: 'var(--gold)' }}>
                {impact.titleAccent}
              </span>{' '}
              {impact.titleEnd}
            </h2>
          </div>

          <div className="stats-grid">
            {(impact.items || []).map((s: any, i: number) => (
              <div
                key={i}
                className={`stat-item reveal reveal-delay-${i}`}
              >
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PROJECTS
          ============================================================ */}
      <section id="projects" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{projects.eyebrow}</span>
            <h2 className="section-title">
              {projects.title}{' '}
              <span className="accent">{projects.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{projects.subtitle}</p>
          </div>

          <div className="grid-3">
            {(projects.items || []).map((p: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
              >
                <div className="project-date">
                  <i className="fa-regular fa-calendar" /> {p.date}
                </div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <div className="project-meta">
                  <span className="project-donor">Donor: {p.donor}</span>
                  <span className="project-budget">{p.budget}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href={projects.ctaLink} className="btn btn-outline-navy">
              {projects.ctaText}{' '}
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          NEWS
          ============================================================ */}
      <section id="news" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{news.eyebrow}</span>
            <h2 className="section-title">
              {news.title}{' '}
              <span className="accent">{news.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-3">
            {(news.items || []).map((n: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
              >
                <div
                  className="project-date"
                  style={{ color: 'var(--gold)' }}
                >
                  <i className="fa-regular fa-calendar" /> {n.date}
                </div>
                <h4>{n.title}</h4>
                <p>{n.text}</p>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 50 }}>
            <Link href={news.ctaLink} className="btn btn-gold">
              {news.ctaText}{' '}
              <i className="fa-regular fa-newspaper" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================
          PARTNERS CAROUSEL
          ============================================================ */}
      <section
        id="partners"
        className="section-lg section-white"
        style={{ overflow: 'hidden' }}
      >
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{partners.eyebrow}</span>
            <h2 className="section-title">
              {partners.title}{' '}
              <span className="accent">{partners.titleAccent}</span>
            </h2>
          </div>
        </div>

        <div className="partner-carousel-wrapper reveal">
          <div className="partner-carousel-track">
            {[
              ...(partners.items || []),
              ...(partners.items || []),
            ].map((p: any, i: number) => (
              <div key={i} className="partner-card">
                <PartnerLogo
                  src={p.logo}
                  alt={p.name}
                  fallbackIcon={p.placeholder}
                />
                <span className="partner-name">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

           {/* ============================================================
          GET INVOLVED
          ============================================================ */}
      <section id="get-involved" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{getInvolved.eyebrow}</span>
            <h2 className="section-title">
              {getInvolved.title}{' '}
              <span className="accent">{getInvolved.titleAccent}</span>
            </h2>
          </div>

          <div
            className="grid-4"
            style={{ maxWidth: 1200, margin: '0 auto' }}
          >
            {(getInvolved.items || []).map((g: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i % 4}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  padding: '34px 24px 30px',
                }}
              >
                <i
                  className={g.icon}
                  style={{
                    fontSize: '2.2rem',
                    color:
                      g.color === 'gold'
                        ? 'var(--gold)'
                        : g.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    display: 'block',
                    marginBottom: 18,
                  }}
                />
                <h4
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    margin: '0 0 10px',
                  }}
                >
                  {g.title}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    margin: '0 0 22px',
                    flex: 1,
                  }}
                >
                  {g.text}
                </p>
                <Link
                  href={g.link || '#'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    alignSelf: 'center',
                    padding: '11px 22px',
                    background:
                      g.color === 'gold'
                        ? 'linear-gradient(135deg, #D4A017, #e8b830)'
                        : g.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    color:
                      g.color === 'forest' || g.color === 'navy' ? '#fff' : '#06283D',
                    borderRadius: 999,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    letterSpacing: '0.3px',
                    boxShadow:
                      g.color === 'gold'
                        ? '0 10px 22px rgba(212,160,23,0.3)'
                        : g.color === 'forest'
                        ? '0 10px 22px rgba(27,94,69,0.28)'
                        : '0 10px 22px rgba(6,40,61,0.28)',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                >
                  {g.buttonText || 'Learn More'}{' '}
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ============================================================
          CONTACT — DETAILS ONLY
          ============================================================ */}
      <section id="contact" className="section-lg section-white">
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="section-head-center reveal">
            <span className="eyebrow">{contact.eyebrow}</span>
            <h2 className="section-title">
              {contact.title}{' '}
              <span className="accent">{contact.titleAccent}</span>
            </h2>
            {contact.intro && (
              <p className="section-subtitle">{contact.intro}</p>
            )}
          </div>

          {/* Contact info cards */}
          <div className="grid-3" style={{ marginBottom: 50, gap: 24 }}>
            {(contact.cards || []).map((c: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i % 3}`}
                style={{
                  textAlign: 'center',
                  padding: '36px 26px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background:
                      c.iconBg === 'forest'
                        ? 'rgba(27,94,69,0.12)'
                        : c.iconBg === 'navy'
                        ? 'rgba(6,40,61,0.1)'
                        : 'rgba(212,160,23,0.15)',
                    color:
                      c.iconBg === 'forest'
                        ? 'var(--forest)'
                        : c.iconBg === 'navy'
                        ? 'var(--navy)'
                        : 'var(--gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    margin: '0 auto 20px',
                  }}
                >
                  <i className={c.icon} />
                </div>
                <h4
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '1.6px',
                    textTransform: 'uppercase',
                    color:
                      c.iconBg === 'forest'
                        ? 'var(--forest)'
                        : c.iconBg === 'navy'
                        ? 'var(--navy)'
                        : 'var(--gold)',
                    margin: '0 0 12px',
                  }}
                >
                  {c.label}
                </h4>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.95rem',
                    lineHeight: 1.65,
                    margin: '0 0 20px',
                    flex: 1,
                  }}
                >
                  {c.text}
                </p>
                {c.link && (
                  <a
                    href={c.link}
                    target={c.link.startsWith('http') ? '_blank' : undefined}
                    rel={
                      c.link.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      alignSelf: 'center',
                      color:
                        c.iconBg === 'forest'
                          ? 'var(--forest)'
                          : c.iconBg === 'navy'
                          ? 'var(--navy)'
                          : '#B8860B',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textDecoration: 'none',
                    }}
                  >
                    {c.linkText || 'Open'}{' '}
                    <i
                      className="fa-solid fa-arrow-right"
                      style={{ fontSize: '0.7rem' }}
                    />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Social row */}
          {(contact.socials || []).length > 0 && (
            <div
              className="reveal"
              style={{
                textAlign: 'center',
                paddingTop: 30,
                borderTop: '1px solid rgba(6,40,61,0.08)',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  letterSpacing: '1.6px',
                  textTransform: 'uppercase',
                  color: 'var(--gray-600)',
                  marginBottom: 18,
                }}
              >
                Follow Our Work
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                }}
              >
                {(contact.socials || []).map((s: any, i: number) => (
                  <a
                    key={i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: '#f9fafb',
                      border: '1px solid rgba(6,40,61,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--navy)',
                      transition: 'all 0.25s',
                      textDecoration: 'none',
                    }}
                  >
                    <i className={s.icon} style={{ fontSize: '1.05rem' }} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}