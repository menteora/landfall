'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useApp } from '@/context/AppContext';

// Centralized Google Tag Management
// In a real app, this would be an environment variable
const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID || 'G-XXXXXXXXXX';

export function GoogleTagManager() {
  const { consent } = useApp();

  useEffect(() => {
    // This function initializes the default consent state for Google Tag
    // We deny everything by default and only grant after user interaction
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gConsent = {
        ad_storage: consent.marketing ? 'granted' : 'denied',
        analytics_storage: consent.analytics ? 'granted' : 'denied',
        functionality_storage: 'granted', // technical
        personalization_storage: consent.marketing ? 'granted' : 'denied',
        security_storage: 'granted', // technical
      };

      (window as any).gtag('consent', 'update', gConsent);
    }
  }, [consent]);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          // Default consent settings (Italian Law: default is DENIED)
          gtag('consent', 'default', {
            'ad_storage': 'denied',
            'analytics_storage': 'denied',
            'functionality_storage': 'granted',
            'personalization_storage': 'denied',
            'security_storage': 'granted'
          });

          gtag('config', '${GTAG_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
