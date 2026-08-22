"use client";

import React, { useState } from "react";
import Link from "next/link";
import DiscoveryCallModal from "@/components/DiscoveryCallModal";
import PortfolioAccessModal from "@/components/PortfolioAccessModal";
import { ASSETS } from "@/config/assets";

export default function PrivacyPolicyPage() {
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openDiscoveryModal = () => setDiscoveryModalOpen(true);
  const closeDiscoveryModal = () => setDiscoveryModalOpen(false);
  const openPortfolioModal = () => setPortfolioModalOpen(true);
  const closePortfolioModal = () => setPortfolioModalOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="privacy-page-root">
      {/* ═══════════════════════════════ HEADER / NAVBAR ═══════════════════════════ */}
      <header id="site-header" role="banner" className="scrolled">
        <div className="header-inner">
          <Link href="/" className="logo" aria-label="The Reel Company Home">
            <img
              src={ASSETS.brand.logo.primary}
              alt={ASSETS.brand.logo.alt}
              className="brand-logo-img"
              width={140}
              height={40}
            />
          </Link>
          <nav id="main-nav" aria-label="Main navigation">
            <Link href="/#hero" className="nav-link">Home</Link>
            <Link href="/#portfolio" className="nav-link">Portfolio</Link>
            <Link href="/#services" className="nav-link">Services</Link>
            <Link href="/#footer-cta" className="nav-link">Contact</Link>
          </nav>
          <button
            type="button"
            className="btn btn-red header-cta"
            id="header-cta-btn"
            onClick={openDiscoveryModal}
          >
            Book a Call
          </button>
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            id="mobile-menu-toggle"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-nav"
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}
          id="mobile-nav"
          aria-hidden={mobileMenuOpen ? "false" : "true"}
        >
          <button
            className="mobile-nav-close"
            id="mobile-nav-close"
            aria-label="Close menu"
            onClick={closeMobileMenu}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="mobile-nav-scroll-container">
            <Link href="/#hero" className="mobile-nav-link" onClick={closeMobileMenu}>Home</Link>
            <Link href="/#portfolio" className="mobile-nav-link" onClick={closeMobileMenu}>Portfolio</Link>
            <Link href="/#services" className="mobile-nav-link" onClick={closeMobileMenu}>Services</Link>
            <Link href="/#footer-cta" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
            <Link href="/privacy-policy" className="mobile-nav-link active" onClick={closeMobileMenu}>Privacy Policy</Link>
            <button
              type="button"
              className="btn btn-red mobile-nav-cta"
              onClick={() => {
                closeMobileMenu();
                openDiscoveryModal();
              }}
            >
              Book a Call
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════ MAIN CONTENT ═══════════════════════════ */}
      <main className="privacy-main-wrapper">
        <div className="privacy-ambient-glow" aria-hidden="true" />

        <div className="privacy-container">
          {/* Header Area */}
          <div className="privacy-header-section">
            <div className="privacy-eyebrow">
              <span className="privacy-eyebrow-accent">✦</span> LEGAL / PRIVACY
            </div>
            <h1 className="privacy-main-title">Privacy Policy</h1>
            <p className="privacy-sub-title">Privacy Policy for The Reel Company</p>
            <div className="privacy-effective-date">
              Effective Date: <strong>20/08/2026</strong>
            </div>
            <div className="privacy-divider" aria-hidden="true" />
          </div>

          {/* Policy Body */}
          <div className="privacy-content-body">
            <section className="privacy-section">
              <p>
                Welcome to <strong>www.thereelcompany.in</strong>, the official website of The Reel Company. This Privacy Policy aims to provide clarity on how we gather, use, and safeguard your personal information when you interact with our website or utilize our services.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">1. Information We Collect</h2>
              <p>
                In the course of your engagement with our platform, we may collect a variety of information. This includes personal details such as your name, email address, phone number, and links to your social media profiles. Additionally, we automatically gather certain information, such as your IP address, browser type, operating system, and the referring website. Further data may be obtained during order processing and newsletter subscriptions.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">2. How We Collect Information</h2>
              <p>
                Our data collection methods encompass various channels. Through order forms for both digital and physical products, we gather information vital for the processing of orders and the delivery of products. Newsletter subscription forms allow us to keep you informed about our latest updates and offerings. In parallel, automated technologies, including Google Analytics and Facebook Pixels, are employed to facilitate website analytics and targeted advertising, providing insights into our audience and aiding us in enhancing our online presence.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">3. Purposes of Data Collection</h2>
              <p>
                The primary purposes for which we collect and process your personal information include order processing, analytics for website improvement, communication before discovery calls, and delivering newsletters and updates if you choose to subscribe.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">4. Third-Party Services</h2>
              <p>
                In our quest to provide a seamless user experience, we utilize certain third-party services. Google Analytics assists us in analyzing website traffic, and Facebook Pixels enables targeted advertising. We encourage you to review the respective privacy policies of these services: Google’s Privacy Policy and Facebook Data Policy.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">5. Security Measures</h2>
              <p>
                To protect your personal information, we have implemented a range of security measures. These include secure development practices during website creation and the use of security plugins to mitigate common vulnerabilities.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">6. Data Sharing</h2>
              <p>
                We share data only with specific categories, such as automation and marketing software tools. This sharing is undertaken to enhance the efficiency of our services and communication with our users.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">7. User Rights &amp; Choices</h2>
              <p>
                As a user, you have rights regarding your personal information. You can access, correct, or delete your data, opt-out of marketing communications, and unsubscribe from newsletters at any time.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">8. Data Retention</h2>
              <p>
                The retention period for certain data is limited. Facebook Pixel data is retained for 180 days, while customer information is stored until you choose to unsubscribe or request its deletion.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">9. Policy Updates</h2>
              <p>
                Our Privacy Policy may be updated periodically, and users are encouraged to check this page for any changes. By using <strong>www.thereelcompany.in</strong>, you signify your agreement to the terms outlined in this Privacy Policy.
              </p>
            </section>

            {/* Contact Information Card */}
            <section className="privacy-contact-card" aria-label="Contact Details for Privacy Inquiries">
              <h2 className="privacy-contact-title">Privacy Inquiries &amp; Contact Information</h2>
              <p className="privacy-contact-intro">
                If you have any privacy-related concerns, inquiries, or requests regarding your personal data, please reach out to our grievance officer directly:
              </p>

              <div className="privacy-contact-grid">
                <div className="privacy-contact-item">
                  <span className="privacy-contact-label">Name</span>
                  <span className="privacy-contact-val">Shubham Mishra</span>
                </div>

                <div className="privacy-contact-item">
                  <span className="privacy-contact-label">E-mail</span>
                  <span className="privacy-contact-val">shubham@creator-navigator.in</span>
                </div>

                <div className="privacy-contact-item">
                  <span className="privacy-contact-label">Phone</span>
                  <span className="privacy-contact-val">+91 8109214834</span>
                </div>

                <div className="privacy-contact-item full-width">
                  <span className="privacy-contact-label">Address</span>
                  <span className="privacy-contact-val">
                    Ground Floor, Kohinoor Tower, Kohka Junwani, Bhilai, 490023, Chhattisgarh
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link href="/" className="logo footer-logo" aria-label="The Reel Company">
              <span className="logo-mark">TRC</span>
              <span className="logo-text">The Reel Company</span>
            </Link>
            <p className="footer-tagline">Studio-quality UGC &amp; ad videos.<br/>On-demand. Affordable. Fast.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <div className="footer-nav-col">
              <h4>Navigation</h4>
              <Link href="/#hero">Home</Link>
              <Link href="/#portfolio">Portfolio</Link>
              <Link href="/#services">Services</Link>
              <Link href="/#footer-cta">Contact</Link>
              <Link href="/privacy-policy" className="active">Privacy Policy</Link>
            </div>
            <div className="footer-nav-col">
              <h4>Work with us</h4>
              <button 
                type="button" 
                className="footer-nav-link-btn" 
                onClick={openDiscoveryModal}
              >
                Book a Call
              </button>
              <button 
                type="button" 
                className="footer-nav-link-btn" 
                onClick={openPortfolioModal}
              >
                Portfolio Access
              </button>
              <button 
                type="button" 
                className="footer-nav-link-btn" 
                onClick={openDiscoveryModal}
              >
                Email Us
              </button>
            </div>
            <div className="footer-nav-col footer-contact-col">
              <h4>Contact</h4>
              <p className="footer-contact-line">
                <span className="footer-contact-label">Address:</span> Ground Floor, Kohinoor Tower, Kohka Junwani, Bhilai, 490023, Chhattisgarh
              </p>
              <p className="footer-contact-line">
                <span className="footer-contact-label">Phone -</span> +91 8109214834
              </p>
              <p className="footer-contact-line">
                <span className="footer-contact-label">E-mail :</span> shubham@creator-navigator.in
              </p>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="copyright-text">&copy; 2026 The Reel Company Co.</span>
          </div>
          <p className="footer-studio-tag">UGC &amp; Content Production Studio</p>
        </div>

        {/* Big Footer Branding SVG (Last Element) */}
        <div className="footer-big-branding-wrap" aria-label="The Reel Company">
          <div className="footer-big-branding-glow" aria-hidden="true"></div>
          <svg
            viewBox="0 0 1700 160"
            width="100%"
            height="100%"
            className="footer-big-branding-svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="footerBrandGradPrivacy" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="22%" stopColor="#ff4d4d" />
                <stop offset="50%" stopColor="#e50914" />
                <stop offset="78%" stopColor="#660003" />
                <stop offset="100%" stopColor="#100203" />
              </linearGradient>
              <filter id="footerGlowPrivacy" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(229, 9, 20, 0.55)" />
              </filter>
            </defs>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="url(#footerBrandGradPrivacy)"
              filter="url(#footerGlowPrivacy)"
              style={{
                fontFamily: "var(--font-head), 'Plus Jakarta Sans', sans-serif",
                fontWeight: 900,
                fontSize: "148px",
                letterSpacing: "-0.015em",
              }}
            >
              <tspan>THE</tspan>
              <tspan dx="42">REEL</tspan>
              <tspan dx="42">COMPANY</tspan>
            </text>
          </svg>
        </div>
      </footer>

      {/* Discovery Call Lead Capture Modal */}
      <DiscoveryCallModal
        isOpen={discoveryModalOpen}
        onClose={closeDiscoveryModal}
      />

      {/* Portfolio Access Lead Capture Modal */}
      <PortfolioAccessModal
        isOpen={portfolioModalOpen}
        onClose={closePortfolioModal}
      />
    </div>
  );
}
