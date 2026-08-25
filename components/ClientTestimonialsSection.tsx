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

export default function ClientTestimonialsSection() {
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  // Mouse drag & touch gesture refs
  const dragStartPos = useRef<{ x: number; y: number; scrollLeft: number } | null>(null);
  const isPointerDragRef = useRef<boolean>(false);
  const hasMovedRef = useRef<boolean>(false);

  // Register card element ref
  const setCardRef = useCallback((id: number, el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  // Register video element ref
  const setVideoRef = useCallback((id: number, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(id, el);
    } else {
      videoRefs.current.delete(id);
    }
  }, []);

  // Pause active video safely
  const pauseActiveVideo = useCallback(() => {
    if (activeVideoId !== null) {
      const vid = videoRefs.current.get(activeVideoId);
      if (vid && !vid.paused) {
        vid.pause();
      }
      setIsPlaying(false);
    }
  }, [activeVideoId]);

  // Update navigation button enabled/disabled states based on scroll position
  const updateScrollButtons = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;
    const tolerance = 4;

    setCanScrollLeft(scrollLeft > tolerance);
    setCanScrollRight(scrollLeft < maxScroll - tolerance);
  }, []);

  // Handle Play/Pause toggle for a specific video card
  const handleTogglePlay = useCallback((id: number) => {
    const targetVideo = videoRefs.current.get(id);
    if (!targetVideo) return;

    if (activeVideoId === id) {
      if (targetVideo.paused) {
        targetVideo.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.warn("[Testimonial Video Play Error]", err);
        });
      } else {
        targetVideo.pause();
        setIsPlaying(false);
      }
    } else {
      // Pause any previously playing video
      if (activeVideoId !== null) {
        const prevVideo = videoRefs.current.get(activeVideoId);
        if (prevVideo && !prevVideo.paused) {
          prevVideo.pause();
        }
      }

      // Activate and play new video
      setActiveVideoId(id);
      targetVideo.muted = isMuted;
      targetVideo.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("[Testimonial Video Play Error]", err);
      });
    }
  }, [activeVideoId, isMuted]);

  // Handle Mute/Unmute toggle
  const handleToggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (activeVideoId !== null) {
      const activeVideo = videoRefs.current.get(activeVideoId);
      if (activeVideo) {
        activeVideo.muted = nextMuted;
      }
    }
  }, [activeVideoId, isMuted]);

  // Handle video ended
  const handleVideoEnded = useCallback((id: number) => {
    if (activeVideoId === id) {
      setIsPlaying(false);
    }
  }, [activeVideoId]);

  // Calculate dynamic card step distance and scroll track
  const handleScroll = useCallback((direction: 'left' | 'right') => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.querySelector<HTMLElement>('.testimonial-card');
    const cardWidth = firstCard ? firstCard.offsetWidth : 260;
    const computedGap = parseFloat(window.getComputedStyle(track).gap) || 24;
    const slideDistance = cardWidth + computedGap;

    track.scrollBy({
      left: direction === 'right' ? slideDistance : -slideDistance,
      behavior: 'smooth'
    });
  }, []);

  // Desktop Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: track.scrollLeft
    };
    isPointerDragRef.current = true;
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerDragRef.current || !dragStartPos.current) return;
    const track = trackRef.current;
    if (!track) return;

    const dx = e.clientX - dragStartPos.current.x;
    if (Math.abs(dx) > 6) {
      hasMovedRef.current = true;
      if (!isDragging) setIsDragging(true);
      track.scrollLeft = dragStartPos.current.scrollLeft - dx;
    }
  };

  const handleMouseUp = () => {
    isPointerDragRef.current = false;
    dragStartPos.current = null;
    if (isDragging) {
      setIsDragging(false);
    }
  };

  // Touch handlers to distinguish swipe vs tap
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      scrollLeft: trackRef.current ? trackRef.current.scrollLeft : 0
    };
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartPos.current) return;
    const touch = e.touches[0];
    const dx = Math.abs(touch.clientX - dragStartPos.current.x);
    const dy = Math.abs(touch.clientY - dragStartPos.current.y);

    if (dx > 8 || dy > 8) {
      hasMovedRef.current = true;
    }
  };

  const handleTouchEnd = () => {
    dragStartPos.current = null;
  };

  // Card click handler — only triggers if user tapped without dragging/swiping
  const handleCardClick = (id: number) => {
    if (hasMovedRef.current) {
      // Swiped or dragged: suppress accidental click
      hasMovedRef.current = false;
      return;
    }
    handleTogglePlay(id);
  };

  // Initialize and track scroll states + ResizeObserver
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateScrollButtons();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollButtons();
          ticking = false;
        });
        ticking = true;
      }
    };

    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScrollButtons, { passive: true });

    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons]);

  // Pause active video if it scrolls out of view (e.g. user swiped away)
  useEffect(() => {
    if (activeVideoId === null) return;

    const activeCardEl = cardRefs.current.get(activeVideoId);
    if (!activeCardEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the card is less than 35% visible, pause playback
        if (!entry.isIntersecting || entry.intersectionRatio < 0.35) {
          pauseActiveVideo();
        }
      },
      {
        root: trackRef.current,
        threshold: [0, 0.35, 0.7, 1.0]
      }
    );

    observer.observe(activeCardEl);
    return () => observer.disconnect();
  }, [activeVideoId, pauseActiveVideo]);

  // Global Section Visibility Observer: pause when section is offscreen
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            pauseActiveVideo();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [pauseActiveVideo]);

  // Page Visibility API: pause when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseActiveVideo();
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

      {/* ════════════════ TESTIMONIAL VIDEO CAROUSEL ════════════════ */}
      <div className="testimonials-slider-container">
        {/* Desktop Previous Button */}
        <button
          type="button"
          className="testimonial-nav-btn testimonial-nav-prev"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          aria-label="Previous testimonial"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Carousel Track */}
        <div 
          ref={trackRef}
          className={`testimonials-track ${isDragging ? 'is-dragging' : ''}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Client testimonial video carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              handleScroll('left');
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              handleScroll('right');
            }
          }}
        >
          {TESTIMONIAL_VIDEOS.map((video) => {
            const isThisActive = activeVideoId === video.id;
            const isThisPlaying = isThisActive && isPlaying;

            return (
              <div
                key={video.id}
                ref={(el) => setCardRef(video.id, el)}
                className={`testimonial-card ${isThisActive ? 'is-active' : ''} ${isThisPlaying ? 'is-playing' : ''}`}
                onClick={() => handleCardClick(video.id)}
                role="button"
                tabIndex={0}
                aria-label={`Testimonial video for ${video.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTogglePlay(video.id);
                  }
                }}
              >
                <div className="testimonial-video-wrap">
                  <video
                    ref={(el) => setVideoRef(video.id, el)}
                    poster={video.poster}
                    preload="none"
                    playsInline
                    muted={isMuted}
                    loop={false}
                    onEnded={() => handleVideoEnded(video.id)}
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
                        handleTogglePlay(video.id);
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
        </div>

        {/* Desktop Next Button */}
        <button
          type="button"
          className="testimonial-nav-btn testimonial-nav-next"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
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

