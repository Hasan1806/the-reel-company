import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Reel Company — Studio-Quality UGC & Content Production',
  description: 'The Reel Company delivers studio-quality UGC and ad videos for brands. On-demand, affordable, and delivered quickly. Stop struggling to create content.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://formrobin.com" />
        <link rel="dns-prefetch" href="https://formrobin.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />
        <link rel="preload" as="image" href="/camera-lens-transparent-cutout-480.avif" type="image/avif" media="(max-width: 480px)" />
        <link rel="preload" as="image" href="/camera-lens-transparent-cutout-768.avif" type="image/avif" media="(min-width: 481px) and (max-width: 768px)" />
        <link rel="preload" as="image" href="/camera-lens-transparent-cutout.avif" type="image/avif" media="(min-width: 769px)" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
