/**
 * Centralized Asset Configuration Dictionary & Manifest
 * Single Source of Truth for all media assets, logos, videos, images, and external endpoints.
 */

export interface FrameSequenceOptions {
  basePath: string;
  totalFrames: number;
  extension?: string;
  startFrame?: number;
  padLength?: number;
  prefix?: string;
}

/**
 * Reusable helper to generate clean frame sequence URLs for scroll-triggered / canvas animations
 */
export const createFrameSequence = ({
  basePath,
  totalFrames,
  extension = 'webp',
  startFrame = 1,
  padLength = 4,
  prefix = '',
}: FrameSequenceOptions): string[] => {
  return Array.from({ length: totalFrames }, (_, index) => {
    const frameNumber = String(startFrame + index).padStart(padLength, '0');
    return `${basePath}/${prefix}${frameNumber}.${extension}`;
  });
};

export const ASSETS = {
  brand: {
    logo: {
      primary: '/trc-logo.png',
      mark: '/trc-logo-mark.png',
      dark: '/trc-logo-dark.png',
      full: '/trc-logo-full.jpg',
      alt: 'The Reel Company',
    },
  },

  images: {
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
      cutouts: {
        transparentCutoutPng: '/camera-lens-transparent-cutout.png',
        transparentCutoutAvif: '/camera-lens-transparent-cutout.avif',
        transparentCutoutWebp: '/camera-lens-transparent-cutout.webp',
        cameraHeroPng: '/camera-hero.png',
        cameraHeroWebp: '/camera-hero.webp',
        cameraHeroAvif: '/camera-hero.avif',
        lensEyeBgPng: '/lens-eye-bg.png',
        lensEyeBgWebp: '/lens-eye-bg.webp',
        lensEyeBgAvif: '/lens-eye-bg.avif',
      },
    },
    services: {
      scriptwriting: {
        webp: '/services/scriptwriting.webp',
        jpg: '/services/scriptwriting.jpg',
      },
      filming: {
        webp: '/services/filming.webp',
        jpg: '/services/filming.jpg',
      },
      motionGraphics: {
        webp: '/services/motion-graphics.webp',
        jpg: '/services/motion-graphics.jpg',
      },
      soundDesign: {
        webp: '/services/sound-design.webp',
        jpg: '/services/sound-design.jpg',
      },
      vfx: {
        webp: '/services/vfx.webp',
        png: '/services/vfx.png',
      },
    },
  },

  videos: {
    hero: {
      src: '/videos/hero-video.mp4',
      poster: '/videos/hero-video-poster.webp',
      fallback: '/videos/portfolio/portfolio-1.mp4',
      name: 'CN-Outro-Animation.mp4',
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
  },

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

  fonts: {
    primary: {
      family: 'Plus Jakarta Sans',
      weights: '300..800',
      googleUrl:
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap',
    },
  },

  external: {
    formRobinEndpoint: 'https://formrobin.com',
    googleSheetWebhookUrl:
      'https://script.google.com/macros/s/AKfycbyBGm2YZIYt5m41QYT2dx9bkvfI9iXwgs4WZshHwXwklo6rLI4ET8SIN2VoatZV7jpm/exec',
  },

  videoConfig: {
    hero: {
      autoPlay: true,
      muted: true,
      loop: true,
      playsInline: true,
      preload: 'auto' as const,
    },
    portfolio: {
      autoPlay: false,
      muted: true,
      loop: true,
      playsInline: true,
      preloadInView: 'metadata' as const,
      preloadOffscreen: 'none' as const,
    },
  },
} as const;

export const CRITICAL_ASSETS = [
  ASSETS.brand.logo.primary,
  ASSETS.images.hero.cameraLens.preloads.desktopAvif,
  ASSETS.images.hero.cameraLens.preloads.mobileAvif,
  ASSETS.videos.hero.poster,
] as const;

export type AssetDictionary = typeof ASSETS;
