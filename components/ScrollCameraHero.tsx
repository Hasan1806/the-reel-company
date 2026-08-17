"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

interface ScrollCameraHeroProps {
  children: React.ReactNode;
}

export default function ScrollCameraHero({ children }: ScrollCameraHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cameraWrapRef = useRef<HTMLDivElement>(null);
  const cameraImgRef = useRef<HTMLImageElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const sticky = stickyRef.current;
    const cameraWrap = cameraWrapRef.current;
    const cameraImg = cameraImgRef.current;
    const textOverlay = textOverlayRef.current;

    if (!container || !sticky || !cameraWrap || !cameraImg) return;

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
          gsap.set(cameraWrap, { opacity: 0.35, scale: 1, rotateY: 0 });
          gsap.set(cameraImg, { rotateY: 0 });
          return;
        }

        const maxScale = conditions.isMobile ? 1.35 : 1.9;
        const startYRotation = 65; // Side perspective angle at start
        const endYRotation = 0;   // Rotates turn till the lens faces directly forward

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(
          cameraWrap,
          { scale: 1, opacity: 0.38, rotateY: startYRotation },
          { scale: 1.05, opacity: 0.45, rotateY: startYRotation, duration: 0.15, ease: "none" },
          0
        );

        tl.to(
          cameraWrap,
          {
            rotateY: endYRotation,
            duration: 0.6,
            ease: "power1.inOut",
          },
          0.15
        );

        tl.to(
          cameraWrap,
          {
            scale: maxScale,
            opacity: 0.55,
            duration: 0.65,
            ease: "power2.out",
          },
          0.2
        );

        if (textOverlay) {
          tl.to(
            textOverlay,
            {
              scale: 0.94,
              opacity: 0.85,
              duration: 0.2,
              ease: "power1.out",
            },
            0.7
          );
        }

        tl.to(
          cameraWrap,
          {
            opacity: 0,
            scale: maxScale * 1.08,
            duration: 0.12,
            ease: "power2.in",
          },
          0.88
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
      className="camera-hero-scroll-container"
      style={{
        position: "relative",
        height: "240svh",
        width: "100%",
      }}
    >
      <div
        ref={stickyRef}
        className="camera-hero-sticky-viewport"
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
        <div className="camera-hero-bg-layer" />

        <div
          ref={cameraWrapRef}
          className="camera-hero-3d-wrap"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            perspective: "1200px",
            transformStyle: "preserve-3d",
            willChange: "transform, opacity",
          }}
        >
          <img
            ref={cameraImgRef}
            src="/camera-hero.png"
            alt="Professional Cinema Camera"
            className="camera-hero-img"
            style={{
              maxHeight: "75vh",
              maxWidth: "85vw",
              objectFit: "contain",
              filter:
                "drop-shadow(0 25px 50px rgba(0,0,0,0.85)) drop-shadow(0 0 35px rgba(224,32,32,0.25))",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          />
        </div>

        <div className="camera-hero-vignette-overlay" />

        <div
          ref={textOverlayRef}
          className="camera-hero-text-overlay"
          style={{
            position: "relative",
            zIndex: 3,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            pointerEvents: "auto",
            willChange: "transform, opacity",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
