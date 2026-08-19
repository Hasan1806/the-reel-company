"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { StatsCard } from "./StatsCard";

interface LensIntroHeroProps {
  children: React.ReactNode;
}

export default function LensIntroHero({ children }: LensIntroHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const blackBgRef = useRef<HTMLDivElement>(null);
  const lensLayerRef = useRef<HTMLDivElement>(null);
  const lensImgRef = useRef<HTMLImageElement>(null);
  const introTextRef = useRef<HTMLDivElement>(null);
  const readabilityOverlayRef = useRef<HTMLDivElement>(null);
  const tempStatsWrapRef = useRef<HTMLDivElement>(null);
  const tempStatsCardRef = useRef<HTMLDivElement>(null);
  const tempStatItemsRef = useRef<HTMLDivElement[]>([]);
  const mainHeroWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const sticky = stickyRef.current;
    const blackBg = blackBgRef.current;
    const lensLayer = lensLayerRef.current;
    const lensImg = lensImgRef.current;
    const introText = introTextRef.current;
    const readabilityOverlay = readabilityOverlayRef.current;
    const tempStatsWrap = tempStatsWrapRef.current;
    const tempStatsCard = tempStatsCardRef.current;
    const tempStatItems = tempStatItemsRef.current.filter(Boolean);
    const mainHeroWrap = mainHeroWrapRef.current;

    if (
      !container ||
      !sticky ||
      !blackBg ||
      !lensLayer ||
      !lensImg ||
      !introText ||
      !readabilityOverlay ||
      !tempStatsWrap ||
      !tempStatsCard ||
      !mainHeroWrap
    ) {
      return;
    }

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
          gsap.set(blackBg, { display: "none" });
          gsap.set(lensLayer, { display: "none" });
          gsap.set(readabilityOverlay, { display: "none" });
          gsap.set(introText, { display: "none" });
          gsap.set(tempStatsWrap, { display: "none" });
          gsap.set(mainHeroWrap, { opacity: 1, y: 0, pointerEvents: "auto" });
          return;
        }

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        const screenDiagonal = Math.hypot(vw, vh);
        const initialVisualDimension = Math.max(vw, vh);
        const blackCenterInitialDiameter = initialVisualDimension * 0.33;

        const dynamicTargetScale = Math.min(
          conditions.isMobile ? 5.5 : 8.5,
          Math.max(2.5, Math.ceil((screenDiagonal / blackCenterInitialDiameter) * 1.08))
        );

        // One unified master timeline for the whole hero transition
        // Controlled scroll distance of ~100% - 120% (1 natural smooth scroll gesture)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: conditions.isMobile ? "+=100%" : "+=120%",
            scrub: conditions.isMobile ? 0.3 : 0.45,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Initial setup
        gsap.set(lensImg, {
          transformOrigin: "50% 50%",
          transform: "translate3d(0, 0, 0) scale(1)",
        });
        gsap.set(introText, { opacity: 1, y: 0, pointerEvents: "auto" });
        gsap.set(blackBg, { opacity: 1 });
        gsap.set(lensLayer, { opacity: 1 });
        gsap.set(readabilityOverlay, { opacity: 1 });
        gsap.set(tempStatsWrap, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
        gsap.set(tempStatsCard, { y: 35, opacity: 0 });
        gsap.set(tempStatItems, { opacity: 0, y: 15 });
        gsap.set(mainHeroWrap, { opacity: 0, y: 20, pointerEvents: "none" });

        // Performance will-change optimization
        tl.call(() => {
          lensImg.style.willChange = "transform";
          introText.style.willChange = "transform, opacity";
          tempStatsCard.style.willChange = "transform, opacity";
          mainHeroWrap.style.willChange = "transform, opacity";
        }, undefined, 0.01);

        // ══════════════════════════════════════════════════════════
        // MASTER SCROLL TIMELINE (0.0 -> 1.0)
        // ══════════════════════════════════════════════════════════

        // 1. (0.00 -> 0.28): Initial Hero Intro text fades out and moves up smoothly
        tl.to(
          introText,
          {
            opacity: 0,
            y: -20,
            duration: 0.28,
            ease: "power1.out",
          },
          0.0
        );

        tl.call(
          () => {
            introText.style.pointerEvents = "none";
          },
          undefined,
          0.28
        );

        // 2. (0.05 -> 0.70): Camera Lens zooms smoothly into the black aperture center
        tl.to(
          lensImg,
          {
            scale: dynamicTargetScale,
            duration: 0.65,
            ease: "power2.inOut",
          },
          0.05
        );

        // 3. (0.35 -> 0.52): Stats Card transitions into the black lens center
        tl.call(
          () => {
            tempStatsWrap.style.visibility = "visible";
          },
          undefined,
          0.35
        );

        tl.to(
          tempStatsWrap,
          {
            opacity: 1,
            duration: 0.12,
            ease: "power1.out",
          },
          0.35
        );

        tl.to(
          tempStatsCard,
          {
            opacity: 1,
            y: 0,
            duration: 0.17,
            ease: "power2.out",
          },
          0.35
        );

        tl.to(
          tempStatItems,
          {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            duration: 0.14,
            ease: "power2.out",
          },
          0.38
        );

        // 4. (0.52 -> 0.63): Stats HOLD comfortably readable in the aperture center

        // 5. (0.63 -> 0.75): Stats EXIT cleanly BEFORE Main Home Section enters
        tl.to(
          tempStatsCard,
          {
            opacity: 0,
            y: -25,
            duration: 0.11,
            ease: "power2.in",
          },
          0.63
        );

        tl.to(
          tempStatsWrap,
          {
            opacity: 0,
            duration: 0.09,
            ease: "power1.in",
          },
          0.66
        );

        tl.call(
          () => {
            tempStatsWrap.style.visibility = "hidden";
            tempStatsWrap.style.pointerEvents = "none";
          },
          undefined,
          0.75
        );

        // 6. (0.75 -> 1.00): Lens/black background fades away as Main Home Section enters
        tl.to(
          [blackBg, lensLayer, readabilityOverlay],
          {
            opacity: 0,
            duration: 0.22,
            ease: "power2.out",
          },
          0.75
        );

        tl.to(
          mainHeroWrap,
          {
            opacity: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0.75
        );

        tl.call(
          () => {
            mainHeroWrap.style.pointerEvents = "auto";
          },
          undefined,
          0.95
        );

        // Release willChange after transition completion
        tl.call(
          () => {
            lensImg.style.willChange = "auto";
            introText.style.willChange = "auto";
            tempStatsCard.style.willChange = "auto";
            mainHeroWrap.style.willChange = "auto";
          },
          undefined,
          0.99
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
      className="intro-lens-scroll-section"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "#080808",
        zIndex: 10,
      }}
    >
      <noscript>
        <style>{`
          .intro-lens-scroll-section { height: auto !important; }
          .intro-lens-sticky-viewport { position: relative !important; height: auto !important; }
          .intro-black-bg, .intro-lens-layer, .intro-readability-overlay, .intro-text-cta-layer, .temp-transition-stats-wrap { display: none !important; }
          .main-hero-preview-layer { position: relative !important; pointer-events: auto !important; opacity: 1 !important; }
        `}</style>
      </noscript>

      <div
        ref={stickyRef}
        className="intro-lens-sticky-viewport"
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#080808",
        }}
      >
        {/* Layer 0: Main Hero Section Content (Z-Index: 1, emerges smoothly at 0.75-1.00) */}
        <div
          ref={mainHeroWrapRef}
          className="main-hero-preview-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          {children}
        </div>

        {/* Layer 1: Solid Black Base Layer (Z-Index: 2) */}
        <div
          ref={blackBgRef}
          className="intro-black-bg"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundColor: "#080808",
            pointerEvents: "none",
          }}
        />

        {/* Layer 2: Full Screen Camera Lens Image (Z-Index: 3) */}
        <div
          ref={lensLayerRef}
          className="intro-lens-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <picture style={{ width: "100%", height: "100%", display: "block" }}>
            <source
              type="image/avif"
              srcSet="/camera-lens-black-center-hero-480.avif 480w, /camera-lens-black-center-hero-768.avif 768w, /camera-lens-black-center-hero-1280.avif 1280w, /camera-lens-black-center-hero-1920.avif 1920w"
              sizes="100vw"
            />
            <source
              type="image/webp"
              srcSet="/camera-lens-black-center-hero-480.webp 480w, /camera-lens-black-center-hero-768.webp 768w, /camera-lens-black-center-hero-1280.webp 1280w, /camera-lens-black-center-hero-1920.webp 1920w"
              sizes="100vw"
            />
            <img
              ref={lensImgRef}
              src="/camera-lens-black-center-hero.jpg"
              alt="Camera Lens Hero"
              width="1920"
              height="1920"
              loading="eager"
              // @ts-ignore
              fetchpriority="high"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 50%",
                transformOrigin: "50% 50%",
                transform: "translate3d(0, 0, 0) scale(1)",
              }}
            />
          </picture>
        </div>

        {/* Layer 3: Contrast Scrim Overlay (Z-Index: 4) */}
        <div
          ref={readabilityOverlayRef}
          className="intro-readability-overlay"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            background:
              "radial-gradient(circle at 50% 50%, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.2) 65%, rgba(8,8,8,0.75) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Layer 4: Initial Vertically Centred Hero Headline & CTA (Z-Index: 5) */}
        <div
          ref={introTextRef}
          className="intro-text-cta-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "0 1.5rem",
            pointerEvents: "auto",
            transformOrigin: "50% 50%",
          }}
        >
          <h1
            className="hero-headline"
            style={{
              fontSize: "clamp(56px, 6vw, 108px)",
              color: "#ffffff",
              marginBottom: "1.25rem",
              lineHeight: 0.95,
              letterSpacing: "-0.055em",
              maxWidth: "1200px",
              fontWeight: 800,
            }}
          >
            The Reel Company
          </h1>
          <p
            className="hero-tagline animated"
            style={{
              fontSize: "clamp(1.2rem, 2.8vw, 1.85rem)",
              color: "rgba(240, 237, 232, 0.95)",
              maxWidth: "52ch",
              marginBottom: "2.25rem",
              lineHeight: 1.35,
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
          >
            High-Performance Content at Scale
          </p>
          <div className="hero-ctas animated">
            <a href="#portfolio" className="btn btn-red" style={{ padding: "0.95rem 2.4rem", fontSize: "0.95rem" }}>
              Explore Studio Work
            </a>
          </div>
        </div>

        {/* Layer 5: Transitional Statistics Card (Z-Index: 6, appears only during 0.35-0.75, cleanly exits before Main Hero) */}
        <div
          ref={tempStatsWrapRef}
          className="temp-transition-stats-wrap"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 1.5rem",
            pointerEvents: "none",
            opacity: 0,
            visibility: "hidden",
          }}
        >
          <StatsCard
            variant="transition"
            cardRef={tempStatsCardRef}
            itemRefs={(el, idx) => {
              if (el) tempStatItemsRef.current[idx] = el;
            }}
          />
        </div>
      </div>
    </div>
  );
}
