"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ReelCompanyHero from './ReelCompanyHero';
import DiscoveryCallModal from './DiscoveryCallModal';
import PortfolioAccessModal from './PortfolioAccessModal';
import EditorialMarqueeSection from './EditorialMarqueeSection';
import UgcProcessSection from './process/UgcProcessSection';
import FAQSection from './FAQSection';
import { ASSETS } from '@/config/assets';

interface VideoItem {
  src: string;
  poster?: string;
  label: string;
}

const VIDEOS: VideoItem[] = [
  ...ASSETS.videos.portfolio.map(item => ({ src: item.src, poster: item.poster, label: item.label })),
  { src: '', label: 'Creative in Production' },
  { src: '', label: 'Brand Campaign in Production' },
  { src: '', label: 'Performance Ad in Production' },
  { src: '', label: 'Creator Story in Production' },
];

interface LazyPortfolioCardProps {
  video: VideoItem;
  index: number;
  isMobile?: boolean;
}

function LazyPortfolioCard({ video, index, isMobile }: LazyPortfolioCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (videoRef.current) {
          if (entry.isIntersecting) {
            videoRef.current.play().catch(() => {});
          } else {
            videoRef.current.pause();
          }
        }
      },
      {
        rootMargin: '250px 0px',
        threshold: 0.05,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`video-card ${!video.src ? 'empty-slot' : ''}`}
      data-index={index}
    >
      <div className="video-card-top-bar" style={{ justifyContent: 'flex-end' }}>
        <span className="video-index-tag">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
      </div>

      {video.src ? (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload={isInView ? "metadata" : "none"}
          poster={video.poster}
          aria-label={video.label}
          src={isInView ? video.src : undefined}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div className="empty-slot-content">
          <div className="empty-slot-icon-wrap">
            <svg width={isMobile ? "24" : "26"} height={isMobile ? "24" : "26"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </div>
          <div className="empty-slot-label">{video.label}</div>
          <span className="empty-slot-sub">{isMobile ? '✦ Slot Reserved' : '✦ Creative Slot Reserved'}</span>
        </div>
      )}
    </div>
  );
}

