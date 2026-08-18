'use client';

import React, { useState, useEffect, useRef } from 'react';

const services = [
  { 
    text: 'Filming', 
    image: { src: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=400&auto=format&fit=crop', width: '130px', height: '90px', rotate: '-4deg' } 
  },
  { 
    text: 'Scriptwriting', 
    image: { src: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=400&auto=format&fit=crop', width: '110px', height: '110px', rotate: '3deg' } 
  },
  { 
    text: 'Sound Design', 
    image: { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400&auto=format&fit=crop', width: '120px', height: '85px', rotate: '-2deg' } 
  },
  { 
    text: 'Color Grading', 
    image: { src: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop', width: '145px', height: '105px', rotate: '2.5deg' } 
  },
  { 
    text: 'Motion Graphics', 
    image: { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop', width: '135px', height: '95px', rotate: '-3deg' } 
  },
  { 
    text: 'VFX', 
    image: { src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', width: '125px', height: '115px', rotate: '2deg' } 
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
      const zoneThreshold = window.innerWidth * 0.15; // 35% to 65% is +/- 15% from center

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
        
        // Priority: Hovered item globally takes priority. 
        // If NO item is hovered, center logic activates the closest item.
        const isActive = activeHoverId ? isHovered : isCentered;
        
        return (
          <React.Fragment key={uniqueKey}>
            <div 
              className={`editorial-service-item ${isActive ? 'is-active' : ''}`}
              ref={el => { itemRefs.current[uniqueKey] = el; }}
              onMouseEnter={() => setActiveHoverId(uniqueKey)}
              onMouseLeave={() => setActiveHoverId(null)}
              onTouchStart={() => setActiveHoverId(uniqueKey)}
              onTouchEnd={() => setTimeout(() => setActiveHoverId(null), 1000)}
            >
              <span className="editorial-marquee-text">{service.text}</span>
              <img
                src={service.image.src}
                alt=""
                className="editorial-floating-image"
                loading="lazy"
                style={{
                  width: service.image.width,
                  height: service.image.height,
                  '--image-rotation': service.image.rotate,
                } as React.CSSProperties}
              />
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
