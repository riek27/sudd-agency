import { getPage } from '@/lib/db';
import { aboutDefaults } from '@/lib/defaults';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AboutPage() {
  let data = { ...aboutDefaults };

  try {
    const saved = await getPage('sudd-about');
    if (saved) data = { ...aboutDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load About, using defaults:', err);
  }

  const { hero, history, mission, strategy, team, values, cta } = data;

  return (
    <>
      {/* ========== HERO ========== */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
          minHeight: '65vh',
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

      {/* ========== HISTORY ========== */}
      <section id="history" className="section-lg section-cream">
        <div className="container">
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{history.eyebrow}</span>
              <h2 className="section-title">
                {history.title} <span className="accent">{history.titleAccent}</span>
              </h2>
              <div style={{ marginTop: 26 }}>
                {(history.paragraphs || []).map((p: string, i: number) => (
                  <p
                    key={i}
                    style={{
                      color: 'var(--gray-600)',
                      fontSize: '1.02rem',
                      lineHeight: 1.8,
                      marginBottom: 18,
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <Link
                href={history.ctaLink}
                className="btn btn-navy"
                style={{ marginTop: 14 }}
              >
                {history.ctaText} <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="two-col-img reveal reveal-delay-2">
              <img src={history.image} alt={history.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== MISSION & VISION ========== */}
      <section id="mission-vision" className="section-lg section-white">
        <div className="container">
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{mission.eyebrow}</span>
              <h2 className="section-title">
                {mission.title} <span className="accent">{mission.titleAccent}</span>
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
                {mission.ctaText} <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="two-col-img reveal reveal-delay-2">
              <img src={mission.image} alt={mission.title} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== STRATEGY ========== */}
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

      {/* ========== TEAM ========== */}
      <section id="team" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{team.eyebrow}</span>
            <h2 className="section-title">
              {team.title} <span className="accent">{team.titleAccent}</span>
            </h2>
          </div>

          <div className="team-grid">
            {(team.members || []).map((m: any, i: number) => (
              <div
                key={m.id || i}
                className={`team-card reveal reveal-delay-${i % 3}`}
              >
                <div className="team-card-img">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name} />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'var(--navy)',
                        color: 'var(--gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2.4rem',
                        fontWeight: 700,
                      }}
                    >
                      {(m.name || '?').charAt(0)}
                    </div>
                  )}
                </div>

                <h3 className="team-card-name">{m.name}</h3>
                <p className="team-card-position">{m.position}</p>

                {(m.education || []).length > 0 && (
                  <div className="team-card-block">
                    {(m.education || []).map((e: string, ei: number) => (
                      <p key={ei} className="team-card-line">
                        {e}
                      </p>
                    ))}
                  </div>
                )}

                {(m.expertise || []).length > 0 && (
                  <div className="team-card-block">
                    <p className="team-card-line team-card-line--italic">
                      {(m.expertise || []).join(' · ')}
                    </p>
                  </div>
                )}

                <div className="team-card-contact">
                  {m.email && (
                    <a href={`mailto:${m.email}`}>
                      <i className="fa-solid fa-envelope" />
                      <span>{m.email}</span>
                    </a>
                  )}
                  {m.whatsapp && (
                    <a
                      href={`https://wa.me/${(m.whatsapp || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="fa-brands fa-whatsapp" />
                      <span>{m.whatsapp}</span>
                    </a>
                  )}
                  {m.phone && (
                    <a href={`tel:${m.phone.replace(/[^0-9+]/g, '')}`}>
                      <i className="fa-solid fa-phone" />
                      <span>{m.phone}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="reveal" style={{ textAlign: 'center', marginTop: 56 }}>
            <Link href={team.ctaLink} className="btn btn-gold">
              {team.ctaText} <i className="fa-solid fa-paper-plane" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== CORE VALUES ========== */}
      <section id="values" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{values.eyebrow}</span>
            <h2 className="section-title">
              {values.title} <span className="accent">{values.titleAccent}</span>
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

      {/* ========== CTA ========== */}
      <section className="section-lg section-navy">
        <div className="container" style={{ maxWidth: 780, textAlign: 'center' }}>
          <div className="reveal">
            <h2 className="section-title" style={{ color: '#fff' }}>
              {cta.title}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.75)',
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
              <Link href={cta.button2Link} className="btn btn-outline-white">
                {cta.button2Text} <i className="fa-solid fa-hand-holding-heart" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PAGE SCOPED STYLES FOR TEAM GRID */}
      <style>{`
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .team-card {
          background: #fff;
          border-radius: 1.5rem;
          padding: 2rem 1.5rem;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.04);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.06);
          transition: all 0.35s cubic-bezier(0.23,1,0.32,1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .team-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 32px 60px -16px rgba(6,40,61,0.18);
          border-color: rgba(212,160,23,0.25);
        }
        .team-card .team-card-img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 20px;
          border: 3px solid var(--gold);
          box-shadow: 0 8px 20px rgba(212,160,23,0.2);
          flex-shrink: 0;
        }
        .team-card .team-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .team-card .team-card-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--navy);
          margin: 0 0 4px;
        }
        .team-card .team-card-position {
          color: var(--gold);
          font-size: 0.85rem;
          font-weight: 600;
          margin: 0 0 14px;
        }
        .team-card .team-card-block {
          margin-bottom: 10px;
        }
        .team-card .team-card-line {
          color: var(--gray-600);
          font-size: 0.8rem;
          line-height: 1.55;
          margin: 0;
        }
        .team-card .team-card-line--italic {
          font-style: italic;
        }
        .team-card .team-card-contact {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid rgba(6,40,61,0.08);
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .team-card .team-card-contact a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: var(--gray-600);
          font-size: 0.82rem;
          transition: color 0.25s;
          text-decoration: none;
        }
        .team-card .team-card-contact a:hover {
          color: var(--navy);
        }
        .team-card .team-card-contact a i {
          color: var(--gold);
          font-size: 0.78rem;
          width: 16px;
        }
        .team-card .team-card-contact a i.fa-whatsapp {
          color: #25D366;
        }
      `}</style>
    </>
  );
}