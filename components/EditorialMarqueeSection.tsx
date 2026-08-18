'use client';

import React, { useState } from 'react';

const services = [
  { 
    text: 'Filming', 
    image: { src: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?q=80&w=400&auto=format&fit=crop', width: '150px', height: '110px', rotate: '-4deg' } 
  },
  { 
    text: 'Scriptwriting', 
    image: { src: 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?q=80&w=400&auto=format&fit=crop', width: '135px', height: '95px', rotate: '3deg' } 
  },
  { 
    text: 'Sound Design', 
    image: { src: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=400&auto=format&fit=crop', width: '145px', height: '105px', rotate: '-2deg' } 
  },
  { 
    text: 'Color Grading', 
    image: { src: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=400&auto=format&fit=crop', width: '165px', height: '125px', rotate: '2.5deg' } 
  },
  { 
    text: 'Motion Graphics', 
    image: { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop', width: '140px', height: '110px', rotate: '-3deg' } 
  },
  { 
    text: 'VFX', 
    image: { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop', width: '155px', height: '135px', rotate: '2deg' } 
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
                loading="eager"
                style={{
                  width: service.image.width,
                  height: service.image.height,
                  '--image-rotation': service.image.rotate,
                } as React.CSSProperties}
              />
              <span className="editorial-marquee-dot"></span>
            </div>
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
