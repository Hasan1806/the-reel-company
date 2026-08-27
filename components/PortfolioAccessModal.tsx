"use client";

import React, { useState, useEffect, useRef } from "react";
interface PortfolioAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAYBOOK_PORTFOLIO_URL =
  "https://www.playbook.com/s/creator-navigator/ugc-content-portfolio";

const GOOGLE_PORTFOLIO_FORM_URL =
  "https://formspree.io/f/mzebpvbv";

export default function PortfolioAccessModal({
  isOpen,
  onClose,
}: PortfolioAccessModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});
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

      // Focus first input on open immediately
      const focusTimer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 40);

      // Escape key listener & Focus Trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
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
      setFieldErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleClose = () => {
    onClose();
    setErrorMessage("");
    setFieldErrors({});
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

    const newFieldErrors: { [key: string]: boolean } = {};

    if (!cleanName) {
      newFieldErrors.name = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter your full name.");
      firstInputRef.current?.focus();
      return;
    }
    if (!cleanPhone) {
      newFieldErrors.phone = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter your phone number.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      newFieldErrors.email = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // 1. Submit via backend API in background
      fetch("/api/portfolio-access", {
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
      }).catch((err) => {
        console.warn("API route non-blocking note:", err);
      });

      // 2. Client-side fallback to Google Forms
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
      console.warn("Submit process handled:", e);
    }

    // Open Playbook in new tab immediately
    window.open(PLAYBOOK_PORTFOLIO_URL, "_blank", "noopener,noreferrer");

    // Reset form & close modal smoothly
    setIsSubmitting(false);
    setName("");
    setPhone("");
    setEmail("");
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="portfolio-modal-backdrop"
      onClick={handleClose}
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
            onClick={handleClose}
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
          <div className="deftform" data-form-id="69e179a0-4190-4579-b14a-04e020f58e83" data-form-width="100%" data-form-align="center" data-form-auto-height="1"></div>

        <p className="portfolio-modal-privacy-note">
          🔒 Zero spam • Instant access to 250+ top-performing UGC creatives
        </p>
      </div>
    </div>
  );
}
