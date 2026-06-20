'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-20 px-4 sm:px-6 md:px-12 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div className="flex flex-col gap-2">
          <div className="text-xl font-serif italic tracking-tighter">Landfall</div>
          <p className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
            © {currentYear} Landfall Systemic Archive
          </p>
        </div>

        <div className="flex flex-wrap gap-8 md:gap-12 text-[10px] font-mono tracking-[0.3em] uppercase text-zinc-400">
          <Link href="/pages/about" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-100 dark:decoration-zinc-800 underline-offset-8">Manifesto</Link>
          <Link href="/tags" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-100 dark:decoration-zinc-800 underline-offset-8">Tags</Link>
          <Link 
            href="/privacy" 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-100 dark:decoration-zinc-800 underline-offset-8"
          >
            Privacy
          </Link>
          <Link 
            href="/cookie" 
            className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-100 dark:decoration-zinc-800 underline-offset-8"
          >
            Cookie
          </Link>
        </div>

        <div className="flex flex-col gap-1 items-start md:items-end font-mono text-[8px] tracking-[0.1em] text-zinc-300 dark:text-zinc-700">
          <span>LAT: 45.4642° N</span>
          <span>LON: 9.1900° E</span>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span>Archive Sync: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
