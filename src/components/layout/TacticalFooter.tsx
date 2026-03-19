import Link from 'next/link';

export const TacticalFooter = (): React.ReactElement => (
  <footer className="mt-20 w-full border-t border-emerald-500/10 bg-slate-950 px-6 py-8">
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
      <div className="font-mono text-[10px] uppercase tracking-widest text-emerald-500/60">
        [SYSTEM_STATUS: OPERATIONAL]
      </div>

      <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-400">
        <Link href="#" className="transition-colors hover:text-emerald-400">
          About
        </Link>
        <Link href="#" className="transition-colors hover:text-emerald-400">
          GitHub
        </Link>
        <Link href="#" className="transition-colors hover:text-emerald-400">
          Discord
        </Link>
      </div>

      <div className="text-center font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500 md:text-right">
        Pokemon is © Nintendo / Creatures Inc. / GAME FREAK
      </div>
    </div>
  </footer>
);
