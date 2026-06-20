'use client';

import { motion } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { Shield } from 'lucide-react';

export function CookieConsentTrigger() {
  const { consent, updateConsent } = useApp();

  // If the user has already interacted, show a small trigger icon in the bottom left
  if (!consent.interacted) return null;

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => updateConsent({ interacted: false })}
      className="fixed bottom-6 left-6 z-[90] w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-500 hover:border-emerald-500/30 transition-all shadow-lg pointer-events-auto"
      title="Gestione Cookie"
    >
      <Shield className="w-5 h-5" />
    </motion.button>
  );
}
