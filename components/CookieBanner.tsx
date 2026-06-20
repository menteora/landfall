'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '@/context/AppContext';
import { X, Shield, Settings, Check, ArrowRight } from 'lucide-react';

export function CookieBanner() {
  const { consent, updateConsent } = useApp();
  const [showPreferences, setShowPreferences] = useState(false);
  const [localConsent, setLocalConsent] = useState(consent);
  const [isVisible, setIsVisible] = useState(false);

  // Show banner only if not interacted or if 6 months passed (simplified to just interacted for now)
  useEffect(() => {
    if (!consent.interacted) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [consent.interacted]);

  const handleAcceptAll = () => {
    updateConsent({ analytics: true, marketing: true, interacted: true });
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    updateConsent({ analytics: false, marketing: false, interacted: true });
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    updateConsent({ ...localConsent, interacted: true });
    setIsVisible(false);
  };

  const togglePreference = (key: 'analytics' | 'marketing') => {
    setLocalConsent(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <div className="bg-white dark:bg-[#0a0a0a] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden rounded-2xl">
              <div className="flex flex-col md:flex-row">
                {/* Info Section */}
                <div className="p-8 md:p-10 flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-lg font-serif italic tracking-tight leading-none">Privacy & Trasparenza</h4>
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 mt-1">Gestione dei cookie</p>
                    </div>
                    {/* Close button - Italian law: closing banner = only technical consent */}
                    <button 
                      onClick={handleRejectAll}
                      className="ml-auto p-2 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-100 transition-colors"
                      aria-label="Rifiuta e chiudi"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {!showPreferences ? (
                    <div className="space-y-4">
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-serif">
                        Utilizziamo i cookie per migliorare la tua esperienza sul nostro sito. Alcuni sono necessari per il funzionamento (tecnici), altri ci aiutano ad analizzare il traffico (analytics) o a personalizzare i contenuti (marketing).
                      </p>
                      <div className="flex flex-wrap gap-4 pt-2">
                        <button 
                          onClick={handleAcceptAll}
                          className="px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs font-mono uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
                        >
                          Accetta Tutti
                        </button>
                        <button 
                          onClick={handleRejectAll}
                          className="px-6 py-3 border border-zinc-100 dark:border-zinc-800 text-zinc-900 dark:text-white rounded-full text-xs font-mono uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all"
                        >
                          Rifiuta
                        </button>
                        <button 
                          onClick={() => setShowPreferences(true)}
                          className="px-6 py-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors text-xs font-mono uppercase tracking-widest flex items-center gap-2"
                        >
                          <Settings className="w-3 h-3" />
                          Personalizza
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {/* Technical */}
                        <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 rounded-xl">
                          <div>
                            <p className="text-xs font-mono uppercase tracking-widest font-bold">Tecnici</p>
                            <p className="text-[10px] text-zinc-400 max-w-[300px] mt-1">Necessari per il corretto funzionamento del sito. Non possono essere disattivati.</p>
                          </div>
                          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                            <Check className="w-3 h-3" />
                          </div>
                        </div>

                        {/* Analytics */}
                        <button 
                          onClick={() => togglePreference('analytics')}
                          className={`w-full flex items-center justify-between p-4 border transition-all rounded-xl text-left ${
                            localConsent.analytics 
                              ? 'bg-emerald-500/5 border-emerald-500/20' 
                              : 'bg-transparent border-zinc-100 dark:border-zinc-800'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-mono uppercase tracking-widest font-bold">Statistici</p>
                            <p className="text-[10px] text-zinc-400 max-w-[300px] mt-1">Ci aiutano a capire come gli utenti interagiscono con il sito in forma anonima.</p>
                          </div>
                          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                            localConsent.analytics ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
                          }`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
                              localConsent.analytics ? 'left-6' : 'left-1'
                            }`} />
                          </div>
                        </button>

                        {/* Marketing */}
                        <button 
                          onClick={() => togglePreference('marketing')}
                          className={`w-full flex items-center justify-between p-4 border transition-all rounded-xl text-left ${
                            localConsent.marketing 
                              ? 'bg-emerald-500/5 border-emerald-500/20' 
                              : 'bg-transparent border-zinc-100 dark:border-zinc-800'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-mono uppercase tracking-widest font-bold">Marketing</p>
                            <p className="text-[10px] text-zinc-400 max-w-[300px] mt-1">Utilizzati per mostrare annunci pertinenti alle tue preferenze.</p>
                          </div>
                          <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                            localConsent.marketing ? 'bg-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800'
                          }`}>
                            <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${
                              localConsent.marketing ? 'left-6' : 'left-1'
                            }`} />
                          </div>
                        </button>
                      </div>

                      <div className="flex gap-4">
                        <button 
                          onClick={handleSavePreferences}
                          className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
                        >
                          Salva Preferenze
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => setShowPreferences(false)}
                          className="px-8 py-3 border border-zinc-100 dark:border-zinc-800 text-zinc-400 rounded-full text-xs font-mono uppercase tracking-widest hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                        >
                          Indietro
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-8 pt-8 border-t border-zinc-50 dark:border-zinc-900/50">
                    <div className="flex gap-6 text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                      <a href="/privacy" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-200 dark:decoration-zinc-800 underline-offset-4">Privacy Policy</a>
                      <a href="/cookie" className="hover:text-zinc-900 dark:hover:text-white transition-colors underline decoration-zinc-200 dark:decoration-zinc-800 underline-offset-4">Cookie Policy</a>
                    </div>
                  </div>
                </div>

                {/* Aesthetic Detail (Desktop) */}
                <div className="hidden md:block w-40 bg-zinc-50 dark:bg-zinc-900/50 border-l border-zinc-100 dark:border-zinc-800 p-8">
                  <div className="h-full flex flex-col justify-between py-10 opacity-20">
                    <Shield className="w-12 h-12 stroke-[0.5]" />
                    <div className="space-y-4">
                      <div className="h-0.5 w-10 bg-zinc-900 dark:bg-white" />
                      <div className="h-0.5 w-6 bg-zinc-900 dark:bg-white" />
                      <div className="h-0.5 w-14 bg-zinc-900 dark:bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
