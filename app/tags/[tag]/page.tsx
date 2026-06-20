import { Metadata } from 'next';
import { getPostsByTag, getPosts, getAllTags } from '@/lib/posts';
import { TagContent } from '@/components/TagContent';
import Link from 'next/link';
import { siteConfig } from '@/site.config';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const capitalizedTag = decodedTag
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const titleMessage = `#${capitalizedTag} | Tags di ${siteConfig.name}`;
  const descriptionMessage = `Scopri tutte le riflessioni e le procedure relative al tag #${capitalizedTag} nel Journal di Landfall.`;

  return {
    title: titleMessage,
    description: descriptionMessage,
    openGraph: {
      title: titleMessage,
      description: descriptionMessage,
      type: 'website',
      url: `/tags/${tag.toLowerCase()}`,
    },
    twitter: {
      card: 'summary',
      title: titleMessage,
      description: descriptionMessage,
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  const allPosts = getPosts();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app';

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-serif italic mb-8">Nessun contenuto trovato per #{decodedTag}</h1>
        <Link href="/tags" className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors">Torna ai tags</Link>
      </div>
    );
  }

  // Dynamic Breadcrumb JSON-LD
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Tags',
        'item': `${baseUrl}/tags`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': decodedTag,
        'item': `${baseUrl}/tags/${decodedTag.toLowerCase()}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <TagContent posts={posts} allPosts={allPosts} tag={decodedTag} />
    </>
  );
}
