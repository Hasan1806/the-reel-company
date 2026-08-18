'use client';

import React, { useState } from 'react';

const services = [
  { 
    text: 'Filming', 
    image: { src: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=400&auto=format&fit=crop', width: '150px', height: '110px', rotate: '-4deg' } 
  },
  { 
    text: 'Color Grading', 
    image: { src: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop', width: '165px', height: '125px', rotate: '2.5deg' } 
  },
  { 
    text: 'VFX', 
    image: { src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', width: '145px', height: '135px', rotate: '2deg' } 
  }
];

export default function EditorialMarqueeSection() {
  const [activeHoverId, setActiveHoverId] = useState<string | null>(null);

  const renderGroup = (groupIndex: number) => (
    <div 
      className="editorial-marquee-group" 
      aria-hidden={groupIndex > 1 ? "true" : undefined}
    >
      {services.map((service, index) => {
        const uniqueKey = `g${groupIndex}-${index}`;
        const isActive = activeHoverId === uniqueKey;
        
        return (
          <React.Fragment key={uniqueKey}>
            <div 
              className={`editorial-service-item ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveHoverId(uniqueKey)}
              onMouseLeave={() => setActiveHoverId(null)}
              onTouchStart={() => setActiveHoverId(uniqueKey)}
              onTouchEnd={() => setTimeout(() => setActiveHoverId(null), 1200)}
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
          {renderGroup(3)}
        </div>
      </div>
    </section>
  );
}
