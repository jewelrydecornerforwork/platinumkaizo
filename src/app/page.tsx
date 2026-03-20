import Link from 'next/link';
import {
  BookOpenText,
  Calculator,
  Server,
  Shield,
  TerminalSquare,
  Users,
} from 'lucide-react';
import { StatusMedals } from '@/components/home/StatusMedals';
import { TacticalFrame } from '@/components/ui/TacticalFrame';

const nodeEnvelope = [
  {
    title: 'Server Mesh',
    detail: 'ACTIVE UPLINK // THREE REGIONS VERIFIED',
    icon: Server,
    tone: 'border-emerald-500/15 bg-emerald-500/10 text-emerald-300',
  },
  {
    title: 'Terminal Queue',
    detail: 'PATCH REVIEW // NO CRITICAL DRIFT DETECTED',
    icon: TerminalSquare,
    tone: 'border-cyan-500/15 bg-cyan-500/10 text-cyan-300',
  },
  {
    title: 'Threat Posture',
    detail: 'SECURE ACCESS // BOSS ROUTES INDEXED',
    icon: Shield,
    tone: 'border-orange-500/15 bg-orange-500/10 text-orange-300',
  },
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cpath d='M48 0H0v48' fill='none' stroke='rgba(148,163,184,0.18)' stroke-width='1'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='6' viewBox='0 0 6 6'%3E%3Crect width='6' height='1' fill='rgba(148,163,184,0.9)'/%3E%3C/svg%3E\")",
          backgroundSize: '100% 6px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[28%] z-0 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10"
      >
        <div
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10 animate-ping"
          style={{ animationDuration: '6s' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/10 animate-ping"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10 animate-ping"
          style={{ animationDuration: '6s', animationDelay: '4s' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="mb-10 text-center">
          <h1 className="title-strong mb-3 text-5xl text-white md:text-7xl">
            PLATINUM KAIZO TACTICAL COMMAND GRID
          </h1>
          <p className="mx-auto max-w-4xl text-sm text-emerald-300 md:text-base">
            MULTI-SOURCE COMBAT INTELLIGENCE FUSION, LIVE THREAT MAPPING, AND HARDCORE STRATEGIC EXECUTION.
          </p>
        </section>

        <section className="grid grid-cols-12 gap-4 xl:auto-rows-[minmax(112px,auto)]">
          <NavCard href="/calculator" className="col-span-12 lg:col-span-7 lg:row-span-2">
            <TacticalFrame
              title="Primary Strike Module"
              subtitle="PRIORITY_CORE"
              className="h-full shadow-[0_0_30px_rgba(16,185,129,0.08),inset_0_1px_3px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                    <Calculator size={30} strokeWidth={2.2} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/50">
                    LIVE CALCULATION ENGINE
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-2xl font-black text-white md:text-3xl xl:text-4xl">
                    PRECISION BALLISTIC CONSOLE
                  </h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
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

          <NavCard href="/pokedex" className="col-span-12 md:col-span-6 lg:col-span-5">
            <TacticalFrame
              title="Dex Intelligence Module"
              subtitle="DEX_NODE"
              className="h-full shadow-[0_0_26px_rgba(14,165,233,0.08),inset_0_1px_3px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                    <BookOpenText size={24} strokeWidth={2.2} />
                  </div>
                  <h2 className="mb-2 text-xl font-black text-white">FULL DEX INDEX</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
                    Search typing, base stats, abilities, move coverage, and revision flags to build faster tactical recognition.
                  </p>
                </div>
              </div>
            </TacticalFrame>
          </NavCard>

          <NavCard href="/trainers" className="col-span-12 md:col-span-6 lg:col-span-5">
            <TacticalFrame
              title="Leader Dossier Module"
              subtitle="OPS_NODE"
              className="h-full shadow-[0_0_26px_rgba(249,115,22,0.08),inset_0_1px_3px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:border-emerald-500/50"
            >
              <div className="flex h-full items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-300">
                    <Shield size={24} strokeWidth={2.2} />
                  </div>
                  <h2 className="mb-2 text-xl font-black text-white">GYM LEADER TACTICAL DOSSIER</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
                    Review hostile lineups, move coverage, and pressure sequencing to plan clean breakthroughs against Platinum Kaizo bosses.
                  </p>
                </div>
              </div>
            </TacticalFrame>
          </NavCard>

          <NavCard href="/teambuilder" className="col-span-12 md:col-span-6 lg:col-span-2">
            <TacticalFrame
              title="Formation Matrix"
              subtitle="BUILD_NODE"
              className="h-full shadow-[0_0_26px_rgba(139,92,246,0.08),inset_0_1px_3px_rgba(16,185,129,0.3)] transition-all duration-300 group-hover:border-emerald-500/50"
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

          <TacticalFrame
            title="Status Medals"
            subtitle="ACCESS_FLAGS"
            className="col-span-12 lg:col-span-5 shadow-[0_0_28px_rgba(16,185,129,0.06),inset_0_1px_3px_rgba(16,185,129,0.3)]"
          >
            <StatusMedals />
          </TacticalFrame>

          <TacticalFrame
            title="Node Envelope"
            subtitle="NETWORK_CAGE"
            className="col-span-12 lg:col-span-10 shadow-[0_0_22px_rgba(15,23,42,0.7),inset_0_1px_3px_rgba(16,185,129,0.3)]"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {nodeEnvelope.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.title} className="rounded-xl border border-slate-800 bg-black/20 p-4">
                    <div className={`mb-3 inline-flex rounded-xl border p-3 ${item.tone}`}>
                      <Icon size={18} />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                      {item.title}
                    </p>
                    <p className="mt-2 font-mono text-sm uppercase tracking-[0.14em] text-white">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>
          </TacticalFrame>
        </section>
      </div>
    </div>
  );
}
