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
  // 5 New Appended Videos
  {
    id: "cv-13",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787663476/CN2704_watermarked.mp4",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787663476/CN2704_watermarked.jpg",
  },
  {
    id: "cv-14",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787663464/Sugar_Support_4_watermarked.mp4",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787663464/Sugar_Support_4_watermarked.jpg",
  },
  {
    id: "cv-15",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787663432/CN2694_watermarked.mp4",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787663432/CN2694_watermarked.jpg",
  },
  {
    id: "cv-16",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787663420/CN2541_watermarked.mp4",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787663420/CN2541_watermarked.jpg",
  },
  {
    id: "cv-17",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787663411/CN2545_watermarked.mp4",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787663411/CN2545_watermarked.jpg",
  },
];

export default function HeroCurvedShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isPlayingRef = useRef<boolean[]>(new Array(CURVED_HERO_VIDEOS.length).fill(false));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;
    let lastTime = performance.now();
    let globalProgress = 0;

    // Single cycle duration: ~18s (noticeably faster ~1.45x, dynamic, fluid and cinematic)
    const SPEED = 1 / (18 * 1000);

    // Track geometry parameters (compact, lightweight proportions matching reference)
    let containerWidth = container.clientWidth || window.innerWidth;
    let isMobile = containerWidth < 768;
    let isTablet = containerWidth >= 768 && containerWidth < 1024;

    let cardWidth = isMobile
      ? Math.min(74, Math.max(60, Math.round(containerWidth * 0.18)))
      : isTablet
      ? 76
      : 84;
    let curveDepth = isMobile ? 28 : isTablet ? 45 : 55;
    let cardSpacing = isMobile ? Math.round(cardWidth * 1.06) : isTablet ? 86 : 96;

    const updateDimensions = () => {
      if (!container) return;
      containerWidth = container.clientWidth || window.innerWidth;
      isMobile = containerWidth < 768;
      isTablet = containerWidth >= 768 && containerWidth < 1024;
      cardWidth = isMobile
        ? Math.min(74, Math.max(60, Math.round(containerWidth * 0.18)))
        : isTablet
        ? 76
        : 84;
      curveDepth = isMobile ? 28 : isTablet ? 45 : 55;
      cardSpacing = isMobile ? Math.round(cardWidth * 1.06) : isTablet ? 86 : 96;
    };

    window.addEventListener("resize", updateDimensions, { passive: true });

    // IntersectionObserver to pause RAF and video decoders when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now();
          videoRefs.current.forEach((vid, i) => {
            if (vid && isPlayingRef.current[i] && vid.paused) {
              vid.play().catch(() => {});
            }
          });
        } else {
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
        const span = totalItems * cardSpacing;
        const wCenter = containerWidth / 2 - cardWidth / 2;
        const xMin = wCenter - span / 2;
        const visibleHalfWidth = (containerWidth + cardWidth * 0.8) / 2;
        const maxRotation = isMobile ? 7.5 : 5.0;

        for (let i = 0; i < totalItems; i++) {
          const card = cardRefs.current[i];
          if (!card) continue;

          // Card loop progress (0 to 1) moving continuously LEFT -> RIGHT
          const p = (globalProgress + i / totalItems) % 1;
          const x = xMin + p * span;

          // Normalized offset from center: -1 (far left) to 0 (center) to +1 (far right)
          const u = (x - wCenter) / visibleHalfWidth;
          const clampedU = Math.max(-1.15, Math.min(1.15, u));

          // Broad U-curve: p = 2.4 gives a smooth, organic arc with rounded base
          const y = curveDepth * (1 - Math.pow(Math.min(1, Math.abs(clampedU)), 2.4));

          // Center focus factor (1.0 at center, drops to 0.0 at outer wings)
          const centerFactor = Math.max(0, 1 - Math.pow(Math.min(1, Math.abs(clampedU)), 1.5));

          // Prominent center scale: center card is enlarged and focused
          const scale = isMobile
            ? 0.86 + 0.24 * centerFactor
            : 0.90 + 0.14 * centerFactor;

          // Dynamic curve tangent tilt: left cards tilt CCW, right cards tilt CW, center upright
          const rotation = clampedU * maxRotation;

          // Edge fade attenuation for seamless infinite entry/exit
          let opacity = 1;
          if (p < 0.05) {
            opacity = p / 0.05;
          } else if (p > 0.95) {
            opacity = (1 - p) / 0.05;
          }

          // Subtle brightness focus for the active center card
          const brightness = 0.82 + 0.18 * centerFactor;

          // Dynamic transform update with GPU hardware acceleration
          card.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          card.style.opacity = opacity.toFixed(3);
          const targetZ = Math.floor(10 + centerFactor * 30);
          if (card.dataset.z !== String(targetZ)) {
            card.dataset.z = String(targetZ);
            card.style.zIndex = String(targetZ);
          }

          // Smart video decode throttling & progressive attachment
          const vid = videoRefs.current[i];
          if (vid) {
            const isCardInViewport = Math.abs(u) <= 1.25 && opacity > 0.05;
            if (isCardInViewport) {
              // Lazy attach source when approaching viewport
              const desiredSrc = vid.dataset.src;
              if (desiredSrc && !vid.src) {
                vid.src = desiredSrc;
                vid.load();
              }
              if (!isPlayingRef.current[i]) {
                isPlayingRef.current[i] = true;
                vid.play().catch(() => {});
              }
            } else {
              if (isPlayingRef.current[i]) {
                isPlayingRef.current[i] = false;
                vid.pause();
              }
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Defer start by one frame so initial critical UI paints instantly
    const startRaf = requestAnimationFrame(() => {
      animationFrameId = requestAnimationFrame(tick);
    });

    return () => {
      cancelAnimationFrame(startRaf);
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
                data-src={item.src}
                poster={item.poster}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                className="hero-curved-video"
                preload="none"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
