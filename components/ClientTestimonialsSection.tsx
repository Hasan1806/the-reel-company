'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface TestimonialVideo {
  id: number;
  name: string;
  src: string;
  poster: string;
  fallbackSrc: string;
}

export const TESTIMONIAL_VIDEOS: TestimonialVideo[] = [
  {
    id: 1,
    name: "Oziva",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588894/oziva.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588894/oziva.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588894/oziva.mp4"
  },
  {
    id: 2,
    name: "Toothsi",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588887/Toothsi.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588887/Toothsi.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588887/Toothsi.mp4"
  },
  {
    id: 3,
    name: "EZO",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588894/ezo.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588894/ezo.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588894/ezo.mp4"
  },
  {
    id: 4,
    name: "Greyt HR",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588895/greyt_hr.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588895/greyt_hr.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588895/greyt_hr.mp4"
  },
  {
    id: 5,
    name: "Tagda Raho",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588890/tagda_raho.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588890/tagda_raho.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588890/tagda_raho.mp4"
  },
  {
    id: 6,
    name: "SAMCO",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588891/SAMCO.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588891/SAMCO.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588891/SAMCO.mp4"
  },
  {
    id: 7,
    name: "Water Science",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588888/water_science.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588888/water_science.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588888/water_science.mp4"
  },
  {
    id: 8,
    name: "Decode Age",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588886/decode_age.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588886/decode_age.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588886/decode_age.mp4"
  },
  {
    id: 9,
    name: "Herb Tantra",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588884/herb_tantra.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588884/herb_tantra.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588884/herb_tantra.mp4"
  },
  {
    id: 10,
    name: "Greensole",
    src: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588883/greensole.webm",
    poster: "https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787588883/greensole.jpg",
    fallbackSrc: "https://res.cloudinary.com/cy9upvoa/video/upload/v1787588883/greensole.mp4"
  }
];

// Constant auto-scroll speed in pixels per second (calm & legible)
const AUTO_SCROLL_SPEED = 28;

