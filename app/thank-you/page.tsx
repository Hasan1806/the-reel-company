import type { Metadata } from "next";
import Link from "next/link";
import { ASSETS } from "@/config/assets";
import styles from "./thank-you.module.css";

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
    <div className={styles.wrapper}>
      
      {/* Left Side (Content) */}
      <div className={styles.leftSide}>
        
        {/* Ambient meshes */}
        <div className="thank-you-ambient-glow" aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none' }} />
        <div className="thank-you-ambient-mesh" aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, pointerEvents: 'none' }} />

        <div className={styles.content}>
          
          {/* Logo */}
          <Link href="/" aria-label="The Reel Company Home" className={styles.logo}>
            <img
              src={ASSETS.brand.logo.primary}
              alt={ASSETS.brand.logo.alt}
            />
          </Link>

          {/* Badge */}
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            SUCCESSFULLY SUBMITTED
          </div>

          {/* Headers */}
          <h1 className={styles.heading1}>
            You&apos;re all set.
          </h1>
          <h2 className={styles.heading2}>
            Our team is on it.
          </h2>

          {/* Text Content */}
          <p className={styles.paraBold}>
            Thank you for reaching out to The Reel Company.
          </p>
          <p className={styles.paraLight}>
            We are currently reviewing your brand&apos;s requirements. Our creative directors typically respond within a few hours to discuss the next steps and set up your discovery call.
          </p>

          {/* Contact Info Box */}
          <div className={styles.contactBox}>
            <h3 className={styles.contactHeading}>
              Need to reach us urgently?
            </h3>
            <div className={styles.contactGrid}>
              <a href="tel:+918109214834" className={styles.contactItem}>
                <div className={styles.contactIconWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <div className={styles.contactLabel}>Phone</div>
                  <div className={styles.contactValue}>+91 8109214834</div>
                </div>
              </a>

              <a href="mailto:connect@thereelcompany.in" className={styles.contactItem}>
                <div className={styles.contactIconWrap}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <div className={styles.contactLabel}>E-mail</div>
                  <div className={styles.contactValue}>connect@thereelcompany.in</div>
                </div>
              </a>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className={styles.whatsappCard}>
            <h3 className={styles.whatsappHeading}>
              Skip the line. Chat instantly.
            </h3>
            <p className={styles.whatsappDesc}>
              Want to speak with us right now? Our founders are active on WhatsApp and ready to review your project.
            </p>
            
            <a
              href="https://wa.me/918109214834?text=Hi%2C%20I%20just%20submitted%20an%20enquiry%20on%20The%20Reel%20Company%20website%20and%20would%20like%20to%20connect%20with%20your%20team."
              target="_blank"
              rel="noopener noreferrer"
              className={styles.whatsappBtn}
              aria-label="Connect with The Reel Company on WhatsApp"
            >
              {/* WhatsApp Icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              Chat on WhatsApp Now
              {/* Right Arrow */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Right Side (Video) */}
      <div className={styles.rightSide}>
        {/* Full bleed / responsive video */}
        <video
          src={ASSETS.videos.hero.src}
          poster={ASSETS.videos.hero.poster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={styles.video}
        />
      </div>

    </div>
  );
}
