"use client";

import React, { useState } from "react";

const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSd7n5N3QLp44MfEaSqq34sk3K6hnTLGzMWkoyEeFs_nwgKgTg/formResponse";
const ENTRY_PHONE = "entry.894765100";
const ENTRY_EMAIL = "entry.835878436";

export default function QuickInquiryPricingForm() {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();

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

    try {
      // 1. Submit directly to Google Form in background
      const formData = new URLSearchParams();
      formData.append(ENTRY_PHONE, cleanPhone);
      formData.append(ENTRY_EMAIL, cleanEmail);

      fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }).catch((err) => {
        console.warn("Google Form post note:", err);
      });

      // 2. Also log to our backend API for double reliability
      fetch("/api/discovery-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: "Quick Inquiry Lead",
          phoneNumber: cleanPhone,
          email: cleanEmail,
          brandName: "Transparent Pricing Inquiry",
          role: "Quick Lead",
          source: "Transparent Pricing Section Form",
        }),
      }).catch(() => {});

      // In-place instant smooth success without opening thank-you page
      setIsSuccess(true);
      setIsSubmitting(false);
      setPhone("");
      setEmail("");
    } catch (err: any) {
      console.warn("Quick inquiry error:", err);
      setIsSubmitting(false);
      setErrorMessage("Something went wrong. Please try again or reach out on WhatsApp.");
    }
  };

  return (
    <div className="quick-inquiry-box">
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="quick-inquiry-form" noValidate>
          <div className="quick-inquiry-header">
            <div className="quick-inquiry-badge">
              <span className="quick-inquiry-dot" aria-hidden="true" />
              <span>DIRECT INQUIRY</span>
            </div>
            <h3 className="quick-inquiry-title">Get Started with Video Production</h3>
            <p className="quick-inquiry-sub">Enter your Phone Number &amp; Email to get in touch with our team directly:</p>
          </div>

          {errorMessage && (
            <div className="quick-inquiry-error" role="alert">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="quick-inquiry-fields">
            {/* Phone Number Field */}
            <div className="quick-inquiry-field-group">
              <label htmlFor="quick-phone" className="quick-inquiry-label">
                Phone Number <span className="quick-req">*</span>
              </label>
              <div className="quick-inquiry-input-wrap">
                <svg className="quick-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  id="quick-phone"
                  type="tel"
                  className="quick-inquiry-input"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="quick-inquiry-field-group">
              <label htmlFor="quick-email" className="quick-inquiry-label">
                Email Address <span className="quick-req">*</span>
              </label>
              <div className="quick-inquiry-input-wrap">
                <svg className="quick-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="quick-email"
                  type="email"
                  className="quick-inquiry-input"
                  placeholder="name@yourbrand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-red quick-inquiry-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="discovery-submit-spinner" />
                <span>Submitting Details...</span>
              </>
            ) : (
              <>
                <span>Submit Inquiry</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>
      ) : (
        /* In-place Luxury Confirmation State */
        <div className="quick-inquiry-success">
          <div className="quick-success-icon-wrap">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="quick-success-title">Inquiry Received!</h3>
          <p className="quick-success-text">
            Thank you! We have received your phone number and email. Our team will reach out shortly.
          </p>
          <button
            type="button"
            className="quick-success-reset-btn"
            onClick={() => setIsSuccess(false)}
          >
            Submit Another Inquiry
          </button>
        </div>
      )}
    </div>
  );
}
