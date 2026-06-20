'use client';

interface StatusLineProps {
  label: string;
  sublabel?: string;
  theme?: 'emerald' | 'zinc';
  hideSubOnMobile?: boolean;
}

export function StatusLine({ label, sublabel, theme = 'emerald', hideSubOnMobile = false }: StatusLineProps) {
  const dotColor = theme === 'emerald' ? 'bg-emerald-500' : 'bg-zinc-500';
  const labelColor = theme === 'emerald' ? 'text-emerald-500' : 'text-zinc-400';

  return (
    <div className="flex items-center gap-3 font-mono">
      <div className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      <span className={`text-[9px] font-bold tracking-[0.4em] uppercase ${labelColor}`}>
        {label}
      </span>
      {sublabel && (
        <div className={hideSubOnMobile ? 'hidden sm:flex items-center gap-3' : 'flex items-center gap-3'}>
          <div className="h-[1px] w-4 bg-zinc-100 dark:bg-zinc-800" />
          <span className="text-[9px] uppercase tracking-widest text-zinc-300 dark:text-zinc-500">
            {sublabel}
          </span>
        </div>
      )}
    </div>
  );
}
