'use client';

import React, { useState, useRef, useEffect } from 'react';

type ItemType = 
  | { type: 'text'; value: string }
  | { type: 'dot' }
  | { 
      type: 'video'; 
      id: string;
      src: string; 
      aspectClass: string; 
      rotation: string; 
      translateY: string 
    };

const marqueeItems: ItemType[] = [
  { type: 'text', value: 'FILMING' },
  { type: 'dot' },
  { type: 'text', value: 'SCRIPTWRITING' },
  { 
    type: 'video', 
    id: 'vid-1',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4',
    aspectClass: 'aspect-portrait',
    rotation: '-1.5deg',
    translateY: '-12px'
  },
  { type: 'dot' },
  { type: 'text', value: 'SOUND DESIGN' },
  { type: 'dot' },
  { type: 'text', value: 'COLOR GRADING' },
  { 
    type: 'video', 
    id: 'vid-2',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-using-her-smartphone-while-outside-42387-large.mp4',
    aspectClass: 'aspect-landscape',
    rotation: '1.2deg',
    translateY: '14px'
  },
  { type: 'dot' },
  { type: 'text', value: 'MOTION GRAPHICS' },
  { type: 'dot' },
  { type: 'text', value: 'EDITING' },
  { 
    type: 'video', 
    id: 'vid-3',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-camera-in-a-studio-42370-large.mp4',
    aspectClass: 'aspect-vertical',
    rotation: '-0.8deg',
    translateY: '-8px'
  },
  { type: 'dot' },
  { type: 'text', value: 'UGC' },
  { type: 'dot' },
  { type: 'text', value: 'AD CREATIVES' },
  { 
    type: 'video', 
    id: 'vid-4',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-sports-in-an-urban-environment-40463-large.mp4',
    aspectClass: 'aspect-portrait',
    rotation: '1.5deg',
    translateY: '10px'
  },
  { type: 'dot' },
];

export default function EditorialMarqueeSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleVideoClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeVideoId === id) {
      // Pause
      setActiveVideoId(null);
      if (videoRefs.current[id]) {
        videoRefs.current[id]?.pause();
      }
    } else {
      // Play new video
      if (activeVideoId && videoRefs.current[activeVideoId]) {
        videoRefs.current[activeVideoId]?.pause();
      }
      setActiveVideoId(id);
      if (videoRefs.current[id]) {
        videoRefs.current[id]!.currentTime = 0;
        videoRefs.current[id]?.play().catch(() => {});
      }
    }
  };

  // Close video if clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (activeVideoId) {
        if (videoRefs.current[activeVideoId]) {
          videoRefs.current[activeVideoId]?.pause();
        }
        setActiveVideoId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeVideoId]);

  const isMarqueePaused = activeVideoId !== null || isHovered;

  const renderGroup = (groupIndex: number) => (
    <div 
      className="editorial-marquee-group" 
      aria-hidden={groupIndex > 1 ? "true" : undefined}
      style={{ animationPlayState: isMarqueePaused ? 'paused' : 'running' }}
    >
      {marqueeItems.map((item, index) => {
        const uniqueKey = `g${groupIndex}-${index}`;
        
        if (item.type === 'text') {
          return (
            <span key={uniqueKey} className="editorial-marquee-text">
              {item.value}
            </span>
          );
        }
        
        if (item.type === 'dot') {
          return (
            <span key={uniqueKey} className="editorial-marquee-dot">
              ●
            </span>
          );
        }

        if (item.type === 'video') {
          // For duplicated group, ensure unique IDs for video refs to avoid conflicts if they share state
          const videoId = `${item.id}-${groupIndex}`;
          const isActive = activeVideoId === videoId;

          return (
            <div 
              key={uniqueKey}
              className={`editorial-video-card ${item.aspectClass} ${isActive ? 'is-active' : ''}`}
              style={{
                transform: `rotate(${item.rotation}) translateY(${item.translateY})`,
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={(e) => handleVideoClick(videoId, e)}
            >
              <video
                ref={(el) => { videoRefs.current[videoId] = el; }}
                src={item.src}
                className="editorial-video"
                preload="metadata"
                playsInline
                loop
                muted={!isActive}
              />
              
              {!isActive && (
                <div className="editorial-play-overlay">
                  <div className="editorial-play-btn">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        }
        return null;
      })}
    </div>
  );

  return (
    <section ref={sectionRef} className="editorial-marquee-section" aria-label="Production Capabilities">
      <div className="editorial-intro-label">WHAT WE CREATE</div>
      <div className="editorial-marquee-viewport">
        <div className="editorial-fade-left"></div>
        <div className="editorial-fade-right"></div>
        
        <div className="editorial-marquee-track">
          {renderGroup(1)}
          {renderGroup(2)}
        </div>
      </div>
    </section>
  );
}
