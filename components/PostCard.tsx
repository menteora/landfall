'use client';

import { motion } from 'motion/react';
import { BlurImage } from './BlurImage';
import { useApp } from '@/context/AppContext';
import { Post } from '@/types/post';
import { StatusLine } from './StatusLine';
import { Zap, BookOpen, Repeat } from 'lucide-react';

const TypeIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'engage': return <Zap className={className} />;
    case 'explain': return <BookOpen className={className} />;
    case 'exchange': return <Repeat className={className} />;
    default: return null;
  }
};

export function PostCard({ post, index }: { post: Post; index: number }) {
  const { setActivePostId, readSlugs } = useApp();
  const isRead = readSlugs.includes(post.slug);
  const isEngage = post.type === 'engage';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ margin: "-10%" }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative w-full h-screen flex flex-col justify-center gap-12 cursor-pointer snap-start border-b border-zinc-100 dark:border-zinc-800 md:border-none px-6 md:px-12 ${isEngage ? 'bg-zinc-50/50 dark:bg-zinc-900/10' : ''}`}
      onClick={() => setActivePostId(post.slug)}
    >
      <div className="max-w-7xl mx-auto w-full relative flex flex-col items-start px-4 md:px-0">
        <div className="flex flex-col gap-8 max-w-xl md:max-w-2xl relative z-10">
          <div className="flex items-center gap-6 font-mono">
            <StatusLine label={isRead ? "Archiviato" : "Nuovo"} />
            <div className={`flex items-center justify-center w-6 h-6 rounded-full border ${
              post.type === 'engage' ? 'border-emerald-500/20 text-emerald-500' :
              post.type === 'explain' ? 'border-amber-500/20 text-amber-500' :
              'border-blue-500/20 text-blue-500'
            }`}>
              <TypeIcon type={post.type} className="w-3 h-3" />
            </div>
            <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-800 min-w-8" />
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              {post.slug} <span className="opacity-30">/</span> {post.date.split('-').join('.')}
            </span>
          </div>
          
          <h2 className={`text-5xl md:text-[7vw] font-serif leading-[0.85] tracking-tighter transition-all duration-700 ease-out group-hover:translate-x-6 text-balance ${isRead ? 'opacity-40 italic font-light' : 'font-medium'}`}>
            {post.title}
          </h2>
  
          <div className="flex flex-col md:flex-row md:items-end gap-10 mt-8">
            <div className="flex flex-col gap-4">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-sm leading-tight font-serif italic">
                &quot;{post.excerpt}&quot;
              </p>
            </div>
            
            <div className="flex flex-col gap-2 font-mono ml-auto">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
                <span>{post.readingTime}</span>
                <span>•</span>
                <span className="text-zinc-600 dark:text-zinc-400">#{post.tags[0]}</span>
              </div>
              <div className="group-hover:translate-x-2 transition-transform duration-500 text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase underline underline-offset-4">Esplora</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </div>
          </div>
        </div>
  
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 md:w-2/5 aspect-[4/5] opacity-20 md:opacity-10 group-hover:opacity-50 transition-all duration-1000 grayscale group-hover:grayscale-0 blur-[6px] group-hover:blur-0 translate-x-12 group-hover:translate-x-0 z-0">
          <BlurImage
            src={post.image}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 33vw, 40vw"
            className="object-cover rounded-[1px] shadow-2xl"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </motion.div>
  );
}
