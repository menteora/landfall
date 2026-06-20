import type { Metadata } from 'next';
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google';
// @ts-ignore
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/context/AppContext';
import { CustomCursor } from '@/components/CustomCursor';
import { GenerativeSoundscape } from '@/components/GenerativeSoundscape';
import { CookieBanner } from '@/components/CookieBanner';
import { CookieConsentTrigger } from '@/components/CookieConsentTrigger';
import { GoogleTagManager } from '@/components/GoogleTagManager';
import { siteConfig } from '@/site.config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://ais-pre-wyhzrhrdp7vgwnfrtmw67b-13320223187.europe-west1.run.app'),
  title: {
    default: siteConfig.blogTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.blogDescription,
  applicationName: 'Landfall Journal',
  authors: [{ name: siteConfig.author.name, url: siteConfig.author.social.github }],
  generator: 'Next.js',
  keywords: [
    'Landfall',
    'Procedura',
    'Architetto Sistemico',
    'Alex Rivolta',
    'Systemic Journal',
    'Rotta Stabile',
    'Abisso',
    'Navigazione',
  ],
  referrer: 'origin-when-cross-origin',
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.blogTitle,
    description: siteConfig.blogDescription,
    images: [
      {
        url: 'https://picsum.photos/seed/vibrant/1200/630',
        width: 1200,
        height: 630,
        alt: 'Landfall | Journal dell\'Architetto Sistemico - Navigare in acque sconosciute',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.blogTitle,
    description: siteConfig.blogDescription,
    creator: '@AlexRivolta',
    images: ['https://picsum.photos/seed/vibrant/1200/630'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${mono.variable} font-sans antialiased cursor-none`}>
        <ThemeProvider>
          <AppProvider>
            <GoogleTagManager />
            <CustomCursor />
            <GenerativeSoundscape />
            {children}
            <CookieBanner />
            <CookieConsentTrigger />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
