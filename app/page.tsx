import { Metadata } from 'next';
import { getPosts, getGraphData } from '@/lib/posts';
import { HomeContent } from '@/components/HomeContent';
import { siteConfig } from '@/site.config';

interface PageProps {
  searchParams: Promise<{ post?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const postSlug = params.post;
  
  if (postSlug) {
    const posts = getPosts();
    const post = posts.find((p) => p.slug === postSlug);
    if (post) {
      return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
          title: `${post.title} | ${siteConfig.name}`,
          description: post.excerpt,
          type: 'article',
          url: `/?post=${post.slug}`,
          publishedTime: new Date(post.date).toISOString(),
          authors: [siteConfig.author.name],
          tags: post.tags,
          images: [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            }
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title: post.title,
          description: post.excerpt,
          images: [post.image],
        },
      };
    }
  }
  
  return {
    title: siteConfig.blogTitle,
    description: siteConfig.blogDescription,
  };
}

export default async function Home({ searchParams }: PageProps) {
  const posts = getPosts();
  const graphData = getGraphData();
  const params = await searchParams;
  const postSlug = params.post;
  
  // Dynamic JSON-LD structured data markup for maximum search engine performance
  const matchedPost = postSlug ? posts.find((p) => p.slug === postSlug) : null;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app';
  
  let jsonLd = {};
  if (matchedPost) {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': matchedPost.title,
      'description': matchedPost.excerpt,
      'image': matchedPost.image,
      'datePublished': new Date(matchedPost.date).toISOString(),
      'author': {
        '@type': 'Person',
        'name': siteConfig.author.name,
        'description': siteConfig.author.bio,
      },
      'publisher': {
        '@type': 'Organization',
        'name': siteConfig.name,
        'logo': {
          '@type': 'ImageObject',
          'url': `${baseUrl}/favicon.svg`
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${baseUrl}/?post=${matchedPost.slug}`
      }
    };
  } else {
    // Standard Website & blog schema
    jsonLd = {
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
  }

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
