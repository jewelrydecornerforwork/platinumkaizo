import Link from 'next/link';
import { BookOpenText, Calculator, Shield, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { TacticalFrame } from '@/components/ui/TacticalFrame';

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-16 pt-24 md:px-12">
      <Navbar />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12),transparent_24%),radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_48%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="mb-10 text-center">
          <h1 className="title-strong mb-3 text-5xl text-white md:text-7xl">
            白金改版战术情报中心
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-emerald-300 md:text-base">
            多源战斗数据融合、实时态势分析与策略级推演平台
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 xl:auto-rows-[minmax(180px,1fr)]">
          <Link
            href="/calculator"
            aria-label="进入伤害计算"
            className="md:col-span-2 xl:col-span-2 xl:row-span-2"
          >
            <TacticalFrame title="Core Module" className="h-full">
              <div className="flex h-full flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                    <Calculator size={30} strokeWidth={2.2} />
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/50">
                    Live Calculation Engine
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-3xl font-black text-white md:text-4xl">
                    伤害计算
                  </h2>
                  <p className="max-w-xl text-sm leading-7 text-slate-300 md:text-base">
                    执行核心对战演算，评估击杀阈值、回合交换效率与风险窗口。用于快速确认
                    Kaizo 环境下的先手线、斩杀线与换人代价。
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      Damage Window
                    </div>
                    <div className="mt-2 font-mono text-3xl font-black text-white">
                      84.3% - 99.1%
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-black/20 p-4">
                    <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-slate-500">
                      Tactical Status
                    </div>
                    <div className="mt-2 text-sm text-emerald-300">
                      演算引擎持续运行
                    </div>
                  </div>
                </div>
              </div>
            </TacticalFrame>
          </Link>

          <Link
            href="/pokedex"
            aria-label="进入全图鉴"
            className="md:col-span-2 xl:col-span-2"
          >
            <TacticalFrame title="Dex Module" className="h-full">
              <div className="flex h-full items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-cyan-300">
                    <BookOpenText size={24} strokeWidth={2.2} />
                  </div>
                  <h2 className="mb-2 text-2xl font-black text-white">全图鉴</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
                    检索属性、种族值、特性、招式与稀有度信息，快速建立战术认知。
                  </p>
                </div>
                <div className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-cyan-400/45 md:block">
                  Dex Database Ready
                </div>
              </div>
            </TacticalFrame>
          </Link>

          <Link
            href="/trainers"
            aria-label="进入馆主对战"
            className="md:col-span-2 xl:col-span-2"
          >
            <TacticalFrame title="Boss Intel" className="h-full">
              <div className="flex h-full items-start justify-between gap-4">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl border border-orange-500/20 bg-orange-500/10 p-3 text-orange-300">
                    <Shield size={24} strokeWidth={2.2} />
                  </div>
                  <h2 className="mb-2 text-2xl font-black text-white">馆主对战</h2>
                  <p className="max-w-xl text-sm leading-6 text-slate-300">
                    汇总关键馆主阵容、技能覆盖与压制节奏，制定针对 Platinum Kaizo 的突破方案。
                  </p>
                </div>
                <div className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-orange-400/45 md:block">
                  Enemy Intel Updated
                </div>
              </div>
            </TacticalFrame>
          </Link>

          <Link
            href="/teambuilder"
            aria-label="进入队伍构建"
            className="xl:col-start-2"
          >
            <TacticalFrame title="Build Matrix" className="h-full">
              <div className="flex h-full flex-col justify-between gap-4">
                <div className="inline-flex w-fit rounded-2xl border border-violet-500/20 bg-violet-500/10 p-3 text-violet-300">
                  <Users size={22} strokeWidth={2.2} />
                </div>
                <div>
                  <h2 className="mb-2 text-xl font-black text-white">队伍构建</h2>
                  <p className="text-sm leading-6 text-slate-300">
                    统筹输出曲线、抗性链路与作战稳定性。
                  </p>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-violet-300/55">
                  Team Matrix Synced
                </div>
              </div>
            </TacticalFrame>
          </Link>

          <TacticalFrame title="System Status" className="h-full xl:col-start-3">
            <div className="flex h-full flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-300">
                  系统在线
                </span>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                  Database Version
                </div>
                <div className="mt-2 font-mono text-2xl font-black text-white">
                  PKZ v4.2
                </div>
              </div>

              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Uptime // 247h 18m
              </div>
            </div>
          </TacticalFrame>
        </section>
      </div>
    </div>
  );
}
