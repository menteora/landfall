import { Metadata } from 'next';
import { getPage, getPageSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { BlurImage } from '@/components/BlurImage';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { siteConfig } from '@/site.config';

export async function generateStaticParams() {
  const slugs = getPageSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    return {
      title: 'Pagina non trovata',
    };
  }

  const cleanDescription = page.subtitle || page.content.slice(0, 155).replace(/[#*_`]/g, '') + '...';

  return {
    title: `${page.title}`,
    description: cleanDescription,
    openGraph: {
      title: `${page.title} | ${siteConfig.name}`,
      description: cleanDescription,
      type: 'article',
      url: `/pages/${slug}`,
      images: page.image ? [{ url: page.image, alt: page.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: cleanDescription,
      images: page.image ? [page.image] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getPage(slug);

  if (!page) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app';

  // Breadcrumb schema LD
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
        'name': page.title,
        'item': `${baseUrl}/pages/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors mb-20"
      >
        <ArrowLeft className="w-4 h-4" />
        Return Home
      </Link>

      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 italic">{page.title}</h1>
        {page.subtitle && (
          <p className="text-xl md:text-2xl text-zinc-500 font-serif leading-relaxed">
            {page.subtitle}
          </p>
        )}
      </header>

      {page.image && (
        <div className="relative aspect-[16/9] mb-20 overflow-hidden rounded-sm">
          <BlurImage
            src={page.image}
            alt={page.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      <article className="markdown-body prose dark:prose-invert max-w-none">
        <ReactMarkdown
          components={{
            p: ({ children }) => (
              <p className="text-xl md:text-2xl leading-relaxed text-zinc-800 dark:text-zinc-300 font-serif mb-12">
                {children}
              </p>
            ),
            h1: ({ children }) => <h2 className="text-3xl font-serif italic mb-8">{children}</h2>,
            h2: ({ children }) => <h2 className="text-2xl font-serif italic mb-8">{children}</h2>,
            ul: ({ children }) => <ul className="space-y-4 mb-12 list-none p-0">{children}</ul>,
            li: ({ children }) => (
              <li className="flex gap-4 items-center font-mono text-sm tracking-widest text-zinc-500">
                <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                {children}
              </li>
            ),
          }}
        >
          {page.content}
        </ReactMarkdown>
      </article>
      
      <footer className="mt-32 pt-16 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex justify-between items-center font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-400">
          <span>ETH. ARCHIVE</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
