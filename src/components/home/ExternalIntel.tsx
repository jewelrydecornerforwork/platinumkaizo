const intelLinks = [
  {
    label: 'OFFICIAL_DOCS',
    ref: '[REF: PK_CORE]',
    href: 'https://platinumkaizo.fandom.com/wiki/Platinum_Kaizo_Wiki',
    kicker: '#OFFICIAL_INTEL',
    detail: 'TACTICAL WIKI INDEX',
    tone:
      'border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/60 to-slate-950/70 hover:border-emerald-500/60',
  },
  {
    label: 'CHANGE_LOG',
    ref: '[REF: PK_CORE]',
    href: 'https://github.com/jewelrydecornerforwork/platinumkaizo',
    kicker: '#REVISION_LOG',
    detail: 'PATCH TRACKING ARCHIVE',
    tone:
      'border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900/60 to-slate-950/70 hover:border-cyan-400/60',
  },
] as const;

export const ExternalIntel = (): React.ReactElement => (
  <div className="grid h-full grid-cols-2 gap-4">
    {intelLinks.map((item) => (
      <a
        key={item.label}
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className={`group relative flex h-full min-h-[150px] flex-col justify-between overflow-hidden rounded-xl border p-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)] ${item.tone}`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)] opacity-60 transition-opacity duration-300 group-hover:opacity-90"
        />

        <div className="relative z-10">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/50">
            {item.kicker}
          </div>
          <div className="text-sm font-black tracking-tight text-white transition-colors group-hover:text-emerald-300">
            {item.label}
          </div>
          <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
            {item.detail}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between pt-4">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
            {item.ref}
          </span>
          <span className="h-2 w-2 rounded-full bg-emerald-500/70 shadow-[0_0_10px_rgba(16,185,129,0.55)] transition-all duration-300 group-hover:animate-pulse" />
        </div>
      </a>
    ))}
  </div>
);
