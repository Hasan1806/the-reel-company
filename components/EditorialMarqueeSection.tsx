import React from 'react';

// Using high-quality Unsplash creative-studio placeholders since the repo only contained camera product cutouts.
const services = [
  { 
    text: 'Filming', 
    image: { 
      src: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=400&auto=format&fit=crop', // Cinematic camera setup
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
      src: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=400&auto=format&fit=crop', // Color grading / editing bay
      width: '145px', height: '115px', 
      top: '60%', left: '60%', 
      rotate: '-2deg' 
    } 
  },
  { text: 'Motion Graphics' },
  { 
    text: 'VFX', 
    image: { 
      src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=400&auto=format&fit=crop', // Creative/cyberpunk visual
      width: '125px', height: '95px', 
      top: '30%', left: '55%', 
      rotate: '3deg' 
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
                    transform: `translate(-50%, -50%) rotate(${service.image.rotate})`,
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
