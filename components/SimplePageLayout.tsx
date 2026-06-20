'use client';

import { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useApp } from '@/context/AppContext';

export function SimplePageLayout({ children }: { children: ReactNode }) {
  const { setIsScrolled } = useApp();

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 50);
  };

  return (
    <main className="relative h-screen bg-transparent overflow-hidden">
      <Header />
      
      <section 
        className="h-full overflow-y-auto scroll-smooth"
        onScroll={handleScroll}
      >
        <div className="min-h-full flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </section>
    </main>
  );
}
