"use client";

import React, { useEffect, useRef } from "react";

export interface CurvedVideoItem {
  id: string;
  src: string;
  poster: string;
}

export const CURVED_HERO_VIDEOS: CurvedVideoItem[] = [
  { id: "cv-1", src: "/videos/portfolio/portfolio-1.mp4", poster: "/videos/portfolio/portfolio-1-poster.webp" },
  { id: "cv-2", src: "/videos/portfolio/portfolio-2.mp4", poster: "/videos/portfolio/portfolio-2-poster.webp" },
  { id: "cv-3", src: "/videos/portfolio/portfolio-3.mp4", poster: "/videos/portfolio/portfolio-3-poster.webp" },
  { id: "cv-4", src: "/videos/portfolio/portfolio-4.mp4", poster: "/videos/portfolio/portfolio-4-poster.webp" },
  { id: "cv-5", src: "/videos/portfolio/portfolio-5.mp4", poster: "/videos/portfolio/portfolio-5-poster.webp" },
  { id: "cv-6", src: "/videos/portfolio/portfolio-6.mp4", poster: "/videos/portfolio/portfolio-6-poster.webp" },
  { id: "cv-7", src: "/videos/portfolio/portfolio-7.mp4", poster: "/videos/portfolio/portfolio-7-poster.webp" },
  { id: "cv-8", src: "/videos/portfolio/portfolio-8.mp4", poster: "/videos/portfolio/portfolio-8-poster.webp" },
  { id: "cv-9", src: "/videos/hero-video.mp4", poster: "/videos/hero-video-poster.webp" },
  { id: "cv-10", src: "/videos/portfolio/portfolio-1.mp4", poster: "/videos/portfolio/portfolio-1-poster.webp" },
  { id: "cv-11", src: "/videos/portfolio/portfolio-2.mp4", poster: "/videos/portfolio/portfolio-2-poster.webp" },
  { id: "cv-12", src: "/videos/portfolio/portfolio-3.mp4", poster: "/videos/portfolio/portfolio-3-poster.webp" },
];

export default function HeroCurvedShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;
    let lastTime = performance.now();
    let globalProgress = 0;

    // Single cycle duration: ~28s (lively, active, buttery smooth)
    const SPEED = 1 / (28 * 1000);

    // Track geometry parameters
    let containerWidth = container.clientWidth || window.innerWidth;
    let isMobile = window.innerWidth < 768;
    let isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    let cardWidth = isMobile ? 120 : isTablet ? 140 : 160;
    let curveDepth = isMobile ? 80 : isTablet ? 110 : 140;

    const updateDimensions = () => {
      if (!container) return;
      containerWidth = container.clientWidth || window.innerWidth;
      isMobile = window.innerWidth < 768;
      isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      cardWidth = isMobile ? 120 : isTablet ? 140 : 160;
      curveDepth = isMobile ? 80 : isTablet ? 110 : 140;
    };

    window.addEventListener("resize", updateDimensions, { passive: true });

    // IntersectionObserver to pause RAF when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now();
          // Ensure videos play smoothly
          videoRefs.current.forEach((vid) => {
            if (vid && vid.paused) {
              vid.play().catch(() => {});
            }
          });
        } else {
          // Pause videos when not visible
          videoRefs.current.forEach((vid) => {
            if (vid && !vid.paused) {
              vid.pause();
            }
          });
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Master Animation Loop
    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      if (isVisible) {
        globalProgress = (globalProgress + dt * SPEED) % 1;

        const totalItems = CURVED_HERO_VIDEOS.length;
        const xMin = -cardWidth * 1.8;
        const xMax = containerWidth + cardWidth * 0.8;
        const span = xMax - xMin;
        const wCenter = containerWidth / 2 - cardWidth / 2;
        const uSpan = containerWidth / 2 + cardWidth;

        for (let i = 0; i < totalItems; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;

          // Card's normalized loop progress (0 to 1) moving LEFT -> RIGHT
          const p = (globalProgress + i / totalItems) % 1;
          const x = xMin + p * span;

          // Normalized offset from center: -1 (far left) to 0 (center) to +1 (far right)
          const u = (x - wCenter) / uSpan;
          const clampedU = Math.max(-1, Math.min(1, u));

          // Broad, smooth, rounded U-shaped curve formula (p = 2.6 for broad flat bottom)
          const y = curveDepth * (1 - Math.pow(Math.abs(clampedU), 2.6));

          // Edge fade attenuation for seamless entry/exit
          let opacity = 1;
          if (p < 0.06) {
            opacity = p / 0.06;
          } else if (p > 0.94) {
            opacity = (1 - p) / 0.06;
          }

          // Dynamic transform update (strictly upright, zero rotation)
          card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
          card.style.opacity = opacity.toFixed(3);
          card.style.zIndex = String(Math.floor(10 + (1 - Math.abs(clampedU)) * 20));
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
    };
  }, []);

  return (
    <div className="hero-curved-track-container" ref={containerRef} aria-label="Featured Videos Stream">
      {/* Dark Edge Vignettes / Masks */}
      <div className="hero-curved-mask-left" aria-hidden="true" />
      <div className="hero-curved-mask-right" aria-hidden="true" />

      {/* 12 Video Cards */}
      <div className="hero-curved-stage">
        {CURVED_HERO_VIDEOS.map((item, idx) => (
          <div
            key={item.id}
            ref={(el) => {
              cardRefs.current[idx] = el;
            }}
            className="hero-curved-card"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              willChange: "transform, opacity",
            }}
          >
            <div className="hero-curved-card-inner">
              <video
                ref={(el) => {
                  videoRefs.current[idx] = el;
                }}
                src={item.src}
                poster={item.poster}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                className="hero-curved-video"
                preload="metadata"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
