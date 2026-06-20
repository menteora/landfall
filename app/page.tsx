import { Metadata } from 'next';
import { getPosts, getGraphData } from '@/lib/posts';
import { HomeContent } from '@/components/HomeContent';
import { siteConfig } from '@/site.config';

export const metadata: Metadata = {
  title: siteConfig.blogTitle,
  description: siteConfig.blogDescription,
};

export default async function Home() {
  const posts = getPosts();
  const graphData = getGraphData();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app';
  
  // Standard Website & blog schema
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': siteConfig.blogTitle,
    'description': siteConfig.blogDescription,
    'url': baseUrl,
    'author': {
      '@type': 'Person',
      'name': siteConfig.author.name,
      'description': siteConfig.author.bio,
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteConfig.name,
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeContent posts={posts} graphData={graphData} />
    </>
  );
}

