"use client";

import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import LensIntroHero from './LensIntroHero';
import { StatsCard } from './StatsCard';
import DiscoveryCallModal from './DiscoveryCallModal';
import EditorialMarqueeSection from './EditorialMarqueeSection';

interface VideoItem {
  src: string;
  label: string;
}

const VIDEOS: VideoItem[] = [
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4', label: 'Activewear Brand' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-man-doing-sports-in-an-urban-environment-40463-large.mp4', label: 'Men\'s Grooming' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-using-her-smartphone-while-outside-42387-large.mp4', label: 'Tech Accessories' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-with-shopping-bags-in-a-city-43227-large.mp4', label: 'Fashion Label' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-overhead-shot-of-a-coffee-cup-being-filled-42813-large.mp4', label: 'Wellness Beverage' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-coffee-shop-with-barista-working-23482-large.mp4', label: 'Skincare Brand' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-a-camera-in-a-studio-42370-large.mp4', label: 'Beauty Cosmetics' },
  { src: 'https://assets.mixkit.co/videos/preview/mixkit-smiling-woman-sitting-on-bed-using-her-smartphone-42234-large.mp4', label: 'Home Goods' },
];

export default function ReelCompanySite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroVideoName, setHeroVideoName] = useState('CN-Outro-Animation.mp4');
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [heroMuted, setHeroMuted] = useState(true);
  const [activeMobileTab, setActiveMobileTab] = useState<'inhouse' | 'freelancers' | 'agencies'>('inhouse');
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  // Discovery Call Modal state
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const lastActiveCtaRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const openDiscoveryModal = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    lastActiveCtaRef.current = e.currentTarget;
    setDiscoveryModalOpen(true);
  };

  const closeDiscoveryModal = () => {
    setDiscoveryModalOpen(false);
  };

  // States to keep track of portfolio video playback icons per video index
  const [portfolioPlayingState, setPortfolioPlayingState] = useState<Record<number, boolean>>({});

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Body scroll lock hook when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  // Scroll listener for header & nav active link
  useEffect(() => {
    const sections = ['hero', 'portfolio', 'services', 'comparison', 'footer-cta'];
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setHeaderScrolled(true);
      } else {
        setHeaderScrolled(false);
      }

      const scrollMid = window.scrollY + window.innerHeight / 3;
      let current = sections[0];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el && scrollMid >= el.offsetTop) {
          current = id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard escape listener for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll for anchor links
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        closeMobileMenu();
      }
    }
  };

  // Back to top button
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hero Video Upload
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/') && heroVideoRef.current) {
      const fileUrl = URL.createObjectURL(file);
      heroVideoRef.current.src = fileUrl;
      heroVideoRef.current.play().catch(() => {});
      setHeroVideoName(file.name);
      setHeroPlaying(true);
    }
  };

  const toggleHeroPlay = () => {
    if (!heroVideoRef.current) return;
    if (heroVideoRef.current.paused) {
      heroVideoRef.current.play().catch(() => {});
      setHeroPlaying(true);
    } else {
      heroVideoRef.current.pause();
      setHeroPlaying(false);
    }
  };

  const toggleHeroMute = () => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.muted = !heroVideoRef.current.muted;
    setHeroMuted(heroVideoRef.current.muted);
  };

  // Hero Reveal Animation & Video Auto-play Guarantee
  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const badge = document.querySelector('.hero-badge');
      const lines = document.querySelectorAll('.line-inner');
      const tagline = document.querySelector('.hero-tagline');
      const sub = document.querySelector('.hero-sub');
      const ctas = document.querySelector('.hero-ctas');
      const videoWrap = document.querySelector('.hero-video-wrap');

      setTimeout(() => { badge?.classList.add('animated'); }, 100);
      setTimeout(() => { lines.forEach(l => l.classList.add('revealed')); }, 300);
      setTimeout(() => { tagline?.classList.add('animated'); }, 500);
      setTimeout(() => { sub?.classList.add('animated'); }, 700);
      setTimeout(() => { ctas?.classList.add('animated'); }, 900);
      setTimeout(() => { videoWrap?.classList.add('animated'); }, 400);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Marquee touch interactions
  useEffect(() => {
    const items = document.querySelectorAll('.client-item');
    const touchStartHandler = function(this: HTMLElement) {
      this.classList.add('active');
    };
    const touchEndHandler = function(this: HTMLElement) {
      setTimeout(() => this.classList.remove('active'), 1200);
    };

    items.forEach(item => {
      item.addEventListener('touchstart', touchStartHandler as EventListener, { passive: true });
      item.addEventListener('touchend', touchEndHandler as EventListener, { passive: true });
    });

    return () => {
      items.forEach(item => {
        item.removeEventListener('touchstart', touchStartHandler as EventListener);
        item.removeEventListener('touchend', touchEndHandler as EventListener);
      });
    };
  }, []);

  // Intersection Observers (Stats, Problems, Capabilities)
  useEffect(() => {
    // Stat Observer
    const strip = document.querySelector('.stats-strip');
    let statObserver: IntersectionObserver | null = null;
    if (strip) {
      statObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.stat-item');
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('revealed'), i * 120);
            });
            statObserver?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      statObserver.observe(strip);
    }

    // Problem Observer
    const problemCards = document.querySelectorAll('.problem-card');
    let problemObserver: IntersectionObserver | null = null;
    if (problemCards.length) {
      problemObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
      problemCards.forEach(card => problemObserver?.observe(card));
    }

    // Capability Observer
    const capCards = document.querySelectorAll('.cap-card');
    let capObserver: IntersectionObserver | null = null;
    if (capCards.length) {
      capObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            capObserver?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      capCards.forEach(card => capObserver?.observe(card));
    }

    return () => {
      statObserver?.disconnect();
      problemObserver?.disconnect();
      capObserver?.disconnect();
    };
  }, []);

  // Capability mouse effect
  useEffect(() => {
    if (window.innerWidth < 1024) return;
    const capCards = document.querySelectorAll<HTMLElement>('.cap-card');
    const moveHandlers: Array<{ card: HTMLElement; handler: (e: MouseEvent) => void }> = [];

    capCards.forEach(card => {
      const handler = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', `${x}%`);
        card.style.setProperty('--my', `${y}%`);
      };
      card.addEventListener('mousemove', handler);
      moveHandlers.push({ card, handler });
    });

    return () => {
      moveHandlers.forEach(({ card, handler }) => {
        card.removeEventListener('mousemove', handler);
      });
    };
  }, []);

  // Video Observer for Portfolio Section (Play/Pause on scroll in and out)
  useEffect(() => {
    const section = document.getElementById('portfolio');
    if (!section) return;

    const loadAndPlayVisible = () => {
      const cards = document.querySelectorAll<HTMLElement>('.video-card');
      cards.forEach(card => {
        const video = card.querySelector<HTMLVideoElement>('video');
        if (!video) return;
        const indexAttr = card.getAttribute('data-index');
        const idx = indexAttr !== null ? parseInt(indexAttr, 10) : -1;
        const rect = card.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;

        // Lazy load src
        if (inView && !video.src && video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }

        if (inView && video.src && video.paused) {
          video.play().catch(() => {});
          if (idx !== -1) {
            setPortfolioPlayingState(prev => ({ ...prev, [idx]: true }));
          }
        } else if (!inView && !video.paused) {
          video.pause();
          if (idx !== -1) {
            setPortfolioPlayingState(prev => ({ ...prev, [idx]: false }));
          }
        }
      });
    };

    let scrollListenerAttached = false;
    const handleScroll = () => {
      loadAndPlayVisible();
    };

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadAndPlayVisible();
          if (!scrollListenerAttached) {
            window.addEventListener('scroll', handleScroll, { passive: true });
            scrollListenerAttached = true;
          }
        } else {
          if (scrollListenerAttached) {
            window.removeEventListener('scroll', handleScroll);
            scrollListenerAttached = false;
          }
          document.querySelectorAll<HTMLVideoElement>('.video-card video').forEach(v => {
            if (!v.paused) v.pause();
          });
          setPortfolioPlayingState({});
        }
      });
    }, { threshold: 0.05 });

    sectionObserver.observe(section);

    return () => {
      if (scrollListenerAttached) {
        window.removeEventListener('scroll', handleScroll);
      }
      sectionObserver.disconnect();
    };
  }, []);

  // Manual toggle for individual portfolio video card
  const togglePortfolioVideo = (idx: number, cardEl: HTMLElement | null) => {
    if (!cardEl) return;
    const video = cardEl.querySelector<HTMLVideoElement>('video');
    if (!video) return;

    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
      video.load();
    }

    if (video.paused) {
      video.play().catch(() => {});
      setPortfolioPlayingState(prev => ({ ...prev, [idx]: true }));
    } else {
      video.pause();
      setPortfolioPlayingState(prev => ({ ...prev, [idx]: false }));
    }
  };

  // GSAP Animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero parallax
      const heroBg = document.getElementById('hero-bg-image');
      if (heroBg) {
        gsap.to(heroBg, {
          y: '20%',
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
          }
        });
      }

      // Production parallax
      const prodBg = document.getElementById('production-bg');
      if (prodBg) {
        gsap.to(prodBg, {
          y: '18%',
          ease: 'none',
          scrollTrigger: {
            trigger: '#production',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        });
      }

      // Production text scroll reveal
      gsap.utils.toArray<HTMLElement>('.production-headline, .production-sub').forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Comparison section reveal
      const table = document.querySelector('.table-wrap');
      if (table) {
        gsap.fromTo(table,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: .8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: table,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Footer CTA reveal
      const footerContent = document.querySelector('.footer-cta-content');
      if (footerContent) {
        gsap.fromTo(footerContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: .9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: footerContent,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Background colour transition for client CTA
      ScrollTrigger.create({
        trigger: '#client-cta',
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => gsap.to('body', { '--body-tint': 1, duration: .6 }),
        onLeave: () => gsap.to('body', { '--body-tint': 0, duration: .6 }),
        onEnterBack: () => gsap.to('body', { '--body-tint': 1, duration: .6 }),
        onLeaveBack: () => gsap.to('body', { '--body-tint': 0, duration: .6 }),
      });

      // Comparison table rows stagger
      const rows = document.querySelectorAll('.comparison-table tbody tr');
      if (rows.length) {
        gsap.fromTo(rows,
          { opacity: 0, x: -12 },
          {
            opacity: 1, x: 0,
            stagger: 0.06,
            duration: .5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: '.comparison-table',
              start: 'top 80%',
              toggleActions: 'play none none none',
            }
          }
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const handleCarouselScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const centerPoint = scrollLeft + container.clientWidth / 2;
    
    const cards = container.children;
    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i] as HTMLElement;
      if (!card) continue;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2 - container.offsetLeft;
      const distance = Math.abs(centerPoint - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    if (activeCarouselIndex !== closestIndex) {
      setActiveCarouselIndex(closestIndex);
    }
  };

  return (
    <>
      {/* ═══════════════════════════════ HEADER ═══════════════════════════════ */}
      <header id="site-header" role="banner" className={headerScrolled ? 'scrolled' : ''}>
        <div className="header-inner">
          <a href="#hero" className="logo" aria-label="The Reel Company Home" onClick={e => handleAnchorClick(e, '#hero')}>
            <span className="logo-mark">TRC</span>
            <span className="logo-text">The Reel Company</span>
          </a>
          <nav id="main-nav" aria-label="Main navigation">
            <a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#hero')}>Home</a>
            <a href="#portfolio" className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#portfolio')}>Portfolio</a>
            <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#services')}>Services</a>
            <a href="#comparison" className={`nav-link ${activeSection === 'comparison' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#comparison')}>Compare</a>
            <a href="#footer-cta" className={`nav-link ${activeSection === 'footer-cta' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#footer-cta')}>Contact</a>
          </nav>
          <a href="#portfolio" className="btn btn-outline header-cta" id="header-cta-btn" onClick={e => handleAnchorClick(e, '#portfolio')}>
            Request Portfolio Access
          </a>
          <button className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`} id="mobile-menu-toggle" aria-label="Open menu" aria-expanded={mobileMenuOpen ? 'true' : 'false'} aria-controls="mobile-nav" onClick={toggleMobileMenu}>
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`mobile-nav ${mobileMenuOpen ? 'open' : ''}`} id="mobile-nav" aria-hidden={mobileMenuOpen ? 'false' : 'true'}>
          <button className="mobile-nav-close" id="mobile-nav-close" aria-label="Close menu" onClick={closeMobileMenu}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className="mobile-nav-scroll-container">
            <a href="#hero" className="mobile-nav-link" onClick={e => handleAnchorClick(e, '#hero')}>Home</a>
            <a href="#portfolio" className="mobile-nav-link" onClick={e => handleAnchorClick(e, '#portfolio')}>Portfolio</a>
            <a href="#services" className="mobile-nav-link" onClick={e => handleAnchorClick(e, '#services')}>Services</a>
            <a href="#comparison" className="mobile-nav-link" onClick={e => handleAnchorClick(e, '#comparison')}>Compare</a>
            <a href="#footer-cta" className="mobile-nav-link" onClick={e => handleAnchorClick(e, '#footer-cta')}>Contact</a>
            <a href="#portfolio" className="btn btn-red mobile-nav-cta" onClick={e => handleAnchorClick(e, '#portfolio')}>Request Portfolio Access</a>
          </div>
        </div>
      </header>

      <main>
        {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
        <LensIntroHero>
          <section id="hero" className="hero-section" aria-label="Hero">
            <div className="hero-bg">
              <div className="hero-bg-image" id="hero-bg-image"></div>
              <div className="hero-overlay"></div>
              <div className="hero-red-glow"></div>
            </div>
            <div className="hero-content">
              <div className="hero-grid">
                <div className="hero-text">
                  <div className="hero-badge reveal-fade">✦ BUILT FOR FAST-GROWING MODERN BRANDS ✦</div>
                  <h1 className="hero-headline">
                    <span className="line-mask"><span className="line-inner">The Reel Company</span></span>
                  </h1>
                  <h2 className="hero-tagline reveal-up">High-Performance Content at Scale</h2>
                  <p className="hero-sub reveal-up">
                    <span style={{ display: 'block', color: 'rgba(255, 255, 255, 0.95)', fontWeight: 500, marginBottom: '0.45rem', letterSpacing: '-0.01em' }}>
                      Trusted by Big Brands. Chosen by Shark Tank–Featured Companies.
                    </span>
                    <span style={{ color: '#cbd5e1', display: 'block' }}>
                      Creating content that turns brand stories into attention, engagement, and measurable growth.
                    </span>
                  </p>
                  <div className="hero-ctas reveal-up" style={{ '--delay': '0.2s' } as React.CSSProperties}>
                    <a href="#portfolio" className="btn btn-red" onClick={e => handleAnchorClick(e, '#portfolio')}>See Our Work</a>
                    <button type="button" className="btn btn-outline" onClick={openDiscoveryModal}>Book a Discovery Call</button>
                  </div>
                </div>

                <div className="hero-video-wrap reveal-up" style={{ '--delay': '0.3s' } as React.CSSProperties}>
                  <div className="hero-ambient-orb-left"></div>
                  <div className="hero-ambient-orb-right"></div>

                  {/* Left Floating Badge */}
                  <div className="hero-floating-card card-float-left">
                    <div className="floating-card-icon">
                      <div className="sound-wave-icon">
                        <span className="sound-wave-bar"></span>
                        <span className="sound-wave-bar"></span>
                        <span className="sound-wave-bar"></span>
                        <span className="sound-wave-bar"></span>
                      </div>
                    </div>
                    <div className="floating-card-text">
                      <span className="floating-card-title">Hinglish &amp; Vernacular</span>
                      <span className="floating-card-sub">Pan-India Creators</span>
                    </div>
                  </div>

                  {/* Right Floating Badge */}
                  <div className="hero-floating-card card-float-right">
                    <div className="floating-card-icon">🔥</div>
                    <div className="floating-card-text">
                      <span className="floating-card-title">3.8x Avg ROAS</span>
                      <span className="floating-card-sub">Meta India Ads</span>
                    </div>
                  </div>

                  {/* Sparkle Accent Stars */}
                  <svg className="hero-sparkle sparkle-top-right" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>
                  <svg className="hero-sparkle sparkle-bottom-left" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"/>
                  </svg>

                  <div className="hero-phone-card">
                    <div className="phone-conic-ring"></div>
                    <div className="phone-glow"></div>
                    <div className="phone-frame">
                      <video
                        ref={heroVideoRef}
                        id="hero-preview-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                        poster="https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          const target = e.currentTarget;
                          const fallbackSrc = 'https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4';
                          if (target.src !== fallbackSrc) {
                            target.src = fallbackSrc;
                            target.load();
                            target.play().catch(() => {});
                          }
                        }}
                      >
                        <source src="http://creatornavigator.in/wp-content/uploads/2024/12/CN-Outro-Animation.mp4" type="video/mp4" />
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-the-camera-on-a-running-track-32807-large.mp4" type="video/mp4" />
                      </video>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </LensIntroHero>

        {/* ═══════════════════════════════ CLIENT MARQUEE ═══════════════════════════ */}
        <section id="clients" className="client-marquee-section" aria-label="Trusted Clients">
          <div className="client-marquee-header">
            <p className="client-marquee-label">✦ TRUSTED BY GLOBAL BRANDS &amp; HIGH-IMPACT CAMPAIGNS ✦</p>
          </div>

          <div className="client-marquee-container">
            <div className="marquee-fade-left" aria-hidden="true"></div>
            <div className="marquee-fade-right" aria-hidden="true"></div>

            {/* Row 1 (Upper): Left to Right */}
            <div className="client-marquee-row row-right">
              <div className="client-marquee-track">
                <span className="client-item">OZIVA</span><span className="item-dot">✦</span>
                <span className="client-item">FRIDO</span><span className="item-dot">✦</span>
                <span className="client-item">JUICY CHEMISTRY</span><span className="item-dot">✦</span>
                <span className="client-item">TRAVALATE</span><span className="item-dot">✦</span>
                <span className="client-item">SLEEPYCAT</span><span className="item-dot">✦</span>
                <span className="client-item">ICON</span><span className="item-dot">✦</span>
                <span className="client-item">SONIC LAMB</span><span className="item-dot">✦</span>
                <span className="client-item">WELME</span><span className="item-dot">✦</span>
              </div>
              <div className="client-marquee-track" aria-hidden="true">
                <span className="client-item">OZIVA</span><span className="item-dot">✦</span>
                <span className="client-item">FRIDO</span><span className="item-dot">✦</span>
                <span className="client-item">JUICY CHEMISTRY</span><span className="item-dot">✦</span>
                <span className="client-item">TRAVALATE</span><span className="item-dot">✦</span>
                <span className="client-item">SLEEPYCAT</span><span className="item-dot">✦</span>
                <span className="client-item">ICON</span><span className="item-dot">✦</span>
                <span className="client-item">SONIC LAMB</span><span className="item-dot">✦</span>
                <span className="client-item">WELME</span><span className="item-dot">✦</span>
              </div>
            </div>

            {/* Row 2 (Lower): Right to Left */}
            <div className="client-marquee-row row-left">
              <div className="client-marquee-track">
                <span className="client-item">BROWN LIVING</span><span className="item-dot">✦</span>
                <span className="client-item">HAMMER</span><span className="item-dot">✦</span>
                <span className="client-item">HOMESTRAP</span><span className="item-dot">✦</span>
                <span className="client-item">SÜKHAM</span><span className="item-dot">✦</span>
                <span className="client-item">PLUM STORIES</span><span className="item-dot">✦</span>
                <span className="client-item">TABBSZ</span><span className="item-dot">✦</span>
                <span className="client-item">A BIG INDIAN STORY</span><span className="item-dot">✦</span>
              </div>
              <div className="client-marquee-track" aria-hidden="true">
                <span className="client-item">BROWN LIVING</span><span className="item-dot">✦</span>
                <span className="client-item">HAMMER</span><span className="item-dot">✦</span>
                <span className="client-item">HOMESTRAP</span><span className="item-dot">✦</span>
                <span className="client-item">SÜKHAM</span><span className="item-dot">✦</span>
                <span className="client-item">PLUM STORIES</span><span className="item-dot">✦</span>
                <span className="client-item">TABBSZ</span><span className="item-dot">✦</span>
                <span className="client-item">A BIG INDIAN STORY</span><span className="item-dot">✦</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ SHOWREEL ═══════════════════════════ */}
        <section id="portfolio" className="showreel-section" aria-label="Portfolio Showreel">
          <div className="portfolio-ambient-glow-left"></div>
          <div className="portfolio-ambient-glow-right"></div>

          <div className="portfolio-header">
            <p className="section-label">Our Work</p>
            <h2 className="section-title">Content That <em>Converts</em></h2>
            <p className="section-sub">Eight handpicked UGC and ad videos from our active client campaigns.</p>
          </div>



          <div className="portfolio-grid" id="portfolio-grid">
            {VIDEOS.map((v, i) => (
              <div
                key={`grid-${i}`}
                className="video-card"
                data-index={i}
                onClick={e => togglePortfolioVideo(i, e.currentTarget)}
              >
                {/* Glassmorphic Top Badges */}
                <div className="video-card-top-bar">
                  <span className="video-badge-tag">{v.label}</span>
                  <span className="video-index-tag">0{i + 1}</span>
                </div>

                {/* Center Play Pulse Trigger */}
                <div className="center-play-trigger">
                  <div className="center-play-pulse"></div>
                  {portfolioPlayingState[i] ? (
                    <svg width="14" height="16" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3.5" height="12"/><rect x="6.5" y="0" width="3.5" height="12"/></svg>
                  ) : (
                    <svg width="14" height="16" viewBox="0 0 10 12" fill="currentColor" style={{ marginLeft: '2px' }}><path d="M0 0l10 6L0 12z"/></svg>
                  )}
                </div>

                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-label={v.label}
                  data-src={v.src}
                ></video>

                <div className="video-card-overlay"></div>

                {/* Bottom Title & Conversion Metric */}
                <div className="video-card-bottom-bar">
                  <span className="video-card-title">{v.label}</span>
                  <div className="video-card-metrics">
                    <span className="metric-highlight">✦ High Converting</span>
                    <span>9:16 HD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio-mobile-carousel" id="portfolio-carousel">
            {VIDEOS.map((v, i) => (
              <div
                key={`mobile-${i}`}
                className="video-card"
                data-index={i}
                onClick={e => togglePortfolioVideo(i, e.currentTarget)}
              >
                <div className="video-card-top-bar">
                  <span className="video-badge-tag">{v.label}</span>
                  <span className="video-index-tag">0{i + 1}</span>
                </div>
                <div className="center-play-trigger">
                  <div className="center-play-pulse"></div>
                  {portfolioPlayingState[i] ? (
                    <svg width="14" height="16" viewBox="0 0 10 12" fill="currentColor"><rect x="0" y="0" width="3.5" height="12"/><rect x="6.5" y="0" width="3.5" height="12"/></svg>
                  ) : (
                    <svg width="14" height="16" viewBox="0 0 10 12" fill="currentColor" style={{ marginLeft: '2px' }}><path d="M0 0l10 6L0 12z"/></svg>
                  )}
                </div>
                <video
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-label={v.label}
                  data-src={v.src}
                ></video>
                <div className="video-card-overlay"></div>
                <div className="video-card-bottom-bar">
                  <span className="video-card-title">{v.label}</span>
                  <div className="video-card-metrics">
                    <span className="metric-highlight">✦ High Converting</span>
                    <span>9:16 HD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="portfolio-cta">
            <a href="https://drive.google.com/drive/folders/your-portfolio-link" target="_blank" rel="noopener" className="btn btn-outline">
              View Full Portfolio
            </a>
          </div>
        </section>



        {/* ═══════════════════════════════ PROBLEM ═══════════════════════════ */}
        <section id="problems" className="problem-section" aria-label="Content Challenges">
          <div className="problem-inner">
            <div className="problem-sticky">
              <p className="section-label">The Reality</p>
              <h2 className="section-title">Content Is The Biggest<br/>Growth Lever.<br/><em>And The Hardest To Scale.</em></h2>
              <p className="section-sub">Most brands hit the same wall when trying to scale content. Here&apos;s what&apos;s holding you back.</p>
            </div>
            <div className="problem-cards" id="problem-cards">
              <div className="problem-card" data-index="01">
                <div className="problem-index">01</div>
                <h3>Hiring in-house is too expensive</h3>
                <p>Building a content team means salaries, benefits, equipment, software, and management overhead — before you&apos;ve filmed a single frame.</p>
              </div>
              <div className="problem-card" data-index="02">
                <div className="problem-index">02</div>
                <h3>Freelancers are inconsistent</h3>
                <p>One great video, then silence. Freelancers deliver varying quality, miss deadlines, and disappear — leaving your pipeline dry when you need it most.</p>
              </div>
              <div className="problem-card" data-index="03">
                <div className="problem-index">03</div>
                <h3>Agencies charge enterprise rates</h3>
                <p>Traditional production agencies quote $5k–$25k per video. That&apos;s not a content strategy — that&apos;s a quarterly budget burned on one asset.</p>
              </div>
              <div className="problem-card" data-index="04">
                <div className="problem-index">04</div>
                <h3>Platforms demand constant volume</h3>
                <p>Instagram, TikTok, YouTube Shorts, and Meta Ads all punish brands that post infrequently. The algorithm rewards volume AND quality — simultaneously.</p>
              </div>
              <div className="problem-card" data-index="05">
                <div className="problem-index">05</div>
                <h3>UGC is hard to produce at scale</h3>
                <p>Authentic-feeling content requires the right creators, briefs, direction, and editing. Doing this consistently without a dedicated system is nearly impossible.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ COMPACT PRICING CALLOUT ═══════════════════════════ */}
        <section className="pricing-callout-section" aria-label="Transparent Pricing">
          <div className="pricing-callout-container">
            <div className="pricing-callout-glow" aria-hidden="true"></div>
            <div className="pricing-callout-card">
              <div className="pricing-callout-badge">
                <span className="badge-pulse-dot" aria-hidden="true"></span>
                TRANSPARENT VALUE ✦
              </div>
              <h2 className="pricing-callout-headline">
                Starting with as low as <span className="pricing-accent-price">₹3,000</span><span className="pricing-per-video">/video</span>
              </h2>
              <p className="pricing-callout-sub">
                Full-spectrum video production tailored for modern brand stories — from initial concept and filming to high-end post-production.
              </p>
              <div className="pricing-pill-tags">
                <span className="pricing-pill">✦ Concept &amp; Scriptwriting</span>
                <span className="pricing-pill">✦ Filming &amp; Direction</span>
                <span className="pricing-pill">✦ Motion Graphics &amp; VFX</span>
                <span className="pricing-pill">✦ Sound Design &amp; Color Grading</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ EDITORIAL SERVICES MARQUEE ═══════════════════════════ */}
        <EditorialMarqueeSection />

        {/* ═══════════════════════════════ CLIENT CTA ═══════════════════════════ */}
        <section id="client-cta" className="client-cta-section" aria-label="Work With Us">
          <div className="client-cta-ambient-glow" aria-hidden="true"></div>
          <div className="client-cta-mesh" aria-hidden="true"></div>
          <div className="client-cta-inner">
            <div className="client-cta-badge">
              <span className="badge-pulse-dot" aria-hidden="true"></span>
              PARTNER WITH US ✦
            </div>
            <h2 className="client-cta-headline">
              Happy clients are our<br/>
              <span className="headline-gradient-text">best case study.</span>
            </h2>
            <p className="client-cta-sub">
              Join 50+ leading modern brands that stopped struggling with content and started scaling it.
            </p>
            <div className="client-cta-actions">
              <a href="#footer-cta" className="btn-cta-luxury" onClick={e => handleAnchorClick(e, '#footer-cta')}>
                <span>Start a Conversation</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ CLIENT TESTIMONIALS ═══════════════════════════════ */}
        <section id="testimonials" className="testimonials-section" aria-label="Client Testimonials">
          <div className="testimonials-inner">
            <div className="testimonials-header">
              <h2 className="testimonials-title">What Our Clients Say</h2>
              <p className="testimonials-sub">Real video testimonials from brands who have worked with The Reel Company.</p>
            </div>
            
            <div className="testimonials-slider-container">
              {/* Single Row (Moving Left) */}
              <div className="testimonials-track track-left">
                {[1, 2].map((groupIndex) => (
                  <div key={`group1-${groupIndex}`} className="marquee-group" aria-hidden={groupIndex > 1 ? "true" : undefined}>
                    {VIDEOS.map((vid, idx) => (
                      <div key={`t1-${idx}`} className="testimonial-card">
                        <div className="testimonial-video-wrap">
                          <video 
                            src={vid.src} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline 
                            className="testimonial-video"
                          />
                          <div className="testimonial-overlay"></div>
                          {vid.label && <div className="testimonial-label">{vid.label}</div>}
                          <div className="testimonial-play-indicator">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ COMPARISON ═══════════════════════════ */}
        <section id="comparison" className="comparison-section" aria-label="Vendor Comparison">
          <div className="comparison-inner">
            <div className="comparison-header">
              <div className="section-badge-pill reveal-fade">✦ COMPARISON MATRIX ✦</div>
              <h2 className="section-title">Why High-Growth Brands<br/>Switch to Us.</h2>
              <p className="section-sub">Traditional agencies move too slow. Freelancers lack scale. We deliver both.</p>
            </div>
            {/* Desktop Table View */}
            <div className="table-wrap desktop-table-view">
              <table className="comparison-table" role="table" aria-label="Vendor comparison table">
                <thead>
                  <tr>
                    <th scope="col" className="feature-col">Feature / Requirement</th>
                    <th scope="col">In-House Team</th>
                    <th scope="col">Freelancers</th>
                    <th scope="col">Big Agencies</th>
                    <th scope="col" className="trc-col">
                      <span className="trc-badge">✦ RECOMMENDED FOR SCALING BRANDS</span>
                      <div className="trc-header-title">The Reel Company</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="feature-name">Consistent Quality</td>
                    <td><span className="badge-tag">Varies</span></td>
                    <td><span className="badge-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Inconsistent</span></td>
                    <td><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> High</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Studio Grade</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">Affordable Pricing</td>
                    <td><span className="badge-tag">High Overhead</span></td>
                    <td><span className="badge-tag">Varies</span></td>
                    <td><span className="badge-tag">Enterprise Only</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Flat Rate</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">Fast Turnaround (48hr)</td>
                    <td><span className="badge-tag">Weeks</span></td>
                    <td><span className="badge-tag">Slow</span></td>
                    <td><span className="badge-tag">3-4 Weeks</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>48 Hours</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">UGC &amp; Ad Specialisation</td>
                    <td><span className="badge-tag">Generalist</span></td>
                    <td><span className="badge-tag">Hit or Miss</span></td>
                    <td><span className="badge-tag">Rarely</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>100% Dedicated</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">Volume at Scale</td>
                    <td><span className="badge-tag">Limited</span></td>
                    <td><span className="badge-tag">Single Operator</span></td>
                    <td><span className="badge-tag">$$ Extra</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Unlimited Scale</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">Ad Strategy &amp; Hooks Included</td>
                    <td><span className="badge-tag">Sometimes</span></td>
                    <td><span className="badge-tag">Execution Only</span></td>
                    <td><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Included</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Full Strategy</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">No Long-Term Contracts</td>
                    <td><span className="badge-tag">Fixed Salary</span></td>
                    <td><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Per Project</span></td>
                    <td><span className="badge-tag">6-12 Mo Lock-in</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Cancel Anytime</strong></span></td>
                  </tr>
                  <tr>
                    <td className="feature-name">Dedicated Account Manager</td>
                    <td><span className="badge-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> N/A</span></td>
                    <td><span className="badge-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> N/A</span></td>
                    <td><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Yes</span></td>
                    <td className="trc-col"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>1-on-1 Slack/Sync</strong></span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile Switcher View - Horizontal Carousel */}
            <div className="mobile-comp-view">
              <div className="mobile-carousel" onScroll={handleCarouselScroll}>
                {/* Card 1: In-House Team */}
                <div className="mobile-carousel-card">
                  <div className="mobile-carousel-header">
                    <h3>In-House Team</h3>
                  </div>
                  <ul className="mobile-carousel-list">
                    <li><span className="feature-name">Quality</span> <span className="val"><span className="badge-tag">Varies</span></span></li>
                    <li><span className="feature-name">Pricing</span> <span className="val"><span className="badge-tag">High Overhead</span></span></li>
                    <li><span className="feature-name">Turnaround</span> <span className="val"><span className="badge-tag">Weeks</span></span></li>
                    <li><span className="feature-name">Specialisation</span> <span className="val"><span className="badge-tag">Generalist</span></span></li>
                    <li><span className="feature-name">Volume at Scale</span> <span className="val"><span className="badge-tag">Limited</span></span></li>
                    <li><span className="feature-name">Ad Strategy</span> <span className="val"><span className="badge-tag">Sometimes</span></span></li>
                    <li><span className="feature-name">Contracts</span> <span className="val"><span className="badge-tag">Fixed Salary</span></span></li>
                    <li><span className="feature-name">Account Manager</span> <span className="val"><span className="badge-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> N/A</span></span></li>
                  </ul>
                </div>

                {/* Card 2: Freelancers */}
                <div className="mobile-carousel-card">
                  <div className="mobile-carousel-header">
                    <h3>Freelancers</h3>
                  </div>
                  <ul className="mobile-carousel-list">
                    <li><span className="feature-name">Quality</span> <span className="val"><span className="badge-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Inconsistent</span></span></li>
                    <li><span className="feature-name">Pricing</span> <span className="val"><span className="badge-tag">Varies</span></span></li>
                    <li><span className="feature-name">Turnaround</span> <span className="val"><span className="badge-tag">Slow</span></span></li>
                    <li><span className="feature-name">Specialisation</span> <span className="val"><span className="badge-tag">Hit or Miss</span></span></li>
                    <li><span className="feature-name">Volume at Scale</span> <span className="val"><span className="badge-tag">Single Operator</span></span></li>
                    <li><span className="feature-name">Ad Strategy</span> <span className="val"><span className="badge-tag">Execution Only</span></span></li>
                    <li><span className="feature-name">Contracts</span> <span className="val"><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Per Project</span></span></li>
                    <li><span className="feature-name">Account Manager</span> <span className="val"><span className="badge-cross"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> N/A</span></span></li>
                  </ul>
                </div>

                {/* Card 3: Big Agencies */}
                <div className="mobile-carousel-card">
                  <div className="mobile-carousel-header">
                    <h3>Big Agencies</h3>
                  </div>
                  <ul className="mobile-carousel-list">
                    <li><span className="feature-name">Quality</span> <span className="val"><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> High</span></span></li>
                    <li><span className="feature-name">Pricing</span> <span className="val"><span className="badge-tag">Enterprise Only</span></span></li>
                    <li><span className="feature-name">Turnaround</span> <span className="val"><span className="badge-tag">3-4 Weeks</span></span></li>
                    <li><span className="feature-name">Specialisation</span> <span className="val"><span className="badge-tag">Rarely</span></span></li>
                    <li><span className="feature-name">Volume at Scale</span> <span className="val"><span className="badge-tag">$$ Extra</span></span></li>
                    <li><span className="feature-name">Ad Strategy</span> <span className="val"><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Included</span></span></li>
                    <li><span className="feature-name">Contracts</span> <span className="val"><span className="badge-tag">6-12 Mo Lock-in</span></span></li>
                    <li><span className="feature-name">Account Manager</span> <span className="val"><span className="badge-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Yes</span></span></li>
                  </ul>
                </div>

                {/* Card 4: The Reel Company */}
                <div className="mobile-carousel-card mobile-carousel-card-trc">
                  <div className="mobile-carousel-header">
                    <span className="trc-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>✦ RECOMMENDED FOR SCALING BRANDS</span>
                    <h3>The Reel Company</h3>
                  </div>
                  <ul className="mobile-carousel-list">
                    <li><span className="feature-name">Quality</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Studio Grade</strong></span></span></li>
                    <li><span className="feature-name">Pricing</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Flat Rate</strong></span></span></li>
                    <li><span className="feature-name">Turnaround</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>48 Hours</strong></span></span></li>
                    <li><span className="feature-name">Specialisation</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>100% Dedicated</strong></span></span></li>
                    <li><span className="feature-name">Volume at Scale</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Unlimited Scale</strong></span></span></li>
                    <li><span className="feature-name">Ad Strategy</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Full Strategy</strong></span></span></li>
                    <li><span className="feature-name">Contracts</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>Cancel Anytime</strong></span></span></li>
                    <li><span className="feature-name">Account Manager</span> <span className="val trc-val"><span className="badge-check-glow"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <strong>1-on-1 Slack/Sync</strong></span></span></li>
                  </ul>
                </div>
              </div>
              <div className="mobile-carousel-indicator">
                <div className={`carousel-dot ${activeCarouselIndex === 0 ? 'active' : ''}`} />
                <div className={`carousel-dot ${activeCarouselIndex === 1 ? 'active' : ''}`} />
                <div className={`carousel-dot ${activeCarouselIndex === 2 ? 'active' : ''}`} />
                <div className={`carousel-dot ${activeCarouselIndex === 3 ? 'active' : ''}`} />
              </div>
            </div>

            {/* High-CRO Conversion Banner */}
            <div className="comparison-cta-card">
              <div className="comparison-cta-text">
                <h3>Ready to upgrade your brand's ad performance?</h3>
                <p>Traditional agencies move too slow. Freelancers lack scale. We deliver both in 48 hours.</p>
              </div>
              <button type="button" className="btn btn-red comparison-cta-btn" onClick={openDiscoveryModal}>
                Book a Discovery Call
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ FOOTER CTA ═══════════════════════════ */}
        <section id="footer-cta" className="footer-cta-section" aria-label="Final Call To Action">
          <div className="footer-cta-glow"></div>
          <div className="footer-cta-container">
            <div className="footer-cta-content">
              <p className="section-label light">Let&apos;s Work Together</p>
              <h2 className="footer-cta-headline">Need More Content<br/>Without Building A<br/>Bigger Team?</h2>
              <p className="footer-cta-sub">We become your on-demand content department. Strategy, production, editing — all handled. You focus on your business.</p>
              <div className="footer-cta-buttons">
                <button type="button" className="btn btn-red" onClick={openDiscoveryModal}>Book a Discovery Call</button>
                <a href="#portfolio" className="btn btn-outline" onClick={e => handleAnchorClick(e, '#portfolio')}>View Portfolio</a>
              </div>
            </div>
            <button className="back-to-top" id="back-to-top" aria-label="Back to top" onClick={handleBackToTop}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 16V4M10 4L4 10M10 4L16 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to top
            </button>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#hero" className="logo footer-logo" aria-label="The Reel Company" onClick={e => handleAnchorClick(e, '#hero')}>
              <span className="logo-mark">TRC</span>
              <span className="logo-text">The Reel Company</span>
            </a>
            <p className="footer-tagline">Studio-quality UGC &amp; ad videos.<br/>On-demand. Affordable. Fast.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <div className="footer-nav-col">
              <h4>Navigation</h4>
              <a href="#hero" onClick={e => handleAnchorClick(e, '#hero')}>Home</a>
              <a href="#portfolio" onClick={e => handleAnchorClick(e, '#portfolio')}>Portfolio</a>
              <a href="#services" onClick={e => handleAnchorClick(e, '#services')}>Services</a>
              <a href="#comparison" onClick={e => handleAnchorClick(e, '#comparison')}>Compare</a>
              <a href="#footer-cta" onClick={e => handleAnchorClick(e, '#footer-cta')}>Contact</a>
            </div>
            <div className="footer-nav-col">
              <h4>Work with us</h4>
              <button type="button" style={{ color: 'inherit', font: 'inherit', padding: 0, textDecoration: 'none', cursor: 'pointer', textAlign: 'left' }} onClick={openDiscoveryModal}>Book a Call</button>
              <a href="#portfolio" onClick={e => handleAnchorClick(e, '#portfolio')}>Portfolio Access</a>
              <a href="mailto:hello@thereelcompany.com">Email Us</a>
            </div>
          </nav>
        </div>

        {/* ════════════════ BIG FOOTER BRANDING ════════════════ */}
        <div className="footer-big-branding-wrap" aria-label="The Reel Company">
          <div className="footer-big-branding-glow" aria-hidden="true"></div>
          <svg
            viewBox="0 0 1650 160"
            width="100%"
            height="100%"
            className="footer-big-branding-svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="footerBrandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#ff4d4d" />
                <stop offset="52%" stopColor="#e50914" />
                <stop offset="78%" stopColor="#660003" />
                <stop offset="100%" stopColor="#100203" />
              </linearGradient>
              <filter id="footerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="rgba(229, 9, 20, 0.4)" />
              </filter>
            </defs>
            <text
              x="50%"
              y="56%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="url(#footerBrandGrad)"
              filter="url(#footerGlow)"
              style={{
                fontFamily: "var(--font-head), 'Syne', sans-serif",
                fontWeight: 900,
                fontSize: "122px",
                letterSpacing: "-1px",
              }}
            >
              THE REEL COMPANY
            </text>
          </svg>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="copyright-text">&copy; 2026 The Reel Company Co.</span>
            <span className="footer-separator" aria-hidden="true">•</span>
            <span className="powered-by-wrap">
              <span className="powered-by-label">Powered by</span>
              <a
                href="https://creatornavigator.in"
                target="_blank"
                rel="noopener noreferrer"
                className="powered-by-brand"
              >
                CreatorNavigator
              </a>
            </span>
          </div>
          <p className="footer-studio-tag">UGC &amp; Content Production Studio</p>
        </div>
      </footer>

      {/* Discovery Call Lead Capture Modal */}
      <DiscoveryCallModal
        isOpen={discoveryModalOpen}
        onClose={closeDiscoveryModal}
        triggerRef={lastActiveCtaRef}
      />
    </>
  );
}