export default function ReelCompanySite() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [heroVideoName, setHeroVideoName] = useState('CN-Outro-Animation.mp4');
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [heroMuted, setHeroMuted] = useState(true);
  // Discovery Call Modal state
  const [discoveryModalOpen, setDiscoveryModalOpen] = useState(false);
  const lastActiveCtaRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);

  const openDiscoveryModal = (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (e) {
      e.preventDefault();
      lastActiveCtaRef.current = e.currentTarget;
    }
    setDiscoveryModalOpen(true);
  };

  const closeDiscoveryModal = () => {
    setDiscoveryModalOpen(false);
  };

  // Portfolio Access Modal state
  const [portfolioModalOpen, setPortfolioModalOpen] = useState(false);

  const openPortfolioModal = (e?: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (e) {
      e.preventDefault();
    }
    setPortfolioModalOpen(true);
  };

  const closePortfolioModal = () => {
    setPortfolioModalOpen(false);
  };

  // States to keep track of portfolio video playback icons per video index
  const [portfolioPlayingState, setPortfolioPlayingState] = useState<Record<number, boolean>>({});
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
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

  // Scroll listener for header & nav active link (RAF-throttled, cached offsets, zero duplicate re-renders)
  useEffect(() => {
    const sections = ['hero', 'portfolio', 'services', 'footer-cta'];
    let sectionOffsets: { id: string; top: number }[] = [];

    const updateOffsets = () => {
      sectionOffsets = sections
        .map(id => {
          const el = document.getElementById(id);
          return el ? { id, top: el.offsetTop } : null;
        })
        .filter(Boolean) as { id: string; top: number }[];
    };

    updateOffsets();

    let ticking = false;
    let lastScrolled = false;
    let lastActive = 'hero';

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const isScrolled = scrollY > 60;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setHeaderScrolled(isScrolled);
          }

          const scrollMid = scrollY + window.innerHeight / 3;
          let current = sections[0];
          for (let i = 0; i < sectionOffsets.length; i++) {
            if (scrollMid >= sectionOffsets[i].top) {
              current = sectionOffsets[i].id;
            }
          }

          if (current !== lastActive) {
            lastActive = current;
            setActiveSection(current);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateOffsets, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateOffsets);
    };
  }, []);

  // Keyboard escape listener for mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobileMenu();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Robust, professional smooth scroll engine for all section anchors
  const scrollToSection = (targetId: string) => {
    closeMobileMenu();
    const id = targetId.replace(/^#/, '');

    if (id === 'hero' || id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const targetEl = document.getElementById(id);
    if (targetEl) {
      const siteHeader = document.getElementById('site-header');
      const headerHeight = siteHeader ? siteHeader.offsetHeight : 70;
      const targetTop = targetEl.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop || 0);
      const scrollToPosition = Math.max(0, targetTop - headerHeight - 12);

      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });

      if (typeof window !== 'undefined' && window.history && window.history.pushState) {
        window.history.pushState(null, '', `#${id}`);
      }
    } else {
      const fallbackEl = document.querySelector(`#${id}`);
      if (fallbackEl) {
        fallbackEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, href: string) => {
    if (href && href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
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
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      const playPromise = heroVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay retry on first interaction if blocked
          const onUserAction = () => {
            if (heroVideoRef.current) {
              heroVideoRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', onUserAction);
            window.removeEventListener('scroll', onUserAction);
            window.removeEventListener('touchstart', onUserAction);
          };
          window.addEventListener('click', onUserAction, { once: true });
          window.addEventListener('scroll', onUserAction, { once: true });
          window.addEventListener('touchstart', onUserAction, { once: true });
        });
      }
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

  // Autoplay Guarantee for Portfolio Videos when Section is In View
  useEffect(() => {
    const playAll = () => {
      const videos = document.querySelectorAll<HTMLVideoElement>('.portfolio-grid video, .portfolio-mobile-carousel video');
      videos.forEach(v => {
        if (v.paused) {
          v.play().catch(() => {});
        }
      });
    };

    const section = document.getElementById('portfolio');
    if (!section) return;

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playAll();
        }
      });
    }, { threshold: 0.05 });

    sectionObserver.observe(section);

    // Visibility change / window focus guarantee
    const handleVisibilityChange = () => {
      if (!document.hidden) playAll();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      sectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Hover & Manual toggle for individual portfolio video card
  const playPortfolioVideo = (idx: number, cardEl: HTMLElement | null) => {
    if (!cardEl) return;
    const video = cardEl.querySelector<HTMLVideoElement>('video');
    if (!video) return;

    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
    }

    video.play().catch(() => {});
    setPortfolioPlayingState(prev => ({ ...prev, [idx]: true }));
  };

  const pausePortfolioVideo = (idx: number, cardEl: HTMLElement | null) => {
    if (!cardEl) return;
    const video = cardEl.querySelector<HTMLVideoElement>('video');
    if (!video) return;

    video.pause();
    setPortfolioPlayingState(prev => ({ ...prev, [idx]: false }));
  };

  const togglePortfolioVideo = (idx: number, cardEl: HTMLElement | null) => {
    if (!cardEl) return;
    const video = cardEl.querySelector<HTMLVideoElement>('video');
    if (!video) return;

    if (!video.src && video.dataset.src) {
      video.src = video.dataset.src;
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
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      <header id="site-header" role="banner" className={headerScrolled ? 'scrolled' : ''}>
        <div className="header-inner">
          <a href="#hero" className="logo" aria-label="The Reel Company Home" onClick={e => handleAnchorClick(e, '#hero')}>
            <img
              src={ASSETS.brand.logo.primary}
              alt={ASSETS.brand.logo.alt}
              className="brand-logo-img"
              width={140}
              height={40}
            />
          </a>
          <nav id="main-nav" aria-label="Main navigation">
            <a href="#hero" className={`nav-link ${activeSection === 'hero' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#hero')}>Home</a>
            <a href="#portfolio" className={`nav-link ${activeSection === 'portfolio' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#portfolio')}>Portfolio</a>
            <a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#services')}>Services</a>
            <a href="#footer-cta" className={`nav-link ${activeSection === 'footer-cta' ? 'active' : ''}`} onClick={e => handleAnchorClick(e, '#footer-cta')}>Contact</a>
          </nav>
          <button type="button" className="btn btn-red header-cta" id="header-cta-btn" onClick={openDiscoveryModal}>
            Book a Call
          </button>
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
            <a href="#footer-cta" className="mobile-nav-link" onClick={e => handleAnchorClick(e, '#footer-cta')}>Contact</a>
            <Link href="/privacy-policy" className="mobile-nav-link" onClick={closeMobileMenu}>Privacy Policy</Link>
            <button type="button" className="btn btn-red mobile-nav-cta" onClick={() => { closeMobileMenu(); openDiscoveryModal(); }}>Book a Call</button>
          </div>
        </div>
      </header>

      <main>
        {/* ═══════════════════════════════ HERO ═══════════════════════════════ */}
        <ReelCompanyHero
          openDiscoveryModal={openDiscoveryModal}
          handleAnchorClick={handleAnchorClick}
        />

        {/* ═══════════════════════════════ STUDIO SHOWCASE (HIGH-PERFORMANCE CONTENT AT SCALE) ═══════════════════════════════ */}
        <section id="studio-overview" className="hero-section studio-overview-section" aria-label="Studio Overview">
          <div className="hero-bg">
            <div className="hero-bg-image" id="hero-bg-image"></div>
            <div className="hero-overlay"></div>
            <div className="hero-red-glow"></div>
          </div>
          <div className="hero-content">
            <div className="hero-grid">
              <div className="hero-text">
                <h2 className="hero-headline">
                  <span className="line-mask"><span className="line-inner">The Reel Company</span></span>
                </h2>
                <h3 className="hero-tagline">High–Performance Content at Scale</h3>
                <div className="hero-sub">
                  <p>
                    From content that stops the scroll, to ads that drive performance, TRC does it all—organic content, Meta ads, motion graphics, AI videos, YouTube long-form, documentaries, and everything in between.
                  </p>
                  <p>
                    One team, one seamless workflow, 2x faster execution, and up to 50% lower costs than traditional agencies.
                  </p>
                </div>
                <div className="hero-ctas">
                  <a href="#portfolio" className="btn btn-red" onClick={e => handleAnchorClick(e, '#portfolio')}>See Our Work</a>
                  <button type="button" className="btn btn-outline" onClick={openDiscoveryModal}>Book a Discovery Call</button>
                </div>
              </div>

              <div className="hero-video-wrap">
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
                      autoPlay={ASSETS.videoConfig.hero.autoPlay}
                      muted={ASSETS.videoConfig.hero.muted}
                      loop={ASSETS.videoConfig.hero.loop}
                      playsInline={ASSETS.videoConfig.hero.playsInline}
                      preload={ASSETS.videoConfig.hero.preload}
                      poster={ASSETS.videos.hero.poster}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallbackSrc = ASSETS.videos.hero.fallback;
                        if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc)) {
                          target.src = fallbackSrc;
                          target.load();
                          target.play().catch(() => {});
                        }
                      }}
                    >
                      <source src={ASSETS.videos.hero.src} type="video/mp4" />
                      <source src="/cn-outro-hero-video.mp4" type="video/mp4" />
                      <source src="https://creatornavigator.in/wp-content/uploads/2024/12/CN-Outro-Animation.mp4" type="video/mp4" />
                      <source src={ASSETS.videos.hero.fallback} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ CLIENT MARQUEE ═══════════════════════════ */}
        <section id="clients" className="client-marquee-section" aria-label="Trusted Clients">
          <div className="client-marquee-header">
            <p className="client-marquee-label">✦ TRUSTED BY TOP INDIAN BRANDS ✦</p>
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
                <span className="client-item">CHEQ</span><span className="item-dot">✦</span>
                <span className="client-item">SLEEPYCAT</span><span className="item-dot">✦</span>
                <span className="client-item">ICON</span><span className="item-dot">✦</span>
                <span className="client-item">SONIC LAMB</span><span className="item-dot">✦</span>
                <span className="client-item">WELME</span><span className="item-dot">✦</span>
                <span className="client-item">BEARDO</span><span className="item-dot">✦</span>
                <span className="client-item">KAPIVA</span><span className="item-dot">✦</span>
              </div>
              <div className="client-marquee-track" aria-hidden="true">
                <span className="client-item">OZIVA</span><span className="item-dot">✦</span>
                <span className="client-item">FRIDO</span><span className="item-dot">✦</span>
                <span className="client-item">JUICY CHEMISTRY</span><span className="item-dot">✦</span>
                <span className="client-item">CHEQ</span><span className="item-dot">✦</span>
                <span className="client-item">SLEEPYCAT</span><span className="item-dot">✦</span>
                <span className="client-item">ICON</span><span className="item-dot">✦</span>
                <span className="client-item">SONIC LAMB</span><span className="item-dot">✦</span>
                <span className="client-item">WELME</span><span className="item-dot">✦</span>
                <span className="client-item">BEARDO</span><span className="item-dot">✦</span>
                <span className="client-item">KAPIVA</span><span className="item-dot">✦</span>
              </div>
            </div>

            {/* Row 2 (Lower): Right to Left */}
            <div className="client-marquee-row row-left">
              <div className="client-marquee-track">
                <span className="client-item">SHRIRAM FINANCE</span><span className="item-dot">✦</span>
                <span className="client-item">HAMMER</span><span className="item-dot">✦</span>
                <span className="client-item">SAMCO</span><span className="item-dot">✦</span>
                <span className="client-item">PHYSICS WALLAH</span><span className="item-dot">✦</span>
                <span className="client-item">JUSTDIAL</span><span className="item-dot">✦</span>
                <span className="client-item">TABBSZ</span><span className="item-dot">✦</span>
                <span className="client-item">PHILIP CAPITAL</span><span className="item-dot">✦</span>
                <span className="client-item">OZONE</span><span className="item-dot">✦</span>
                <span className="client-item">PAGARBOOK</span><span className="item-dot">✦</span>
                <span className="client-item">ALLEN</span><span className="item-dot">✦</span>
              </div>
              <div className="client-marquee-track" aria-hidden="true">
                <span className="client-item">SHRIRAM FINANCE</span><span className="item-dot">✦</span>
                <span className="client-item">HAMMER</span><span className="item-dot">✦</span>
                <span className="client-item">SAMCO</span><span className="item-dot">✦</span>
                <span className="client-item">PHYSICS WALLAH</span><span className="item-dot">✦</span>
                <span className="client-item">JUSTDIAL</span><span className="item-dot">✦</span>
                <span className="client-item">TABBSZ</span><span className="item-dot">✦</span>
                <span className="client-item">PHILIP CAPITAL</span><span className="item-dot">✦</span>
                <span className="client-item">OZONE</span><span className="item-dot">✦</span>
                <span className="client-item">PAGARBOOK</span><span className="item-dot">✦</span>
                <span className="client-item">ALLEN</span><span className="item-dot">✦</span>
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
          </div>

          <div className="portfolio-grid" id="portfolio-grid">
            {VIDEOS.map((v, i) => (
              <LazyPortfolioCard
                key={`grid-${i}`}
                video={v}
                index={i}
                isMobile={false}
              />
            ))}
          </div>

          <div className="portfolio-mobile-carousel" id="portfolio-carousel">
            {VIDEOS.map((v, i) => (
              <LazyPortfolioCard
                key={`mobile-${i}`}
                video={v}
                index={i}
                isMobile={true}
              />
            ))}
          </div>

          <div className="portfolio-cta">
            <button type="button" className="btn btn-outline" onClick={openPortfolioModal}>
              View Full Portfolio
            </button>
          </div>
        </section>



        {/* ═══════════════════════════════ PROBLEM / THE REALITY ═══════════════════════════ */}
        <section id="problems" className="problem-section" aria-label="Content Challenges">
          <div className="problem-inner">
            <div className="problem-left-col">
              <p className="section-label">The Reality</p>
              <h2 className="section-title">Content Is The Biggest<br/>Growth Lever.<br/><em>And The Hardest To Scale.</em></h2>
              <p className="section-sub">Most brands hit the same wall when trying to scale content. Here&apos;s what&apos;s holding you back.</p>
            </div>
            <div className="problem-cards" id="problem-cards">
              <div className="problem-card" data-index="01">
                <div className="problem-card-content">
                  <h3 className="problem-card-title">Hiring in-house is too expensive</h3>
                  <p className="problem-card-desc">Hiring In-house team looks good on paper until you try to scale.</p>
                </div>
                <span className="problem-index" aria-hidden="true">01</span>
              </div>
              <div className="problem-card" data-index="02">
                <div className="problem-card-content">
                  <h3 className="problem-card-title">Freelancers are inconsistent</h3>
                  <p className="problem-card-desc">Freelancers are inconsistent in delivery and pricing.</p>
                </div>
                <span className="problem-index" aria-hidden="true">02</span>
              </div>
              <div className="problem-card" data-index="03">
                <div className="problem-card-content">
                  <h3 className="problem-card-title">Agencies charge enterprise rates</h3>
                  <p className="problem-card-desc">Traditional agencies charge 10-15k/video that might not even perform.</p>
                </div>
                <span className="problem-index" aria-hidden="true">03</span>
              </div>
              <div className="problem-card" data-index="04">
                <div className="problem-card-content">
                  <h3 className="problem-card-title">Platforms demand constant volume</h3>
                  <p className="problem-card-desc">Video apps and platforms are more complex and usually waste of time.</p>
                </div>
                <span className="problem-index" aria-hidden="true">04</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ UGC PROCESS ═══════════════════════════ */}
        <UgcProcessSection />

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
              <div className="pricing-callout-cta-wrap" style={{ marginTop: "1.5rem" }}>
                <button
                  type="button"
                  className="btn btn-red"
                  onClick={openDiscoveryModal}
                >
                  Book a Discovery Call
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════ EDITORIAL SERVICES MARQUEE ═══════════════════════════ */}
        <EditorialMarqueeSection />

        {/* ═══════════════════════════════ CLIENT CTA & TESTIMONIALS ═══════════════════════════ */}
        <section id="client-cta" className="client-cta-section" aria-label="Work With Us">
          <div className="client-cta-ambient-glow" aria-hidden="true"></div>
          <div className="client-cta-mesh" aria-hidden="true"></div>
          <div className="client-cta-inner">
            <h2 className="client-cta-headline">
              Happy clients are our<br/>
              <span className="headline-gradient-text">best case study.</span>
            </h2>
            <p className="client-cta-sub">
              Join 250+ leading modern brands that stopped struggling with content and started scaling it.
            </p>
          </div>

          <div className="testimonials-slider-container">
            {/* Single Row (Moving Left) */}
            <div className="testimonials-track track-left">
              {[1, 2].map((groupIndex) => (
                <div key={`group1-${groupIndex}`} className="marquee-group" aria-hidden={groupIndex > 1 ? "true" : undefined}>
                  {[1, 2, 3, 4, 5, 6].map((item, idx) => (
                    <div key={`t1-${groupIndex}-${idx}`} className="testimonial-card">
                      <div className="testimonial-video-wrap">
                        <div className="testimonial-empty-placeholder">
                          <div className="testimonial-center-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="testimonial-overlay"></div>
                        <div className="testimonial-label">Client Review 0{idx + 1}</div>
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
        </section>

        {/* ═══════════════════════════════ FOOTER CTA ═══════════════════════════ */}
        <section id="footer-cta" className="footer-cta-section" aria-label="Final Call To Action">
          <div className="footer-cta-glow"></div>
          <div className="footer-cta-container">
            <div className="footer-cta-content">
              <p className="section-label light">Let&apos;s Work Together</p>
              <h2 className="footer-cta-headline">
                <span className="footer-cta-line">Need More Content</span>
                <span className="footer-cta-line">Without Building A</span>
                <span className="footer-cta-line">Bigger Team?</span>
              </h2>
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

        {/* ═══════════════════════════════ FAQ SECTION ═══════════════════════════ */}
        <FAQSection />
      </main>

      {/* ═══════════════════════════════ FOOTER ═══════════════════════════ */}
      <footer className="site-footer" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <a href="#hero" className="logo footer-logo" aria-label="The Reel Company" onClick={e => handleAnchorClick(e, '#hero')}>
              <img
                src={ASSETS.brand.logo.primary}
                alt={ASSETS.brand.logo.alt}
                className="footer-logo-img"
                width={160}
                height={48}
              />
            </a>
            <p className="footer-tagline">Studio-quality UGC &amp; ad videos.<br/>On-demand. Affordable. Fast.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer navigation">
            <div className="footer-nav-col">
              <h4>Navigation</h4>
              <a href="#hero" onClick={e => handleAnchorClick(e, '#hero')}>Home</a>
              <a href="#portfolio" onClick={e => handleAnchorClick(e, '#portfolio')}>Portfolio</a>
              <a href="#services" onClick={e => handleAnchorClick(e, '#services')}>Services</a>
              <a href="#footer-cta" onClick={e => handleAnchorClick(e, '#footer-cta')}>Contact</a>
              <Link href="/privacy-policy">Privacy Policy</Link>
            </div>
            <div className="footer-nav-col">
              <h4>Work with us</h4>
              <button 
                type="button" 
                className="footer-nav-link-btn" 
                onClick={openDiscoveryModal}
              >
                Book a Call
              </button>
              <button 
                type="button" 
                className="footer-nav-link-btn" 
                onClick={openPortfolioModal}
              >
                Portfolio Access
              </button>
              <button 
                type="button" 
                className="footer-nav-link-btn" 
                onClick={openDiscoveryModal}
              >
                Email Us
              </button>
            </div>
            <div className="footer-nav-col footer-contact-col">
              <h4>Contact</h4>
              <p className="footer-contact-line">
                <span className="footer-contact-label">Address:</span> Ground Floor, Kohinoor Tower, Kohka Junwani, Bhilai, 490023, Chhattisgarh
              </p>
              <p className="footer-contact-line">
                <span className="footer-contact-label">Phone -</span> +91 8109214834
              </p>
              <p className="footer-contact-line">
                <span className="footer-contact-label">E-mail :</span> shubham@creator-navigator.in
              </p>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="copyright-text">&copy; 2026 The Reel Company Co.</span>
          </div>
          <p className="footer-studio-tag">UGC &amp; Content Production Studio</p>
        </div>

        {/* ════════════════ BIG FOOTER BRANDING (FINAL TERMINATING ELEMENT) ════════════════ */}
        <div className="footer-big-branding-wrap" aria-label="The Reel Company">
          <div className="footer-big-branding-glow" aria-hidden="true"></div>
          <svg
            viewBox="0 0 1700 160"
            width="100%"
            height="100%"
            className="footer-big-branding-svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="footerBrandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="22%" stopColor="#ff4d4d" />
                <stop offset="50%" stopColor="#e50914" />
                <stop offset="78%" stopColor="#660003" />
                <stop offset="100%" stopColor="#100203" />
              </linearGradient>
              <filter id="footerGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(229, 9, 20, 0.55)" />
              </filter>
            </defs>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="central"
              fill="url(#footerBrandGrad)"
              filter="url(#footerGlow)"
              style={{
                fontFamily: "var(--font-head), 'Plus Jakarta Sans', sans-serif",
                fontWeight: 900,
                fontSize: "148px",
                letterSpacing: "-0.015em",
              }}
            >
              <tspan>THE</tspan>
              <tspan dx="42">REEL</tspan>
              <tspan dx="42">COMPANY</tspan>
            </text>
          </svg>
        </div>
      </footer>

      {/* Discovery Call Lead Capture Modal */}
      <DiscoveryCallModal
        isOpen={discoveryModalOpen}
        onClose={closeDiscoveryModal}
        triggerRef={lastActiveCtaRef}
      />

      {/* Portfolio Access Lead Capture Modal */}
      <PortfolioAccessModal
        isOpen={portfolioModalOpen}
        onClose={closePortfolioModal}
      />
    </>
  );
}
