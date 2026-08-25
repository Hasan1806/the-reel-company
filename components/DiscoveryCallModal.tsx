"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
}

// Options for "How are you currently solving your content problem?"
const CONTENT_SOLUTION_OPTIONS = [
  { label: "In-House Team", googleValue: "In House Team" },
  { label: "Freelancers & Agencies", googleValue: "Freelancer/Agencies" },
  { label: "Platforms & Apps", googleValue: "Platform and Apps" },
  { label: "All of Them", googleValue: "All of them" },
];

// Options for "Expected Monthly Content Requirement"
const MONTHLY_REQUIREMENT_OPTIONS = [
  { label: "0 - 10", googleValue: "1-20" },
  { label: "11 - 30", googleValue: "20-50" },
  { label: "31 - 100", googleValue: "50-100" },
  { label: "100+", googleValue: "100+" },
];

// Quick Role Chips for convenience
const COMMON_ROLES = [
  "Founder / CEO",
  "Marketing Head",
  "Brand Manager",
  "Creative Lead",
  "Other",
];

const GOOGLE_FORM_ACTION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfo7zUw86_yoFHA0d8AVUtbGjDfD3yyUq76fz9M0RC1uSyqJQ/formResponse";

export default function DiscoveryCallModal({
  isOpen,
  onClose,
  triggerRef,
}: DiscoveryCallModalProps) {
  const router = useRouter();

  // Form State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [brandName, setBrandName] = useState("");
  const [role, setRole] = useState("");
  const [websiteOrSocial, setWebsiteOrSocial] = useState("");
  const [contentSolution, setContentSolution] = useState("In-House Team");
  const [monthlyRequirement, setMonthlyRequirement] = useState("11 - 30");

  // Field-level error highlights
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: boolean }>({});

  // Submitted Data Cache (for immediate confirmation display)
  const [submittedData, setSubmittedData] = useState({
    name: "",
    brand: "",
    requirement: "11 - 30",
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

      const focusTimer = setTimeout(() => {
        if (!isSuccess) {
          firstInputRef.current?.focus();
        } else {
          closeButtonRef.current?.focus();
        }
      }, 50);

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
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMessage("");
      setFieldErrors({});
    }, 300);
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    const cleanFullName = fullName.trim();
    const cleanPhone = phoneNumber.trim();
    const cleanEmail = email.trim();
    const cleanBrand = brandName.trim();
    const cleanRole = role.trim();
    const cleanWeb = websiteOrSocial.trim();
    const currentSolution = contentSolution;
    const currentRequirement = monthlyRequirement;

    const newFieldErrors: { [key: string]: boolean } = {};

    // Validations
    if (!cleanFullName) {
      newFieldErrors.fullName = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter your full name.");
      modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!cleanPhone) {
      newFieldErrors.phoneNumber = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter your phone number with country code.");
      modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      newFieldErrors.email = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter a valid email address.");
      modalRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (!cleanBrand) {
      newFieldErrors.brandName = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter your brand name.");
      return;
    }
    if (!cleanRole) {
      newFieldErrors.role = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please select or enter your role in the company.");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setErrorMessage("");

    // Cache submission data for instant confirmation screen
    setSubmittedData({
      name: cleanFullName,
      brand: cleanBrand,
      requirement: currentRequirement,
    });

    const googleSolutionValue =
      CONTENT_SOLUTION_OPTIONS.find((opt) => opt.label === currentSolution)
        ?.googleValue || "In House Team";

    const googleRequirementValue =
      MONTHLY_REQUIREMENT_OPTIONS.find((opt) => opt.label === currentRequirement)
        ?.googleValue || "20-50";

    try {
      // 1. Submit via backend API (fast & server-logged)
      const res = await fetch("/api/discovery-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: cleanFullName,
          phoneNumber: cleanPhone,
          email: cleanEmail,
          brandName: cleanBrand,
          role: cleanRole,
          websiteOrSocial: cleanWeb,
          contentSolution: currentSolution,
          monthlyRequirement: currentRequirement,
          source: "Website Book a Call Modal",
        }),
      });

      // 2. Client-side parallel fallback to Google Forms
      const googleFormData = new URLSearchParams();
      googleFormData.append("entry.1936983498", cleanFullName);
      googleFormData.append("entry.203780078", cleanPhone);
      googleFormData.append("entry.979876141", cleanEmail);
      googleFormData.append("entry.897870888", cleanBrand);
      googleFormData.append("entry.1100839857", cleanRole ? `${cleanRole} | ${cleanWeb || "N/A"}` : (cleanWeb || "N/A"));
      googleFormData.append("entry.793890874", cleanWeb || "N/A");
      googleFormData.append("entry.1916628574", googleSolutionValue);
      googleFormData.append("entry.1949108106", googleSolutionValue);
      googleFormData.append("entry.982760340", googleSolutionValue);
      googleFormData.append("entry.1194319614", googleRequirementValue);

      fetch(GOOGLE_FORM_ACTION_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: googleFormData.toString(),
      }).catch(() => {});

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || (data && data.success === false)) {
        throw new Error(data?.message || "Failed to submit request");
      }

      // Verified successful submission:
      setIsSubmitting(false);
      setIsSuccess(true);
      onClose();

      // Reset inputs
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setBrandName("");
      setRole("");
      setWebsiteOrSocial("");
      setContentSolution("In-House Team");
      setMonthlyRequirement("11 - 30");

      // Navigate to dedicated Thank You page
      router.push("/thank-you");
    } catch (e: any) {
      console.warn("Submit process error:", e);
      setIsSubmitting(false);
      setErrorMessage(e?.message || "Something went wrong while submitting. Please try again.");
    }
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
              <h3 className="discovery-modal-title">Book a Discovery Call</h3>
              <p className="discovery-modal-sub">
                Let&apos;s discuss how The Reel Company can scale your high-converting UGC &amp; performance video ads.
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="discovery-modal-form" noValidate>
              {errorMessage && (
                <div className="discovery-modal-error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: "6px" }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Row 1: Full Name & Phone Number */}
              <div className="discovery-form-row">
                <div className="discovery-input-group">
                  <label htmlFor="discovery-fullname" className="discovery-input-label">
                    Full Name <span className="req-star">*</span>
                  </label>
                  <p className="discovery-input-desc">
                    Enter your first and last name as you’d like us to address you.
                  </p>
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
                      id="discovery-fullname"
                      type="text"
                      className={`discovery-modal-input ${fieldErrors.fullName ? "is-error" : ""}`}
                      placeholder="e.g. Sarah Jenkins"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (fieldErrors.fullName) setFieldErrors({ ...fieldErrors, fullName: false });
                      }}
                      required
                      disabled={isSubmitting}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="discovery-input-group">
                  <label htmlFor="discovery-phone" className="discovery-input-label">
                    Phone Number <span className="req-star">*</span>
                  </label>
                  <p className="discovery-input-desc">
                    Include your country code. This helps us contact you quickly.
                  </p>
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
                      className={`discovery-modal-input ${fieldErrors.phoneNumber ? "is-error" : ""}`}
                      placeholder="+91 98765 43210"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        if (fieldErrors.phoneNumber) setFieldErrors({ ...fieldErrors, phoneNumber: false });
                      }}
                      required
                      disabled={isSubmitting}
                      autoComplete="tel"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Email Address */}
              <div className="discovery-input-group">
                <label htmlFor="discovery-email" className="discovery-input-label">
                  Email Address <span className="req-star">*</span>
                </label>
                <p className="discovery-input-desc">
                  We’ll use this to send follow-up details and next steps.
                </p>
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
                    className={`discovery-modal-input ${fieldErrors.email ? "is-error" : ""}`}
                    placeholder="name@yourbrand.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: false });
                    }}
                    required
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Row 3: Brand Name & Role in Company */}
              <div className="discovery-form-row">
                <div className="discovery-input-group">
                  <label htmlFor="discovery-brand" className="discovery-input-label">
                    Brand Name <span className="req-star">*</span>
                  </label>
                  <p className="discovery-input-desc">
                    What brand/company are you enquiring for?
                  </p>
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
                      id="discovery-brand"
                      type="text"
                      className={`discovery-modal-input ${fieldErrors.brandName ? "is-error" : ""}`}
                      placeholder="e.g. Glossier, Nykaa, Boat"
                      value={brandName}
                      onChange={(e) => {
                        setBrandName(e.target.value);
                        if (fieldErrors.brandName) setFieldErrors({ ...fieldErrors, brandName: false });
                      }}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="discovery-input-group">
                  <label htmlFor="discovery-role" className="discovery-input-label">
                    Your Role in the Company <span className="req-star">*</span>
                  </label>
                  <p className="discovery-input-desc">
                    Select the option that best matches your role.
                  </p>
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
                      id="discovery-role"
                      type="text"
                      className={`discovery-modal-input ${fieldErrors.role ? "is-error" : ""}`}
                      placeholder="e.g. Founder, Marketing Head"
                      value={role}
                      onChange={(e) => {
                        setRole(e.target.value);
                        if (fieldErrors.role) setFieldErrors({ ...fieldErrors, role: false });
                      }}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  {/* Quick role selection chips */}
                  <div className="discovery-role-pills">
                    {COMMON_ROLES.map((r) => (
                      <button
                        key={r}
                        type="button"
                        className={`discovery-role-pill ${role === r ? "is-active" : ""}`}
                        onClick={() => {
                          setRole(r);
                          if (fieldErrors.role) setFieldErrors({ ...fieldErrors, role: false });
                        }}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Row 4: Brand Website / Social Media Link */}
              <div className="discovery-input-group">
                <label htmlFor="discovery-website" className="discovery-input-label">
                  Brand Website / Social Media Link
                </label>
                <p className="discovery-input-desc">
                  Share your website and/or social link so we can review your current presence.
                </p>
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
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <input
                    id="discovery-website"
                    type="text"
                    className="discovery-modal-input"
                    placeholder="e.g. https://yourbrand.com or @instagram_handle"
                    value={websiteOrSocial}
                    onChange={(e) => setWebsiteOrSocial(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Row 5: How are you currently solving your content problem? (MCQ) */}
              <div className="discovery-mcq-container">
                <label className="discovery-input-label">
                  How are you currently solving your content problem? <span className="req-star">*</span>
                </label>
                <p className="discovery-input-desc">
                  Choose the option that best describes how your content is handled today.
                </p>
                <div
                  className="discovery-mcq-grid"
                  role="radiogroup"
                  aria-label="How content is currently handled"
                >
                  {CONTENT_SOLUTION_OPTIONS.map((opt) => {
                    const isSelected = contentSolution === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`discovery-mcq-pill ${isSelected ? "is-selected" : ""}`}
                        onClick={() => setContentSolution(opt.label)}
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

              {/* Row 6: Expected Monthly Content Requirement (MCQ) */}
              <div className="discovery-mcq-container">
                <label className="discovery-input-label">
                  Expected Monthly Content Requirement <span className="req-star">*</span>
                </label>
                <p className="discovery-input-desc">
                  How many content pieces do you expect per month (e.g., reels/posts/shorts)?
                </p>
                <div
                  className="discovery-mcq-grid"
                  role="radiogroup"
                  aria-label="Expected monthly content requirement"
                >
                  {MONTHLY_REQUIREMENT_OPTIONS.map((opt) => {
                    const isSelected = monthlyRequirement === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        className={`discovery-mcq-pill ${isSelected ? "is-selected" : ""}`}
                        onClick={() => setMonthlyRequirement(opt.label)}
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

              {/* Bottom Error banner directly above button if any error */}
              {errorMessage && (
                <div className="discovery-modal-error discovery-bottom-error" role="alert">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginRight: "6px" }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-red discovery-modal-submit-btn"
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <span className="discovery-submit-spinner" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
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
              🔒 Fast turnaround • Zero spam • Direct consultation with The Reel Company
            </p>
          </>
        ) : (
          /* Success Screen */
          <div className="discovery-success-wrap">
            <div className="discovery-success-icon">
              <svg
                width="34"
                height="34"
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
            <h3 className="discovery-success-title">Discovery Call Requested!</h3>
            <p className="discovery-success-msg">
              Thank you, <strong style={{ color: "#fff" }}>{submittedData.name || "there"}</strong>! We&apos;ve received your discovery call request for{" "}
              <strong style={{ color: "#fff" }}>{submittedData.brand || "your brand"}</strong> ({submittedData.requirement} content pieces/mo). Our production team will connect with you shortly via phone &amp; email.
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
