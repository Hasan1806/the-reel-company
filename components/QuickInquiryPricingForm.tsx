"use client";

import React, { useState } from "react";

const GOOGLE_FORM_ACTION = "https://formspree.io/f/mzebpvbv";
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
          brandName: "Footer CTA Lead",
          role: "Quick Lead",
          source: "Footer CTA Section Form",
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
    <div className="quick-inquiry-box compact">
      {!isSuccess ? (
        <>
          <div className="deftform" data-form-id="69e179a0-4190-4579-b14a-04e020f58e83" data-form-width="100%" data-form-align="center" data-form-auto-height="1"></div>
        </>
      ) : (
        /* In-place Luxury Confirmation State */
        <div className="quick-inquiry-success">
          <div className="quick-success-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 className="quick-success-title">Callback Requested!</h4>
          <p className="quick-success-text">
            We will reach out to your phone/email within 2 hours.
          </p>
          <button
            type="button"
            className="quick-success-reset-btn"
            onClick={() => setIsSuccess(false)}
          >
            Submit Another
          </button>
        </div>
      )}
    </div>
  );
}
