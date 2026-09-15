"use client";

import React, { useEffect, useRef } from "react";

export interface CurvedVideoItem {
  id: string;
  src: string;
  poster: string;
}

export const CURVED_HERO_VIDEOS: CurvedVideoItem[] = [
  { id: "cv-1", src: "/videos/hero-curve/hero-curve-1.mp4", poster: "/videos/hero-curve/hero-curve-1-poster.webp" },
  { id: "cv-2", src: "/videos/hero-curve/hero-curve-2.mp4", poster: "/videos/hero-curve/hero-curve-2-poster.webp" },
  { id: "cv-3", src: "/videos/hero-curve/hero-curve-3.mp4", poster: "/videos/hero-curve/hero-curve-3-poster.webp" },
  { id: "cv-4", src: "/videos/hero-curve/hero-curve-4.mp4", poster: "/videos/hero-curve/hero-curve-4-poster.webp" },
  { id: "cv-5", src: "/videos/hero-curve/hero-curve-5.mp4", poster: "/videos/hero-curve/hero-curve-5-poster.webp" },
  { id: "cv-6", src: "/videos/hero-curve/hero-curve-6.mp4", poster: "/videos/hero-curve/hero-curve-6-poster.webp" },
  { id: "cv-7", src: "/videos/hero-curve/hero-curve-7.mp4", poster: "/videos/hero-curve/hero-curve-7-poster.webp" },
  { id: "cv-8", src: "/videos/hero-curve/hero-curve-8.mp4", poster: "/videos/hero-curve/hero-curve-8-poster.webp" },
  { id: "cv-9", src: "/videos/hero-video.mp4", poster: "/videos/hero-video-poster.webp" },
  { id: "cv-10", src: "/videos/hero-curve/hero-curve-1.mp4", poster: "/videos/hero-curve/hero-curve-1-poster.webp" },
  { id: "cv-11", src: "/videos/hero-curve/hero-curve-2.mp4", poster: "/videos/hero-curve/hero-curve-2-poster.webp" },
  { id: "cv-12", src: "/videos/hero-curve/hero-curve-3.mp4", poster: "/videos/hero-curve/hero-curve-3-poster.webp" },
  { id: "cv-13", src: "/videos/hero-curve/hero-curve-4.mp4", poster: "/videos/hero-curve/hero-curve-4-poster.webp" },
  { id: "cv-14", src: "/videos/hero-curve/hero-curve-5.mp4", poster: "/videos/hero-curve/hero-curve-5-poster.webp" },
  { id: "cv-15", src: "/videos/hero-curve/hero-curve-6.mp4", poster: "/videos/hero-curve/hero-curve-6-poster.webp" },
  { id: "cv-16", src: "/videos/hero-curve/hero-curve-7.mp4", poster: "/videos/hero-curve/hero-curve-7-poster.webp" },
  { id: "cv-17", src: "/videos/hero-curve/hero-curve-8.mp4", poster: "/videos/hero-curve/hero-curve-8-poster.webp" },
  // 5 Newly Added Hero Curve Videos
  { id: "cv-18", src: "/videos/hero-curve/CN2541_watermarked.mp4", poster: "/videos/hero-curve/CN2541_watermarked-poster.webp?v=1" },
  { id: "cv-19", src: "/videos/hero-curve/CN2545_watermarked.mp4", poster: "/videos/hero-curve/CN2545_watermarked-poster.webp?v=1" },
  { id: "cv-20", src: "/videos/hero-curve/CN2694_watermarked.mp4", poster: "/videos/hero-curve/CN2694_watermarked-poster.webp?v=1" },
  { id: "cv-21", src: "/videos/hero-curve/CN2704_watermarked.mp4", poster: "/videos/hero-curve/CN2704_watermarked-poster.webp?v=1" },
  { id: "cv-22", src: "/videos/hero-curve/Sugar_Support_4_watermarked.mp4", poster: "/videos/hero-curve/Sugar_Support_4_watermarked-poster.webp?v=1" },
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
    let deferTimer: ReturnType<typeof setTimeout> | null = null;
    let isVisible = true;
    let lastTime = performance.now();
    let globalProgress = 0;
    let frameCount = 0;

    // Single cycle duration: ~18s (noticeably faster ~1.45x, dynamic, fluid and cinematic)
    const SPEED = 1 / (18 * 1000);
    // Throttle video play/pause decisions to every Nth frame (~12fps for video vs 60fps for transforms)
    const VIDEO_EVAL_INTERVAL = 5;

    // Track geometry parameters (compact, lightweight proportions matching reference)
    let containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
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
      containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
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

    // Render single frame without requesting next frame
    const renderFrame = (progress: number, evaluateVideos: boolean) => {
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
        const p = (progress + i / totalItems) % 1;
        const x = xMin + p * span;

        // Normalized offset from center: -1 (far left) to 0 (center) to +1 (far right)
        const u = (x - wCenter) / visibleHalfWidth;
        const absU = Math.abs(u);
        const clampedU = Math.max(-1.15, Math.min(1.15, u));
        const isCardVisible = absU <= 1.25;

        if (!isCardVisible) {
          if (card.style.visibility !== "hidden") {
            card.style.visibility = "hidden";
            card.style.opacity = "0";
          }
          if (evaluateVideos && isPlayingRef.current[i]) {
            isPlayingRef.current[i] = false;
            const vid = videoRefs.current[i];
            if (vid && !vid.paused) vid.pause();
          }
          continue;
        }

        // Broad U-curve: fast polynomial approximation
        const absClamped = Math.min(1, Math.abs(clampedU));
        const y = curveDepth * (1 - absClamped * absClamped);

        // Center focus factor (1.0 at center, drops to 0.0 at outer wings)
        const centerFactor = Math.max(0, 1 - absClamped * 1.2);

        // Prominent center scale: center card is enlarged and focused
        const scale = isMobile
          ? 0.86 + 0.24 * centerFactor
          : 0.90 + 0.14 * centerFactor;

        // Dynamic curve tangent tilt: left cards tilt CCW, right cards tilt CW, center upright
        const rotation = clampedU * maxRotation;

        // Edge fade attenuation for seamless infinite entry/exit
        let opacity = 1;
        if (p < 0.05) {
          opacity = p * 20;
        } else if (p > 0.95) {
          opacity = (1 - p) * 20;
        }

        // Dynamic transform update with GPU hardware acceleration
        card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rotation.toFixed(1)}deg) scale(${scale.toFixed(2)})`;
        card.style.opacity = opacity.toFixed(2);
        if (card.style.visibility !== "visible") {
          card.style.visibility = "visible";
        }
        if (card.style.willChange !== "transform") {
          card.style.willChange = "transform";
        }
        const targetZ = Math.floor(10 + centerFactor * 30);
        if (card.dataset.z !== String(targetZ)) {
          card.dataset.z = String(targetZ);
          card.style.zIndex = String(targetZ);
        }

        // Smart video decode throttling & progressive attachment (evaluated every Nth frame)
        if (evaluateVideos) {
          const isCenterFocus = absU <= 0.40 && opacity > 0.3;
          if (isCenterFocus) {
            let vid = videoRefs.current[i];
            if (!vid) {
              const cardInner = card.querySelector<HTMLElement>('.hero-curved-card-inner');
              if (cardInner) {
                vid = document.createElement('video');
                vid.muted = true;
                vid.defaultMuted = true;
                vid.loop = true;
                vid.playsInline = true;
                vid.setAttribute('playsinline', '');
                vid.setAttribute('webkit-playsinline', '');
                vid.disablePictureInPicture = true;
                vid.className = 'hero-curved-video';
                vid.preload = 'auto';
                vid.style.cssText = 'width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 1;';
                vid.src = CURVED_HERO_VIDEOS[i].src;
                cardInner.appendChild(vid);
                videoRefs.current[i] = vid;
              }
            }
            if (vid && !isPlayingRef.current[i]) {
              isPlayingRef.current[i] = true;
              vid.play().catch(() => {});
            }
          } else {
            if (isPlayingRef.current[i]) {
              isPlayingRef.current[i] = false;
              const vid = videoRefs.current[i];
              if (vid && !vid.paused) {
                vid.pause();
              }
            }
          }
        }
      }
    };

    const stopLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };

    const loop = (now: number) => {
      if (!isVisible) {
        animationFrameId = 0;
        return;
      }

      const dt = now - lastTime;
      const minFrameTime = isMobile ? 32 : 16;
      if (dt < minFrameTime) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }
      lastTime = now;

      globalProgress = (globalProgress + dt * SPEED) % 1;
      frameCount++;
      const evaluateVideos = frameCount % VIDEO_EVAL_INTERVAL === 0;

      renderFrame(globalProgress, evaluateVideos);
      animationFrameId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!animationFrameId && isVisible) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    let loopStarted = false;

    const triggerStartLoop = () => {
      if (loopStarted) return;
      loopStarted = true;
      startLoop();
      ['scroll', 'touchstart', 'mousemove', 'click', 'wheel', 'touchmove'].forEach((evt) => {
        window.removeEventListener(evt, triggerStartLoop);
      });
    };

    // IntersectionObserver to pause RAF and video decoders when scrolled offscreen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (loopStarted) {
            startLoop();
            videoRefs.current.forEach((vid, i) => {
              if (vid && isPlayingRef.current[i] && vid.paused) {
                vid.play().catch(() => {});
              }
            });
          }
        } else {
          stopLoop();
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

    // Render initial static frame in next animation frame without starting loop or video decoders
    const initFrameId = requestAnimationFrame(() => {
      renderFrame(0, false);
    });

    // Listen for first interaction to start smooth animation loop
    ['scroll', 'touchstart', 'mousemove', 'click', 'wheel', 'touchmove'].forEach((evt) => {
      window.addEventListener(evt, triggerStartLoop, { once: true, passive: true });
    });

    return () => {
      cancelAnimationFrame(initFrameId);
      ['scroll', 'touchstart', 'mousemove', 'click', 'wheel', 'touchmove'].forEach((evt) => {
        window.removeEventListener(evt, triggerStartLoop);
      });
      stopLoop();
      window.removeEventListener("resize", updateDimensions);
      observer.disconnect();
      videoRefs.current.forEach((v) => {
        if (v) {
          v.pause();
          v.remove();
        }
      });
      videoRefs.current = [];
    };
  }, []);

  return (
    <div className="hero-curved-track-container" ref={containerRef} aria-label="Featured Videos Stream">
      {/* Dark Edge Vignettes / Masks */}
      <div className="hero-curved-mask-left" aria-hidden="true" />
      <div className="hero-curved-mask-right" aria-hidden="true" />

      {/* Featured Video Cards */}
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
            }}
          >
            <div className="hero-curved-card-inner">
              {/* Native lazy-loaded poster for smooth rendering without initial network contention */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.poster}
                alt={`Hero video card ${idx + 1}`}
                loading={idx >= 9 && idx <= 13 ? "eager" : "lazy"}
                fetchPriority={idx === 11 ? "high" : "low"}
                decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
