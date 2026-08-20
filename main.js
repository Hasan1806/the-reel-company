/* ═══════════════════════════════════════════════════════
   The Reel Company — main.js
   Premium scroll-driven experience
═══════════════════════════════════════════════════════ */

const VIDEOS = [
  { src: '/videos/portfolio/portfolio-1.mp4', label: 'E-Commerce UGC Ad' },
  { src: '/videos/portfolio/portfolio-2.mp4', label: 'Performance Ad Creative' },
  { src: '/videos/portfolio/portfolio-3.mp4', label: 'Brand Storytelling' },
  { src: '/videos/portfolio/portfolio-4.mp4', label: 'Direct-Response Reel' },
  { src: '/videos/portfolio/portfolio-5.mp4', label: 'Scroll-Stopping Hook' },
  { src: '/videos/portfolio/portfolio-6.mp4', label: 'Lifestyle & Fitness Ad' },
  { src: '/videos/portfolio/portfolio-7.mp4', label: 'Viral Creator Reel' },
  { src: '/videos/portfolio/portfolio-8.mp4', label: 'High-ROI Paid Social' },
];

// ─── State ────────────────────────────────────────────
let gsapLoaded = false;
let allVideoEls = [];
let sectionObserver = null;
let statObserver = null;
let problemObserver = null;
let capObserver = null;

// ─── DOM ready ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildPortfolio();
  initHeader();
  initMobileMenu();
  initHeroReveal();
  initHeroVideoUploader();
  initClientMarqueeInteractions();
  initStatObserver();
  initProblemObserver();
  initCapObserver();
  initVideoObserver();
  initCapMouseEffect();
  initBackToTop();
  initFAQAccordion();
  waitForGSAP();
});

// ─── Wait for GSAP ───────────────────────────────────
function waitForGSAP() {
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsapLoaded = true;
    gsap.registerPlugin(ScrollTrigger);
    initGSAP();
  } else {
    setTimeout(waitForGSAP, 100);
  }
}

// ─── Build Portfolio Grid ─────────────────────────────
function buildPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  const carousel = document.getElementById('portfolio-carousel');
  if (!grid || !carousel) return;

  VIDEOS.forEach((v, i) => {
    const card = createVideoCard(v, i);
    grid.appendChild(card.cloneNode(true));

    const mCard = createVideoCard(v, i);
    carousel.appendChild(mCard);
  });

  // Re-query all video elements after building
  allVideoEls = [...document.querySelectorAll('.video-card video')];

  // Add play/pause button listeners
  document.querySelectorAll('.play-pause-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const video = btn.closest('.video-card').querySelector('video');
      if (!video) return;
      if (video.paused) {
        video.play().catch(() => {});
        btn.innerHTML = getPauseIcon();
        btn.setAttribute('aria-label', 'Pause video');
      } else {
        video.pause();
        btn.innerHTML = getPlayIcon();
        btn.setAttribute('aria-label', 'Play video');
      }
    });
  });
}

function createVideoCard(v, i) {
  const card = document.createElement('div');
  card.className = 'video-card';
  card.setAttribute('data-index', i);

  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  video.preload = 'auto';
  video.setAttribute('aria-label', v.label);
  video.src = v.src;

  const topBar = document.createElement('div');
  topBar.className = 'video-card-top-bar';
  topBar.style.justifyContent = 'flex-end';
  topBar.innerHTML = `<span class="video-index-tag">0${i + 1}</span>`;

  card.appendChild(topBar);
  card.appendChild(video);

  video.play().catch(() => {});
  return card;
}

function getPlayIcon() {
  return `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true"><path d="M0 0l10 6L0 12z"/></svg>`;
}
function getPauseIcon() {
  return `<svg width="10" height="12" viewBox="0 0 10 12" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="3.5" height="12"/><rect x="6.5" y="0" width="3.5" height="12"/></svg>`;
}

