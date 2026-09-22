import { getPage } from '@/lib/db';
import { getInvolvedDefaults } from '@/lib/defaults';
import Link from 'next/link';
import VolunteerForm from './VolunteerForm';
import NewsletterForm from './NewsletterForm';
import VolunteerImage from './VolunteerImage';

export const dynamic = 'force-dynamic';

export default async function GetInvolvedPage() {
  let data = { ...getInvolvedDefaults };

  try {
    const saved = await getPage('sudd-get-involved');
    if (saved) data = { ...getInvolvedDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Get Involved, using defaults:', err);
  }

  const { hero, ways, volunteer, donation, partner, newsletter } = data;

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

      {/* ========== HOW YOU CAN HELP ========== */}
      <section id="ways" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{ways.eyebrow}</span>
            <h2 className="section-title">
              {ways.title}{' '}
              <span className="accent">{ways.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-4" style={{ maxWidth: 1200, margin: '0 auto' }}>
            {(ways.items || []).map((w: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  className={`card-icon card-icon-${w.iconBg}`}
                  style={{ margin: '0 auto 18px' }}
                >
                  <i className={w.icon} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    marginBottom: 10,
                  }}
                >
                  {w.title}
                </h3>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    margin: '0 0 22px',
                    flex: 1,
                  }}
                >
                  {w.text}
                </p>
                <Link
                  href={w.buttonLink || '#'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    alignSelf: 'center',
                    padding: '10px 20px',
                    background: 'transparent',
                    color: 'var(--navy)',
                    border: '1.5px solid var(--navy)',
                    borderRadius: 999,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                >
                  {w.buttonText || 'Learn More'}{' '}
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ========== VOLUNTEER ========== */}
      <section id="volunteer" className="section-lg section-cream">
        <div className="container">
          <div className="two-col">
            <div className="reveal">
              <span className="eyebrow">{volunteer.eyebrow}</span>
              <h2 className="section-title">
                {volunteer.title}{' '}
                <span className="accent">{volunteer.titleAccent}</span>
              </h2>
              <p
                style={{
                  color: 'var(--gray-600)',
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  margin: '20px 0 30px',
                }}
              >
                {volunteer.text}
              </p>

              <VolunteerForm form={volunteer.form} />
            </div>

            <div className="two-col-img reveal reveal-delay-2">
              <VolunteerImage
                src={volunteer.image}
                alt={volunteer.title}
                fallbackIcon={volunteer.fallbackIcon || 'fa-solid fa-people-group'}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== DONATION TIERS ========== */}
      <section id="donate" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{donation.eyebrow}</span>
            <h2 className="section-title">
              {donation.title}{' '}
              <span className="accent">{donation.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-4" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(donation.items || []).map((d: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '2.4rem',
                    fontWeight: 700,
                    color:
                      d.color === 'gold'
                        ? 'var(--gold)'
                        : d.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    lineHeight: 1,
                    marginBottom: 14,
                  }}
                >
                  {d.amount}
                </div>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.88rem',
                    lineHeight: 1.65,
                    margin: '0 0 22px',
                    flex: 1,
                  }}
                >
                  {d.text}
                </p>
                <Link
                  href={d.buttonLink || '#'}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    alignSelf: 'center',
                    padding: '10px 22px',
                    background:
                      d.color === 'gold'
                        ? 'linear-gradient(135deg, #D4A017, #e8b830)'
                        : d.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    color:
                      d.color === 'forest' || d.color === 'navy'
                        ? '#fff'
                        : '#06283D',
                    borderRadius: 999,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow:
                      d.color === 'gold'
                        ? '0 10px 22px rgba(212,160,23,0.3)'
                        : d.color === 'forest'
                        ? '0 10px 22px rgba(27,94,69,0.28)'
                        : '0 10px 22px rgba(6,40,61,0.28)',
                  }}
                >
                  {d.buttonText}{' '}
                  <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.7rem' }} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARTNER ========== */}
      <section
        id="partner"
        className="section-lg section-navy"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,40,61,0.82) 0%, rgba(6,40,61,0.9) 100%), url(${partner.backgroundImage})`,
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
              <span className="eyebrow">{partner.eyebrow}</span>
              <h2 className="section-title" style={{ color: '#fff' }}>
                {partner.title}{' '}
                <span className="accent" style={{ color: 'var(--gold)' }}>
                  {partner.titleAccent}
                </span>
              </h2>
              <p
                style={{
                  color: 'rgba(255,255,255,0.78)',
                  fontSize: '1.02rem',
                  lineHeight: 1.8,
                  margin: '20px 0 24px',
                }}
              >
                {partner.text}
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {(partner.bulletPoints || []).map((b: string, i: number) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'flex-start',
                      color: 'rgba(255,255,255,0.72)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                    }}
                  >
                    <i
                      className="fa-solid fa-check-circle"
                      style={{
                        color: 'var(--gold)',
                        fontSize: '1rem',
                        marginTop: 3,
                        flexShrink: 0,
                      }}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <Link href={partner.ctaLink} className="btn btn-gold">
                {partner.ctaText}{' '}
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="reveal reveal-delay-2">
              <div
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: 22,
                  padding: '40px 32px',
                  border: '1px solid rgba(255,255,255,0.18)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: '#fff',
                    marginBottom: 14,
                  }}
                >
                  {partner.panelTitle}
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.65)',
                    fontSize: '0.92rem',
                    lineHeight: 1.7,
                    marginBottom: 26,
                  }}
                >
                  {partner.panelText}
                </p>
                <Link
                  href={partner.panelButtonLink}
                  className="btn btn-gold"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {partner.panelButtonText}{' '}
                  <i className="fa-solid fa-handshake" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER + SOCIAL ========== */}
      <section id="newsletter" className="section-lg section-white">
        <div className="container">
          <div
            className="reveal"
            style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}
          >
            <span className="eyebrow">{newsletter.eyebrow}</span>
            <h2 className="section-title">
              {newsletter.title}{' '}
              <span className="accent">{newsletter.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{newsletter.text}</p>

            <NewsletterForm newsletter={newsletter} />

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
                marginTop: 36,
              }}
            >
              {(newsletter.socials || []).map((s: any, i: number) => {
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
                      width: 50,
                      height: 50,
                      borderRadius: 14,
                      background: bg,
                      color: fg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                      transition: 'all 0.25s',
                      textDecoration: 'none',
                    }}
                  >
                    <i className={s.icon} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}