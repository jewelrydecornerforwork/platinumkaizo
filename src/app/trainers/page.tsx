"use client";

import React from 'react';
import { Crosshair, ShieldAlert, Zap } from 'lucide-react';

type UnitIntel = {
  id: string;
  name: string;
  enName: string;
  level: string;
  role: string;
  summary: string;
  threat: string;
  nature: string;
  item: string;
  stats: {
    hp: number;
    atk: number;
    def: number;
    spe: number;
  };
};

const roarkUnits: UnitIntel[] = [
  {
    id: 'cranidos',
    name: '头盖龙',
    enName: 'Cranidos',
    level: 'LV. 14',
    role: '首发破盾手',
    summary: '依靠极高攻击种族值与生命玉修正进行正面强攻，是开局最危险的减员点。',
    threat: '生命玉强攻',
    nature: '固执',
    item: '生命宝珠',
    stats: {
      hp: 67,
      atk: 125,
      def: 40,
      spe: 58,
    },
  },
  {
    id: 'onix',
    name: '大岩蛇',
    enName: 'Onix',
    level: 'LV. 12',
    role: '布场中转位',
    summary: '高防御配合岩石抗性链，常用于接管回合并铺设压制节奏。',
    threat: '生命玉强攻',
    nature: '固执',
    item: '生命宝珠',
    stats: {
      hp: 35,
      atk: 45,
      def: 160,
      spe: 70,
    },
  },
  {
    id: 'geodude',
    name: '小拳石',
    enName: 'Geodude',
    level: 'LV. 11',
    role: '低速压制位',
    summary: '依靠地面与岩石双本联防施压，在残局中仍具备强制换人的威慑力。',
    threat: '生命玉强攻',
    nature: '固执',
    item: '生命宝珠',
    stats: {
      hp: 40,
      atk: 80,
      def: 100,
      spe: 20,
    },
  },
];

