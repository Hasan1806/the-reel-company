import type { Metadata } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans } from 'next/font/google';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'optional',
  variable: '--font-plus-jakarta',
  preload: true,
  adjustFontFallback: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.thereelcompany.in'),
  title: 'The Reel Company — Studio-Quality UGC & Content Production',
  description: 'The Reel Company delivers studio-quality UGC and ad videos for brands. On-demand, affordable, and delivered quickly. Stop struggling to create content.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Reel Company — Studio-Quality UGC & Content Production',
    description: 'The Reel Company delivers studio-quality UGC and ad videos for brands. On-demand, affordable, and delivered quickly.',
    url: 'https://www.thereelcompany.in',
    siteName: 'The Reel Company',
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="preload" as="image" href="/videos/hero-curve/hero-curve-2-poster.webp" type="image/webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/trc-logo.png" type="image/png" />
        <link rel="preconnect" href="https://cdn.deftform.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.deftform.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.deftform.com" />
        <link rel="dns-prefetch" href="https://api.deftform.com" />
      </head>
      <body suppressHydrationWarning>
        {/* Meta Pixel Base Script - Executed on first interaction or idle timeout to protect initial TBT */}
        <Script
          id="meta-pixel-base"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window._initPixel = function() {
                if (window._pixelLoaded) return;
                window._pixelLoaded = true;
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '1495345585967447');
                fbq('track', 'PageView');
              };
              ['scroll', 'touchstart', 'click', 'mousemove', 'keydown'].forEach(function(e) {
                window.addEventListener(e, window._initPixel, { once: true, passive: true });
              });
            `,
          }}
        />
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=1495345585967447&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>

        {/* Client Route Change PageView Tracker */}
        <MetaPixelTracker />

        {children}
      </body>
    </html>
  );
}
