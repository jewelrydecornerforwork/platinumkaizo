import Image from 'next/image';
import Link from 'next/link';
import { BookOpenText, Calculator, Github, Shield, Users } from 'lucide-react';
import { TacticalFrame } from '@/components/ui/TacticalFrame';

const statusBadges = [
  'DATABASE: ONLINE',
  'VERSION: KAIZO_V1.1',
  'SECURITY: ACTIVE',
] as const;

const gymQuickAccess = [
  { id: '01', name: 'Roark', href: '/trainers', asset: '/silhouettes/roark.svg' },
  { id: '02', name: 'Gardenia', href: '/trainers', asset: '/silhouettes/gardenia.svg' },
  { id: '03', name: 'Maylene', href: '/trainers', asset: '/silhouettes/maylene.svg' },
  { id: '04', name: 'Wake', href: '/trainers', asset: '/silhouettes/wake.svg' },
] as const;

const newsFeed = [
  { time: '07:14', text: 'BALLISTIC CALCULATION STACK SYNCHRONIZED. PRIMARY KO THRESHOLD TABLE REFRESHED.' },
  { time: '08:32', text: 'GYM LEADER DOSSIER APPENDED WITH AI SWITCH CHAIN NOTES AND HIGH-RISK LEAD TAGS.' },
  { time: '09:05', text: 'DEX INTEL DATABASE COMPLETED MOVE MAPPING VALIDATION. FIELD CONSISTENCY PASSED.' },
  { time: '10:21', text: 'STRIKE TEAM MATRIX NOW REFERENCES THE LATEST KAIZO THREAT PRIORITY MODEL.' },
] as const;

const commandLinks = [
  { label: 'Discord', href: '#' },
  { label: 'GitHub', href: '#' },
  { label: 'Docs', href: '#' },
] as const;

