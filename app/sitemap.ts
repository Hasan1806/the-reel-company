import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://www.thereelcompany.in'
  ).replace(/\/+$/, '');

  return [
    {
      url: `${baseUrl}`,
    },
    {
      url: `${baseUrl}/privacy-policy`,
    },
  ];
}
