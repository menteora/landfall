'use client';

import { ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PostDetail } from '@/components/PostDetail';
import { useApp } from '@/context/AppContext';
import { Post } from '@/types/post';

interface PageLayoutProps {
  children: ReactNode;
  allPosts: Post[];
  snap?: boolean;
}

export function PageLayout({ children, allPosts, snap = false }: PageLayoutProps) {
  const { activePostId, setIsScrolled } = useApp();
  const activePost = allPosts.find(p => p.slug === activePostId);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 50);
  };

  return (
    <main className="relative h-screen bg-transparent overflow-hidden">
      <Header />
      
      <section 
        className={`h-full overflow-y-auto overflow-x-hidden scroll-smooth ${snap ? 'snap-y snap-mandatory' : ''}`}
        onScroll={handleScroll}
      >
        <div className="min-h-full flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <section className="snap-start">
            <Footer />
          </section>
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activePost && (
          <PostDetail post={activePost} allPosts={allPosts} key="detail" />
        )}
      </AnimatePresence>
    </main>
  );
}
