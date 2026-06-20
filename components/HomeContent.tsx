'use client';

import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { PageLayout } from '@/components/PageLayout';
import { PostCard } from '@/components/PostCard';
import { useApp } from '@/context/AppContext';
import { Post, GraphData } from '@/types/post';
import { NeuralGraph } from '@/components/NeuralGraph';
import { StatusLine } from '@/components/StatusLine';
import { ArrowDown } from 'lucide-react';
import { getAssetUrl } from '@/lib/utils';

interface HomeContentProps {
  posts: Post[];
  graphData: GraphData;
}

export function HomeContent({ posts, graphData }: HomeContentProps) {
  const { searchQuery } = useApp();
  
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout allPosts={posts} snap={true}>
        <div className="min-h-screen flex flex-col justify-start snap-start px-6 md:px-12 relative overflow-hidden pt-20 md:pt-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto w-full relative z-10"
          >
            <div className="mb-2 md:mb-6 hidden md:block">
              <StatusLine label="Landfall Navigation Protocol 1.0" sublabel="System Active" />
            </div>
            
            <div className="relative py-8 md:py-16 flex flex-col items-center justify-center min-h-[70vh] md:min-h-[65vh] px-3 md:px-8 overflow-hidden">
              {/* Immersive Landfall Background Image with slow cinematic pan/zoom & vignette overlay */}
              <div className="absolute inset-0 z-0 select-none overflow-hidden rounded-3xl border border-zinc-200/40 dark:border-zinc-800/20 shadow-inner">
                <motion.div
                  initial={{ scale: 1.15, opacity: 0 }}
                  animate={{ scale: 1.02, opacity: 0.15 }}
                  transition={{ duration: 4, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full relative"
                >
                  <img
                    src={getAssetUrl('/landfall_hero.jpg')}
                    alt="Landfall Hero - La Terra Ferma"
                    className="w-full h-full object-cover dark:brightness-75 transition-all duration-1000 grayscale hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  {/* Smooth backdrop gradients matching light & dark themes */}
                  <div className="absolute inset-0 bg-radial from-transparent via-white/70 to-white dark:via-black/70 dark:to-black" />
                </motion.div>
                
                {/* Background L representing Landfall, styled with absolute subtlety */}
                <div className="absolute inset-0 z-10 select-none pointer-events-none flex items-center justify-center overflow-visible">
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.05 }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[70vw] md:text-[40vw] lg:text-[30vw] font-serif font-light leading-none text-zinc-900 dark:text-zinc-100 select-none"
                  >
                    L
                  </motion.span>
                </div>
              </div>

              {/* Central Hub Layout */}
              <div className="relative w-full max-w-6xl flex flex-col items-center z-10 px-2 sm:px-4 overflow-hidden md:overflow-visible">
                {/* Top Section: Abyss -> System */}
                <div className="flex flex-col items-center group mb-8 md:mb-16 text-center w-full px-2">
                  <h1 className="text-4xl sm:text-5xl md:text-[6.5vw] font-serif tracking-tighter leading-none transition-all cursor-default flex items-center justify-center gap-2 sm:gap-8 w-full">
                    <span>Abyss</span>
                    <span className="font-sans font-light text-zinc-300 dark:text-zinc-800 select-none text-[0.8em]">→</span>
                    <span>System</span>
                  </h1>
                  
                  {/* Minimalistic status indicators placed beneath the main title */}
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                    <StatusLine label="Abyss" sublabel="Acque Sconosciute / Nebbia" theme="zinc" />
                    <span className="text-zinc-200 dark:text-zinc-800 hidden sm:block">|</span>
                    <StatusLine label="System" sublabel="La Procedura / Il Metodo" theme="zinc" />
                  </div>
                  
                  <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent mt-6 hidden md:block" />
                </div>

                {/* Bottom Row: Landfall */}
                <div className="flex flex-col items-center gap-6 md:gap-8 relative z-10 w-full group mt-8">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative flex items-center justify-center w-6 h-6">
                      <motion.div 
                        animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full bg-emerald-500/30" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] z-10" 
                      />
                    </div>
                    <div className="px-6 md:px-12 py-3 border border-zinc-100 dark:border-zinc-800/50 rounded-full md:border-none backdrop-blur-sm">
                      <StatusLine label="Landfall" sublabel="La Terra Ferma / L'Approdo dell'Architetto" theme="emerald" />
                    </div>
                    
                    {/* Centered Poetic Caption */}
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 1.2 }}
                      className="max-w-md text-center px-4"
                    >
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm font-serif italic leading-relaxed">
                        "Quando tutto è nebuloso e l'orizzonte svanisce, l'architettura sistemica traccia la rotta. Attreverso procedure definite, facciamo landfall."
                      </p>
                    </motion.div>

                    <motion.div 
                      key="arrow"
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mt-6 md:mt-10"
                    >
                      <ArrowDown className="w-8 h-8 text-emerald-500/50" strokeWidth={1} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex flex-col gap-6">
              <div className="hidden md:block">
                <StatusLine label="Mappa e Rotte Tracciate" sublabel="Approdi Disponibili" />
              </div>
              <div className="flex items-center gap-6 font-mono group cursor-pointer">
                <div className="w-16 h-[1px] bg-zinc-200 dark:bg-zinc-800 transition-all duration-700 group-hover:w-32" />
                <span className="text-[10px] uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-500 transition-colors group-hover:text-zinc-800 dark:group-hover:text-zinc-200">
                  {searchQuery ? `Filtro Rotte: ${searchQuery}` : 'Scorri per esplorare l\'archivio'}
                </span>
                <div className="w-16 h-[1px] bg-zinc-200 dark:bg-zinc-800 transition-all duration-700 group-hover:w-32 md:hidden" />
              </div>
            </div>
          </motion.div>
        </div>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <PostCard key={post.slug} post={post} index={index} />
          ))
        ) : searchQuery && (
          <div className="h-screen flex items-center justify-center snap-start font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-widest text-[10px]">
            Nessuna voce corrispondente trovata nell&apos;archivio.
          </div>
        )}

        <section className="min-h-screen snap-start flex flex-col justify-center py-20">
          <NeuralGraph data={graphData} />
        </section>
    </PageLayout>
  );
}
