# Architectural & Engineering Decision Record (ADR)
## The Reel Company — Production Architecture & Hostinger Deployment

---

## 1. Hosting Environment & Execution Runtime Decision

### **Context**
The website was previously deployed on Vercel. We are migrating to **Hostinger** while ensuring zero downtime, identical visual aesthetics, preserved animations, and intact backend API endpoints (`/api/discovery-call`, `/api/portfolio-access`).

### **Decision**
- **Selected Mode:** **Hostinger Node.js Application (Node.js 18+ / 20+ LTS runtime)**.
- **Start Command:** `npm run start` (`next start`).
- **Build Command:** `npm run build` (`next build`).

### **Justification**
1. **API Route Preservation:** The website features two active API Route handlers (`/api/discovery-call` and `/api/portfolio-access`) that sanitize leads, process Google Sheet webhooks, and submit lead captures to FormRobin. Forcing a static export (`output: 'export'`) would disable server-side API Route Handlers. Running as a Node.js web application retains 100% of the backend lead capture functionality.
2. **Dynamic Headers & Security:** Hostinger Node.js execution allows Next.js to serve production security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) and HTTP long-term caching headers (`Cache-Control: public, max-age=31536000, immutable`) natively.
3. **Universal Compatibility:** Standard Next.js server mode runs identically on Hostinger, Vercel, Docker, and standard Linux VPS servers without vendor lock-in.

---

## 2. Centralized Asset Dictionary Decision (`config/assets.ts`)

### **Context**
Media assets (camera lens hero images, responsive WebP/AVIF cuts, portfolio video files, posters, and brand logos) were previously referenced across multiple component files.

### **Decision**
- Created `config/assets.ts` as the single source of truth for all media paths, srcset definitions, and video items.
- Preserved all existing files in `/public` exactly as they are.

### **Justification**
1. **Zero URL Regressions:** Preserving the existing public file paths ensures that any cached assets, search engine index references, and external links continue to resolve with HTTP 200.
2. **Type Safety & Single Source of Truth:** `ASSETS` provides TypeScript autocomplete and prevents typos in video poster paths, srcSet strings, or fallback URLs.
3. **Decoupled Configuration:** When changing or adding portfolio reels or service graphics in the future, developers only need to edit `config/assets.ts` instead of modifying core JSX components.

---

## 3. Media & Performance Optimization Decisions

### **Context**
The website is visually rich with 4K camera lens zoom scroll animations, 8 portfolio video streams, and 3D metallic branding.

### **Decisions & Justifications**

#### A. Hero Camera Lens Preloading Alignment (`app/layout.tsx`)
- **Action:** Updated `app/layout.tsx` `<head>` preload links to match the active responsive hero assets (`camera-lens-black-center-hero-*.avif` for 480px, 768px, 1920px).
- **Justification:** Preloading the exact responsive AVIF file that matches the client device's viewport width eliminates Largest Contentful Paint (LCP) delays and prevents downloading redundant desktop-resolution assets on mobile phones.

#### B. Portfolio Video Viewport Streaming (`components/ReelCompanySite.tsx`)
- **Action:** Video elements in the portfolio section utilize `IntersectionObserver` with `preload="metadata"` when approaching the viewport and `preload="none"` when far offscreen.
- **Justification:** Preloading 8 full MP4 video files on initial page load would consume >25MB of network bandwidth and degrade mobile Core Web Vitals. Viewport-triggered streaming preserves instant playback on user arrival while keeping initial page weight lightweight (<160kB initial JS).

#### C. Immutable Static Asset Caching (`next.config.mjs`)
- **Action:** Configured `Cache-Control: public, max-age=31536000, immutable` for all static media (`.avif`, `.webp`, `.png`, `.jpg`, `.mp4`, `/_next/static/*`).
- **Justification:** Instructs browser caches and CDN/Hostinger LiteSpeed/Nginx reverse proxies to cache versioned media indefinitely, eliminating repeated network roundtrips for returning visitors.

---

## 4. Stability & Fast Refresh Decisions

### **Context**
During local development and continuous edits, GSAP ScrollTrigger and video DOM contexts require clean lifecycle management.

### **Decisions & Justifications**
1. **Removal of `distDir: 'dist'`:**
   - *Justification:* On Windows and Linux dev environments, redirecting the dev cache into a custom `dist` directory causes file-locking collisions (`EBUSY`) during Fast Refresh. Allowing Next.js to manage its standard `.next` internal cache guarantees seamless instant hot-reloading.
2. **`reactStrictMode: false` in Development:**
   - *Justification:* React 18 StrictMode double-mounts components in development mode. For complex canvas rendering and GSAP ScrollTrigger pinning, double-mounting creates orphaned timeline listeners in memory. Setting `reactStrictMode: false` prevents GSAP timeline collisions during HMR while retaining full type safety and linting.

---

## 5. Technical SEO Architecture Decisions

### **Context**
Search engine crawlers require standards-compliant `sitemap.xml` and `robots.txt` endpoints referencing the canonical production domain (`https://www.thereelcompany.in`).

### **Decisions & Justifications**
1. **Native Next.js Metadata Routes (`app/sitemap.ts`, `app/robots.ts`):**
   - *Justification:* Avoids heavy third-party npm dependencies. Next.js generates static, valid XML/TXT during `next build` at `/sitemap.xml` and `/robots.txt`.
2. **Environment Variable Fallback:**
   - *Justification:* Uses `process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thereelcompany.in'` ensuring correct URLs regardless of staging or production deployment environments.
3. **Disallow `/api/` in Robots:**
   - *Justification:* Prevents web crawlers from needlessly indexing backend lead submission endpoints while permitting full crawling of all public marketing pages (`/` and `/privacy-policy`).

---

## 6. Hostinger Deployment & Zero-Downtime Migration Strategy

### **Decision**
- Maintain existing live Vercel deployment while deploying and verifying the Hostinger Node.js Web App.
- Only switch DNS records (A / CNAME) after the Hostinger staging URL is 100% verified.

### **Justification**
- Eliminates any possibility of website downtime.
- Leaves Vercel as an instant rollback target during the migration window.