// ─── Header ──────────────────────────────────────────
function initHeader() {
  const header = document.getElementById('site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = ['hero', 'portfolio', 'capabilities', 'comparison', 'footer-cta'];

  const onScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    // Active nav - find current section by position
    const scrollMid = window.scrollY + window.innerHeight / 3;
    let current = sections[0];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && scrollMid >= el.offsetTop) current = id;
    });
    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── Mobile Menu ─────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('mobile-menu-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  const open = () => {
    toggle.classList.add('open');
    nav.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    toggle.classList.remove('open');
    nav.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const closeBtn = document.getElementById('mobile-nav-close');

  toggle.addEventListener('click', () => {
    toggle.classList.contains('open') ? close() : open();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  nav.querySelectorAll('.mobile-nav-link, .mobile-nav-cta').forEach(link => {
    link.addEventListener('click', close);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
}

// ─── Hero Reveal ─────────────────────────────────────
function initHeroReveal() {
  // Trigger after a short delay (no GSAP needed for initial reveal)
  requestAnimationFrame(() => {
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
}

// ─── Hero 9:16 Video Uploader & Player ───────────────
function initHeroVideoUploader() {
  const video = document.getElementById('hero-preview-video');
  const fileInput = document.getElementById('hero-video-input');
  const filenameEl = document.getElementById('hero-video-name');
  const playBtn = document.getElementById('hero-play-toggle');
  const muteBtn = document.getElementById('hero-mute-toggle');
  if (!video) return;

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('video/')) {
        const fileUrl = URL.createObjectURL(file);
        video.src = fileUrl;
        video.play().catch(() => {});
        if (filenameEl) filenameEl.textContent = file.name;
        updatePlayIcon(true);
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (video.paused) {
        video.play().catch(() => {});
        updatePlayIcon(true);
      } else {
        video.pause();
        updatePlayIcon(false);
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      updateMuteIcon(video.muted);
    });
  }

  function updatePlayIcon(isPlaying) {
    const pauseIcon = playBtn?.querySelector('.icon-pause');
    const playIcon = playBtn?.querySelector('.icon-play');
    if (pauseIcon && playIcon) {
      pauseIcon.style.display = isPlaying ? 'block' : 'none';
      playIcon.style.display = isPlaying ? 'none' : 'block';
    }
  }

  function updateMuteIcon(isMuted) {
    const mutedIcon = muteBtn?.querySelector('.icon-muted');
    const soundIcon = muteBtn?.querySelector('.icon-sound');
    if (mutedIcon && soundIcon) {
      mutedIcon.style.display = isMuted ? 'block' : 'none';
      soundIcon.style.display = isMuted ? 'none' : 'block';
    }
  }
}

// ─── Client Marquee Touch & Interactions ──────────────
function initClientMarqueeInteractions() {
  document.querySelectorAll('.client-item').forEach(item => {
    item.addEventListener('touchstart', () => {
      item.classList.add('active');
    }, { passive: true });
    item.addEventListener('touchend', () => {
      setTimeout(() => item.classList.remove('active'), 1200);
    }, { passive: true });
  });
}

// ─── Stats Intersection Observer ─────────────────────
function initStatObserver() {
  const strip = document.querySelector('.stats-strip');
  if (!strip) return;

  statObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll('.stat-item');
        items.forEach((item, i) => {
          setTimeout(() => item.classList.add('revealed'), i * 120);
        });
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statObserver.observe(strip);
}

// ─── Problem Cards Observer ──────────────────────────
function initProblemObserver() {
  const cards = document.querySelectorAll('.problem-card');
  if (!cards.length) return;

  problemObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  cards.forEach(card => problemObserver.observe(card));
}

// ─── Capabilities Cards Observer ─────────────────────
function initCapObserver() {
  const cards = document.querySelectorAll('.cap-card');
  if (!cards.length) return;

  capObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        capObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => capObserver.observe(card));
}

// ─── Video Playback Observer ──────────────────────────
function initVideoObserver() {
  const section = document.getElementById('portfolio');
  if (!section) return;

  const loadAndPlayVisible = () => {
    document.querySelectorAll('.video-card').forEach(card => {
      const video = card.querySelector('video');
      if (!video) return;
      const rect = card.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      // Lazy load src
      if (inView && !video.src && video.dataset.src) {
        video.src = video.dataset.src;
        video.load();
      }

      if (inView && video.src && video.paused) {
        video.play().catch(() => {});
        const btn = card.querySelector('.play-pause-btn');
        if (btn) btn.innerHTML = getPauseIcon();
      } else if (!inView && !video.paused) {
        video.pause();
        const btn = card.querySelector('.play-pause-btn');
        if (btn) btn.innerHTML = getPlayIcon();
      }
    });
  };

  sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadAndPlayVisible();
        window.addEventListener('scroll', loadAndPlayVisible, { passive: true });
      } else {
        window.removeEventListener('scroll', loadAndPlayVisible);
        document.querySelectorAll('.video-card video').forEach(v => {
          if (!v.paused) v.pause();
        });
      }
    });
  }, { threshold: 0.05 });

  sectionObserver.observe(section);
}

// ─── Capabilities Mouse Effect ────────────────────────
function initCapMouseEffect() {
  if (window.innerWidth < 1024) return;

  document.querySelectorAll('.cap-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
}

// ─── Back to Top ──────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── GSAP Animations ─────────────────────────────────
function initGSAP() {
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
  gsap.utils.toArray('.production-headline, .production-sub').forEach(el => {
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
}

// ─── Smooth anchor scrolling ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    e.preventDefault();
    if (id === 'hero' || id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  });
});

// ─── Single-Open FAQ Accordion ────────────────────────
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const btn = item.querySelector('.faq-trigger-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('is-open');
        otherItem.classList.add('is-closed');
        const otherBtn = otherItem.querySelector('.faq-trigger-btn');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      // If clicked item was closed, open it
      if (!isOpen) {
        item.classList.remove('is-closed');
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

