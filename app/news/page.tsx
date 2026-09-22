import { getPage } from '@/lib/db';
import { newsDefaults } from '@/lib/defaults';
import NewsCard from './NewsCard';
import NewsletterForm from './NewsletterForm';

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  let data = { ...newsDefaults };

  try {
    const saved = await getPage('sudd-news');
    if (saved) data = { ...newsDefaults, ...saved };
  } catch (err) {
    console.error('Failed to load News, using defaults:', err);
  }

  const { hero, featured, grid, newsletter, social } = data;

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

      {/* ========== FEATURED ========== */}
      <section id="featured" className="section-lg section-white">
        <div className="container">
          <NewsCard article={featured} variant="featured" />
        </div>
      </section>

      {/* ========== NEWS GRID ========== */}
      <section id="grid" className="section-lg section-cream">
        <div className="container">
          <div className="section-head-center reveal">
            <span className="eyebrow">{grid.eyebrow}</span>
            <h2 className="section-title">
              {grid.title}{' '}
              <span className="accent">{grid.titleAccent}</span>
            </h2>
          </div>

          <div
            className="grid-3"
            style={{ alignItems: 'start', gridAutoRows: 'min-content' }}
          >
            {(grid.items || []).map((n: any, i: number) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i % 3}`}
                style={{ display: 'flex' }}
              >
                <NewsCard article={n} variant="card" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section
        id="newsletter"
        className="section-lg section-navy"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6,40,61,0.82) 0%, rgba(6,40,61,0.9) 100%), url(${newsletter.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'scroll',
          position: 'relative',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div
            className="reveal"
            style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}
          >
            <span className="eyebrow">{newsletter.eyebrow}</span>
            <h2 className="section-title" style={{ color: '#fff' }}>
              {newsletter.title}{' '}
              <span className="accent" style={{ color: 'var(--gold)' }}>
                {newsletter.titleAccent}
              </span>
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.75)',
                fontSize: '1.05rem',
                lineHeight: 1.75,
                marginTop: 16,
              }}
            >
              {newsletter.text}
            </p>

            <NewsletterForm newsletter={newsletter} />
          </div>
        </div>
      </section>

      {/* ========== SOCIAL ========== */}
      <section id="social" className="section-lg section-white">
        <div className="container">
          <div
            className="reveal"
            style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}
          >
            <span className="eyebrow">{social.eyebrow}</span>
            <h2 className="section-title">
              {social.title}{' '}
              <span className="accent">{social.titleAccent}</span>
            </h2>
            <p className="section-subtitle">{social.text}</p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 16,
                flexWrap: 'wrap',
                marginTop: 40,
              }}
            >
              {(social.links || []).map((s: any, i: number) => {
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
                      width: 56,
                      height: 56,
                      borderRadius: 16,
                      background: bg,
                      color: fg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
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