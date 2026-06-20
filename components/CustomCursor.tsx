'use client';

import { motion, useSpring, useMotionValue } from 'motion/react';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400 };
  const borderX = useSpring(cursorX, springConfig);
  const borderY = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if it's a touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('.cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-zinc-900 dark:bg-white rounded-full pointer-events-none z-[999] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-zinc-900 dark:border-white rounded-full pointer-events-none z-[998] mix-blend-difference"
        animate={{
          scale: isHovering ? 2.5 : 1,
          opacity: isHovering ? 0.3 : 0.6,
          borderWidth: isHovering ? 1 : 2,
        }}
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          x: borderX,
          y: borderY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {isHovering && (
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border border-emerald-500 rounded-full"
          />
        )}
      </motion.div>
    </>
  );
}
