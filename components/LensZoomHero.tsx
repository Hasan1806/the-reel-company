"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface LensZoomHeroProps {
  children: React.ReactNode;
}

export default function LensZoomHero({ children }: LensZoomHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const lensWrapRef = useRef<HTMLDivElement>(null);
  const lensImgRef = useRef<HTMLImageElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const sticky = stickyRef.current;
    const lensWrap = lensWrapRef.current;
    const lensImg = lensImgRef.current;
    const textOverlay = textOverlayRef.current;

    if (!container || !sticky || !lensWrap || !lensImg || !textOverlay) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const conditions = context.conditions as {
          isDesktop: boolean;
          isMobile: boolean;
          reduceMotion: boolean;
        };

        if (conditions.reduceMotion) {
          gsap.set(lensWrap, { opacity: 0 });
          gsap.set(textOverlay, { opacity: 1 });
          return;
        }

        const maxZoomScale = conditions.isMobile ? 12 : 18;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        // 0% - 75%: Lens zooms dramatically in into aperture center while initial title text fades out
        tl.to(
          lensImg,
          {
            scale: maxZoomScale,
            opacity: 0.95,
            duration: 0.75,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          textOverlay,
          {
            opacity: 0,
            scale: 0.85,
            duration: 0.45,
            ease: "power1.out",
          },
          0
        );

        // 65% - 100%: Lens becomes completely transparent as we enter the camera aperture, revealing original hero content smoothly
        tl.to(
          lensWrap,
          {
            opacity: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0.65
        );
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="lens-zoom-scroll-container"
      style={{
        position: "relative",
        height: "220svh",
        width: "100%",
      }}
    >
      <div
        ref={stickyRef}
        className="lens-zoom-sticky-viewport"
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Layer 1: Lens Zoom Background Layer */}
        <div
          ref={lensWrapRef}
          className="lens-zoom-bg-wrap"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080808",
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        >
          <img
            ref={lensImgRef}
            src="/lens-eye-bg.png"
            alt="Camera Lens Eye"
            style={{
              width: "min(550px, 80vw)",
              height: "min(550px, 80vw)",
              objectFit: "contain",
              transformOrigin: "center center",
              filter: "drop-shadow(0 0 50px rgba(0, 162, 255, 0.4))",
              willChange: "transform, opacity",
            }}
          />

          {/* Intro Overlay Text inside Lens BG */}
          <div
            ref={textOverlayRef}
            style={{
              position: "absolute",
              zIndex: 11,
              textAlign: "center",
              padding: "0 1.5rem",
              pointerEvents: "none",
            }}
          >
            <div
              className="hero-badge reveal-fade animated"
              style={{ marginBottom: "1rem" }}
            >
              UGC &amp; Content Production Studio
            </div>
            <h1
              className="hero-headline"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)", color: "#ffffff" }}
            >
              The Reel Company
            </h1>
            <p
              className="hero-tagline"
              style={{
                fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                color: "rgba(240, 237, 232, 0.85)",
                marginTop: "0.5rem",
              }}
            >
              High-Performance Content at Scale
            </p>
          </div>
        </div>

        {/* Layer 0: Original Hero Section revealed after zooming through lens */}
        <div style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
