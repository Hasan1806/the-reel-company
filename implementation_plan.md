# Hostinger Production Migration & Performance Optimization Plan

A comprehensive engineering plan to audit, optimize, centralize assets, and prepare The Reel Company website for high-performance deployment on Hostinger without changing visual UI, animations, routes, or existing functionality.

## Proposed Changes

### 1. Centralized Asset Architecture (`config/assets.ts`)
- Create [NEW] [`config/assets.ts`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/config/assets.ts) acting as the single source of truth for all:
  - Logos (primary transparent 3D metallic emblem, dark fallback, icon mark)
  - Hero camera lens responsive picture sets (AVIF, WebP, JPEG fallbacks for 480w, 768w, 1280w, 1920w)
  - Hero ambient video & poster
  - Portfolio video streams & WebP poster thumbnails (1 through 8)
  - Service capability illustrations (filming, motion graphics, scriptwriting, sound design, VFX in WebP/JPEG)
  - Process icons & SVG assets

### 2. Performance & Media Optimizations
- Update [`app/layout.tsx`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/app/layout.tsx) to preload the exact active Hero camera lens responsive source (`/camera-lens-black-center-hero-*.avif`) aligned with `config/assets.ts`.
- Update [`components/LensIntroHero.tsx`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/components/LensIntroHero.tsx) and [`components/ReelCompanySite.tsx`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/components/ReelCompanySite.tsx) to consume `ASSETS` cleanly.
- Configure production HTTP caching headers in [`next.config.mjs`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/next.config.mjs) for static assets (`/videos/*`, `/services/*`, `/_next/static/*`) to maximize TTFB and caching efficiency on Hostinger.

### 3. Hostinger Deployment Configuration
- Update [`package.json`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/package.json) with `engines` field specifying Node.js `>=18.17.0` (Hostinger LTS).
- Create [NEW] [`.nvmrc`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/.nvmrc) pinning Node.js `20.18.0`.
- Create [NEW] [`.env.example`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/.env.example) documenting all production environment variables with safe defaults.
- Create [NEW] [`decision.md`](file:///C:/Users/SAYYE/.gemini/antigravity-ide/scratch/the-reel-company/decision.md) providing full architectural, performance, and deployment justifications.

## Verification Plan

### Automated Build Verification
- Execute `npm run build` locally in non-interactive environment to confirm:
  - Exit code `0`
  - Zero TypeScript compiler errors
  - Zero Next.js route generation errors
  - Successful static pre-rendering of `/`, `/privacy-policy`, `/sitemap.xml`, and `/robots.txt`
  - Successful bundling of API Route handlers (`/api/discovery-call`, `/api/portfolio-access`)

### Manual Verification
- Test all pages (`/`, `/privacy-policy`, `/sitemap.xml`, `/robots.txt`)
- Verify all interactive modals (Discovery Call, Portfolio Access), video playbacks, GSAP animations, and mobile responsive behavior.
- Git commit and push to GitHub `origin main`.
