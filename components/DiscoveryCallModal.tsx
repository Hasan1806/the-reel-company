"use client";

import React, { useEffect, useRef } from "react";

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
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

        {/* Modal Body / Embedded FormRobin Form */}
        <div className="discovery-modal-content">
          <iframe
            src={FORM_URL}
            title="Book a Discovery Call"
            loading="eager"
            className="discovery-modal-iframe is-ready"
            allow="camera; microphone; autoplay; encrypted-media; fullscreen"
          />
        </div>
      </div>
    </div>
  );
}
