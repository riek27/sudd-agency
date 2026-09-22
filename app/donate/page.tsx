import { getPage } from '@/lib/db';
import { donateDefaults } from '@/lib/defaults';
import Link from 'next/link';
import BankDetails from './BankDetails';
import FAQAccordion from './FAQAccordion';

export const dynamic = 'force-dynamic';

export default async function DonatePage() {
  let data = { ...donateDefaults };

  try {
    const saved = await getPage('sudd-donate');
    if (saved) data = { ...donateDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load Donate, using defaults:', err);
  }

  const { hero, ways, bank, impact, faq, cta } = data;

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
              {hero.title}{' '}
              <span className="accent">{hero.titleAccent}</span>
            </h1>
            <p
              className="hero-subtitle reveal reveal-delay-2"
              style={{ margin: '0 auto 30px' }}
            >
              {hero.subtitle}
            </p>
            <div className="reveal reveal-delay-3">
              <a href={hero.ctaLink || '#ways-to-give'} className="btn btn-gold">
                {hero.ctaText || 'Ways to Give'}{' '}
                <i className="fa-solid fa-arrow-down" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========== WAYS TO GIVE ========== */}
      <section id="ways-to-give" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{ways.eyebrow}</span>
            <h2 className="section-title">
              {ways.title}{' '}
              <span className="accent">{ways.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
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
                  style={{ margin: '0 auto 20px' }}
                >
                  <i className={w.icon} />
                </div>
                <h3
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    color: 'var(--navy)',
                    marginBottom: 12,
                  }}
                >
                  {w.title}
                </h3>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    margin: '0 0 22px',
                    flex: 1,
                  }}
                >
                  {w.text}
                </p>
                <Link href={w.buttonLink || '#'} className="btn btn-outline-navy" style={{ alignSelf: 'center' }}>
                  {w.buttonText}{' '}
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BANK DETAILS ========== */}
      <section id="bank-details" className="section-lg section-cream">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="section-head-center reveal">
            <span className="eyebrow">{bank.eyebrow}</span>
            <h2 className="section-title">
              {bank.title}{' '}
              <span className="accent">{bank.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{bank.subtitle}</p>
          </div>

          <BankDetails bank={bank} />
        </div>
      </section>

      {/* ========== YOUR IMPACT ========== */}
      <section id="impact" className="section-lg section-white">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{impact.eyebrow}</span>
            <h2 className="section-title">
              {impact.title}{' '}
              <span className="accent">{impact.titleAccent}</span>
            </h2>
          </div>

          <div className="grid-4" style={{ maxWidth: 1100, margin: '0 auto' }}>
            {(impact.items || []).map((d: any, i: number) => (
              <div
                key={i}
                className={`card reveal reveal-delay-${i}`}
                style={{
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '36px 24px 32px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '2.6rem',
                    fontWeight: 700,
                    color:
                      d.color === 'gold'
                        ? 'var(--gold)'
                        : d.color === 'forest'
                        ? 'var(--forest)'
                        : 'var(--navy)',
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {d.amount}
                </div>
                <p
                  style={{
                    color: 'var(--gray-600)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    margin: 0,
                    flex: 1,
                  }}
                >
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="section-lg section-cream">
        <div className="container" style={{ maxWidth: 900 }}>
          <div className="section-head-center reveal">
            <span className="eyebrow">{faq.eyebrow}</span>
            <h2 className="section-title">
              {faq.title}{' '}
              <span className="accent">{faq.titleAccent}</span>
            </h2>
          </div>

          <div className="reveal">
            <FAQAccordion items={faq.items} />
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