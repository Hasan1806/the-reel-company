"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
interface QueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement | HTMLAnchorElement | null>;
}

export default function QueryModal({ isOpen, onClose, triggerRef }: QueryModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [loadCount, setLoadCount] = useState(0);

  const handleClose = useCallback(() => {
    onClose();
    if (triggerRef?.current) {
      triggerRef.current.focus();
    }
  }, [onClose, triggerRef]);

  // Handle body scroll lock & keyboard accessibility
  useEffect(() => {
    if (isOpen) {
      setLoadCount(0); // Reset load count on open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          handleClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleIframeLoad = () => {
    setLoadCount(prev => prev + 1);
  };

  if (!isOpen) return null;

  return (
    <div
      className="discovery-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="query-modal-title"
      onClick={handleBackdropClick}
    >
      <div
        className="discovery-modal-card query-modal-card"
        ref={modalRef}
        style={{
          maxWidth: '680px',
          width: '100%',
          backgroundColor: '#0a0a0a',
          borderRadius: '16px',
          border: '1px solid #333',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 id="query-modal-title" style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600, color: '#fff' }}>
            Raise a Query
          </h3>
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s',
              borderRadius: '50%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#888'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="discovery-modal-body" style={{ padding: '0', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {loadCount > 1 ? (
            <div style={{ padding: '64px 32px', textAlign: 'center', color: '#fff' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(230, 0, 0, 0.1)',
                color: '#E60000',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '1.75rem', marginBottom: '16px', fontWeight: 600 }}>Thank you!</h3>
              <p style={{ fontSize: '1.1rem', color: '#aaa', marginBottom: '24px', lineHeight: 1.6 }}>
                We got the form, a member from our team will reach out to you shortly.
              </p>
              <div style={{ background: '#111', padding: '24px', borderRadius: '12px', border: '1px solid #333' }}>
                <p style={{ margin: '0 0 12px', color: '#ddd' }}>In case of urgency, you can connect with us directly:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                  <a href="tel:+918109214834" style={{ color: '#E60000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    +91 8109214834
                  </a>
                  <a href="mailto:connect@thereelcompany.in" style={{ color: '#E60000', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    connect@thereelcompany.in
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-red"
                onClick={handleClose}
                style={{ marginTop: '32px' }}
              >
                Close Window
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '556px', overflow: 'hidden' }}>
              {/* Optional loading state here */}
              <div className="deftform" data-form-id="69e179a0-4190-4579-b14a-04e020f58e83" data-form-width="100%" data-form-align="center" data-form-auto-height="1"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
