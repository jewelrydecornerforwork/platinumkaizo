"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, ShieldAlert, Zap } from 'lucide-react';
import { LEADER_ART_ASSETS, POKEMON_ART_ASSETS } from '@/data/remoteAssets';
import { defaultTrainerId, trainersData } from '@/data/trainers';
import type { TrainerIntelProfile, TrainerPokemonIntel } from '@/types';

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '');
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-slate-500">
        <span>{label}</span>
        <span style={{ color: 'var(--trainer-primary)' }}>{value}</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-900/90"
        style={{ boxShadow: 'inset 0 0 0 1px var(--trainer-primary-faint)' }}
      >
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.42, ease: 'easeOut' }}
          style={{
            background:
              'linear-gradient(90deg, var(--trainer-primary-faint), var(--trainer-primary-soft), var(--trainer-primary))',
            boxShadow: '0 0 16px var(--trainer-primary-glow)',
          }}
        />
      </div>
    </div>
  );
}

function TargetButton({
  trainer,
  isActive,
  onClick,
}: {
  trainer: TrainerIntelProfile;
  isActive: boolean;
  onClick: () => void;
}): React.ReactElement {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.975, y: 1 }}
      className="group relative w-full overflow-hidden rounded-xl border px-4 py-3 text-left"
      style={{
        borderColor: isActive ? 'var(--trainer-primary-border)' : 'rgba(51, 65, 85, 0.9)',
        background: isActive ? 'var(--trainer-primary-faint)' : 'rgba(15, 23, 42, 0.82)',
        boxShadow: isActive
          ? 'inset 0 0 18px var(--trainer-primary-faint), 0 0 16px var(--trainer-primary-faint)'
          : 'none',
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(var(--trainer-primary-grid) 1px, transparent 1px), linear-gradient(90deg, var(--trainer-primary-grid) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
      />
      <div
        className="absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full transition-all"
        style={{
          backgroundColor: isActive ? 'var(--trainer-primary)' : 'rgba(71, 85, 105, 0.85)',
          boxShadow: isActive ? '0 0 10px var(--trainer-primary-glow)' : 'none',
        }}
      />
      <div className="absolute inset-x-3 bottom-0 h-px origin-center scale-x-0 bg-white/0 transition-transform duration-200 group-hover:scale-x-100" />
      <div className="relative flex items-center justify-between gap-3 pl-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-500">
            TARGET {trainer.code}
          </p>
          <p className={`mt-1 text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-300'}`}>
            {trainer.name}
          </p>
        </div>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.24em]"
          style={{ color: isActive ? 'var(--trainer-primary)' : '#64748b' }}
        >
          {trainer.specialty}
        </p>
      </div>
    </motion.button>
  );
}

