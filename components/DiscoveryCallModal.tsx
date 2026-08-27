"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  "https://formspree.io/f/mzebpvbv";

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

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setIsSuccess(false);
      setErrorMessage("");
      setFieldErrors({});
    }, 300);
  }, [onClose]);

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
  }, [isOpen, isSuccess, triggerRef, handleClose]);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

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

    try {
      // Submit once via backend API (fast single dispatch & server-logged)
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
          source: "Website Book a Discovery Call Modal",
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok || (data && data.success === false)) {
        throw new Error(data?.message || "Failed to submit request");
      }

      // Verified successful submission: directly close modal and open /thank-you
      setIsSubmitting(false);
      onClose();
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
        aria-label="Book a Discovery Call"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="discovery-modal-header">
          <div className="discovery-modal-badge">
            <span className="discovery-modal-dot" aria-hidden="true" />
            <span>Book a Discovery Call</span>
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
            <div className="deftform" data-form-id="69e179a0-4190-4579-b14a-04e020f58e83" data-form-width="100%" data-form-align="center" data-form-auto-height="1"></div>

            <p className="discovery-modal-privacy-note">
              🔒 Fast turnaround • Zero spam • Direct consultation with The Reel Company
            </p>
          </>
        ) : (
          /* Success Screen */
          <div className="discovery-success-wrap">
            <div className="discovery-success-icon" aria-hidden="true">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="discovery-success-title">Response Submitted</h3>
            <p className="discovery-success-msg">
              Thank you, <strong style={{ color: "#fff" }}>{submittedData.name || "there"}</strong>! We&apos;ve received your request. Redirecting you to the confirmation page...
            </p>
            <button
              type="button"
              className="btn btn-red discovery-success-btn"
              onClick={() => {
                onClose();
                router.push("/thank-you");
              }}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