function StatBar({
  label,
  value,
  max = 180,
}: {
  label: string;
  value: number;
  max?: number;
}): React.ReactElement {
  const width = `${Math.min((value / max) * 100, 100)}%`;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.24em] text-slate-400">
        <span>{label}</span>
        <span className="text-emerald-300">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-emerald-500/15">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.25),rgba(74,222,128,0.88),rgba(187,247,208,1))] shadow-[0_0_14px_rgba(74,222,128,0.55)]"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function PixelPortrait(): React.ReactElement {
  const pixels = [
    [3, 1], [4, 1], [5, 1],
    [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
    [2, 3], [3, 3], [4, 3], [5, 3], [6, 3],
    [2, 4], [3, 4], [4, 4], [5, 4], [6, 4],
    [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
    [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
    [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
    [2, 8], [3, 8], [4, 8], [5, 8], [6, 8],
    [2, 9], [3, 9], [4, 9], [5, 9], [6, 9],
    [2, 10], [3, 10], [5, 10], [6, 10],
    [2, 11], [3, 11], [5, 11], [6, 11],
  ] as const;

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))]">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(16,185,129,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.10)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-400/15 to-transparent" />
      <div className="absolute inset-6 rounded-xl border border-slate-800/80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-56 w-40">
          {pixels.map(([x, y]) => (
            <div
              key={`${x}-${y}`}
              className="absolute bg-emerald-300/75 shadow-[0_0_12px_rgba(74,222,128,0.25)]"
              style={{
                width: '12.5%',
                height: '8.333%',
                left: `${x * 12.5}%`,
                top: `${y * 8.333}%`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 text-[10px] font-mono uppercase tracking-[0.32em] text-emerald-300/70">
        Roark silhouette
      </div>
    </div>
  );
}

function UnitCard({ unit }: { unit: UnitIntel }): React.ReactElement {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/45 p-6 shadow-[0_0_24px_rgba(16,185,129,0.08)] backdrop-blur-sm transition-all hover:border-emerald-500/45 hover:shadow-[0_0_28px_rgba(16,185,129,0.18)]">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

      <div className="relative z-10">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400/80">{unit.level}</p>
            <h3 className="mt-2 text-xl font-black tracking-tight text-white">{unit.name}</h3>
            <p className="text-xs font-mono uppercase tracking-[0.24em] text-slate-500">{unit.enName}</p>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-300">
            {unit.role}
          </div>
        </div>

        <p className="mb-5 text-sm leading-relaxed text-slate-400">{unit.summary}</p>

        <div className="mb-5 space-y-3 rounded-xl bg-slate-950/70 p-4 ring-1 ring-emerald-500/10">
          <StatBar label="HP" value={unit.stats.hp} />
          <StatBar label="ATK" value={unit.stats.atk} />
          <StatBar label="DEF" value={unit.stats.def} />
          <StatBar label="SPE" value={unit.stats.spe} />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2 text-slate-300">
            <span className="tracking-wide text-slate-500">核心威胁</span>
            <span className="font-semibold text-emerald-300">{unit.threat}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2 text-slate-300">
            <span className="tracking-wide text-slate-500">性格</span>
            <span className="font-semibold text-emerald-300">{unit.nature}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950/60 px-3 py-2 text-slate-300">
            <span className="tracking-wide text-slate-500">携带道具</span>
            <span className="font-semibold text-emerald-300">{unit.item}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BossIntelPage(): React.ReactElement {
  return (
    <>
      <style jsx>{`
        @keyframes radarSweep {
          0% { transform: translateY(-18%); opacity: 0; }
          10% { opacity: 1; }
          50% { opacity: 0.85; }
          100% { transform: translateY(118%); opacity: 0; }
        }
      `}</style>

      <div className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-slate-200 lg:p-12">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 opacity-15 [background-image:repeating-linear-gradient(180deg,rgba(148,163,184,0.08)_0px,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_6px)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(16,185,129,0.16),transparent_24%),radial-gradient(circle_at_80%_25%,rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_28%)]" />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-transparent via-emerald-400/12 to-transparent"
          style={{ animation: 'radarSweep 7s linear infinite' }}
        />

        <div className="relative mx-auto mb-12 flex max-w-7xl items-end justify-between border-b border-emerald-500/30 pb-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">馆主战术情报中心</h1>
            <p className="mt-2 font-mono text-sm text-emerald-500">CLASSIFIED // PLATINUM KAIZO TACTICAL DATA</p>
          </div>
          <div className="hidden text-right md:block">
            <p className="font-mono text-xs text-slate-500">ENCRYPTION: AES-256</p>
            <p className="font-mono text-xs text-slate-500">STATUS: LIVE_INTEL</p>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <PixelPortrait />

            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-[0_0_26px_rgba(16,185,129,0.08)]">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <ShieldAlert className="h-5 w-5 text-red-500" /> 瓢太 (Roark)
              </h2>
              <p className="text-sm leading-relaxed text-slate-400">
                白金改版第一道关卡。瓢太的队伍在 Kaizo 版中不再是教学强度，而是围绕岩石系高压首发与耐久联防构建的完整试炼。
                若在开局让出节奏，头盖龙会迅速把对局推进到减员交换阶段。
              </p>
              <div className="mt-6 space-y-2">
                <div className="text-[10px] font-mono uppercase text-slate-500">核心威胁度</div>
                <div className="h-1.5 w-full rounded-full bg-slate-800">
                  <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#10b981,#4ade80,#bbf7d0)] shadow-[0_0_14px_rgba(74,222,128,0.55)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {roarkUnits.map((unit) => (
                <UnitCard key={unit.id} unit={unit} />
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-8 shadow-[0_0_30px_rgba(16,185,129,0.10)]">
              <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(16,185,129,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent"
                style={{ animation: 'radarSweep 5.6s linear infinite' }}
              />
              <div className="absolute right-0 top-0 p-4 opacity-10">
                <Crosshair className="h-24 w-24" />
              </div>

              <div className="relative z-10">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-emerald-400">
                  <Zap className="h-5 w-5" /> 战场决策建议
                </h3>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-emerald-500">▶</span>
                    注意头盖龙的生命玉强攻轴，非抵抗属性切入将直接暴露减员风险。
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">▶</span>
                    大岩蛇的高防中转会拖长对局，请提前准备草系或水系稳定突破点。
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-500">▶</span>
                    小拳石虽速度低，但在残局交换中依旧能凭双本覆盖强制逼退脆皮单位。
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
