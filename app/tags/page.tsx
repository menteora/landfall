import { getAllTags } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft, Hash } from 'lucide-react';

export default async function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
      <Link 
        href="/"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.4em] uppercase text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors mb-20"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna alla Home
      </Link>

      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-serif mb-6 italic">Archivio Tags</h1>
        <p className="text-xl md:text-2xl text-zinc-500 font-serif leading-relaxed">
          Esplora la narrazione attraverso i tags ricorrenti dello spazio bio-digitale.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
        {tags.map((tag) => (
          <Link 
            key={tag}
            href={`/tags/${tag.toLowerCase()}`}
            className="group p-8 border border-zinc-100 dark:border-zinc-900 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Hash className="w-4 h-4 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
              <span className="font-mono text-[8px] uppercase tracking-widest text-zinc-300 dark:text-zinc-500">Archiviato</span>
            </div>
            <h2 className="text-2xl font-serif group-hover:italic transition-all">{tag}</h2>
          </Link>
        ))}
      </div>
      
      <footer className="mt-32 pt-16 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex justify-between items-center font-mono text-[10px] tracking-[0.4em] uppercase text-zinc-400">
          <span>ETH. DIRECTORY</span>
          <span>© 2026</span>
        </div>
      </footer>
    </div>
  );
}
