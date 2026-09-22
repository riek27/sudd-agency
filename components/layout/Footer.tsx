import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-about">
          <Link href="/" className="footer-brand">
            <img src="/images/sea-logo-2025.jpg" alt="SEA Logo" />
            <span className="footer-brand-text">
              <strong>Sudd Environment Agency</strong>
              <span>Protecting Nature</span>
            </span>
          </Link>
          <p>
            Advocating for the environment, protecting wetlands, and empowering
            communities in South Sudan.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook-f" /></a>
            <a href="#" aria-label="Twitter"><i className="fa-brands fa-x-twitter" /></a>
            <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
            <a href="#" aria-label="LinkedIn"><i className="fa-brands fa-linkedin-in" /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/programs">Programs</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/news">News</Link></li>
            <li><Link href="/get-involved">Get Involved</Link></li>
          </ul>
        </div>

        {/* Focus Areas */}
        <div className="footer-col">
          <h4>Focus Areas</h4>
          <ul className="footer-links">
            <li><Link href="/programs#wetlands-advocacy">Wetlands Advocacy</Link></li>
            <li><Link href="/programs#climate-action">Climate Action</Link></li>
            <li><Link href="/programs#wildlife-advocacy">Wildlife Conservation</Link></li>
            <li><Link href="/programs#agroforestry">Agroforestry</Link></li>
            <li><Link href="/programs#humanitarian">Humanitarian</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-links">
            <li>
              <a href="https://maps.google.com/?q=Juba+South+Sudan" target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-location-dot" />
                <span>Juba, South Sudan</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@seasouthsudan.org">
                <i className="fa-solid fa-envelope" />
                <span>info@seasouthsudan.org</span>
              </a>
            </li>
            <li>
              <a href="tel:+211912511115">
                <i className="fa-solid fa-phone" />
                <span>+211 912 511 115</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Sudd Environment Agency. All rights reserved.
          {' '}Registered National NGO No. 2360, South Sudan.
        </p>
      </div>
    </footer>
  );
}