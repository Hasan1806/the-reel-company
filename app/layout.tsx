import type { Metadata } from 'next';
import Script from 'next/script';
import { Plus_Jakarta_Sans } from 'next/font/google';
import MetaPixelTracker from '@/components/MetaPixelTracker';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'The Reel Company — Studio-Quality UGC & Content Production',
  description: 'The Reel Company delivers studio-quality UGC and ad videos for brands. On-demand, affordable, and delivered quickly. Stop struggling to create content.',
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
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://deftform.com" />
        <link rel="preconnect" href="https://share.deftform.com" />
        <link rel="dns-prefetch" href="https://share.deftform.com" />
        <noscript>
          <style>{`
            .intro-lens-scroll-section { height: auto !important; }
            .intro-lens-sticky-viewport { position: relative !important; height: auto !important; }
            .intro-black-bg, .intro-lens-layer, .intro-readability-overlay, .intro-text-cta-layer, .temp-transition-stats-wrap { display: none !important; }
            .main-hero-preview-layer { position: relative !important; pointer-events: auto !important; opacity: 1 !important; }
          `}</style>
        </noscript>
      </head>
      <body suppressHydrationWarning>
        {/* Meta Pixel Base Script - Loaded with lazyOnload to prioritize initial rendering */}
        <Script
          id="meta-pixel-base"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
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
