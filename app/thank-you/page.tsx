import type { Metadata } from "next";
import Link from "next/link";
import { ASSETS } from "@/config/assets";

export const metadata: Metadata = {
  title: "Thank You | The Reel Company",
  description: "Thank you for requesting a discovery call with The Reel Company. Our team will review your details and reach out shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="thank-you-page-root">
      {/* Background ambient lighting */}
      <div className="thank-you-ambient-glow" aria-hidden="true" />
      <div className="thank-you-ambient-mesh" aria-hidden="true" />

      {/* Header / Brand Bar */}
      <header className="thank-you-header">
        <Link href="/" className="logo" aria-label="The Reel Company Home">
          <img
            src={ASSETS.brand.logo.primary}
            alt={ASSETS.brand.logo.alt}
            className="brand-logo-img"
            width={140}
            height={40}
          />
        </Link>
      </header>

      {/* Main Confirmation Content */}
      <main className="thank-you-main">
        <div className="thank-you-card">
          {/* Top Success Element */}
          <div className="thank-you-icon-wrap" aria-hidden="true">
            <div className="thank-you-icon-pulse" />
            <svg
              className="thank-you-check-svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          {/* Eyebrow Badge */}
          <div className="thank-you-badge">
            <span className="thank-you-dot" aria-hidden="true" />
            <span>REQUEST RECEIVED</span>
          </div>

          {/* Heading */}
          <h1 className="thank-you-title">Thank You for Your Response</h1>

          {/* Founder & Intro Body */}
          <div className="thank-you-intro">
            <p className="thank-you-founder-line">
              This is <strong>Shubham Mishra</strong>, Founder of The Reel Company.
            </p>
            <p className="thank-you-p">
              Thank you for taking the time to tell us about your brand and content requirements.
            </p>
            <p className="thank-you-p">
              Our team has received your request successfully and will review the information you&apos;ve shared.
            </p>
            <p className="thank-you-p thank-you-p-last">
              Someone from our team will connect with you shortly to discuss the next steps.
            </p>
          </div>

          {/* Urgent Contact Card */}
          <section className="thank-you-contact-box" aria-label="Urgent Contact Information">
            <h2 className="thank-you-contact-heading">Need to reach us urgently?</h2>
            <p className="thank-you-contact-desc">
              If your requirement is time-sensitive or you need to speak with us immediately, you can contact us directly using the details below.
            </p>
            <div className="thank-you-contact-grid">
              <a
                href="tel:+918109214834"
                className="thank-you-contact-item"
                aria-label="Call +91 8109214834"
              >
                <div className="thank-you-contact-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="thank-you-contact-info">
                  <span className="thank-you-contact-label">Phone</span>
                  <span className="thank-you-contact-val">+91 8109214834</span>
                </div>
              </a>

              <a
                href="mailto:connect@thereelcompany.in"
                className="thank-you-contact-item"
                aria-label="Email connect@thereelcompany.in"
              >
                <div className="thank-you-contact-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div className="thank-you-contact-info">
                  <span className="thank-you-contact-label">E-mail</span>
                  <span className="thank-you-contact-val">connect@thereelcompany.in</span>
                </div>
              </a>
            </div>
          </section>

          {/* Action CTAs */}
          <div className="thank-you-actions">
            <Link href="/" className="btn btn-red thank-you-btn-primary">
              <span>Back to Home</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            <Link href="/#portfolio" className="btn btn-outline thank-you-btn-secondary">
              View Our Work
            </Link>
          </div>

          {/* Closing Message */}
          <p className="thank-you-closing">
            Thank you for considering The Reel Company. We look forward to creating something impactful together.
          </p>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="thank-you-footer">
        <p>© {new Date().getFullYear()} The Reel Company. All rights reserved.</p>
      </footer>
    </div>
  );
}
