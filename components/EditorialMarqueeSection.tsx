'use client';

import React, { useState } from 'react';

const services = [
  { 
    text: 'Script Writing', 
    image: { 
      src: '/services/scriptwriting.jpg', 
      width: '155px', 
      height: '115px', 
      rotate: '3deg' 
    } 
  },
  { 
    text: 'Sound Design', 
    image: { 
      src: '/services/sound-design.jpg', 
      width: '160px', 
      height: '115px', 
      rotate: '-2.5deg' 
    } 
  },
  { 
    text: 'Motion Graphics', 
    image: { 
      src: '/services/motion-graphics.jpg', 
      width: '155px', 
      height: '110px', 
      rotate: '2.5deg' 
    } 
  },
  { 
    text: 'VFX', 
    image: { 
      src: '/services/vfx.png', 
      width: '160px', 
      height: '120px', 
      rotate: '-3deg' 
    } 
  },
  { 
    text: 'Filming', 
    image: { 
      src: '/services/filming.jpg', 
      width: '155px', 
      height: '115px', 
      rotate: '3.5deg' 
    } 
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
          <div 
            key={uniqueKey}
            className={`editorial-service-item ${isActive ? 'is-active' : ''}`}
            onMouseEnter={() => setActiveHoverId(uniqueKey)}
            onMouseLeave={() => setActiveHoverId(null)}
            onTouchStart={() => setActiveHoverId(uniqueKey)}
            onTouchEnd={() => setTimeout(() => setActiveHoverId(null), 1200)}
          >
            <span className="editorial-marquee-text">{service.text}</span>
            <img
              src={service.image.src}
              alt={service.text}
              className="editorial-floating-image"
              loading="eager"
              decoding="async"
              style={{
                width: service.image.width,
                height: service.image.height,
                '--image-rotation': service.image.rotate,
              } as React.CSSProperties}
            />
            <span className="editorial-marquee-dot" aria-hidden="true"></span>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="editorial-marquee-section" aria-label="Production Capabilities">
      <div className="editorial-marquee-viewport">
        <div className="editorial-fade-left" aria-hidden="true"></div>
        <div className="editorial-fade-right" aria-hidden="true"></div>
        
        <div className="editorial-marquee-track">
          {renderGroup(1)}
          {renderGroup(2)}
          {renderGroup(3)}
          {renderGroup(4)}
        </div>
      </div>
    </section>
  );
}

