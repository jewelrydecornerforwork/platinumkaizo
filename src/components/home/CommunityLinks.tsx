const communityLinks = [
  {
    label: 'DISCORD_INTEL',
    sublabel: 'COMMUNITY CHANNEL',
    href: '#',
  },
  {
    label: 'SOURCE_TERMINAL',
    sublabel: 'OPEN REPOSITORY',
    href: 'https://github.com/jewelrydecornerforwork/platinumkaizo',
  },
  {
    label: 'RANKING_BOARD',
    sublabel: 'TACTICAL LADDER',
    href: '#',
  },
] as const;

export const CommunityLinks = (): React.ReactElement => (
  <div className="grid h-full grid-cols-3 gap-3">
    {communityLinks.map((link) => (
      <a
        key={link.label}
        href={link.href}
        target={link.href.startsWith('http') ? '_blank' : undefined}
        rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
        className="group relative flex min-h-[148px] flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-900/25 px-3 py-4 font-mono transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:shadow-[0_0_18px_rgba(16,185,129,0.18)]"
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/0 blur-2xl transition-all duration-500 group-hover:h-40 group-hover:w-40 group-hover:bg-emerald-500/15"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/0 transition-all duration-500 group-hover:bg-emerald-400/80 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.9)]"
        />

        <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-500/45">
          [CHANNEL]
        </div>

        <div className="relative z-10">
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-white transition-colors duration-300 group-hover:text-emerald-300">
            {link.label}
          </div>
          <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">
            {link.sublabel}
          </div>
        </div>

        <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600 transition-colors duration-300 group-hover:text-emerald-500/80">
          ACCESS
        </div>
      </a>
    ))}
  </div>
);
