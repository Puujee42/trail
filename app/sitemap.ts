import { MetadataRoute } from 'next';
import { getAllTrips } from '@/lib/mongo/trips';
import { getPosts } from '@/lib/mongo/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.mongoltrail.com';
  const locales = ['mn', 'en', 'ko'];

  // 1. Absolute Root Homepage (The very first entry)
  const homepages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    }
  ];

  // 2. Localized Homepages (e.g., /mn, /en, /ko)
  for (const locale of locales) {
    homepages.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    });
  }

  // 3. Other Static Routes
  const otherRoutes = [
    '/about',
    '/packages',
    '/packages/europe',
    '/packages/mongolia',
    '/blog',
    '/contact',
    '/faq',
    '/custom-trip',
    '/tour-calendar',
    '/rewards',
  ];

  const staticRoutes: MetadataRoute.Sitemap = [];
  for (const route of otherRoutes) {
    for (const locale of locales) {
      staticRoutes.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/contact' ? 'yearly' : 'monthly',
        priority: 0.8,
      });
    }
  }

  // 4. Dynamic Routes: Trips
  let tripRoutes: MetadataRoute.Sitemap = [];
  try {
    const trips = await getAllTrips();
    for (const trip of trips) {
      for (const locale of locales) {
        tripRoutes.push({
          url: `${baseUrl}/${locale}/tours/${trip._id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      }
    }
  } catch (error) {
    console.error('Sitemap Error: Failed to fetch trips', error);
  }

  // 5. Dynamic Routes: Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPosts();
    for (const post of posts) {
      for (const locale of locales) {
        blogRoutes.push({
          url: `${baseUrl}/${locale}/blog/${post._id}`,
          lastModified: new Date(post.date || new Date()),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch (error) {
    console.error('Sitemap Error: Failed to fetch posts', error);
  }

  // 6. Dynamic Routes: Destinations (pSEO)
  let destinationRoutes: MetadataRoute.Sitemap = [];
  try {
    const { getAllDestinations } = await import('@/lib/mongo/destinations');
    const destinations = await getAllDestinations();
    for (const dest of destinations) {
      for (const locale of locales) {
        destinationRoutes.push({
          url: `${baseUrl}/${locale}/destinations/${dest.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    }
  } catch (error) {
    console.error('Sitemap Error: Failed to fetch destinations', error);
  }

  // Combine in order: Homepages FIRST, then static, then trips, then destinations, then blogs
  return [...homepages, ...staticRoutes, ...tripRoutes, ...destinationRoutes, ...blogRoutes];
}