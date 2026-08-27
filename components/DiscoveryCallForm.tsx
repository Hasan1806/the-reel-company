"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function DiscoveryCallForm() {
  const router = useRouter();

  // Prefetch /thank-you so page transition is instantaneous and smooth
  useEffect(() => {
    router.prefetch("/thank-you");
  }, [router]);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formTopRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

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
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      firstInputRef.current?.focus();
      return;
    }
    if (!cleanPhone) {
      newFieldErrors.phoneNumber = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter your phone number with country code.");
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      newFieldErrors.email = true;
      setFieldErrors(newFieldErrors);
      setErrorMessage("Please enter a valid email address.");
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

    try {
      // Submit once via backend API (server-side forwarding & logging)
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
          source: "Contact Page Form",
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

      // Verified successful submission: navigate directly to /thank-you
      setIsSubmitting(false);
      router.push("/thank-you");
    } catch (e: any) {
      console.warn("Submit process error:", e);
      setIsSubmitting(false);
      setErrorMessage(e?.message || "Something went wrong while submitting. Please try again.");
    }
  };

  return (
    <div ref={formTopRef} className="discovery-standalone-card">
      {/* Top Control Bar */}
      <div className="discovery-modal-header">
        <div className="discovery-modal-badge">
          <span className="discovery-modal-dot" aria-hidden="true" />
          <span>Book a Discovery Call</span>
        </div>
      </div>

      {/* Header & Subtitle */}
      <div className="discovery-modal-info">
        <h1 className="discovery-modal-title">Book a Discovery Call</h1>
        <p className="discovery-modal-sub">
          Let&apos;s discuss how The Reel Company can scale your high-converting UGC &amp; performance video ads.
        </p>
      </div>

      {/* Form Body */}
        <div className="deftform" data-form-id="69e179a0-4190-4579-b14a-04e020f58e83" data-form-width="100%" data-form-align="center" data-form-auto-height="1"></div>
    </div>
  );
}
