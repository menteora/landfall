'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion } from 'motion/react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5 text-zinc-100" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-900" />
        )}
      </motion.div>
    </button>
  );
}
