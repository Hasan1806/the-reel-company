"use client";

import React, { useState, useEffect, useRef } from "react";

export const ESTIMATED_MOQ_OPTIONS = [
  "1–5 videos",
  "6–10 videos",
  "11–25 videos",
  "26–50 videos",
  "51–100 videos",
  "100+ videos",
  "Not sure yet",
];

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
}

interface FormDataState {
  fullName: string;
  companyName: string;
  designation: string;
  email: string;
  contactNumber: string;
  estimatedMOQ: string;
  honeypot: string;
}

interface FormErrors {
  fullName?: string;
  companyName?: string;
  designation?: string;
  email?: string;
  contactNumber?: string;
  estimatedMOQ?: string;
}

export default function DiscoveryCallModal({
  isOpen,
  onClose,
  triggerRef,
}: DiscoveryCallModalProps) {
  const [formData, setFormData] = useState<FormDataState>({
    fullName: "",
    companyName: "",
    designation: "",
    email: "",
    contactNumber: "",
    estimatedMOQ: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus trap & Accessibility
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
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
        clearTimeout(timer);
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
      if (triggerRef && triggerRef.current) {
        triggerRef.current.focus();
      }
    }
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (formData.companyName.trim().length < 2) {
      newErrors.companyName = "Company name must be at least 2 characters.";
    }

    if (formData.designation.trim().length < 2) {
      newErrors.designation = "Designation / Job Title must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid work email address.";
    }

    const phoneDigits = formData.contactNumber.replace(/\D/g, "");
    if (!formData.contactNumber.trim() || phoneDigits.length < 7 || phoneDigits.length > 15) {
      newErrors.contactNumber = "Please enter a valid contact number (7–15 digits).";
    }

    if (!formData.estimatedMOQ || !ESTIMATED_MOQ_OPTIONS.includes(formData.estimatedMOQ)) {
      newErrors.estimatedMOQ = "Please select an estimated requirement.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/discovery-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "Book a Discovery Call CTA",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSuccess(true);
      } else {
        if (data.errors) {
          setErrors(data.errors);
        }
        setServerError(
          data.message || "We couldn’t submit your request right now. Please try again."
        );
      }
    } catch (err) {
      setServerError("We couldn’t submit your request right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSuccess(false);
    setFormData({
      fullName: "",
      companyName: "",
      designation: "",
      email: "",
      contactNumber: "",
      estimatedMOQ: "",
      honeypot: "",
    });
    setErrors({});
    setServerError("");
    onClose();
  };

  return (
    <div
      className="discovery-modal-backdrop"
      onClick={handleResetAndClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="discovery-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discovery-form-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="discovery-modal-close"
          aria-label="Close discovery call form"
          onClick={handleResetAndClose}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isSuccess ? (
          <div className="discovery-success-state">
            <div className="success-icon-badge">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34c759" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="discovery-modal-title" style={{ color: "#ffffff" }}>
              Request Submitted Successfully!
            </h3>
            <p className="discovery-modal-sub" style={{ color: "#a1a1aa", marginBottom: "1.75rem" }}>
              Thank you! Your enquiry has been sent to our team and recorded in our system. We will get back to you shortly.
            </p>
            <button
              type="button"
              className="btn discovery-success-close-btn"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={handleResetAndClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="discovery-modal-header">
              <h2 id="discovery-form-title" className="discovery-modal-title">
                Let’s Create Something That Converts
              </h2>
              <p className="discovery-modal-sub">
                Tell us a little about your brand and content requirements. Our team will get in touch to discuss the next steps.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="discovery-form-body">
              {/* Honeypot field for bot protection */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="discovery-form-grid">
                {/* 1. Full Name */}
                <div className="form-group">
                  <label htmlFor="fullName" className="form-label">
                    Full Name <span className="req-star">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    autoComplete="name"
                    maxLength={80}
                    value={formData.fullName}
                    onChange={handleChange}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    className={`form-input ${errors.fullName ? "invalid" : ""}`}
                  />
                  {errors.fullName && (
                    <span id="fullName-error" className="field-error">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* 2. Company Name */}
                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">
                    Company Name <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    autoComplete="organization"
                    maxLength={100}
                    value={formData.companyName}
                    onChange={handleChange}
                    aria-invalid={!!errors.companyName}
                    aria-describedby={errors.companyName ? "companyName-error" : undefined}
                    className={`form-input ${errors.companyName ? "invalid" : ""}`}
                  />
                  {errors.companyName && (
                    <span id="companyName-error" className="field-error">
                      {errors.companyName}
                    </span>
                  )}
                </div>

                {/* 3. Designation */}
                <div className="form-group">
                  <label htmlFor="designation" className="form-label">
                    Designation / Job Title <span className="req-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="designation"
                    name="designation"
                    required
                    autoComplete="organization-title"
                    maxLength={100}
                    value={formData.designation}
                    onChange={handleChange}
                    aria-invalid={!!errors.designation}
                    aria-describedby={errors.designation ? "designation-error" : undefined}
                    className={`form-input ${errors.designation ? "invalid" : ""}`}
                  />
                  {errors.designation && (
                    <span id="designation-error" className="field-error">
                      {errors.designation}
                    </span>
                  )}
                </div>

                {/* 4. Work Email */}
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Work Email <span className="req-star">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    maxLength={120}
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`form-input ${errors.email ? "invalid" : ""}`}
                  />
                  {errors.email && (
                    <span id="email-error" className="field-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* 5. Contact Number */}
                <div className="form-group">
                  <label htmlFor="contactNumber" className="form-label">
                    Contact Number <span className="req-star">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    maxLength={25}
                    value={formData.contactNumber}
                    onChange={handleChange}
                    aria-invalid={!!errors.contactNumber}
                    aria-describedby={errors.contactNumber ? "contactNumber-error" : undefined}
                    className={`form-input ${errors.contactNumber ? "invalid" : ""}`}
                  />
                  {errors.contactNumber && (
                    <span id="contactNumber-error" className="field-error">
                      {errors.contactNumber}
                    </span>
                  )}
                </div>

                {/* 6. Estimated MOQ */}
                <div className="form-group">
                  <label htmlFor="estimatedMOQ" className="form-label">
                    Estimated MOQ <span className="req-star">*</span>
                  </label>
                  <select
                    id="estimatedMOQ"
                    name="estimatedMOQ"
                    required
                    value={formData.estimatedMOQ}
                    onChange={handleChange}
                    aria-invalid={!!errors.estimatedMOQ}
                    aria-describedby={errors.estimatedMOQ ? "estimatedMOQ-error" : undefined}
                    className={`form-input form-select ${errors.estimatedMOQ ? "invalid" : ""}`}
                  >
                    <option value="" disabled>
                      Select estimated requirement
                    </option>
                    {ESTIMATED_MOQ_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.estimatedMOQ && (
                    <span id="estimatedMOQ-error" className="field-error">
                      {errors.estimatedMOQ}
                    </span>
                  )}
                </div>
              </div>

              {serverError && <div className="server-error-banner">{serverError}</div>}

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-red discovery-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-dot" aria-hidden="true" />
                      Submitting…
                    </>
                  ) : (
                    "Request a Discovery Call"
                  )}
                </button>
                <p className="privacy-note">
                  We’ll only use your details to contact you about your enquiry.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
