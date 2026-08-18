'use client';

import React, { useState, useEffect, useRef } from 'react';

// Using high-quality Unsplash creative-studio placeholders since the repo only contained camera product cutouts.
const services = [
  { 
    text: 'Filming', 
    image: { 
      src: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=400&auto=format&fit=crop', 
      width: '110px', height: '110px', 
      top: '50%', left: '40%', 
      rotate: '-4deg' 
    } 
  },
  { text: 'Scriptwriting' },
  { text: 'Sound Design' },
  { 
    text: 'Color Grading', 
    image: { 
      src: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop', 
      width: '145px', height: '115px', 
      top: '60%', left: '60%', 
      rotate: '-2deg' 
    } 
  },
  { text: 'Motion Graphics' },
  { 
    text: 'VFX', 
    image: { 
      src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', 
      width: '125px', height: '95px', 
      top: '30%', left: '55%', 
      rotate: '3deg' 
    } 
  }
];

export default function EditorialMarqueeSection() {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);
  const [activeCenterId, setActiveCenterId] = useState<string | null>(null);
  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const rafRef = useRef<number>();

  // Center detection logic
  useEffect(() => {
    const checkCenter = () => {
      const centerX = window.innerWidth / 2;
      let closestId: string | null = null;
      let minDistance = Infinity;
      const zoneThreshold = 200; // Activation zone width in pixels from center

      Object.entries(itemRefs.current).forEach(([id, el]) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          const itemCenterX = rect.left + rect.width / 2;
          const distance = Math.abs(centerX - itemCenterX);
          
          if (distance < minDistance) {
            minDistance = distance;
            closestId = id;
          }
        }
      });

      if (minDistance < zoneThreshold) {
        setActiveCenterId(closestId);
      } else {
        setActiveCenterId(null);
      }

      rafRef.current = requestAnimationFrame(checkCenter);
    };

    rafRef.current = requestAnimationFrame(checkCenter);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const renderGroup = (groupIndex: number) => (
    <div 
      className="editorial-marquee-group" 
      aria-hidden={groupIndex > 1 ? "true" : undefined}
    >
      {services.map((service, index) => {
        const uniqueKey = `g${groupIndex}-${index}`;
        const isHovered = activeHoverId === uniqueKey;
        const isCentered = activeCenterId === uniqueKey;
        
        // Hover takes precedence. If no item is hovered globally, use center logic.
        const isActive = activeHoverId ? isHovered : isCentered;
        
        return (
          <React.Fragment key={uniqueKey}>
            <div 
              className="editorial-service-item"
              ref={el => { itemRefs.current[uniqueKey] = el; }}
              onMouseEnter={() => setActiveHoverId(uniqueKey)}
              onMouseLeave={() => setActiveHoverId(null)}
              onTouchStart={() => setActiveHoverId(uniqueKey)}
              onTouchEnd={() => setActiveHoverId(null)}
            >
              <span className="editorial-marquee-text">{service.text}</span>
              {service.image && (
                <div 
                  className={`editorial-floating-image-wrapper ${isActive ? 'is-active' : ''}`}
                  style={{
                    width: service.image.width,
                    height: service.image.height,
                    top: service.image.top,
                    left: service.image.left,
                    transform: `translate(-50%, -50%) rotate(${service.image.rotate})`,
                  }}
                >
                  <img
                    src={service.image.src}
                    alt=""
                    className="editorial-floating-image"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <span className="editorial-marquee-dot"></span>
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <section className="editorial-marquee-section" aria-label="Production Capabilities">
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
