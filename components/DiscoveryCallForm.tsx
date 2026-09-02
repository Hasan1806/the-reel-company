"use client";

import React, { useEffect, useRef } from "react";

export default function DiscoveryCallForm() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If Deftform embed is already on window, trigger initialization
    if (typeof (window as any).initDeftform === "function") {
      try {
        (window as any).initDeftform();
      } catch (err) {
        console.warn("Deftform init error:", err);
      }
    } else {
      // Dynamically load the embed script if not present
      const existingScript = document.querySelector(
        'script[src="https://cdn.deftform.com/embed.js"]'
      );
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "https://cdn.deftform.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, []);

  return (
    <div className="discovery-standalone-card">
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
      <div
        ref={containerRef}
        className="deftform"
        data-form-id="69e179a0-4190-4579-b14a-04e020f58e83"
        data-form-width="100%"
        data-form-align="center"
        data-form-auto-height="1"
        style={{ minHeight: "560px", width: "100%" }}
      />
    </div>
  );
}
