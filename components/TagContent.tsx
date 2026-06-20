'use client';

import { motion } from 'motion/react';
import { Post } from '@/types/post';
import { PostCard } from '@/components/PostCard';
import { PageLayout } from '@/components/PageLayout';
import { StatusLine } from '@/components/StatusLine';
import { ArrowLeft, ArrowDown, Hash } from 'lucide-react';
import Link from 'next/link';

interface TagContentProps {
  posts: Post[];
  allPosts: Post[];
  tag: string;
}

export function TagContent({ posts, allPosts, tag }: TagContentProps) {
  return (
    <PageLayout allPosts={allPosts} snap={true}>
      {/* Immersive Tag Hero Slide */}
      <div className="min-h-screen flex flex-col justify-start snap-start px-6 md:px-12 relative overflow-hidden pt-20 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-between"
        >
          <div>
            <div className="mb-4">
              <Link 
                href="/tags"
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Torna ai Tags
              </Link>
            </div>

            <div className="relative py-4 flex flex-col justify-center min-h-[50vh]">
              {/* Background Big Tag Character indicator */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-0 select-none pointer-events-none flex items-center justify-center overflow-visible">
                <span className="text-[60vw] md:text-[30vw] font-serif font-light leading-none text-zinc-900/5 dark:text-zinc-100/10 select-none">
                  #
                </span>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <Hash className="w-5 h-5 text-emerald-500" />
                  <StatusLine label="Archivio Tags" sublabel={`Filtro attivo: ${tag}`} theme="emerald" />
                </div>
                
                <h1 className="text-5xl sm:text-6xl md:text-[6vw] font-serif tracking-tighter leading-none mb-8 italic text-zinc-900 dark:text-zinc-100">
                  {tag}
                </h1>

                <p className="text-zinc-500 dark:text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed font-serif italic">
                  Visualizzazione di {posts.length} {posts.length === 1 ? 'voce' : 'voci'} associate a questa sezione della narrazione bio-digitale.
                </p>
              </div>
            </div>
          </div>

          <div className="pb-16 flex flex-col gap-6">
            <div className="flex items-center gap-6 font-mono group cursor-pointer w-fit">
              <div className="w-16 h-[1px] bg-zinc-200 dark:bg-zinc-800 transition-all duration-700 group-hover:w-32" />
              <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-500 transition-colors group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                Scorri per esplorare
              </span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-4 h-4 text-emerald-500/80" strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Matching Posts in the same style */}
      {posts.map((post, index) => (
        <PostCard key={post.slug} post={post} index={index} />
      ))}
    </PageLayout>
  );
}
