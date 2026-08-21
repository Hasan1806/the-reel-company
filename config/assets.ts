/**
 * Centralized Asset Configuration Dictionary
 * Single Source of Truth for all media assets, logos, videos, and images across the application.
 */

export const ASSETS = {
  logos: {
    primary: '/trc-logo.png',
    mark: '/trc-logo-mark.png',
    dark: '/trc-logo-dark.png',
    full: '/trc-logo-full.jpg',
  },

  hero: {
    cameraLens: {
      fallbackJpg: '/camera-lens-black-center-hero.jpg',
      avifSrcSet:
        '/camera-lens-black-center-hero-480.avif 480w, /camera-lens-black-center-hero-768.avif 768w, /camera-lens-black-center-hero-1280.avif 1280w, /camera-lens-black-center-hero-1920.avif 1920w',
      webpSrcSet:
        '/camera-lens-black-center-hero-480.webp 480w, /camera-lens-black-center-hero-768.webp 768w, /camera-lens-black-center-hero-1280.webp 1280w, /camera-lens-black-center-hero-1920.webp 1920w',
      preloads: {
        mobileAvif: '/camera-lens-black-center-hero-480.avif',
        tabletAvif: '/camera-lens-black-center-hero-768.avif',
        desktopAvif: '/camera-lens-black-center-hero-1920.avif',
      },
    },
    video: {
      src: '/videos/hero-video.mp4',
      poster: '/videos/hero-video-poster.webp',
      fallback: '/videos/portfolio/portfolio-1.mp4',
      name: 'CN-Outro-Animation.mp4',
    },
  },

  portfolio: [
    {
      id: 'p1',
      src: '/videos/portfolio/portfolio-1.mp4',
      poster: '/videos/portfolio/portfolio-1-poster.webp',
      label: 'E-Commerce UGC Ad',
    },
    {
      id: 'p2',
      src: '/videos/portfolio/portfolio-2.mp4',
      poster: '/videos/portfolio/portfolio-2-poster.webp',
      label: 'Performance Ad Creative',
    },
    {
      id: 'p3',
      src: '/videos/portfolio/portfolio-3.mp4',
      poster: '/videos/portfolio/portfolio-3-poster.webp',
      label: 'Brand Storytelling',
    },
    {
      id: 'p4',
      src: '/videos/portfolio/portfolio-4.mp4',
      poster: '/videos/portfolio/portfolio-4-poster.webp',
      label: 'Direct-Response Reel',
    },
    {
      id: 'p5',
      src: '/videos/portfolio/portfolio-5.mp4',
      poster: '/videos/portfolio/portfolio-5-poster.webp',
      label: 'Scroll-Stopping Hook',
    },
    {
      id: 'p6',
      src: '/videos/portfolio/portfolio-6.mp4',
      poster: '/videos/portfolio/portfolio-6-poster.webp',
      label: 'Lifestyle & Fitness Ad',
    },
    {
      id: 'p7',
      src: '/videos/portfolio/portfolio-7.mp4',
      poster: '/videos/portfolio/portfolio-7-poster.webp',
      label: 'Viral Creator Reel',
    },
    {
      id: 'p8',
      src: '/videos/portfolio/portfolio-8.mp4',
      poster: '/videos/portfolio/portfolio-8-poster.webp',
      label: 'High-ROI Paid Social',
    },
  ],

  services: [
    {
      id: 'scriptwriting',
      title: 'Scriptwriting & Hook Architecture',
      description:
        'Data-backed 3-second visual and psychological hooks tailored to your exact target audience.',
      imageWebp: '/services/scriptwriting.webp',
      imageJpg: '/services/scriptwriting.jpg',
    },
    {
      id: 'filming',
      title: 'Pan-India Creator Network & Studio Filming',
      description:
        'Access 500+ vetted UGC creators and professional studio-grade 4K camera production setups.',
      imageWebp: '/services/filming.webp',
      imageJpg: '/services/filming.jpg',
    },
    {
      id: 'motion-graphics',
      title: 'Fast-Paced Editing & Motion Graphics',
      description:
        'Snappy jump-cuts, dynamic on-screen typography, sound effects, and native platform UI elements.',
      imageWebp: '/services/motion-graphics.webp',
      imageJpg: '/services/motion-graphics.jpg',
    },
    {
      id: 'sound-design',
      title: 'Voiceover & Sound Engineering',
      description:
        'Studio voice talents in multiple languages plus custom audio mixing for immersive sound design.',
      imageWebp: '/services/sound-design.webp',
      imageJpg: '/services/sound-design.jpg',
    },
    {
      id: 'vfx',
      title: '3D Product CGI & Visual Effects',
      description:
        'Hyper-realistic CGI product models, explosive unboxings, and fluid simulations for high CTR.',
      imageWebp: '/services/vfx.webp',
      imagePng: '/services/vfx.png',
    },
  ],
} as const;

export type AssetsConfig = typeof ASSETS;
