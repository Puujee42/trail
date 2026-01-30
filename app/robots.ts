import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.mongoltrail.com';

  return {
    rules: [
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot', 'ClaudeBot'],
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/api/', '/sign-in/', '/sign-up/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