function TrainerPortrait({
  trainer,
}: {
  trainer: TrainerIntelProfile;
}): React.ReactElement {
  return (
    <div
      className="relative aspect-[4/4.55] overflow-hidden rounded-2xl border bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))]"
      style={{
        borderColor: 'var(--trainer-primary-border)',
        boxShadow: '0 0 32px var(--trainer-primary-faint)',
      }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(var(--trainer-primary-grid) 1px, transparent 1px), linear-gradient(90deg, var(--trainer-primary-grid) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-20"
        style={{ background: 'linear-gradient(180deg, var(--trainer-primary-faint), transparent)' }}
      />
      <div
        className="absolute left-4 top-4 rounded-lg border bg-slate-950/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em]"
        style={{ borderColor: 'var(--trainer-primary-border)', color: 'var(--trainer-primary)' }}
      >
        {trainer.code}
      </div>
      <div className="absolute right-4 top-4 rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-1 text-[10px] tracking-[0.22em] text-slate-300">
        {trainer.specialty}
      </div>
      <motion.div
        className="absolute bottom-6 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full blur-3xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ backgroundColor: 'var(--trainer-primary-glow)' }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6 pb-6 pt-14">
        <div className="relative h-[84%] w-[84%] overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/45">
          <Image
            src={LEADER_ART_ASSETS[trainer.id] || trainer.silhouetteAsset}
            alt={trainer.name}
            fill
            className="object-contain object-bottom p-4"
          />
        </div>
      </div>
      <div
        className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.32em]"
        style={{ color: 'var(--trainer-primary)' }}
      >
        {trainer.portraitLabel}
      </div>
    </div>
  );
}

function UnitCard({
  unit,
  index,
}: {
  unit: TrainerPokemonIntel;
  index: number;
}): React.ReactElement {
  const showTopEdge = index < 3;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="relative h-full overflow-hidden rounded-2xl border bg-slate-900/45 p-5 backdrop-blur-sm"
      style={{
        borderColor: 'var(--trainer-primary-border)',
        boxShadow: '0 0 16px rgba(15, 23, 42, 0.55)',
      }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(var(--trainer-primary-grid) 1px, transparent 1px), linear-gradient(90deg, var(--trainer-primary-grid) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />
      {showTopEdge ? (
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--trainer-primary-border), var(--trainer-primary), var(--trainer-primary-border), transparent)',
            boxShadow: '0 0 10px var(--trainer-primary-faint)',
          }}
        />
      ) : null}

      <div className="relative z-10">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
              <Image
                src={POKEMON_ART_ASSETS[unit.enName]}
                alt={unit.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--trainer-primary)' }}>
                {unit.level}
              </p>
              <h3 className="mt-2 text-lg font-black tracking-tight text-white">{unit.name}</h3>
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">{unit.enName}</p>
            </div>
          </div>
        </div>

        <p className="mb-4 text-[13px] leading-6 text-slate-400">{unit.tactic}</p>

        <div
          className="mb-4 space-y-2 rounded-xl bg-slate-950/75 p-4"
          style={{ boxShadow: 'inset 0 0 0 1px var(--trainer-primary-faint)' }}
        >
          <StatBar label="HP" value={unit.stats.hp} />
          <StatBar label="ATK" value={unit.stats.atk} />
          <StatBar label="DEF" value={unit.stats.def} />
          <StatBar label="SPE" value={unit.stats.spe} />
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-end">
            <div
              className="rounded-lg border px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]"
              style={{
                borderColor: 'var(--trainer-primary-border)',
                backgroundColor: 'var(--trainer-primary-faint)',
                color: 'var(--trainer-primary)',
              }}
            >
              {unit.role}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
            <span className="text-slate-500">THREAT FLAG</span>
            <span style={{ color: 'var(--trainer-primary)' }}>{unit.note}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
            <span className="text-slate-500">ABILITY</span>
            <span style={{ color: 'var(--trainer-primary)' }}>{unit.ability}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
            <span className="text-slate-500">NATURE</span>
            <span style={{ color: 'var(--trainer-primary)' }}>{unit.nature}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-slate-950/70 px-3 py-2">
            <span className="text-slate-500">HELD ITEM</span>
            <span style={{ color: 'var(--trainer-primary)' }}>{unit.item}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">KEY MOVE PACKAGE</p>
          <div className="flex flex-wrap gap-2">
            {unit.moves.map((move) => (
              <span
                key={move}
                className="rounded-full border px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em]"
                style={{
                  borderColor: 'var(--trainer-primary-border)',
                  backgroundColor: 'var(--trainer-primary-faint)',
                  color: 'var(--trainer-primary)',
                }}
              >
                {move}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function BossIntelPage(): React.ReactElement {
  const [activeTrainer, setActiveTrainer] = useState(defaultTrainerId);
  const currentTrainer =
    trainersData.find((trainer) => trainer.id === activeTrainer) ?? trainersData[0];

  const themeVars = {
    '--trainer-primary': currentTrainer.primaryColor,
    '--trainer-primary-soft': hexToRgba(currentTrainer.primaryColor, 0.2),
    '--trainer-primary-faint': hexToRgba(currentTrainer.primaryColor, 0.11),
    '--trainer-primary-border': hexToRgba(currentTrainer.primaryColor, 0.35),
    '--trainer-primary-glow': hexToRgba(currentTrainer.primaryColor, 0.46),
    '--trainer-primary-grid': hexToRgba(currentTrainer.primaryColor, 0.08),
  } as React.CSSProperties;

  return (
    <>
      <style jsx>{`
        @keyframes radarSweep {
          0% { transform: translateY(-18%); opacity: 0; }
          10% { opacity: 1; }
          50% { opacity: 0.85; }
          100% { transform: translateY(118%); opacity: 0; }
        }

        @keyframes dataPulse {
          0% { opacity: 0.3; transform: translateX(-8px); }
          50% { opacity: 0.9; transform: translateX(0); }
          100% { opacity: 0.3; transform: translateX(8px); }
        }

        .trainer-feed-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .trainer-feed-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <motion.div
        style={themeVars}
        animate={themeVars as any}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        className="relative min-h-screen overflow-hidden bg-[#020617] p-6 text-slate-200 lg:p-12"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(var(--trainer-primary-grid) 1px, transparent 1px), linear-gradient(90deg, var(--trainer-primary-grid) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute inset-0 opacity-15 [background-image:repeating-linear-gradient(180deg,rgba(148,163,184,0.08)_0px,rgba(148,163,184,0.08)_1px,transparent_1px,transparent_6px)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 15%, var(--trainer-primary-soft), transparent 24%), radial-gradient(circle at 80% 25%, rgba(59,130,246,0.12), transparent 22%), radial-gradient(circle at 50% 100%, var(--trainer-primary-faint), transparent 28%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            animation: 'radarSweep 7s linear infinite',
            background: 'linear-gradient(180deg, transparent, var(--trainer-primary-faint), transparent)',
          }}
        />

        <div
          className="relative mx-auto mb-12 flex max-w-7xl items-end justify-between border-b pb-6"
          style={{ borderColor: 'var(--trainer-primary-border)' }}
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">GYM LEADER TACTICAL DOSSIER</h1>
            <p className="mt-2 font-mono text-sm" style={{ color: 'var(--trainer-primary)' }}>
              CLASSIFIED // PLATINUM KAIZO TACTICAL DATA
            </p>
          </div>
          <div className="hidden text-right md:block">
            <p className="font-mono text-xs text-slate-500">ENCRYPTION: AES-256</p>
            <p className="font-mono text-xs text-slate-500">STATUS: LIVE_INTEL</p>
          </div>
        </div>

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/55 p-4 shadow-[0_0_22px_rgba(15,23,42,0.7)]">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: 'var(--trainer-primary)' }}>
                  TARGET SELECTION
                </p>
                <div
                  className="h-2 w-10 rounded-full"
                  style={{
                    animation: 'dataPulse 1.8s linear infinite',
                    background: 'linear-gradient(90deg, transparent, var(--trainer-primary), transparent)',
                  }}
                />
              </div>
              <div className="space-y-3">
                {trainersData.map((trainer) => (
                  <TargetButton
                    key={trainer.id}
                    trainer={trainer}
                    isActive={trainer.id === currentTrainer.id}
                    onClick={() => setActiveTrainer(trainer.id)}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`left-${currentTrainer.id}`}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="space-y-4"
              >
                <TrainerPortrait trainer={currentTrainer} />

                <div
                  className="rounded-2xl border bg-slate-900/50 p-4"
                  style={{
                    borderColor: 'var(--trainer-primary-border)',
                    boxShadow: '0 0 18px rgba(15, 23, 42, 0.52)',
                  }}
                >
                  <h2 className="mb-2.5 flex items-center gap-2 text-base font-bold text-white">
                    <ShieldAlert className="h-4 w-4 text-red-500" /> {currentTrainer.name}
                  </h2>
                  <p className="text-[13px] leading-7 text-slate-400">
                    {currentTrainer.intel}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500">
                      THREAT INDEX
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800">
                      <motion.div
                        key={`${currentTrainer.id}-threat`}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentTrainer.threatLevel}%` }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{
                          background:
                            'linear-gradient(90deg, var(--trainer-primary-faint), var(--trainer-primary-soft), var(--trainer-primary))',
                          boxShadow: '0 0 14px var(--trainer-primary-glow)',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="space-y-8 lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`right-${currentTrainer.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-8"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.32em]" style={{ color: 'var(--trainer-primary)' }}>
                      LIVE TARGET FEED
                    </p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight text-white">
                      {currentTrainer.name}
                    </h2>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-right">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      SPECIALTY
                    </p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: 'var(--trainer-primary)' }}>
                      {currentTrainer.specialty} SECTOR
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div
                    className="trainer-feed-scroll max-h-[calc(100vh-22rem)] overflow-y-auto pr-5 pt-1"
                    style={{
                      maskImage: 'linear-gradient(180deg, transparent 0, black 0.9rem, black 100%)',
                      WebkitMaskImage:
                        'linear-gradient(180deg, transparent 0, black 0.9rem, black 100%)',
                    }}
                  >
                    <motion.div
                      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                        },
                      }}
                    >
                      {currentTrainer.pokemon.map((unit, index) => (
                        <UnitCard key={`${currentTrainer.id}-${unit.id}`} unit={unit} index={index} />
                      ))}
                    </motion.div>
                  </div>
                </div>

                <div
                  className="relative overflow-hidden rounded-3xl border p-6"
                  style={{
                    borderColor: 'var(--trainer-primary-border)',
                    backgroundColor: 'var(--trainer-primary-faint)',
                    boxShadow: '0 0 20px rgba(15, 23, 42, 0.5)',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        'linear-gradient(var(--trainer-primary-grid) 1px, transparent 1px), linear-gradient(90deg, var(--trainer-primary-grid) 1px, transparent 1px)',
                      backgroundSize: '22px 22px',
                    }}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-28"
                    style={{
                      animation: 'radarSweep 5.6s linear infinite',
                      background: 'linear-gradient(180deg, transparent, var(--trainer-primary-faint), transparent)',
                    }}
                  />
                  <div className="absolute right-0 top-0 p-4 opacity-10">
                    <Crosshair className="h-24 w-24" style={{ color: 'var(--trainer-primary)' }} />
                  </div>

                  <div className="relative z-10">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-bold" style={{ color: 'var(--trainer-primary)' }}>
                      <Zap className="h-4 w-4" /> BATTLEFIELD DECISION BRIEF
                    </h3>
                    <p className="text-sm leading-6 text-slate-300">
                      {currentTrainer.recommendation}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  );
}


