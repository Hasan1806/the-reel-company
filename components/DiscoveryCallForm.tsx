"use client";

import React, { useEffect, useRef, useState } from "react";

export default function DiscoveryCallForm() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    let checkInterval: NodeJS.Timeout | null = null;
    let attempts = 0;

    const runInit = () => {
      // Guard: never initialize more than once
      if (initializedRef.current) return true;

      // Guard: if container already contains an iframe, mark ready and abort
      if (containerRef.current && containerRef.current.querySelector("iframe")) {
        initializedRef.current = true;
        setIsLoaded(true);
        return true;
      }

      if (typeof (window as any).initDeftform === "function") {
        try {
          // If container has stale duplicate children, clean them before single init
          if (containerRef.current) {
            const iframes = containerRef.current.querySelectorAll("iframe");
            if (iframes.length > 1) {
              for (let i = 1; i < iframes.length; i++) {
                iframes[i].remove();
              }
            }
          }
          initializedRef.current = true;
          (window as any).initDeftform();
          setIsLoaded(true);
          return true;
        } catch (err) {
          console.warn("Deftform init error:", err);
        }
      }
      return false;
    };

    // 1. Try immediately if embed script was already cached/loaded
    if (runInit()) return;

    // 2. Check existing script tag and listen to its load event
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://cdn.deftform.com/embed.js"]'
    );

    const handleScriptLoad = () => {
      runInit();
    };

    if (!script) {
      script = document.createElement("script");
      script.src = "https://cdn.deftform.com/embed.js";
      script.async = true;
      script.addEventListener("load", handleScriptLoad);
      document.body.appendChild(script);
    } else {
      script.addEventListener("load", handleScriptLoad);
    }

    // 3. Interval check that terminates immediately on success or after 1.5s
    checkInterval = setInterval(() => {
      attempts++;
      if (runInit() || attempts > 30) {
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        setIsLoaded(true);
      }
    }, 50);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (script) script.removeEventListener("load", handleScriptLoad);
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

