'use client';

import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'motion/react';
import { Post } from '@/types/post';
import { getLocalGraphData, getE3Suggestions } from '@/lib/client-utils';
import { X, ArrowLeft, Bookmark, Heart, Share2, ArrowRight, Zap, BookOpen, Repeat } from 'lucide-react';
import { BlurImage } from './BlurImage';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { NeuralGraph } from '@/components/NeuralGraph';
import { Footer } from '@/components/Footer';

const TypeIcon = ({ type, className }: { type: string; className?: string }) => {
  switch (type) {
    case 'engage': return <Zap className={className} />;
    case 'explain': return <BookOpen className={className} />;
    case 'exchange': return <Repeat className={className} />;
    default: return null;
  }
};

export function PostDetail({ post, allPosts }: { post: Post; allPosts: Post[] }) {
  const { setActivePostId, markAsRead, readSlugs } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const localGraph = getLocalGraphData(post.slug, allPosts);
  const pathSuggestions = getE3Suggestions(post, allPosts, readSlugs);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch((err) => {
        console.error('Failed to copy link: ', err);
      });
    }
  };

  // Mark as read when the post is viewed
  useEffect(() => {
    if (post.slug) {
      markAsRead(post.slug);
    }
  }, [post.slug, markAsRead]);

  // Reset scroll to top when current post slug changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [post.slug]);

  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [headerScrolled, setHeaderScrolled] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHeaderScrolled(latest > 0.01);
  });

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0% 0 0 0)' }}
      exit={{ opacity: 0, clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] bg-white dark:bg-[#0a0a0a] overflow-y-auto overflow-x-hidden"
      ref={containerRef}
    >
      <div className="fixed top-0 left-0 w-full h-1 z-[120]">
        <motion.div 
          className="h-full bg-zinc-900 dark:bg-white origin-left"
          style={{ scaleX }}
        />
      </div>

      <div className={`fixed top-0 left-0 w-full transition-all duration-500 z-[110] pointer-events-none flex justify-between items-center ${
        headerScrolled 
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 py-4 px-8' 
          : 'p-8'
      }`}>
        <button
          onClick={() => setActivePostId(null)}
          className="flex items-center gap-4 text-[10px] font-bold tracking-[0.3em] uppercase transition-all text-zinc-900 dark:text-white hover:opacity-50 pointer-events-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Chiudi Voce
        </button>
        
        <div className="flex gap-6 pointer-events-auto text-zinc-900 dark:text-white items-center relative">
          <button className="hover:scale-125 transition-transform"><Heart className="w-4 h-4" /></button>
          <button className="hover:scale-125 transition-transform"><Bookmark className="w-4 h-4" /></button>
          <div className="relative flex items-center">
            <button 
              onClick={handleShare}
              className="hover:scale-125 transition-transform p-1"
              aria-label="Condividi voce"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 whitespace-nowrap bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-md text-[9px] font-mono uppercase tracking-widest shadow-xl pointer-events-none z-[130]"
                >
                  Link copiato!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-48">
        <motion.header
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <div className="flex items-center gap-4 mb-8 font-mono">
            <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-300 dark:text-zinc-700">
              {post.slug}
            </span>
            <div className="h-[1px] w-8 bg-zinc-100 dark:bg-zinc-800" />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${
              post.type === 'engage' ? 'border-emerald-500/20 text-emerald-500' :
              post.type === 'explain' ? 'border-amber-500/20 text-amber-500' :
              'border-blue-500/20 text-blue-500'
            }`}>
              <TypeIcon type={post.type} className="w-4 h-4" />
            </div>
            <div className="h-[px] flex-1 bg-zinc-100 dark:bg-zinc-800" />
            <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400">
              {post.date.split('-').join(' // ')}
            </span>
          </div>

          <h1 className="text-6xl md:text-[8vw] font-serif leading-[0.85] tracking-tighter mb-16">
            {post.title}
          </h1>

          <div className="grid grid-cols-2 gap-8 font-mono border-y border-zinc-100 dark:border-zinc-800 py-8">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Tempo</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-900 dark:text-white">{post.readingTime}</span>
            </div>
            <div className="flex flex-col gap-1 text-right md:text-left">
              <span className="text-[8px] uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Risonanza</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Ottimale</span>
            </div>
          </div>
        </motion.header>

        {post.image && (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            className="relative aspect-video mb-24 overflow-hidden rounded-sm"
          >
            <BlurImage
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}

        <div className="markdown-body prose dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ margin: "-20% 0px -20% 0px" }}
                  transition={{ duration: 0.8 }}
                  className="text-xl md:text-2xl leading-relaxed text-zinc-800 dark:text-zinc-300 font-serif mb-12"
                >
                  {children}
                </motion.p>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {pathSuggestions.length > 0 && (
          <div className="mt-40">
            <div className="flex items-center gap-8 mb-20">
              <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-900" />
              <div className="flex items-center gap-3">
                <TypeIcon type={post.type} className="w-3 h-3 opacity-30" />
                <ArrowRight className="w-3 h-3 opacity-30" />
                <TypeIcon type={pathSuggestions[0].type} className="w-3 h-3 opacity-60" />
              </div>
              <div className="h-[1px] flex-1 bg-zinc-100 dark:bg-zinc-900" />
            </div>
            
            <div className={`grid grid-cols-1 ${pathSuggestions.length > 1 ? 'md:grid-cols-2' : ''} gap-8 h-full`}>
              {pathSuggestions.map((suggestion) => (
                <motion.button
                  key={suggestion.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() => {
                    setActivePostId(suggestion.slug);
                    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group relative flex flex-col h-full border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#0a0a0a] overflow-hidden transition-all duration-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 text-left"
                >
                  {suggestion.image && (
                    <div className="relative w-full aspect-[21/9] overflow-hidden">
                      <BlurImage
                        src={suggestion.image}
                        alt={suggestion.title}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-zinc-900/20 mix-blend-overlay" />
                    </div>
                  )}
                  
                  <div className="p-8 md:p-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2 items-center">
                        <TypeIcon type={suggestion.type} className="w-3 h-3 text-zinc-400" />
                        <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-zinc-400">Continua</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-200 group-hover:text-emerald-500 transition-colors group-hover:translate-x-1" />
                    </div>
                    
                    <h4 className="text-3xl font-serif mb-4 group-hover:italic transition-all duration-500 leading-none">{suggestion.title}</h4>
                    <p className="text-sm text-zinc-500 font-serif leading-relaxed line-clamp-3 mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
                      {suggestion.excerpt}
                    </p>
                    
                    <div className="mt-auto pt-6 border-t border-zinc-50 dark:border-zinc-900/50 font-mono text-[9px] uppercase tracking-[0.4em] text-zinc-400 flex items-center justify-between">
                      <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">#{suggestion.tags[0]}</span>
                      <span>Next Step</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-between items-center gap-6 py-12 border-y border-zinc-100 dark:border-zinc-800 mt-40">
          <div className="flex flex-wrap gap-4">
            {post.tags.map((tag) => (
              <Link 
                key={tag}
                href={`/tags/${tag.toLowerCase()}`}
                onClick={() => setActivePostId(null)}
                className="px-4 py-2 border border-zinc-100 dark:border-zinc-800 text-[10px] font-mono tracking-widest uppercase hover:border-emerald-500/50 hover:text-emerald-500 transition-all rounded-full"
              >
                #{tag}
              </Link>
            ))}
          </div>
          
          <div className="relative">
            <button
              onClick={handleShare}
              className="flex items-center gap-3 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-[10px] font-mono uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md group cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
              <span>Condividi Voce</span>
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 bottom-full mb-2 whitespace-nowrap bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-md text-[9px] font-mono uppercase tracking-widest shadow-xl pointer-events-none z-[130]"
                >
                  Link copiato negli appunti!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-40 mb-32">
          <NeuralGraph 
            data={localGraph} 
            height={400} 
            title="Percorso Bio-Digitale."
            subtitle="Connessioni Semantiche"
            focusNodeId={post.slug}
          />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 pt-16 flex flex-col items-center gap-12"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i}
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                />
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActivePostId(null)}
            className="group relative px-16 py-5 overflow-hidden border border-zinc-900 dark:border-white text-[10px] font-bold tracking-[0.4em] uppercase transition-all duration-500 hover:text-white dark:hover:text-zinc-900"
          >
            <div className="absolute inset-0 bg-zinc-900 dark:bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22, 1, 0.36, 1]" />
            <span className="relative z-10 flex items-center gap-4">
              Torna al Flusso
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </button>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
}