const NavCard = ({
  href,
  className = '',
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className={`group block h-full w-full cursor-pointer ${className}`}>
    <div className="h-full w-full transition-all duration-300 group-hover:scale-[1.02] group-active:scale-[0.99]">
      {children}
    </div>
  </Link>
);

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-8 pt-12 md:px-12 md:pt-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_48%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="mb-10 text-center">
          <h1 className="title-strong mb-3 text-5xl text-white md:text-7xl">
            PLATINUM KAIZO TACTICAL COMMAND GRID
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-emerald-300 md:text-base">
            MULTI-SOURCE COMBAT INTELLIGENCE FUSION, LIVE THREAT MAPPING, AND HARDCORE STRATEGIC EXECUTION.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {statusBadges.map((badge) => (
              <div
                key={badge}
                className="rounded-full border border-emerald-500/15 bg-slate-900/40 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-emerald-300/70 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.45)]"
              >
                {badge}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 border-y border-emerald-500/10 py-4 font-mono text-[10px] uppercase tracking-widest text-emerald-500/60">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-500" />
              DATABASE_SYNC: SUCCESSFUL
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              UPLOADER: CHIEF_ARCHITECT
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
              VERSION: PLATINUM_KAIZO_V1.1
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:auto-rows-[minmax(160px,1fr)] xl:grid-cols-4">
          <NavCard href="/calculator" className="xl:col-span-2 xl:row-span-2">
            <TacticalFrame
              title="Primary Strike Module"
              className="h-full transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                    <Calculator size={30} strokeWidth={2.2} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/50">
                    LIVE CALCULATION ENGINE
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">
                    PRECISION BALLISTIC CONSOLE
                  </h2>
                  <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                    Execute primary combat simulation, confirm lethal ranges, review exchange efficiency, and verify tactical punishment windows inside the Kaizo ruleset.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      DAMAGE WINDOW
                    </div>
                    <div className="mt-2 font-mono text-3xl font-black text-white">
                      84.3% - 99.1%
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      TACTICAL STATUS
                    </div>
                    <div className="mt-2 font-mono text-sm uppercase tracking-[0.18em] text-emerald-300">
                      CALCULATION ENGINE ONLINE
                    </div>
                  </div>
                </div>
              </div>
            </TacticalFrame>
          </NavCard>

          <NavCard href="/pokedex" className="xl:col-span-2">
            <TacticalFrame
              title="Dex Intelligence Module"
              className="h-full transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                    <BookOpenText size={24} strokeWidth={2.2} />
                  </div>
                  <h2 className="mb-2 text-2xl font-black text-white">FULL DEX INDEX</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
                    Search typing, base stats, abilities, move coverage, and revision flags to build faster tactical recognition.
                  </p>
                </div>
                <div className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/45 md:block">
                  DEX DATABASE READY
                </div>
              </div>
            </TacticalFrame>
          </NavCard>

          <NavCard href="/trainers" className="xl:col-span-2">
            <TacticalFrame
              title="Leader Dossier Module"
              className="h-full transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-300">
                    <Shield size={24} strokeWidth={2.2} />
                  </div>
                  <h2 className="mb-2 text-2xl font-black text-white">GYM LEADER TACTICAL DOSSIER</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
                    Review hostile lineups, move coverage, and pressure sequencing to plan clean breakthroughs against Platinum Kaizo bosses.
                  </p>
                </div>
                <div className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-orange-400/45 md:block">
                  ENEMY INTEL UPDATED
                </div>
              </div>
            </TacticalFrame>
          </NavCard>

          <TacticalFrame title="Gym Quick-Access" className="xl:col-span-4">
            <div className="grid grid-cols-4 gap-3 md:grid-cols-4 xl:grid-cols-8">
              {gymQuickAccess.map((leader) => (
                <Link
                  key={leader.id}
                  href={leader.href}
                  aria-label={`Open ${leader.name} dossier`}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 text-center backdrop-blur-md transition-all hover:border-emerald-500/35 hover:shadow-[0_0_18px_rgba(16,185,129,0.12)]"
                >
                  <div className="relative mx-auto mb-3 h-12 w-12 overflow-hidden rounded-lg border border-slate-800 bg-black/25">
                    <Image
                      src={leader.asset}
                      alt={leader.name}
                      fill
                      className="object-contain p-2 opacity-85"
                    />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-300">
                    {leader.name}
                  </div>
                </Link>
              ))}
            </div>
          </TacticalFrame>

          <TacticalFrame title="News Feed" className="xl:col-span-2">
            <div className="space-y-3">
              {newsFeed.map((item) => (
                <div
                  key={`${item.time}-${item.text}`}
                  className="flex items-start gap-4 rounded-xl border border-slate-800 bg-black/15 px-4 py-3"
                >
                  <span className="min-w-14 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/60">
                    {item.time}
                  </span>
                  <span className="font-mono text-xs leading-6 text-slate-400">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </TacticalFrame>

          <NavCard href="/teambuilder">
            <TacticalFrame
              title="Formation Matrix"
              className="h-full transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="inline-flex w-fit rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-300">
                  <Users size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="mb-2 text-xl font-black text-white">STRIKE TEAM ARCHITECT</h2>
                  <p className="text-sm leading-6 text-slate-300">
                    Audit offensive curves, resistance chains, and structural battlefield stability.
                  </p>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-violet-300/55">
                  TEAM MATRIX SYNCED
                </div>
              </div>
            </TacticalFrame>
          </NavCard>

          <TacticalFrame title="System Status" className="h-full">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
                  SYSTEM ONLINE
                </span>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  DATABASE VERSION
                </div>
                <div className="mt-2 font-mono text-2xl font-black text-white">
                  PKZ v4.2
                </div>
              </div>

              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                UPTIME // 247H 18M
              </div>
            </div>
          </TacticalFrame>

          <div className="xl:col-span-4">
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {commandLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 font-mono text-xs uppercase tracking-[0.24em] text-slate-200 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(16,185,129,0.22)]"
                >
                  {link.label === 'GitHub' ? <Github size={14} /> : null}
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
