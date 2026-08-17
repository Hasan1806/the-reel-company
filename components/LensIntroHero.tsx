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
          gsap.set(introText, { display: "none" });
          gsap.set(tempStatsWrap, { display: "none" });
          gsap.set(mainHeroWrap, { opacity: 1, pointerEvents: "auto" });
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

        // Responsive scroll height allowing full zoom -> temporary stats reveal & hold -> exit -> main hero reveal
        container.style.height = conditions.isMobile ? "180svh" : "210svh";

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: conditions.isMobile ? 0.2 : 0.4,
            invalidateOnRefresh: true,
          },
        });

        // Initial setup
        gsap.set(lensImg, {
          transformOrigin: "50% 50%",
          transform: "translate3d(0, 0, 0) scale(1)",
        });
        gsap.set(mainHeroWrap, { opacity: 1, pointerEvents: "none" });
        gsap.set(tempStatsWrap, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
        gsap.set(tempStatsCard, { y: 30, opacity: 0 });
        gsap.set(tempStatItems, { opacity: 0, y: 12 });

        tl.call(() => {
          lensImg.style.willChange = "transform, opacity";
          introText.style.willChange = "transform, opacity";
          tempStatsCard.style.willChange = "transform, opacity";
        }, undefined, 0);

        // Stage 1 (0% - 65%): Lens zoom, hero intro text fades out. Temporary stats hidden.
        tl.to(
          lensImg,
          {
            scale: dynamicTargetScale,
            duration: 0.65,
            ease: "power2.inOut",
          },
          0
        );

        tl.to(
          introText,
          {
            scale: 0.95,
            opacity: 0,
            duration: 0.35,
            ease: "power1.out",
          },
          0.1
        );

        // Stage 1 (65% - 82%): Lens is in final black center state. Reveal temporary statistics card upward.
        tl.to(
          tempStatsWrap,
          {
            opacity: 1,
            visibility: "visible",
            duration: 0.05,
          },
          0.65
        );

        tl.to(
          tempStatsCard,
          {
            opacity: 1,
            y: 0,
            duration: 0.17,
            ease: "power2.out",
          },
          0.65
        );

        tl.to(
          tempStatItems,
          {
            opacity: 1,
            y: 0,
            stagger: 0.03,
            duration: 0.14,
            ease: "power2.out",
          },
          0.68
        );

        // Stage 1 (82% - 92%): Hold temporary statistics fully visible and readable.

        // Stage 1 (92% - 100%): Temporary statistics completely fade & exit out before main hero appears!
        tl.to(
          tempStatsCard,
          {
            opacity: 0,
            y: -20,
            duration: 0.08,
            ease: "power2.in",
          },
          0.92
        );

        tl.to(
          tempStatsWrap,
          {
            opacity: 0,
            visibility: "hidden",
            duration: 0.01,
          },
          0.99
        );

        // Fade out black base lens layers and readability overlay so Main Hero Section appears smoothly with full brightness
        tl.to(
          blackBg,
          {
            opacity: 0,
            duration: 0.1,
            ease: "power2.out",
          },
          0.92
        );

        tl.to(
          lensLayer,
          {
            opacity: 0,
            duration: 0.1,
            ease: "power2.out",
          },
          0.92
        );

        tl.to(
          readabilityOverlay,
          {
            opacity: 0,
            duration: 0.1,
            ease: "power2.out",
          },
          0.92
        );

        // Release sticky hero & enable main hero pointer events
        tl.call(
          () => {
            mainHeroWrap.style.pointerEvents = "auto";
          },
          undefined,
          0.95
        );

        tl.call(() => {
          lensImg.style.willChange = "auto";
          introText.style.willChange = "auto";
          tempStatsCard.style.willChange = "auto";
        }, undefined, 1.0);
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
        height: "210svh",
        backgroundColor: "#080808",
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
          position: "sticky",
          top: 0,
          height: "100svh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "#080808",
        }}
      >
        {/* Layer 0: Main Hero Section Content */}
        <div
          ref={mainHeroWrapRef}
          className="main-hero-preview-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {children}
        </div>

        {/* Layer 1: Solid Black Base Layer */}
        <div
          ref={blackBgRef}
          className="intro-black-bg"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            backgroundColor: "#080808",
            pointerEvents: "none",
            willChange: "opacity",
          }}
        />

        {/* Layer 2: Full Screen Camera Lens Image */}
        <div
          ref={lensLayerRef}
          className="intro-lens-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            overflow: "hidden",
            willChange: "opacity",
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

        {/* Layer 3: Contrast Scrim Overlay */}
        <div
          ref={readabilityOverlayRef}
          className="intro-readability-overlay"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background:
              "radial-gradient(circle at 50% 50%, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.2) 65%, rgba(8,8,8,0.75) 100%)",
            pointerEvents: "none",
            willChange: "opacity",
          }}
        />

        {/* Layer 4: Initial Vertically Centred Hero Headline & CTA */}
        <div
          ref={introTextRef}
          className="intro-text-cta-layer"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
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
          <div className="hero-badge reveal-fade animated" style={{ marginBottom: "1.25rem" }}>
            ✦ BUILT FOR FAST-GROWING INDIAN BRANDS ✦
          </div>
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
              fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)",
              color: "rgba(240, 237, 232, 0.95)",
              maxWidth: "52ch",
              marginBottom: "2.25rem",
              lineHeight: 1.35,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            High-Converting UGC &amp; Meta Ad Reels for Indian D2C Brands.
          </p>
          <div className="hero-ctas animated">
            <a href="#portfolio" className="btn btn-red" style={{ padding: "0.95rem 2.4rem", fontSize: "0.95rem" }}>
              Explore Studio Work
            </a>
          </div>
        </div>

        {/* Layer 5: Temporary Visual Statistics Card (Appears during 65%-92% of lens zoom, disappears completely at 92-100% before Main Hero) */}
        <div
          ref={tempStatsWrapRef}
          className="temp-transition-stats-wrap"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
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



