'use client';

import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from './ThemeToggle';
import { useApp } from '@/context/AppContext';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export function Header() {
  const { setActivePostId, searchQuery, setSearchQuery, isScrolled, readSlugs, resetReadHistory } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className={`fixed top-0 left-0 w-full z-[90] transition-all duration-500 pointer-events-none ${
      isScrolled 
        ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 py-4 px-6 md:px-12' 
        : 'p-6 md:px-12 md:py-8'
    } flex justify-between items-center`}>
      <div className="flex items-center gap-6 pointer-events-auto">
        <Link href="/" onClick={() => setActivePostId(null)}>
          <motion.div
            className="text-lg font-serif tracking-tighter text-zinc-900 dark:text-white group flex items-center gap-4 cursor-pointer"
          >
            <span className="group-hover:italic transition-all">Landfall</span>
          </motion.div>
        </Link>
        
        <div className="hidden md:flex flex-col font-mono text-[7px] tracking-[0.2em] text-zinc-400 dark:text-zinc-500 uppercase">
          <div className="flex items-center gap-2">
            <span>Archivio: {readSlugs.length}</span>
            {readSlugs.length > 0 && (
              <button 
                onClick={resetReadHistory}
                className="opacity-30 hover:opacity-100 transition-opacity hover:text-red-500"
              >
                [Reset]
              </button>
            )}
          </div>
          <span className="text-zinc-500 dark:text-zinc-400 mt-1">Landfall Archive</span>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 pointer-events-auto">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[8px] font-bold tracking-[0.3em] text-emerald-500 uppercase">System Active</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8 pointer-events-auto">
        <div className="relative flex items-center">
          <AnimatePresence>
            {isSearchOpen && (
              <motion.input
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                type="text"
                placeholder="CERCA NELL'ARCHIVIO..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-b border-zinc-200 dark:border-zinc-800 focus:outline-none text-[10px] font-mono tracking-widest py-1 px-2 uppercase placeholder:opacity-50"
                autoFocus
              />
            )}
          </AnimatePresence>
          <button 
            onClick={() => {
              if (isSearchOpen && searchQuery) {
                setSearchQuery('');
              } else {
                setIsSearchOpen(!isSearchOpen);
              }
            }}
            className="p-2 hover:opacity-50 transition-opacity"
          >
            {isSearchOpen && searchQuery ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
          </button>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
