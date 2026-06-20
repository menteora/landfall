'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function GenerativeSoundscape() {
  const { activePostId } = useApp();
  const [isMuted, setIsMuted] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const oscillatorsRef = useRef<{ osc: OscillatorNode; lfo: OscillatorNode; g: GainNode }[]>([]);

  const initAudio = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
      
      masterGainRef.current = audioContextRef.current.createGain();
      filterRef.current = audioContextRef.current.createBiquadFilter();
      
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.setValueAtTime(400, audioContextRef.current.currentTime);
      filterRef.current.Q.setValueAtTime(1, audioContextRef.current.currentTime);
      
      masterGainRef.current.connect(audioContextRef.current.destination);
      filterRef.current.connect(masterGainRef.current);
      
      masterGainRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);

      // Frequencies for an ambient cluster (Am9 partials)
      const freqs = [110, 164.81, 220, 329.63, 440]; 
      freqs.forEach((freq, i) => {
        const osc = audioContextRef.current!.createOscillator();
        const g = audioContextRef.current!.createGain();
        const lfo = audioContextRef.current!.createOscillator();
        const lfoGain = audioContextRef.current!.createGain();

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, audioContextRef.current!.currentTime);
        
        // Very slow modulation for generative feel
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.03 + Math.random() * 0.05, audioContextRef.current!.currentTime);
        
        // Map LFO to gain
        lfoGain.gain.setValueAtTime(0.03, audioContextRef.current!.currentTime);
        g.gain.setValueAtTime(0.05, audioContextRef.current!.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);
        
        osc.connect(g);
        g.connect(filterRef.current!);
        
        osc.start();
        lfo.start();
        
        oscillatorsRef.current.push({ osc, lfo, g });
      });
    }
  };

  const startAudio = () => {
    initAudio();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    // Deep generative drone fade in
    masterGainRef.current?.gain.setTargetAtTime(0.4, audioContextRef.current!.currentTime, 4);
    
    // Slow filter movement
    if (filterRef.current) {
      filterRef.current.frequency.setTargetAtTime(600 + Math.random() * 400, audioContextRef.current!.currentTime, 10);
    }
  };

  const stopAudio = () => {
    masterGainRef.current?.gain.setTargetAtTime(0, audioContextRef.current!.currentTime, 3);
  };

  useEffect(() => {
    if (activePostId && !isMuted) {
      startAudio();
    } else {
      stopAudio();
    }
  }, [activePostId, isMuted]);

  useEffect(() => {
    return () => {
      oscillatorsRef.current.forEach(({ osc, lfo }) => {
        osc.stop();
        lfo.stop();
      });
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <button
      onClick={() => setIsMuted(!isMuted)}
      className="fixed bottom-10 right-10 z-[120] pointer-events-auto p-3 rounded-full bg-zinc-200/20 dark:bg-zinc-800/20 backdrop-blur-lg border border-zinc-300/30 dark:border-zinc-700/30 text-zinc-600 dark:text-zinc-400 hover:scale-110 active:scale-90 transition-all group"
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.div
              key="muted"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <VolumeX className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="unmuted"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 className="w-5 h-5 text-emerald-500 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="absolute right-full mr-4 font-mono text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-3 py-1.5 rounded-sm border border-zinc-800 dark:border-zinc-200 shadow-2xl">
        {isMuted ? "Audio Off" : "Ambient Active"}
      </span>
    </button>
  );
}
