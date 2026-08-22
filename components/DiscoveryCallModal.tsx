"use client";

import React, { useState, useEffect, useRef } from "react";

interface DiscoveryCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
}

const FORM_URL = "https://formrobin.com/f/31zvy0j";

export default function DiscoveryCallModal({
  isOpen,
  onClose,
  triggerRef,
}: DiscoveryCallModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPreloadReady, setIsPreloadReady] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Mount FormRobin iframe on-demand when the modal is opened
  useEffect(() => {
    if (isOpen && !isPreloadReady) {
      setIsPreloadReady(true);
    }
  }, [isOpen, isPreloadReady]);

  // Handle body scroll lock & keyboard accessibility when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Focus close button on modal open for immediate accessibility
      const focusTimer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);

      // Escape key listener & Focus Trap
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          onClose();
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
  }, [isOpen, onClose, triggerRef]);

  // Fallback safety: If iframe doesn't load after 12s, show fallback button
  useEffect(() => {
    if (isLoading) {
      const timeoutTimer = setTimeout(() => {
        if (isLoading) {
          setHasError(true);
          setIsLoading(false);
        }
      }, 12000);
      return () => clearTimeout(timeoutTimer);
    }
  }, [isLoading]);

  const handleOpenExternal = () => {
    window.open(FORM_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`discovery-modal-backdrop ${isOpen ? "open" : "closed"}`}
      style={{
        display: "flex",
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? "visible" : "hidden",
        pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={onClose}
      role="presentation"
      aria-hidden={!isOpen}
    >
      <div
        ref={modalRef}
        className="discovery-modal-card"
        style={{
          transform: isOpen ? "translateY(0) scale(1)" : "translateY(14px) scale(0.98)",
          opacity: isOpen ? 1 : 0,
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Book a Discovery Call"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="discovery-modal-topbar">
          <div className="discovery-topbar-info">
            <span className="discovery-pulse-dot" aria-hidden="true" />
            <span className="discovery-topbar-title">Book a Discovery Call</span>
          </div>

          <div className="discovery-topbar-actions">
            {/* Open in new tab icon button */}
            <button
              type="button"
              className="discovery-action-btn"
              title="Open form in new tab"
              aria-label="Open discovery call form in new tab"
              onClick={handleOpenExternal}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              className="discovery-action-btn discovery-modal-close"
              aria-label="Close discovery call form"
              onClick={onClose}
            >
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
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body / Embedded Content */}
        <div className="discovery-modal-content">
          {/* Subtle loading spinner overlay */}
          {isLoading && !hasError && (
            <div className="discovery-loader-wrap" aria-live="polite">
              <div className="discovery-loader-spinner" />
              <span className="discovery-loader-text">Loading form…</span>
            </div>
          )}

          {/* Fallback Error State if embedding blocked */}
          {hasError ? (
            <div className="discovery-error-state">
              <h3 className="discovery-error-title">Book Your Discovery Call</h3>
              <p className="discovery-error-sub">
                Click below to open our secure booking form directly in a new window.
              </p>
              <button
                type="button"
                className="btn btn-red"
                onClick={handleOpenExternal}
                style={{ padding: "0.85rem 1.8rem", fontSize: "0.95rem" }}
              >
                Open FormRobin Form
              </button>
            </div>
          ) : (
            isPreloadReady && (
              <iframe
                ref={iframeRef}
                src={FORM_URL}
                title="Book a Discovery Call"
                loading="eager"
                className={`discovery-modal-iframe ${!isLoading ? "is-ready" : ""}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
                allow="camera; microphone; autoplay; encrypted-media; fullscreen"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
