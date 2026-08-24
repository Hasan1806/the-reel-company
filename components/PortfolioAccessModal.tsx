"use client";

import React, { useState, useEffect, useRef } from "react";

interface PortfolioAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAYBOOK_PORTFOLIO_URL =
  "https://www.playbook.com/s/creator-navigator/ugc-content-portfolio";

const GOOGLE_PORTFOLIO_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSch9tLR2yl2BGu3-EiXK_p7UQLbCA5NSANVpnYen0pOs7Zj4w/formResponse";

export default function PortfolioAccessModal({
  isOpen,
  onClose,
}: PortfolioAccessModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle body scroll lock & keyboard accessibility
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus first input on open
      const focusTimer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 60);

      // Escape key listener & Focus Trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
          return;
        }

        if (e.key === "Tab" && modalRef.current) {
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;

          const firstElement = focusables[0];
          const lastElement = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        clearTimeout(focusTimer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = originalOverflow;
      };
    } else {
      document.body.style.overflow = "";
      setErrorMessage("");
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!cleanPhone) {
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // 1. Submit via backend API (server-side forwarding to Google Forms & Sheet)
    let submittedViaApi = false;
    try {
      const res = await fetch("/api/portfolio-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          fullName: cleanName,
          phone: cleanPhone,
          contactNumber: cleanPhone,
          email: cleanEmail,
          source: "Portfolio Access Modal",
        }),
      });
      if (res.ok) {
        submittedViaApi = true;
      }
    } catch (err) {
      console.warn("API route fallback:", err);
    }

    // 2. Fallback: Submit directly to Google Forms if API was unreachable
    if (!submittedViaApi) {
      try {
        const googleFormData = new URLSearchParams();
        googleFormData.append("entry.41647073", cleanName);
        googleFormData.append("entry.1646448611", cleanPhone);
        googleFormData.append("entry.1726298412", cleanEmail);

        fetch(GOOGLE_PORTFOLIO_FORM_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: googleFormData.toString(),
        }).catch(() => {});
      } catch (e) {
        console.warn("Client-side direct submit error:", e);
      }
    }

    // Open Playbook in new tab immediately
    window.open(PLAYBOOK_PORTFOLIO_URL, "_blank", "noopener,noreferrer");

    // Reset form & close modal smoothly
    setIsSubmitting(false);
    setName("");
    setPhone("");
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="portfolio-modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="portfolio-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Unlock Full Portfolio"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="portfolio-modal-header">
          <div className="portfolio-modal-badge">
            <span className="portfolio-modal-dot" aria-hidden="true" />
            <span>PORTFOLIO ACCESS</span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="portfolio-modal-close-btn"
            aria-label="Close portfolio modal"
            onClick={onClose}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="portfolio-modal-info">
          <h3 className="portfolio-modal-title">Access Our Full Portfolio</h3>
          <p className="portfolio-modal-sub">
            Fill in your details below to instantly unlock our private UGC &amp; performance ad library on Playbook.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="portfolio-modal-form" noValidate>
          {errorMessage && (
            <div className="portfolio-modal-error" role="alert">
              {errorMessage}
            </div>
          )}

          {/* Full Name Field */}
          <div className="portfolio-input-group">
            <label htmlFor="portfolio-form-name" className="portfolio-input-label">
              Full Name <span className="req-star">*</span>
            </label>
            <div className="portfolio-input-wrapper">
              <svg
                className="portfolio-input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                ref={firstInputRef}
                id="portfolio-form-name"
                type="text"
                className="portfolio-modal-input"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="name"
              />
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="portfolio-input-group">
            <label htmlFor="portfolio-form-phone" className="portfolio-input-label">
              Phone Number <span className="req-star">*</span>
            </label>
            <div className="portfolio-input-wrapper">
              <svg
                className="portfolio-input-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <input
                id="portfolio-form-phone"
                type="tel"
                className="portfolio-modal-input"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="portfolio-input-group">
            <label htmlFor="portfolio-form-email" className="portfolio-input-label">
              Email <span className="req-star">*</span>
            </label>
            <div className="portfolio-input-wrapper">
              <svg
                className="portfolio-input-icon"
                width="16"
                height="16"
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
              <input
                id="portfolio-form-email"
                type="email"
                className="portfolio-modal-input"
                placeholder="work@yourcompany.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Submit Button: Submit & Proceed */}
          <button
            type="submit"
            className="btn btn-red portfolio-modal-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="portfolio-submit-spinner" />
                <span>Redirecting…</span>
              </>
            ) : (
              <>
                <span>Submit &amp; Proceed</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="portfolio-modal-privacy-note">
          🔒 Instant access • Direct high-resolution UGC library on Playbook
        </p>
      </div>
    </div>
  );
}
