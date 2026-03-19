export const TacticalFooter = (): React.ReactElement => (
  <footer className="mt-20 w-full border-t border-emerald-500/10 bg-transparent py-6 font-mono">
    <div className="flex flex-col items-center justify-between gap-4 px-8 text-[10px] uppercase tracking-widest text-slate-500 md:flex-row">
      <div>© 2026 // INTEL_CORE_V1.1</div>
      <div className="flex flex-wrap items-center gap-6">
        <span className="text-emerald-500/60">[DATABASE: SYNCED]</span>
        <span className="animate-pulse text-slate-400">[LIVE_FEED_ACTIVE]</span>
      </div>
    </div>
  </footer>
);
