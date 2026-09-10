"use client";

import React, { useEffect, useRef, useState } from "react";

export default function DiscoveryCallForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;
    let attempts = 0;

    const runInit = () => {
      if (typeof (window as any).initDeftform === "function") {
        try {
          (window as any).initDeftform();
          setIsLoaded(true);
          return true;
        } catch (err) {
          console.warn("Deftform init error:", err);
        }
      }
      return false;
    };

    // 1. Try immediately if embed script was already cached/loaded by Next.js
    if (runInit()) return;

    // 2. Check existing script tag and listen to its load event
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://cdn.deftform.com/embed.js"]'
    );

    if (!script) {
      script = document.createElement("script");
      script.src = "https://cdn.deftform.com/embed.js";
      script.async = true;
      script.onload = () => {
        runInit();
      };
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", runInit);
    }

    // 3. Fast high-frequency polling check (every 30ms) to trigger initDeftform the millisecond it evaluates
    checkInterval = setInterval(() => {
      attempts++;
      if (runInit() || attempts > 40) {
        if (checkInterval) clearInterval(checkInterval);
        setIsLoaded(true);
      }
    }, 30);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (script) script.removeEventListener("load", runInit);
    };
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

      {/* Form Body with Smooth Instant Skeleton Fallback */}
      <div style={{ position: "relative", minHeight: "560px", width: "100%" }}>
        {!isLoaded && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.02)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              zIndex: 0,
            }}
          >
            <div style={{ height: "18px", width: "35%", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
            <div style={{ height: "46px", width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }} />
            <div style={{ height: "18px", width: "30%", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
            <div style={{ height: "46px", width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }} />
            <div style={{ height: "18px", width: "45%", background: "rgba(255,255,255,0.06)", borderRadius: "6px" }} />
            <div style={{ height: "46px", width: "100%", background: "rgba(255,255,255,0.04)", borderRadius: "10px" }} />
            <div style={{ height: "46px", width: "100%", background: "rgba(224,32,32,0.2)", borderRadius: "999px", marginTop: "0.75rem" }} />
          </div>
        )}
        <div
          ref={containerRef}
          className="deftform"
          data-form-id="69e179a0-4190-4579-b14a-04e020f58e83"
          data-form-width="100%"
          data-form-align="center"
          data-form-auto-height="1"
          style={{ minHeight: "560px", width: "100%", position: "relative", zIndex: 1 }}
        />
      </div>
    </div>
  );
}

