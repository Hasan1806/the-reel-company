"use client";

import React, { useState, useEffect, useRef } from "react";

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
}

const VIDEO_COUNT_OPTIONS = [
  { label: "1 to 20", googleValue: "1-20" },
  { label: "20 to 50", googleValue: "20-50" },
  { label: "50 to 100", googleValue: "50-100" },
  { label: "100 to 200", googleValue: "100-200" },
  { label: "200 +", googleValue: "200+" },
];

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfo7zUw86_yoFHA0d8AVUtbGjDfD3yyUq76fz9M0RC1uSyqJQ/formResponse";

export default function DiscoveryCallModal({
  isOpen,
  onClose,
  triggerRef,
}: DiscoveryCallModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedVideos, setSelectedVideos] = useState("1 to 20");
  const [submittedData, setSubmittedData] = useState({
    name: "",
    videoCount: "1 to 20",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
        if (!isSuccess) {
          firstInputRef.current?.focus();
        } else {
          closeButtonRef.current?.focus();
        }
      }, 50);

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
      if (triggerRef && triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  }, [isOpen, isSuccess, triggerRef]);

  const handleClose = () => {
    onClose();
    // Reset success state after fade out
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMessage("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const cleanCompany = companyName.trim();
    const cleanDesig = designation.trim();
    const currentSelectedVideos = selectedVideos;

    if (!cleanName) {
      setErrorMessage("Please enter your name.");
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
    if (!cleanCompany) {
      setErrorMessage("Please enter your company name.");
      return;
    }
    if (!cleanDesig) {
      setErrorMessage("Please enter your designation.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // Cache the exact user selection for the success confirmation UI
    setSubmittedData({
      name: cleanName,
      videoCount: currentSelectedVideos,
    });

    const matchedOption = VIDEO_COUNT_OPTIONS.find(
      (opt) => opt.label === currentSelectedVideos
    );
    const googleVideoValue = matchedOption ? matchedOption.googleValue : "1-20";

    // 1. Submit via backend API (fast & reliable)
    let submittedViaApi = false;
    try {
      const res = await fetch("/api/discovery-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cleanName,
          phone: cleanPhone,
          email: cleanEmail,
          companyName: cleanCompany,
          designation: cleanDesig,
          videoCount: currentSelectedVideos,
          source: "Website Book a Call Modal",
        }),
      });
      if (res.ok) {
        submittedViaApi = true;
      }
    } catch (err) {
      console.warn("API route error, falling back to direct submit:", err);
    }

    // 2. Fallback: If API was unavailable (e.g. static hosting), submit directly to Google Forms
    if (!submittedViaApi) {
      try {
        const googleFormData = new URLSearchParams();
        googleFormData.append("entry.1936983498", cleanName);
        googleFormData.append("entry.203780078", cleanPhone);
        googleFormData.append("entry.979876141", cleanEmail);
        googleFormData.append("entry.897870888", cleanCompany);
        googleFormData.append("entry.1100839857", cleanDesig);
        googleFormData.append("entry.1194319614", googleVideoValue);

        fetch(GOOGLE_FORM_ACTION_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: googleFormData.toString(),
        }).catch(() => {});
      } catch (e) {
        console.warn("Client-side fallback submit error:", e);
      }
    }

    // Immediately switch to success screen
    setIsSubmitting(false);
    setIsSuccess(true);
    setName("");
    setPhone("");
    setEmail("");
    setCompanyName("");
    setDesignation("");
    setSelectedVideos("1 to 20");
  };

  if (!isOpen) return null;

  return (
    <div
      className="discovery-modal-backdrop"
      onClick={handleClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="discovery-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Book a Call"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="discovery-modal-header">
          <div className="discovery-modal-badge">
            <span className="discovery-modal-dot" aria-hidden="true" />
            <span>BOOK A CALL</span>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="discovery-modal-close-btn"
            aria-label="Close modal"
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

        {!isSuccess ? (
          <>
            {/* Header & Subtitle */}
            <div className="discovery-modal-info">
              <h3 className="discovery-modal-title">Book a Call</h3>
              <p className="discovery-modal-sub">
                Fill in your details below and our production team will connect with you to plan your high-performing content.
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="discovery-modal-form" noValidate>
              {errorMessage && (
                <div className="discovery-modal-error" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Row 1: Name & Phone No. */}
              <div className="discovery-form-row">
                <div className="discovery-input-group">
                  <label htmlFor="discovery-name" className="discovery-input-label">
                    Name <span className="req-star">*</span>
                  </label>
                  <div className="discovery-input-wrapper">
                    <svg
                      className="discovery-input-icon"
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
                      id="discovery-name"
                      type="text"
                      className="discovery-modal-input"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="discovery-input-group">
                  <label htmlFor="discovery-phone" className="discovery-input-label">
                    Phone No. <span className="req-star">*</span>
                  </label>
                  <div className="discovery-input-wrapper">
                    <svg
                      className="discovery-input-icon"
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
                      id="discovery-phone"
                      type="tel"
                      className="discovery-modal-input"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      disabled={isSubmitting}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: E-Mail */}
              <div className="discovery-input-group">
                <label htmlFor="discovery-email" className="discovery-input-label">
                  E-Mail <span className="req-star">*</span>
                </label>
                <div className="discovery-input-wrapper">
                  <svg
                    className="discovery-input-icon"
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
                    id="discovery-email"
                    type="email"
                    className="discovery-modal-input"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Row 3: Brands / Company Name & Designation in Company */}
              <div className="discovery-form-row">
                <div className="discovery-input-group">
                  <label htmlFor="discovery-company" className="discovery-input-label">
                    Brands / Company Name <span className="req-star">*</span>
                  </label>
                  <div className="discovery-input-wrapper">
                    <svg
                      className="discovery-input-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <input
                      id="discovery-company"
                      type="text"
                      className="discovery-modal-input"
                      placeholder="e.g. Acme Brands"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="discovery-input-group">
                  <label htmlFor="discovery-designation" className="discovery-input-label">
                    Designation in Company <span className="req-star">*</span>
                  </label>
                  <div className="discovery-input-wrapper">
                    <svg
                      className="discovery-input-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <polyline points="17 11 19 13 23 9" />
                    </svg>
                    <input
                      id="discovery-designation"
                      type="text"
                      className="discovery-modal-input"
                      placeholder="e.g. Founder, Marketing Head"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: No. of Videos (MCQ Selector) */}
              <div className="discovery-mcq-container">
                <label className="discovery-input-label">
                  No. of Videos <span className="req-star">*</span>
                </label>
                <div className="discovery-mcq-grid" role="radiogroup" aria-label="Number of videos required">
                  {VIDEO_COUNT_OPTIONS.map((opt) => {
                    const isSelected = selectedVideos === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`discovery-mcq-pill ${isSelected ? "is-selected" : ""}`}
                        onClick={() => setSelectedVideos(opt.label)}
                        disabled={isSubmitting}
                      >
                        <span className="discovery-mcq-radio-dot">
                          {isSelected && <span className="discovery-mcq-inner-dot" />}
                        </span>
                        <span className="discovery-mcq-text">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-red discovery-modal-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="discovery-submit-spinner" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
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
                  </>
                )}
              </button>
            </form>

            <p className="discovery-modal-privacy-note">
              🔒 Fast turnaround • Zero spam • Direct creator &amp; studio consultation
            </p>
          </>
        ) : (
          /* Success Screen */
          <div className="discovery-success-wrap">
            <div className="discovery-success-icon">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="discovery-success-title">Call Request Received!</h3>
            <p className="discovery-success-msg">
              Thank you, <strong style={{ color: "#fff" }}>{submittedData.name || "there"}</strong>. We&apos;ve received your discovery call request for <span style={{ color: "var(--red)", fontWeight: 700 }}>{submittedData.videoCount} videos</span>. Our team will reach out to you shortly via phone and email.
            </p>
            <button
              type="button"
              className="btn btn-red discovery-success-btn"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
