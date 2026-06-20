'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ConsentState {
  technical: boolean;
  analytics: boolean;
  marketing: boolean;
  interacted: boolean;
  timestamp: number;
}

interface AppContextType {
  activePostId: string | null;
  setActivePostId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isScrolled: boolean;
  setIsScrolled: (scrolled: boolean) => void;
  readSlugs: string[];
  markAsRead: (slug: string) => void;
  resetReadHistory: () => void;
  consent: ConsentState;
  updateConsent: (newConsent: Partial<ConsentState>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_CONSENT: ConsentState = {
  technical: true,
  analytics: false,
  marketing: false,
  interacted: false,
  timestamp: 0,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [readSlugs, setReadSlugs] = useState<string[]>([]);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);

  // Load state from localStorage on mount and sync URL
  useEffect(() => {
    const savedHistory = localStorage.getItem('ethereal_read_history');
    if (savedHistory) {
      try {
        setReadSlugs(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse read history', e);
      }
    }

    const savedConsent = localStorage.getItem('ethereal_cookie_consent');
    if (savedConsent) {
      try {
        setConsent(JSON.parse(savedConsent));
      } catch (e) {
        console.error('Failed to parse consent', e);
      }
    }

    // Sync from URL query ?post=slug
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const postFromQuery = params.get('post');
      if (postFromQuery) {
        setActivePostId(postFromQuery);
      }

      const handlePopState = () => {
        const p = new URLSearchParams(window.location.search);
        setActivePostId(p.get('post'));
      };
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, []);

  // Synchronize activePostId changes with URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const currentPost = params.get('post');
      if (activePostId !== currentPost) {
        if (activePostId) {
          params.set('post', activePostId);
          window.history.pushState(null, '', `?${params.toString()}`);
        } else {
          params.delete('post');
          const search = params.toString();
          window.history.pushState(null, '', search ? `?${search}` : window.location.pathname);
        }
      }
    }
  }, [activePostId]);

  const markAsRead = (slug: string) => {
    setReadSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const next = [...prev, slug];
      localStorage.setItem('ethereal_read_history', JSON.stringify(next));
      return next;
    });
  };

  const resetReadHistory = () => {
    setReadSlugs([]);
    localStorage.removeItem('ethereal_read_history');
  };

  const updateConsent = (newConsent: Partial<ConsentState>) => {
    setConsent((prev) => {
      const next = { ...prev, ...newConsent, timestamp: Date.now(), interacted: true };
      localStorage.setItem('ethereal_cookie_consent', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ 
      activePostId, 
      setActivePostId, 
      searchQuery, 
      setSearchQuery,
      isScrolled,
      setIsScrolled,
      readSlugs,
      markAsRead,
      resetReadHistory,
      consent,
      updateConsent
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
