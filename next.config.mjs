/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.mixkit.co',
      },
    ],
  },
  async headers() {
    const staticCacheHeader = isProd
      ? [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ]
      : [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, max-age=0, must-revalidate',
          },
        ];

    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|mp4|webm|woff2|woff|ttf)',
        headers: staticCacheHeader,
      },
      {
        source: '/_next/static/:path*',
        headers: staticCacheHeader,
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          ...(isProd
            ? []
            : [
                {
                  key: 'Cache-Control',
                  value: 'no-cache, no-store, max-age=0, must-revalidate',
                },
              ]),
        ],
      },
    ];
  },
};

export default nextConfig;

