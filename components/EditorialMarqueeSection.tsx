import React from 'react';

type ItemType = 
  | { type: 'text'; value: string }
  | { type: 'dot' }
  | { 
      type: 'image'; 
      src: string; 
      sizeClass: string; 
      rotation: string; 
      translateY: string 
    };

const marqueeItems: ItemType[] = [
  { type: 'text', value: 'Filming' },
  { type: 'dot' },
  { 
    type: 'image', 
    src: '/camera-hero-380.webp',
    sizeClass: 'img-square',
    rotation: '-1.5deg',
    translateY: '-25px'
  },
  { type: 'text', value: 'Scriptwriting' },
  { type: 'dot' },
  { type: 'text', value: 'Sound Design' },
  { type: 'dot' },
  { type: 'text', value: 'Color Grading' },
  { 
    type: 'image', 
    src: '/camera-lens-black-center-hero-480.webp',
    sizeClass: 'img-landscape',
    rotation: '2deg',
    translateY: '20px'
  },
  { type: 'dot' },
  { type: 'text', value: 'Motion Graphics' },
  { type: 'dot' },
  { 
    type: 'image', 
    src: '/lens-eye-bg.webp',
    sizeClass: 'img-portrait',
    rotation: '-2deg',
    translateY: '-15px'
  },
  { type: 'text', value: 'VFX' },
  { type: 'dot' },
];

export default function EditorialMarqueeSection() {
  const renderGroup = (groupIndex: number) => (
    <div 
      className="editorial-marquee-group" 
      aria-hidden={groupIndex > 1 ? "true" : undefined}
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
            <span key={uniqueKey} className="editorial-marquee-dot"></span>
          );
        }

        if (item.type === 'image') {
          return (
            <div 
              key={uniqueKey}
              className={`editorial-image-wrapper ${item.sizeClass}`}
              style={{
                transform: `translateY(${item.translateY}) rotate(${item.rotation})`,
              }}
            >
              <img
                src={item.src}
                alt=""
                className="editorial-image"
                loading="lazy"
              />
            </div>
          );
        }
        return null;
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