export default function ClientTestimonialsSection() {
  const [activeInstanceKey, setActiveInstanceKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Centralized Pause State Model to eliminate race conditions
  const pauseReasonsRef = useRef({
    hover: false,
    interaction: false,
    videoPlaying: false,
    offscreen: false,
    tabHidden: false,
  });

  const rafIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Gesture tracking
  const pointerStartPos = useRef<{ x: number; y: number; scrollLeft: number } | null>(null);
  const isPointerDownRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

  // Set or remove card element ref
  const setCardRef = useCallback((key: string, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(key, el);
    } else {
      cardRefs.current.delete(key);
    }
  }, []);

  // Set or remove video element ref
  const setVideoRef = useCallback((key: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(key, el);
    } else {
      videoRefs.current.delete(key);
    }
  }, []);

  // Pause active video safely
  const pauseActiveVideo = useCallback(() => {
    if (activeInstanceKey !== null) {
      const vid = videoRefs.current.get(activeInstanceKey);
      if (vid && !vid.paused) {
        vid.pause();
      }
      setIsPlaying(false);
      setActiveInstanceKey(null);
      pauseReasonsRef.current.videoPlaying = false;
    }
  }, [activeInstanceKey]);

  // Gracefully schedule auto-scroll resume after user interaction
  const scheduleResume = useCallback((delayMs = 2000) => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    pauseReasonsRef.current.interaction = true;
    setIsInteracting(true);

    resumeTimeoutRef.current = setTimeout(() => {
      pauseReasonsRef.current.interaction = false;
      setIsInteracting(false);
      lastTimeRef.current = performance.now();
    }, delayMs);
  }, []);

  // Handle Play/Pause toggle for a specific video card instance
  const handleTogglePlay = useCallback((instanceKey: string) => {
    const targetVideo = videoRefs.current.get(instanceKey);
    if (!targetVideo) return;

    if (activeInstanceKey === instanceKey) {
      if (targetVideo.paused) {
        targetVideo.play().then(() => {
          setIsPlaying(true);
          pauseReasonsRef.current.videoPlaying = true;
        }).catch((err) => {
          console.warn("[Testimonial Video Play Error]", err);
        });
      } else {
        targetVideo.pause();
        setIsPlaying(false);
        setActiveInstanceKey(null);
        pauseReasonsRef.current.videoPlaying = false;
        scheduleResume(2000);
      }
    } else {
      // Pause any previously playing video
      if (activeInstanceKey !== null) {
        const prevVideo = videoRefs.current.get(activeInstanceKey);
        if (prevVideo && !prevVideo.paused) {
          prevVideo.pause();
        }
      }

      // Activate and play new video
      setActiveInstanceKey(instanceKey);
      targetVideo.muted = isMuted;
      targetVideo.play().then(() => {
        setIsPlaying(true);
        pauseReasonsRef.current.videoPlaying = true;
      }).catch((err) => {
        console.warn("[Testimonial Video Play Error]", err);
      });
    }
  }, [activeInstanceKey, isMuted, scheduleResume]);

  // Handle Mute/Unmute toggle
  const handleToggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (activeInstanceKey !== null) {
      const activeVideo = videoRefs.current.get(activeInstanceKey);
      if (activeVideo) {
        activeVideo.muted = nextMuted;
      }
    }
  }, [activeInstanceKey, isMuted]);

  // Handle video ended naturally
  const handleVideoEnded = useCallback((instanceKey: string) => {
    if (activeInstanceKey === instanceKey) {
      setIsPlaying(false);
      setActiveInstanceKey(null);
      pauseReasonsRef.current.videoPlaying = false;
      scheduleResume(2000);
    }
  }, [activeInstanceKey, scheduleResume]);

  // Desktop Previous / Next smooth step scrolling
  const handleManualNav = useCallback((direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;

    scheduleResume(2200);

    const firstCard = track.querySelector<HTMLElement>('.testimonial-card');
    const cardWidth = firstCard ? firstCard.offsetWidth : 260;
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 24;
    const slideDistance = cardWidth + computedGap;

    track.scrollBy({
      left: direction === 'right' ? slideDistance : -slideDistance,
      behavior: 'smooth'
    });
  }, [scheduleResume]);

  // Mouse Hover handlers on Desktop
  const handleMouseEnter = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    pauseReasonsRef.current.hover = true;
  };

  const handleMouseLeave = () => {
    pauseReasonsRef.current.hover = false;
    scheduleResume(1000);
  };

  // Touch / Pointer gesture handlers for mobile swipe & desktop drag
  const handleTouchStart = (e: React.TouchEvent) => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    pauseReasonsRef.current.interaction = true;
    setIsInteracting(true);

    const touch = e.touches[0];
    pointerStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: trackRef.current ? trackRef.current.scrollLeft : 0
    };
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pointerStartPos.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - pointerStartPos.current.x);
    const dy = Math.abs(touch.clientY - pointerStartPos.current.y);

    if (dx > 8 || dy > 8) {
      hasMovedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    pointerStartPos.current = null;
    scheduleResume(2000);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    pauseReasonsRef.current.interaction = true;
    setIsInteracting(true);

    isPointerDownRef.current = true;
    hasMovedRef.current = false;
    pointerStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: trackRef.current ? trackRef.current.scrollLeft : 0
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerDownRef.current || !pointerStartPos.current || !trackRef.current) return;
    const dx = e.clientX - pointerStartPos.current.x;
    if (Math.abs(dx) > 6) {
      hasMovedRef.current = true;
      trackRef.current.scrollLeft = pointerStartPos.current.scrollLeft - dx;
    }
  };

  const handleMouseUp = () => {
    isPointerDownRef.current = false;
    pointerStartPos.current = null;
    scheduleResume(2000);
  };

  // Card click handler: suppresses click if user was swiping/dragging
  const handleCardClick = (instanceKey: string) => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    handleTogglePlay(instanceKey);
  };

  // ════════════════ LEFT → RIGHT RAF ANIMATION LOOP ════════════════
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Set initial scroll position to middle set on mount
    const initializePosition = () => {
      const singleSetWidth = track.scrollWidth / 3;
      if (singleSetWidth > 0 && track.scrollLeft === 0) {
        track.scrollLeft = singleSetWidth;
      }
    };

    initializePosition();
    const initTimer = setTimeout(initializePosition, 100);

    const animate = (currentTime: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = currentTime;
      }
      const elapsed = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      // Cap delta time to prevent jumping when tab is restored
      const delta = Math.min(elapsed, 0.1);

      const isPaused =
        pauseReasonsRef.current.hover ||
        pauseReasonsRef.current.interaction ||
        pauseReasonsRef.current.videoPlaying ||
        pauseReasonsRef.current.offscreen ||
        pauseReasonsRef.current.tabHidden;

      if (!isPaused && trackRef.current) {
        const trackEl = trackRef.current;
        // Decrement scrollLeft to move cards visually LEFT → RIGHT
        trackEl.scrollLeft -= AUTO_SCROLL_SPEED * delta;

        // Seamless Infinite Loop Wrapping
        const singleSetWidth = trackEl.scrollWidth / 3;
        if (singleSetWidth > 0) {
          if (trackEl.scrollLeft <= 10) {
            trackEl.scrollLeft += singleSetWidth;
          } else if (trackEl.scrollLeft >= singleSetWidth * 2) {
            trackEl.scrollLeft -= singleSetWidth;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      clearTimeout(initTimer);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Pause active video if it scrolls out of view (>65% out of view)
  useEffect(() => {
    if (activeInstanceKey === null) return;

    const activeCardEl = cardRefs.current.get(activeInstanceKey);
    if (!activeCardEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          pauseActiveVideo();
          scheduleResume(2000);
        }
      },
      {
        root: trackRef.current,
        threshold: [0, 0.35, 0.7, 1.0]
      }
    );

    observer.observe(activeCardEl);
    return () => observer.disconnect();
  }, [activeInstanceKey, pauseActiveVideo, scheduleResume]);

  // Section Visibility: pause RAF when section is offscreen to save battery/CPU
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            pauseActiveVideo();
            pauseReasonsRef.current.offscreen = true;
          } else {
            pauseReasonsRef.current.offscreen = false;
            lastTimeRef.current = performance.now();
          }
        });
      },
      { threshold: 0.08 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [pauseActiveVideo]);

  // Page Visibility API: pause when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseActiveVideo();
        pauseReasonsRef.current.tabHidden = true;
      } else {
        pauseReasonsRef.current.tabHidden = false;
        lastTimeRef.current = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pauseActiveVideo]);

  return (
    <section 
      id="client-cta" 
      ref={sectionRef} 
      className="client-cta-section" 
      aria-label="Work With Us"
    >
      <div className="client-cta-ambient-glow" aria-hidden="true"></div>
      <div className="client-cta-mesh" aria-hidden="true"></div>

      <div className="client-cta-inner">
        <h2 className="client-cta-headline">
          <span className="client-cta-headline-line">Happy clients are our</span>
          <span className="client-cta-headline-line">best case study.</span>
        </h2>
        <p className="client-cta-sub">
          Join 250+ leading modern brands that stopped struggling with content and started scaling it.
        </p>
      </div>

      {/* ════════════════ INFINITE TESTIMONIAL VIDEO CAROUSEL (LEFT → RIGHT) ════════════════ */}
      <div 
        className="testimonials-slider-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Desktop Previous Button */}
        <button
          type="button"
          className="testimonial-nav-btn testimonial-nav-prev"
          onClick={() => handleManualNav('left')}
          aria-label="Previous testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Continuous Carousel Track (3-Set Seamless Infinite Loop) */}
        <div 
          ref={trackRef}
          className={`testimonials-track ${isInteracting ? 'is-interacting' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Client testimonial video carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handleManualNav('left');
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleManualNav('right');
            }
          }}
        >
          {[0, 1, 2].map((setIndex) => (
            <React.Fragment key={`testimonial-set-${setIndex}`}>
              {TESTIMONIAL_VIDEOS.map((video) => {
                const instanceKey = `set${setIndex}-vid${video.id}`;
                const isThisActive = activeInstanceKey === instanceKey;
                const isThisPlaying = isThisActive && isPlaying;

                return (
                  <div
                    key={instanceKey}
                    ref={(el) => setCardRef(instanceKey, el)}
                    className={`testimonial-card ${isThisActive ? 'is-active' : ''} ${isThisPlaying ? 'is-playing' : ''}`}
                    onClick={() => handleCardClick(instanceKey)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Testimonial video for ${video.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTogglePlay(instanceKey);
                      }
                    }}
                  >
                    <div className="testimonial-video-wrap">
                      <video
                        ref={(el) => setVideoRef(instanceKey, el)}
                        poster={video.poster}
                        preload="none"
                        playsInline
                        muted={isMuted}
                        loop={false}
                        onEnded={() => handleVideoEnded(instanceKey)}
                        className="testimonial-video-el"
                      >
                        <source src={video.src} type="video/webm" />
                        <source src={video.fallbackSrc} type="video/mp4" />
                      </video>

                      {/* Ambient overlay */}
                      <div className={`testimonial-overlay ${isThisPlaying ? 'is-playing' : ''}`}></div>

                      {/* Center Play Button (Shown when paused / not actively playing) */}
                      {!isThisPlaying && (
                        <div className="testimonial-center-play-overlay" aria-hidden="true">
                          <div className="testimonial-center-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Video Controls Bar (Bottom Left: Play/Pause, Bottom Right: Mute/Unmute) */}
                      <div className="testimonial-controls-bar">
                        <button
                          type="button"
                          className="testimonial-control-btn testimonial-play-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePlay(instanceKey);
                          }}
                          aria-label={isThisPlaying ? `Pause ${video.name} testimonial` : `Play ${video.name} testimonial`}
                        >
                          {isThisPlaying ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: "2px" }}>
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          )}
                        </button>

                        <button
                          type="button"
                          className="testimonial-control-btn testimonial-mute-btn"
                          onClick={(e) => handleToggleMute(e)}
                          aria-label={isMuted ? "Unmute testimonial" : "Mute testimonial"}
                        >
                          {isMuted ? (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
                              <line x1="23" y1="9" x2="17" y2="15"></line>
                              <line x1="17" y1="9" x2="23" y2="15"></line>
                            </svg>
                          ) : (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor"></polygon>
                              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop Next Button */}
        <button
          type="button"
          className="testimonial-nav-btn testimonial-nav-next"
          onClick={() => handleManualNav('right')}
          aria-label="Next testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}


