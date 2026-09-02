import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ASSETS } from "@/config/assets";
import DiscoveryCallForm from "@/components/DiscoveryCallForm";

export const metadata: Metadata = {
  title: "Contact | The Reel Company",
  description:
    "Contact The Reel Company to discuss content production, UGC, ads, AI videos, brand films and creative requirements.",
};

export default function ContactPage() {
  return (
    <div className="contact-page-root">
      {/* Background ambient lighting */}
      <div className="contact-ambient-glow" aria-hidden="true" />
      <div className="contact-ambient-mesh" aria-hidden="true" />

      {/* Header / Brand Bar */}
      <header className="contact-header">
        <div className="contact-header-inner">
          <Link href="/" className="logo" aria-label="The Reel Company Home">
            <Image
              src={ASSETS.brand.logo.primary}
              alt={ASSETS.brand.logo.alt}
              className="brand-logo-img"
              width={140}
              height={40}
              priority
            />
          </Link>
          <Link href="/" className="contact-back-home-link">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="contact-main">
        <div className="contact-container">
          <DiscoveryCallForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="contact-footer">
        <div className="contact-footer-inner">
          <div className="contact-footer-nav">
            <Link href="/" className="contact-footer-link">Home</Link>
            <Link href="/#portfolio" className="contact-footer-link">Portfolio</Link>
            <Link href="/#services" className="contact-footer-link">Services</Link>
            <Link href="/contact" className="contact-footer-link active">Contact</Link>
            <Link href="/privacy-policy" className="contact-footer-link">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="contact-footer-link">Terms &amp; Conditions</Link>
          </div>
          <p className="contact-footer-copy">
            © {new Date().getFullYear()} The Reel Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
