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
  const [activeInstanceKey, setActiveInstanceKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isManualHover, setIsManualHover] = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const pointerDownRef = useRef<{ x: number; y: number } | null>(null);

  // Set or remove video element ref
  const setVideoRef = useCallback((key: string, el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(key, el);
    } else {
      videoRefs.current.delete(key);
    }
  }, []);

  // Pause current active video safely
  const pauseActiveVideo = useCallback(() => {
    if (activeInstanceKey) {
      const vid = videoRefs.current.get(activeInstanceKey);
      if (vid && !vid.paused) {
        vid.pause();
      }
      setIsPlaying(false);
    }
  }, [activeInstanceKey]);

  // Handle Play/Pause toggle for a specific video card instance
  const handleTogglePlay = useCallback((instanceKey: string) => {
    const targetVideo = videoRefs.current.get(instanceKey);
    if (!targetVideo) return;

    if (activeInstanceKey === instanceKey) {
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
      if (activeInstanceKey) {
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
      }).catch((err) => {
        console.warn("[Testimonial Video Play Error]", err);
      });
    }
  }, [activeInstanceKey, isMuted]);

  // Handle Mute/Unmute toggle
  const handleToggleMute = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (activeInstanceKey) {
      const activeVideo = videoRefs.current.get(activeInstanceKey);
      if (activeVideo) {
        activeVideo.muted = nextMuted;
      }
    }
  }, [activeInstanceKey, isMuted]);

  // Handle video ended
  const handleVideoEnded = useCallback((instanceKey: string) => {
    if (activeInstanceKey === instanceKey) {
      setIsPlaying(false);
      setActiveInstanceKey(null);
    }
  }, [activeInstanceKey]);

  // Track tap/click vs swipe/drag to prevent accidental playback during scroll
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCardClick = (instanceKey: string, e: React.MouseEvent) => {
    if (pointerDownRef.current) {
      const dx = Math.abs(e.clientX - pointerDownRef.current.x);
      const dy = Math.abs(e.clientY - pointerDownRef.current.y);
      if (dx > 8 || dy > 8) {
        // Was a drag/scroll, do not trigger play
        return;
      }
    }
    handleTogglePlay(instanceKey);
  };

  // IntersectionObserver to pause video if scrolled away
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
      { threshold: 0.15 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [pauseActiveVideo]);

  // Page Visibility API: pause when switching tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseActiveVideo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pauseActiveVideo]);

  const isSliderPaused = isPlaying || isManualHover;

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

      {/* ════════════════ INFINITE TESTIMONIAL MARQUEE (LEFT → RIGHT) ════════════════ */}
      <div 
        className="testimonials-slider-container"
        onMouseEnter={() => setIsManualHover(true)}
        onMouseLeave={() => setIsManualHover(false)}
      >
        <div className={`testimonials-track track-right ${isSliderPaused ? 'is-paused' : ''}`}>
          {[1, 2].map((groupIndex) => (
            <div 
              key={`testimonial-group-${groupIndex}`} 
              className="marquee-group marquee-scroll-right" 
              aria-hidden={groupIndex > 1 ? "true" : undefined}
            >
              {TESTIMONIAL_VIDEOS.map((video) => {
                const instanceKey = `grp${groupIndex}-vid${video.id}`;
                const isThisActive = activeInstanceKey === instanceKey;
                const isThisPlaying = isThisActive && isPlaying;

                return (
                  <div
                    key={instanceKey}
                    className={`testimonial-card ${isThisActive ? 'is-active' : ''} ${isThisPlaying ? 'is-playing' : ''}`}
                    onPointerDown={handlePointerDown}
                    onClick={(e) => handleCardClick(instanceKey, e)}
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

                      {/* Center Play Button (Shown when not playing) */}
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
                          aria-label={isThisPlaying ? "Pause testimonial" : "Play testimonial"}
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
          ))}
        </div>
      </div>
    </section>
  );
}
