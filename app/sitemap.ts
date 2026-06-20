import { MetadataRoute } from 'next';
import { getPosts, getAllTags, getPageSlugs } from '@/lib/posts';

export const dynamic = 'force-static';

// Fallback to the production or preview host URL
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Core Pages
  const corePages = ['', '/privacy', '/cookie'];
  const now = new Date();

  corePages.forEach((path) => {
    sitemapEntries.push({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? 'daily' : 'monthly',
      priority: path === '' ? 1.0 : 0.4,
    });
  });

  // 2. Individual Journal Entries (loaded dynamically via ?post=)
  try {
    const posts = getPosts();
    posts.forEach((post) => {
      sitemapEntries.push({
        url: `${BASE_URL}/?post=${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }

  // 3. Dynamic Pages (Manifesto, About etc)
  try {
    const pageSlugs = getPageSlugs();
    pageSlugs.forEach((slug) => {
      sitemapEntries.push({
        url: `${BASE_URL}/pages/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error('Error fetching pages for sitemap:', error);
  }

  // 4. Dynamic Tag Archives
  try {
    const tags = getAllTags();
    tags.forEach((tag) => {
      sitemapEntries.push({
        url: `${BASE_URL}/tags/${tag.toLowerCase()}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    });
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error);
  }

  return sitemapEntries;
}
