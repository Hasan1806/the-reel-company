"use client";

import React, { useState } from "react";
import Link from "next/link";
import DiscoveryCallModal from "@/components/DiscoveryCallModal";
import PortfolioAccessModal from "@/components/PortfolioAccessModal";
import { ASSETS } from "@/config/assets";

export default function TermsAndConditionsPage() {
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
      <header id="site-header" role="banner" className="scrolled" suppressHydrationWarning>
        <div className="header-inner" suppressHydrationWarning>
          <Link href="/" className="logo" aria-label="The Reel Company Home" suppressHydrationWarning>
            <img
              src={ASSETS.brand.logo.primary}
              alt={ASSETS.brand.logo.alt}
              className="brand-logo-img"
              width={140}
              height={40}
            />
          </Link>
          <nav id="main-nav" aria-label="Main navigation" suppressHydrationWarning>
            <Link href="/#hero" className="nav-link" suppressHydrationWarning>Home</Link>
            <Link href="/#portfolio" className="nav-link" suppressHydrationWarning>Portfolio</Link>
            <Link href="/#services" className="nav-link" suppressHydrationWarning>Services</Link>
            <Link href="/contact" className="nav-link" suppressHydrationWarning>Contact</Link>
          </nav>
          <Link
            href="/contact"
            className="btn btn-red header-cta"
            id="header-cta-btn"
            prefetch={true}
            suppressHydrationWarning
          >
            Book a Discovery Call
          </Link>
          <button
            className={`mobile-menu-toggle ${mobileMenuOpen ? "open" : ""}`}
            id="mobile-menu-toggle"
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen ? "true" : "false"}
            aria-controls="mobile-nav"
            onClick={toggleMobileMenu}
            suppressHydrationWarning
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
            <Link href="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>Contact</Link>
            <Link href="/privacy-policy" className="mobile-nav-link" onClick={closeMobileMenu}>Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="mobile-nav-link active" onClick={closeMobileMenu}>Terms &amp; Conditions</Link>
            <Link
              href="/contact"
              className="btn btn-red mobile-nav-cta"
              onClick={closeMobileMenu}
              prefetch={true}
            >
              Book a Discovery Call
            </Link>
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
              <span className="privacy-eyebrow-accent">✦</span> LEGAL / TERMS
            </div>
            <h1 className="privacy-main-title">Terms &amp; Conditions</h1>
            <p className="privacy-sub-title">Terms and Conditions for The Reel Company</p>
            <div className="privacy-effective-date">
              Effective Date: <strong>25/08/2026</strong>
            </div>
            <div className="privacy-divider" aria-hidden="true" />
          </div>

          {/* Terms Body */}
          <div className="privacy-content-body">
            <section className="privacy-section">
              <p>
                Welcome to <strong><a href="https://www.thereelcompany.in" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>www.thereelcompany.in</a></strong>, the official website of The Reel Company. By accessing and using this website, you agree to comply with and be bound by the following Terms and Conditions. If you disagree with any part of these terms, please do not use our website.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">1. Use of the Website</h2>
              <p>
                <strong>1.1 Acceptance of Terms:</strong> By using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
              <p>
                <strong>1.2 Age Restriction:</strong> This website is intended for users who are at least 18 years old. If you are under 18, you may use this website only with the involvement and permission of a parent or legal guardian.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">2. User Responsibilities</h2>
              <p>
                <strong>2.1 Accurate Information:</strong> You agree to provide accurate, current, and complete information when using forms or interacting with our website.
              </p>
              <p>
                <strong>2.2 Prohibited Activities:</strong> You agree not to misuse the website, attempt unauthorized access, interfere with its functionality, introduce malicious software, or use the website for unlawful or fraudulent purposes.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">3. Intellectual Property</h2>
              <p>
                <strong>3.1 Ownership:</strong> All content on this website, including but not limited to text, graphics, logos, images, videos, designs, and software, is the property of The Reel Company and is protected by applicable copyright, trademark, and intellectual property laws.
              </p>
              <p>
                <strong>3.2 Use of Content:</strong> You may not reproduce, distribute, modify, copy, republish, commercially exploit, or otherwise use any content from this website without our prior written consent.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">4. Privacy Policy</h2>
              <p>
                <strong>4.1 Privacy:</strong> Your use of this website is also governed by our Privacy Policy. Please review the policy to understand our practices regarding the collection, processing, storage, and use of your personal information.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">5. Third-Party Links</h2>
              <p>
                <strong>5.1 External Links:</strong> Our website may contain links to third-party websites or services. These links are provided for your convenience, and The Reel Company does not endorse, control, or assume responsibility for the content, privacy practices, availability, or services of these third-party websites.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">6. Limitation of Liability</h2>
              <p>
                <strong>6.1 No Guarantees:</strong> We make no guarantees, representations, or warranties regarding the accuracy, completeness, availability, reliability, or suitability of the information presented on this website.
              </p>
              <p>
                <strong>6.2 Limitation of Liability:</strong> To the fullest extent permitted by applicable law, The Reel Company shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your access to, inability to access, or use of this website or its content.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">7. Governing Law</h2>
              <p>
                <strong>7.1 Jurisdiction:</strong> These Terms and Conditions are governed by and construed in accordance with the applicable laws of Chhattisgarh, India.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">8. Changes to Terms and Conditions</h2>
              <p>
                <strong>8.1 Updates:</strong> We reserve the right to update, modify, or change these Terms and Conditions at any time without prior notice. Any changes will become effective once published on this website. It is your responsibility to review this page periodically for updates.
              </p>
            </section>

            <section className="privacy-section">
              <h2 className="privacy-section-heading">9. Contact Information</h2>
              <p>
                <strong>9.1 Communication:</strong> For any inquiries, questions, or concerns related to these Terms and Conditions, please contact us at:
              </p>
              <div style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <p><strong>Name:</strong> Shubham Mishra</p>
                <p><strong>Email:</strong> <a href="mailto:connect@thereelcompany.in" style={{ color: "#fff", textDecoration: "underline" }}>connect@thereelcompany.in</a></p>
                <p><strong>Phone:</strong> <a href="tel:+918109214834" style={{ color: "#fff", textDecoration: "underline" }}>+91 8109214834</a></p>
              </div>
            </section>

            <section className="privacy-section">
              <p style={{ marginTop: "1rem", color: "rgba(240, 237, 232, 0.75)", fontStyle: "italic" }}>
                By using <a href="https://www.thereelcompany.in" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>www.thereelcompany.in</a>, you agree to abide by these Terms and Conditions. If you do not agree with any part of these terms, please refrain from using our website.
              </p>
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
              <Link href="/contact">Contact</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/terms-and-conditions" className="active">Terms &amp; Conditions</Link>
            </div>
            <div className="footer-nav-col">
              <h4>Work with us</h4>
              <Link 
                href="/contact" 
                className="footer-nav-link-btn"
                style={{ display: "inline-block", textAlign: "left", textDecoration: "none" }}
                prefetch={true}
              >
                Book a Discovery Call
              </Link>
              <Link href="/#portfolio">
                Portfolio Access
              </Link>
              <a 
                href="mailto:connect@thereelcompany.in"
                className="footer-nav-link-btn"
                style={{ display: "inline-block", textAlign: "left", textDecoration: "none" }}
              >
                Email Us
              </a>
            </div>
            <div className="footer-nav-col footer-contact-col">
              <h4>Contact</h4>
              <p className="footer-contact-line">
                <span className="footer-contact-label">Phone -</span> +91 8109214834
              </p>
              <p className="footer-contact-line">
                <span className="footer-contact-label">E-mail :</span> connect@thereelcompany.in
              </p>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="copyright-text">&copy; 2026 The Reel Company Co.</span>
          </div>
          <p className="footer-studio-tag">Formerly Creator Navigator</p>
        </div>

        {/* Big Footer Branding SVG */}
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
              <linearGradient id="footerBrandGradTerms" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="22%" stopColor="#ff4d4d" />
                <stop offset="50%" stopColor="#e50914" />
                <stop offset="78%" stopColor="#660003" />
                <stop offset="100%" stopColor="#100203" />
              </linearGradient>
              <filter id="footerGlowTerms" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(229, 9, 20, 0.55)" />
              </filter>
            </defs>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="url(#footerBrandGradTerms)"
              filter="url(#footerGlowTerms)"
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
