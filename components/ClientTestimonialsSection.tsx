'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

import { ASSETS } from '@/config/assets';

export interface TestimonialVideo {
  id: number;
  name: string;
  person?: string;
  role?: string;
  src: string;
  poster: string;
  fallbackSrc: string;
  metric?: string;
  tag?: string;
}

export const TESTIMONIAL_VIDEOS: readonly TestimonialVideo[] = ASSETS.videos.testimonials;

// Constant auto-scroll speed in pixels per second (calm & legible)
const AUTO_SCROLL_SPEED = 28;

export default function ClientTestimonialsSection() {
  const [activeInstanceKey, setActiveInstanceKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Centralized Pause State Model to eliminate race conditions (starts paused offscreen)
  const pauseReasonsRef = useRef({
    hover: false,
    interaction: false,
    videoPlaying: false,
    offscreen: true,
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
    if (activeInstanceKey === instanceKey) {
      const targetVideo = videoRefs.current.get(instanceKey);
      if (targetVideo) {
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
      }
    } else {
      // Pause any previously playing video
      if (activeInstanceKey !== null) {
        const prevVideo = videoRefs.current.get(activeInstanceKey);
        if (prevVideo && !prevVideo.paused) {
          prevVideo.pause();
        }
      }

      // Activate new video on demand
      setActiveInstanceKey(instanceKey);
      setIsPlaying(true);
      pauseReasonsRef.current.videoPlaying = true;
    }
  }, [activeInstanceKey, scheduleResume]);

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
    const sectionEl = sectionRef.current;
    if (!track) return;

    const stopLoop = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };

    const animate = (currentTime: number) => {
      if (pauseReasonsRef.current.offscreen || pauseReasonsRef.current.tabHidden) {
        rafIdRef.current = null;
        return;
      }

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
        pauseReasonsRef.current.videoPlaying;

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

    const startLoop = () => {
      if (!rafIdRef.current && !pauseReasonsRef.current.offscreen && !pauseReasonsRef.current.tabHidden) {
        lastTimeRef.current = performance.now();
        rafIdRef.current = requestAnimationFrame(animate);
      }
    };

    // Section Visibility Observer: only run RAF and position initialize when section is scrolled into view
    let observer: IntersectionObserver | null = null;
    let initialized = false;
    if (sectionEl && typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              pauseActiveVideo();
              pauseReasonsRef.current.offscreen = true;
              stopLoop();
            } else {
              if (!initialized) {
                initialized = true;
                const singleSetWidth = track.scrollWidth / 3;
                if (singleSetWidth > 0 && track.scrollLeft === 0) {
                  track.scrollLeft = singleSetWidth;
                }
              }
              pauseReasonsRef.current.offscreen = false;
              startLoop();
            }
          });
        },
        { threshold: 0.05, rootMargin: '100px 0px' }
      );
      observer.observe(sectionEl);
    }

    // Page Visibility API: pause when tab is inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseActiveVideo();
        pauseReasonsRef.current.tabHidden = true;
        stopLoop();
      } else {
        pauseReasonsRef.current.tabHidden = false;
        startLoop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopLoop();
      if (observer) observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseActiveVideo]);

  return (
    <section 
      id="testimonials" 
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
                      {/* Branded Case Study Card Backdrop */}
                      <div className="testimonial-brand-backdrop">
                        {video.tag && <span className="testimonial-brand-tag">✦ {video.tag}</span>}
                        <h3 className="testimonial-brand-name">{video.name}</h3>
                        {video.person && <p className="testimonial-brand-person">{video.person} ({video.role})</p>}
                        {video.metric && <div className="testimonial-brand-metric">{video.metric}</div>}
                        <span className="testimonial-brand-hint">✦ Case Study</span>
                      </div>

                      {/* Native lazy-loaded poster image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={video.poster}
                        alt={`${video.name} - ${video.person || 'Testimonial'}`}
                        loading="lazy"
                        decoding="async"
                        className="testimonial-video-el"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          zIndex: 2,
                          display: isThisPlaying ? 'none' : 'block',
                        }}
                      />

                      {isThisPlaying && (
                        <video
                          ref={(el) => {
                            setVideoRef(instanceKey, el);
                            if (el && el.paused) {
                              el.muted = isMuted;
                              const playPromise = el.play();
                              if (playPromise !== undefined) {
                                playPromise.catch(() => {
                                  if (!el.muted) {
                                    el.muted = true;
                                    setIsMuted(true);
                                    el.play().catch(() => {});
                                  }
                                });
                              }
                            }
                          }}
                          playsInline
                          autoPlay
                          muted={isMuted}
                          loop={false}
                          poster={video.poster}
                          onError={() => {
                            console.warn(`[Testimonial] Video playback error at ${video.src}.`);
                            setIsPlaying(false);
                            setActiveInstanceKey(null);
                          }}
                          onEnded={() => handleVideoEnded(instanceKey)}
                          className="testimonial-video-el"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            zIndex: 3,
                          }}
                        >
                          <source src={video.src} type="video/webm" />
                          <source src={video.fallbackSrc} type="video/mp4" />
                        </video>
                      )}

                      {/* Ambient overlay */}
                      <div className={`testimonial-overlay ${isThisPlaying ? 'is-playing' : ''}`}></div>

                      {/* Top Controls Bar */}
                      <div className="testimonial-controls-bar">
                        <div className="testimonial-top-actions">
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


