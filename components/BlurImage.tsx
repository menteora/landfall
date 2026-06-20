'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ComponentProps } from 'react';

type ImageProps = ComponentProps<typeof Image>;

interface BlurImageProps extends Omit<ImageProps, 'onLoad'> {
  containerClassName?: string;
}

// Minimalist fallback SVG data URL to serve as a micro-blurred placeholder during loading
const fallbackBlurSvg = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 5'%3E%3Crect width='100%' height='100%' fill='%2327272a'/%3E%3C/svg%3E`;

export function BlurImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  placeholder = 'blur',
  blurDataURL,
  ...props
}: BlurImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full bg-zinc-100 dark:bg-zinc-900/40 rounded-[inherit] ${containerClassName}`}>
      {/* Custom pulse skeleton loading backdrop */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-ping" />
            <span className="text-[7px] font-mono tracking-[0.2em] text-zinc-400 dark:text-zinc-600 uppercase">Caricamento...</span>
          </div>
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        className={`transition-all duration-1000 ease-out ${
          isLoaded 
            ? 'blur-0 scale-100 grayscale-0 opacity-100' 
            : 'blur-xl scale-[1.04] grayscale opacity-40'
        } ${className}`}
        placeholder={placeholder}
        blurDataURL={blurDataURL || fallbackBlurSvg}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
