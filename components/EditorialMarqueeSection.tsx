import React from 'react';

const services = [
  { 
    text: 'Filming', 
    image: { 
      src: '/camera-hero-380.webp', 
      width: '120px', height: '95px', 
      top: '-40%', left: '45%', 
      rotate: '-4deg' 
    } 
  },
  { text: 'Scriptwriting' },
  { text: 'Sound Design' },
  { 
    text: 'Color Grading', 
    image: { 
      src: '/camera-lens-black-center-hero-480.webp', 
      width: '150px', height: '125px', 
      top: '25%', left: '55%', 
      rotate: '2.5deg' 
    } 
  },
  { text: 'Motion Graphics' },
  { 
    text: 'VFX', 
    image: { 
      src: '/lens-eye-bg.webp', 
      width: '165px', height: '110px', 
      top: '-20%', left: '20%', 
      rotate: '-2deg' 
    } 
  }
];

export default function EditorialMarqueeSection() {
  const renderGroup = (groupIndex: number) => (
    <div 
      className="editorial-marquee-group" 
      aria-hidden={groupIndex > 1 ? "true" : undefined}
    >
      {services.map((service, index) => {
        const uniqueKey = `g${groupIndex}-${index}`;
        
        return (
          <React.Fragment key={uniqueKey}>
            <div className="editorial-service-item">
              <span className="editorial-marquee-text">{service.text}</span>
              {service.image && (
                <img
                  src={service.image.src}
                  alt=""
                  className="editorial-floating-image"
                  loading="lazy"
                  style={{
                    width: service.image.width,
                    height: service.image.height,
                    top: service.image.top,
                    left: service.image.left,
                    transform: `rotate(${service.image.rotate})`,
                  }}
                />
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
