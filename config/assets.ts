/**
 * Centralized Asset Configuration Dictionary & Manifest
 * Single Source of Truth for all media assets, logos, videos, images, animations, and external endpoints.
 * Production-ready for Hostinger deployment.
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
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787662132/CN1098_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787662132/CN1098_watermarked.jpg',
        label: 'Creative UGC 01',
      },
      {
        id: 'p2',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661073/CN0804_1__watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661073/CN0804_1__watermarked.jpg',
        label: 'Creative UGC 02',
      },
      {
        id: 'p3',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661072/CN0663_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661072/CN0663_watermarked.jpg',
        label: 'Creative UGC 03',
      },
      {
        id: 'p4',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661071/CN2473_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661071/CN2473_watermarked.jpg',
        label: 'Creative UGC 04',
      },
      {
        id: 'p5',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661069/CN2539_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661069/CN2539_watermarked.jpg',
        label: 'Creative UGC 05',
      },
      {
        id: 'p6',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661064/SK-86_1_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661064/SK-86_1_watermarked.jpg',
        label: 'Creative UGC 06',
      },
      {
        id: 'p7',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661062/mount_everest_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661062/mount_everest_watermarked.jpg',
        label: 'Creative UGC 07',
      },
      {
        id: 'p8',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661059/CN2423_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661059/CN2423_watermarked.jpg',
        label: 'Creative UGC 08',
      },
      {
        id: 'p9',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787661025/CN0581_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787661025/CN0581_watermarked.jpg',
        label: 'Creative UGC 09',
      },
      {
        id: 'p10',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787660985/CN1064_watermarked.webm',
        type: 'video/webm',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787660985/CN1064_watermarked.jpg',
        label: 'Creative UGC 10',
      },
      {
        id: 'p11',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787662197/CN2579_watermarked.mp4',
        type: 'video/mp4',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787662197/CN2579_watermarked.jpg',
        label: 'Creative UGC 11',
      },
      {
        id: 'p12',
        src: 'https://res.cloudinary.com/cy9upvoa/video/upload/v1787662175/CN2463_watermarked.mp4',
        type: 'video/mp4',
        poster: 'https://res.cloudinary.com/cy9upvoa/video/upload/so_0,f_auto,q_auto,w_600/v1787662175/CN2463_watermarked.jpg',
        label: 'Creative UGC 12',
      },
    ],
  },

  animations: {
    hero: {
      scrollCameraZoom: {
        name: 'GSAP ScrollTrigger 3D Camera Zoom',
        component: 'LensIntroHero',
      },
      cameraPerspective3D: {
        name: 'GSAP ScrollTrigger 3D Camera Perspective Tilt',
        component: 'ScrollCameraHero',
      },
      lensEyeZoom: {
        name: 'GSAP ScrollTrigger Lens Eye Intro Zoom',
        component: 'LensZoomHero',
      },
      editorialMarquee: {
        name: 'Infinite Multi-Row Editorial Service Marquee',
        component: 'EditorialMarqueeSection',
      },
    },
    process: {
      script: {
        id: 'script',
        name: 'Script & Hook Architecture Interactive Canvas Animation',
        step: '01',
      },
      film: {
        id: 'film',
        name: 'Pan-India Creator Network Film Studio Animation',
        step: '02',
      },
      edit: {
        id: 'edit',
        name: 'Fast-Paced Motion Graphics & Waveform Jump-Cut Animation',
        step: '03',
      },
      measure: {
        id: 'measure',
        name: 'Real-time Performance Ad Analytics & ROI Chart Animation',
        step: '04',
      },
    },
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
