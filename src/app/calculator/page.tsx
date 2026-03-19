'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Pokemon } from '@smogon/calc';
import { AnimatePresence, motion } from 'framer-motion';
import { Crosshair, Radar, ShieldAlert, Swords } from 'lucide-react';
import { TypeIcon } from '@/components/calc/TypeIcon';
import { LeaderList } from '@/components/trainers/LeaderList';
import { TYPE_CHART } from '@/constants/typeChart';
import { GYM_MOVE_INTEL, getGymMoveIntelByName } from '@/data/gymMoveIntel';
import { LEADER_ART_ASSETS, POKEMON_ART_ASSETS } from '@/data/remoteAssets';
import { defaultTrainerId, trainersData } from '@/data/trainers';
import { usePokemonCalc } from '@/hooks/usePokemonCalc';

type MoveOption = {
  value: string;
  label: string;
  power: number;
  type: string;
  category: 'physical' | 'special' | 'status';
};

type CombatPreset = {
  id: string;
  trainerId: string;
  trainerCode: string;
  trainerName: string;
  name: string;
  enName: string;
  role: string;
  level: number;
  item: string;
  ability: string;
  nature: string;
  types: string[];
  stats: { hp: number; atk: number; def: number; spA: number; spD: number; spe: number };
  tactic: string;
  note: string;
  moves: MoveOption[];
};

type TrainerListEntry = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  threatLevel: string;
};

type LiveCombatantIntel = {
  stats: { hp: number; atk: number; def: number; spA: number; spD: number; spe: number };
  types: string[];
  valid: boolean;
};

const TRAINER_LABELS: Record<string, string> = {
  roark: 'Roark',
  gardenia: 'Gardenia',
  maylene: 'Maylene',
  wake: 'Wake',
};

const GYM_KEY_MAP: Record<string, keyof typeof GYM_MOVE_INTEL.gym_leaders> = {
  roark: 'Roark',
  gardenia: 'Gardenia',
  maylene: 'Maylene',
  wake: 'Wake',
};

const POKEMON_TYPE_MAP: Record<string, string[]> = {
  Cranidos: ['Rock'],
  Onix: ['Rock', 'Ground'],
  Geodude: ['Rock', 'Ground'],
  Shieldon: ['Rock', 'Steel'],
  Nosepass: ['Rock'],
  Aron: ['Steel', 'Rock'],
  Roserade: ['Grass', 'Poison'],
  Breloom: ['Grass', 'Fighting'],
  Tangela: ['Grass'],
  Cherrim: ['Grass'],
  Grovyle: ['Grass'],
  Grotle: ['Grass'],
  Lucario: ['Fighting', 'Steel'],
  Medicham: ['Fighting', 'Psychic'],
  Machoke: ['Fighting'],
  Hariyama: ['Fighting'],
  Toxicroak: ['Poison', 'Fighting'],
  Heracross: ['Bug', 'Fighting'],
  Gyarados: ['Water', 'Flying'],
  Floatzel: ['Water'],
  Quagsire: ['Water', 'Ground'],
  Azumarill: ['Water'],
  Pelipper: ['Water', 'Flying'],
  Poliwrath: ['Water', 'Fighting'],
};

const MOVE_LABELS: Record<string, string> = {
  'Head Smash': 'Head Smash',
  'Rock Slide': 'Rock Slide',
  'Stealth Rock': 'Stealth Rock',
  'Leaf Storm': 'Leaf Storm',
  'Sludge Bomb': 'Sludge Bomb',
  'Giga Drain': 'Giga Drain',
  'Close Combat': 'Close Combat',
  'Aura Sphere': 'Aura Sphere',
  'Drain Punch': 'Drain Punch',
  Waterfall: 'Waterfall',
  'Ice Fang': 'Ice Fang',
  'Dragon Dance': 'Dragon Dance',
};

const ZERO_STATS = { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 };


const statLabels = [
  { key: 'hp', short: 'H' },
  { key: 'atk', short: 'A' },
  { key: 'def', short: 'B' },
  { key: 'spA', short: 'C' },
  { key: 'spD', short: 'D' },
  { key: 'spe', short: 'S' },
] as const;

function getMoveCategory(category?: string): 'physical' | 'special' | 'status' {
  if (category === 'Special') return 'special';
  if (category === 'Status') return 'status';
  return 'physical';
}

function getPresetMoveOptions(trainerId: string): MoveOption[] {
  const gymKey = GYM_KEY_MAP[trainerId];

  return GYM_MOVE_INTEL.gym_leaders[gymKey].core_moves.map((move) => ({
    value: move.name,
    label: MOVE_LABELS[move.name] || move.name,
    power: move.power,
    type: move.type,
    category: getMoveCategory(move.category),
  }));
}

function buildPresets(): CombatPreset[] {
  return trainersData.flatMap((trainer) =>
    trainer.pokemon.map((pokemon) => ({
      id: pokemon.id,
      trainerId: trainer.id,
      trainerCode: trainer.code,
      trainerName: TRAINER_LABELS[trainer.id] || trainer.name,
      name: pokemon.name,
      enName: pokemon.enName,
      role: pokemon.role || 'TACTICAL SLOT',
      level: Number(pokemon.level.replace(/[^\d]/g, '')) || 100,
      item: pokemon.item,
      ability: pokemon.ability,
      nature: pokemon.nature,
      tactic: pokemon.tactic,
      note: pokemon.note,
      types: POKEMON_TYPE_MAP[pokemon.enName] || ['Normal'],
      stats: pokemon.stats,
      moves: getPresetMoveOptions(trainer.id),
    }))
  );
}

const PRESETS = buildPresets();

function getPreset(presetId: string): CombatPreset {
  return PRESETS.find((preset) => preset.id === presetId) ?? PRESETS[0];
}

function getEffectiveness(moveType: string, defenderTypes: string[]): number {
  return defenderTypes.reduce(
    (multiplier, type) => multiplier * (TYPE_CHART[moveType]?.[type] ?? 1),
    1
  );
}

function getEffectivenessLabel(multiplier: number): string {
  if (multiplier === 0) return 'NO EFFECT';
  if (multiplier >= 4) return '4X EFFECTIVE';
  if (multiplier >= 2) return 'SUPER EFFECTIVE';
  if (multiplier <= 0.25) return 'SEVERELY RESISTED';
  if (multiplier < 1) return 'RESISTED';
  return 'STANDARD HIT';
}

function getDamageGradient(min: number, max: number): string {
  if (max >= 100) return 'linear-gradient(90deg, #22c55e 0%, #facc15 52%, #ef4444 100%)';
  if (max >= 70) return 'linear-gradient(90deg, #10b981 0%, #84cc16 28%, #facc15 70%, #f97316 100%)';
  return 'linear-gradient(90deg, #10b981 0%, #84cc16 58%, #eab308 100%)';
}

function getKoDisplay(koText: string | undefined): string {
  if (!koText) return 'AWAITING CALCULATION FEED';
  if (koText.includes('OHKO')) return 'CERTAIN OHKO';
  if (koText.includes('2HKO')) return koText.includes('Stealth Rock') ? 'CERTAIN 2HKO // STEALTH ROCK REQUIRED' : 'CERTAIN 2HKO';
  if (koText.includes('3HKO')) return 'CERTAIN 3HKO';
  if (koText.includes('4HKO')) return 'CERTAIN 4HKO';
  if (koText.includes('STATUS_MOVE')) return 'STATUS MOVE // NO DIRECT DAMAGE';
  return 'NO RELIABLE LETHAL CONFIRMED';
}

function getThreatTier(value: number): string {
  if (value >= 75) return 'OMEGA';
  if (value >= 60) return 'HIGH';
  if (value >= 45) return 'ELEVATED';
  return 'STABLE';
}

function buildDamageRolls(min: number, max: number) {
  const start = Number(min.toFixed(1));
  const end = Number(max.toFixed(1));
  const step = end > start ? (end - start) / 15 : 0;

  return Array.from({ length: 16 }, (_, index) => ({
    factor: 85 + index,
    value: Number((start + step * index).toFixed(1)),
  }));
}

function buildLiveCombatantIntel(
  combatant: {
    name: string;
    level: number;
    evs: { hp?: number; atk?: number; def?: number; spA?: number; spD?: number; spe?: number };
    ivs: { hp?: number; atk?: number; def?: number; spA?: number; spD?: number; spe?: number };
    item: string;
    nature: string;
    ability?: string;
  },
  fallbackPreset: CombatPreset
): LiveCombatantIntel {
  try {
    const livePokemon = new Pokemon(4, combatant.name as never, {
      level: combatant.level,
      evs: combatant.evs,
      ivs: combatant.ivs,
      item: combatant.item,
      nature: combatant.nature,
      ability: combatant.ability,
    } as never);

    return {
      stats: {
        hp: livePokemon.rawStats.hp,
        atk: livePokemon.rawStats.atk,
        def: livePokemon.rawStats.def,
        spA: livePokemon.rawStats.spa,
        spD: livePokemon.rawStats.spd,
        spe: livePokemon.rawStats.spe,
      },
      types: livePokemon.types.length ? livePokemon.types : ['Unknown'],
      valid: true,
    };
  } catch {
    return {
      stats: combatant.name === fallbackPreset.enName ? fallbackPreset.stats : ZERO_STATS,
      types: combatant.name === fallbackPreset.enName ? fallbackPreset.types : ['Unknown'],
      valid: false,
    };
  }
}

function getCombatantArt(name: string): string | null {
  return POKEMON_ART_ASSETS[name] || null;
}

function CompactInput({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (value: string) => void; type?: 'text' | 'number' }) {
  return (
    <label className="space-y-1.5">
      <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-emerald-500/20 bg-black/35 px-3 py-2 font-mono text-sm text-white outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)] transition-all focus:border-emerald-400/40"
      />
    </label>
  );
}

function ProfileToggleButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] transition-all ${
        active
          ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200 shadow-[0_0_18px_rgba(16,185,129,0.12)]'
          : 'border-slate-700 bg-black/35 text-slate-400 hover:border-emerald-500/25 hover:text-emerald-200'
      }`}
    >
      {label}
    </button>
  );
}

function PortraitFrame({
  name,
  fallbackLabel,
}: {
  name: string;
  fallbackLabel: string;
}) {
  const art = getCombatantArt(name);

  return (
    <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden rounded-xl border border-slate-800 bg-black/35">
      {art ? (
        <Image src={art} alt={name} fill className="object-contain p-2" />
      ) : (
        <div className="flex h-full w-full items-center justify-center px-2 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
          {fallbackLabel}
        </div>
      )}
    </div>
  );
}

function CompactSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return (
    <label className="space-y-1.5">
      <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-emerald-500/20 bg-black/35 px-3 py-2 font-mono text-sm text-white outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)] transition-all focus:border-emerald-400/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TacticalDmgHud({ min, max, koDisplay }: { min: number; max: number; koDisplay: string }) {
  const ledColor = max >= 100 ? 'text-red-400' : max >= 70 ? 'text-emerald-200' : 'text-emerald-300';

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-4 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12),0_0_30px_rgba(16,185,129,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-slate-500">Ballistic_Output</div>
          <div className={`mt-1.5 font-mono text-5xl font-black tracking-tight xl:text-[3.25rem] ${ledColor}`} style={{ textShadow: '0 0 10px rgba(16,185,129,0.5)' }}>
            {min.toFixed(1)}%
            <span className="px-2 text-3xl font-light text-slate-700">-</span>
            {max.toFixed(1)}%
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">Knockout_Probability</div>
          <div className={`mt-1.5 font-mono text-xs font-bold uppercase tracking-[0.16em] ${koDisplay.includes('OHKO') ? 'animate-pulse text-red-400' : 'text-emerald-300'}`} style={{ textShadow: '0 0 10px rgba(16,185,129,0.35)' }}>
            {koDisplay}
          </div>
        </div>
      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full border border-emerald-500/20 bg-black/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.85)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(max, 100)}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="h-full"
          style={{ background: getDamageGradient(min, max) }}
        />
      </div>
    </div>
  );
}

function RngMatrix({ rolls }: { rolls: Array<{ factor: number; value: number }> }) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-white">16-Step RNG Damage Matrix</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">Seed: 0xDEADBEEF</span>
      </div>
      <div className="grid flex-1 grid-cols-4 gap-2">
        {rolls.map((roll) => (
          <div key={`${roll.factor}-${roll.value}`} className="rounded-lg border border-slate-800 bg-black/35 px-2.5 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.75)]">
            <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-600">R{roll.factor}</div>
            <div className="mt-0.5 font-mono text-base font-bold text-white">{roll.value.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatBar({ label, value }: { label: string; value: number }) {
  const width = Math.min((value / 160) * 100, 100);

  return (
    <div className="grid grid-cols-[20px_58px_minmax(0,1fr)_42px] items-center gap-2">
      <span className="font-mono text-sm font-black text-emerald-400">{label}</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Stat</span>
      <div className="h-2.5 overflow-hidden rounded-full border border-emerald-500/10 bg-black/45 shadow-[inset_0_1px_2px_rgba(0,0,0,0.85)]">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#14532d_0%,#10b981_35%,#34d399_100%)] shadow-[0_0_10px_rgba(16,185,129,0.25)]" style={{ width: `${width}%` }} />
      </div>
      <span className="text-right font-mono text-sm font-bold text-white">{value}</span>
    </div>
  );
}

export default function DamageCalculatorPage(): React.ReactElement {
  const { attacker, setAttacker, defender, setDefender, move, setMove, result } = usePokemonCalc();

  const [activeTrainerId, setActiveTrainerId] = useState(defaultTrainerId);
  const [activeRosterPokemonId, setActiveRosterPokemonId] = useState(trainersData[0].pokemon[0].id);
  const [activeAttackerId, setActiveAttackerId] = useState('roark-cranidos');
  const [attackerCustomOpen, setAttackerCustomOpen] = useState(false);
  const [defenderCustomOpen, setDefenderCustomOpen] = useState(false);

  const activeTrainer = useMemo(() => trainersData.find((trainer) => trainer.id === activeTrainerId) ?? trainersData[0], [activeTrainerId]);
  const activeRosterPokemon = useMemo(() => activeTrainer.pokemon.find((pokemon) => pokemon.id === activeRosterPokemonId) ?? activeTrainer.pokemon[0], [activeRosterPokemonId, activeTrainer]);
  const selectedAttackerPreset = useMemo(() => getPreset(activeAttackerId), [activeAttackerId]);
  const selectedDefenderPreset = useMemo(() => getPreset(activeRosterPokemonId), [activeRosterPokemonId]);
  const attackerPresetOptions = useMemo(() => PRESETS.map((preset) => ({ value: preset.id, label: `${preset.name} // ${preset.trainerName}` })), []);
  const moveOptions = useMemo(() => {
    const baseOptions = selectedAttackerPreset.moves.map((option) => ({
      value: option.value,
      label: `${option.label} // ${option.power} BP`,
    }));

    if (!move || baseOptions.some((option) => option.value === move)) {
      return baseOptions;
    }

    return [{ value: move, label: `${move} // MANUAL` }, ...baseOptions];
  }, [move, selectedAttackerPreset.moves]);
  const mappedMoveIntel = useMemo(() => getGymMoveIntelByName(move), [move]);
  const currentMove = useMemo(
    () =>
      selectedAttackerPreset.moves.find((option) => option.value === move) ?? {
        value: move,
        label: move,
        power: 0,
        type: 'Normal',
        category: 'physical' as const,
      },
    [selectedAttackerPreset.moves, move]
  );
  const attackerIntel = useMemo(() => buildLiveCombatantIntel(attacker, selectedAttackerPreset), [attacker, selectedAttackerPreset]);
  const defenderIntel = useMemo(() => buildLiveCombatantIntel(defender, selectedDefenderPreset), [defender, selectedDefenderPreset]);
  const attackerTypes = attackerIntel.types;
  const defenderTypes = defenderIntel.types;
  const attackerDisplayName = attacker.name || selectedAttackerPreset.name;
  const defenderDisplayName = defender.name || selectedDefenderPreset.name;
  const minDamage = result?.range[0] ?? 0;
  const maxDamage = result?.range[1] ?? 0;
  const koDisplay = useMemo(() => getKoDisplay(result?.ko), [result?.ko]);
  const damageRolls = useMemo(() => buildDamageRolls(minDamage, maxDamage), [minDamage, maxDamage]);
  const effectiveness = useMemo(() => {
    const moveType = mappedMoveIntel?.type || currentMove?.type || 'Normal';
    return getEffectiveness(moveType, defenderTypes);
  }, [currentMove?.type, defenderTypes, mappedMoveIntel?.type]);
  const offenseStatValue = currentMove?.category === 'special' ? attackerIntel.stats.spA : attackerIntel.stats.atk;
  const defenseStatValue = currentMove?.category === 'special' ? defenderIntel.stats.spD : defenderIntel.stats.def;
  const leaders = useMemo<TrainerListEntry[]>(
    () =>
      trainersData.map((trainer) => ({
        id: trainer.id,
        name: trainer.name,
        specialty: trainer.specialty,
        avatar: LEADER_ART_ASSETS[trainer.id] || trainer.silhouetteAsset,
        threatLevel: `${trainer.threatLevel}%`,
      })),
    []
  );

  const applyAttackerPreset = (presetId: string) => {
    const preset = getPreset(presetId);
    setActiveAttackerId(presetId);
    setAttacker({
      name: preset.enName,
      level: preset.level,
      evs: { atk: 252, spA: 252, spe: 252 },
      ivs: { atk: 31, spA: 31, spe: 31 },
      item: preset.item,
      nature: preset.nature,
      ability: preset.ability,
    });
    setMove(preset.moves[0]?.value || 'Earthquake');
  };

  const applyDefenderPreset = (presetId: string) => {
    const preset = getPreset(presetId);
    setActiveRosterPokemonId(presetId);
    setDefender({
      name: preset.enName,
      level: preset.level,
      evs: { hp: 252, def: 252, spD: 252 },
      ivs: { hp: 31, def: 31, spD: 31 },
      item: preset.item,
      nature: preset.nature,
      ability: preset.ability,
    });
  };

  const handleTrainerSelect = (trainerId: string) => {
    const trainer = trainersData.find((entry) => entry.id === trainerId) ?? trainersData[0];
    setActiveTrainerId(trainer.id);
    applyDefenderPreset(trainer.pokemon[0].id);
  };

  useEffect(() => {
    const initialAttacker = getPreset('roark-cranidos');
    const initialDefender = getPreset(trainersData[0].pokemon[0].id);

    setActiveAttackerId(initialAttacker.id);
    setAttacker({
      name: initialAttacker.enName,
      level: initialAttacker.level,
      evs: { atk: 252, spA: 252, spe: 252 },
      ivs: { atk: 31, spA: 31, spe: 31 },
      item: initialAttacker.item,
      nature: initialAttacker.nature,
      ability: initialAttacker.ability,
    });
    setMove(initialAttacker.moves[0]?.value || 'Earthquake');

    setActiveRosterPokemonId(initialDefender.id);
    setDefender({
      name: initialDefender.enName,
      level: initialDefender.level,
      evs: { hp: 252, def: 252, spD: 252 },
      ivs: { hp: 31, def: 31, spD: 31 },
      item: initialDefender.item,
      nature: initialDefender.nature,
      ability: initialDefender.ability,
    });
  }, [setAttacker, setDefender, setMove]);

  useEffect(() => {
    if (!move) {
      setMove(selectedAttackerPreset.moves[0]?.value || 'Earthquake');
    }
  }, [move, selectedAttackerPreset.moves, setMove]);

  return (
    <main className="relative h-[100dvh] overflow-hidden bg-[#020617] px-4 py-3 text-slate-100 md:px-5">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.06)_1px,transparent_1px)] bg-[size:36px_36px]" />
        <motion.div
          className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent"
          animate={{ y: ['0%', '100vh'] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 mx-auto flex h-full max-w-[1820px] flex-col gap-3">
        <header className="shrink-0 rounded-2xl border border-emerald-500/20 bg-[#0a0f16] px-4 py-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.34em] text-emerald-400/70">
                Command_Center
              </div>
              <h1 className="mt-1 font-mono text-[1.7rem] font-black uppercase tracking-tight text-white xl:text-[2.2rem]">
                Platinum Kaizo Tactical Command Center
              </h1>
            </div>
            <div className="flex gap-2">
              {['DATABASE: ONLINE', 'SYNC: VERIFIED', 'SECURITY: ACTIVE'].map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-emerald-500/15 bg-black/35 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/80"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 grid-cols-[15rem_minmax(0,1fr)_19rem] gap-3">
          <aside className="flex min-h-0 flex-col rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
            <div className="mb-3 rounded-2xl border border-emerald-500/15 bg-black/30 p-3">
              <div className="relative mx-auto h-28 w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
                <Image
                  src={LEADER_ART_ASSETS[activeTrainer.id] || activeTrainer.silhouetteAsset}
                  alt={activeTrainer.name}
                  fill
                  className="object-contain object-bottom p-2"
                />
              </div>
              <div className="mt-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Active_Dossier
                </div>
                <div className="mt-1 text-lg font-black text-white">{activeTrainer.name}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300/70">
                  Threat Level: {activeTrainer.threatLevel}% // {getThreatTier(activeTrainer.threatLevel)}
                </div>
                <p className="mt-2 text-[11px] leading-5 text-slate-400">{activeTrainer.intel}</p>
              </div>
            </div>

            <LeaderList leaders={leaders} activeId={activeTrainerId} onSelect={handleTrainerSelect} />
          </aside>

          <section className="flex min-h-0 flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
            <TacticalDmgHud min={minDamage} max={maxDamage} koDisplay={koDisplay} />

            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeAttackerId}-${activeRosterPokemonId}-${move}-${attacker.name}-${attacker.item}-${attacker.ability}-${attacker.nature}-${defender.name}-${defender.item}-${defender.ability}-${defender.nature}-${attacker.level}-${defender.level}-${attacker.evs.atk}-${attacker.evs.spA}-${attacker.evs.spe}-${defender.evs.hp}-${defender.evs.def}-${defender.evs.spD}`}
                initial={{ opacity: 0.3, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.18, y: -10 }}
                transition={{ duration: 0.26, ease: 'easeOut' }}
                className="grid min-h-0 flex-1 grid-rows-[auto_auto_minmax(0,1fr)] gap-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
                    <div className="mb-2.5 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <PortraitFrame name={attackerDisplayName} fallbackLabel="CUSTOM UNIT" />
                        <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                          Attacker_Vector
                        </div>
                        <div className="mt-1 font-mono text-xl font-black uppercase text-white">
                          {attackerDisplayName}
                        </div>
                        {!attackerIntel.valid && attacker.name !== selectedAttackerPreset.enName ? (
                          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300/80">
                            Manual species name required
                          </div>
                        ) : null}
                        </div>
                      </div>
                      <div className="flex max-w-[15rem] flex-col items-end gap-2">
                        <div className="flex flex-wrap justify-end gap-2">
                          {attackerTypes.map((type) => (
                            <TypeIcon key={type} type={type} />
                          ))}
                        </div>
                        <ProfileToggleButton
                          active={attackerCustomOpen}
                          label={attackerCustomOpen ? 'Close Custom Profile' : 'Custom Profile'}
                          onClick={() => setAttackerCustomOpen((prev) => !prev)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <CompactSelect
                        label="Attack Unit"
                        value={activeAttackerId}
                        onChange={applyAttackerPreset}
                        options={attackerPresetOptions}
                      />
                      <CompactSelect
                        label="Move Package"
                        value={move}
                        onChange={setMove}
                        options={moveOptions}
                      />
                      <CompactInput
                        label="Level"
                        type="number"
                        value={attacker.level}
                        onChange={(value) =>
                          setAttacker((prev) => ({
                            ...prev,
                            level: Math.max(1, Number(value) || 1),
                          }))
                        }
                      />
                      <CompactInput
                        label="ATK EV"
                        type="number"
                        value={attacker.evs.atk ?? 0}
                        onChange={(value) =>
                          setAttacker((prev) => ({
                            ...prev,
                            evs: { ...prev.evs, atk: Math.max(0, Number(value) || 0) },
                          }))
                        }
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {attackerCustomOpen ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2.5 rounded-xl border border-emerald-500/10 bg-black/25 p-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
                            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/70">
                              Manual Override // use official species and move names
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              <CompactInput
                                label="Species"
                                value={attacker.name}
                                onChange={(value) => setAttacker((prev) => ({ ...prev, name: value }))}
                              />
                              <CompactInput
                                label="Move Name"
                                value={move}
                                onChange={setMove}
                              />
                              <CompactInput
                                label="Ability"
                                value={attacker.ability ?? ''}
                                onChange={(value) => setAttacker((prev) => ({ ...prev, ability: value }))}
                              />
                              <CompactInput
                                label="Item"
                                value={attacker.item}
                                onChange={(value) => setAttacker((prev) => ({ ...prev, item: value }))}
                              />
                              <CompactInput
                                label="Nature"
                                value={attacker.nature}
                                onChange={(value) => setAttacker((prev) => ({ ...prev, nature: value }))}
                              />
                              <CompactInput
                                label="SPE EV"
                                type="number"
                                value={attacker.evs.spe ?? 0}
                                onChange={(value) =>
                                  setAttacker((prev) => ({
                                    ...prev,
                                    evs: { ...prev.evs, spe: Math.max(0, Number(value) || 0) },
                                  }))
                                }
                              />
                              <CompactInput
                                label="SPA EV"
                                type="number"
                                value={attacker.evs.spA ?? 0}
                                onChange={(value) =>
                                  setAttacker((prev) => ({
                                    ...prev,
                                    evs: { ...prev.evs, spA: Math.max(0, Number(value) || 0) },
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      {[
                        { label: 'POWER', value: mappedMoveIntel?.power ?? currentMove?.power ?? 0 },
                        { label: 'ATK', value: offenseStatValue },
                        { label: 'SPEED', value: attackerIntel.stats.spe },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-slate-800 bg-black/35 p-2.5"
                        >
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {item.label}
                          </div>
                          <div className="mt-1.5 font-mono text-lg font-black text-white">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
                    <div className="mb-2.5 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <PortraitFrame name={defenderDisplayName} fallbackLabel="CUSTOM UNIT" />
                        <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                          Defender_Dossier
                        </div>
                        <div className="mt-1 font-mono text-xl font-black uppercase text-white">
                          {defenderDisplayName}
                        </div>
                        {!defenderIntel.valid && defender.name !== selectedDefenderPreset.enName ? (
                          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-amber-300/80">
                            Manual species name required
                          </div>
                        ) : null}
                        </div>
                      </div>
                      <div className="flex max-w-[15rem] flex-col items-end gap-2">
                        <div className="flex flex-wrap justify-end gap-2">
                          {defenderTypes.map((type) => (
                            <TypeIcon key={type} type={type} />
                          ))}
                        </div>
                        <ProfileToggleButton
                          active={defenderCustomOpen}
                          label={defenderCustomOpen ? 'Close Custom Profile' : 'Custom Profile'}
                          onClick={() => setDefenderCustomOpen((prev) => !prev)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <CompactInput
                        label="Level"
                        type="number"
                        value={defender.level}
                        onChange={(value) =>
                          setDefender((prev) => ({
                            ...prev,
                            level: Math.max(1, Number(value) || 1),
                          }))
                        }
                      />
                      <CompactInput
                        label="HP EV"
                        type="number"
                        value={defender.evs.hp ?? 0}
                        onChange={(value) =>
                          setDefender((prev) => ({
                            ...prev,
                            evs: { ...prev.evs, hp: Math.max(0, Number(value) || 0) },
                          }))
                        }
                      />
                      <CompactInput
                        label="DEF EV"
                        type="number"
                        value={defender.evs.def ?? 0}
                        onChange={(value) =>
                          setDefender((prev) => ({
                            ...prev,
                            evs: { ...prev.evs, def: Math.max(0, Number(value) || 0) },
                          }))
                        }
                      />
                      <CompactInput
                        label="SPD EV"
                        type="number"
                        value={defender.evs.spD ?? 0}
                        onChange={(value) =>
                          setDefender((prev) => ({
                            ...prev,
                            evs: { ...prev.evs, spD: Math.max(0, Number(value) || 0) },
                          }))
                        }
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {defenderCustomOpen ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22, ease: 'easeOut' }}
                          className="overflow-hidden"
                        >
                          <div className="mt-2.5 rounded-xl border border-emerald-500/10 bg-black/25 p-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.7)]">
                            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300/70">
                              Manual Override // refine target dossier
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              <CompactInput
                                label="Species"
                                value={defender.name}
                                onChange={(value) => setDefender((prev) => ({ ...prev, name: value }))}
                              />
                              <CompactInput
                                label="Ability"
                                value={defender.ability ?? ''}
                                onChange={(value) => setDefender((prev) => ({ ...prev, ability: value }))}
                              />
                              <CompactInput
                                label="Item"
                                value={defender.item}
                                onChange={(value) => setDefender((prev) => ({ ...prev, item: value }))}
                              />
                              <CompactInput
                                label="Nature"
                                value={defender.nature}
                                onChange={(value) => setDefender((prev) => ({ ...prev, nature: value }))}
                              />
                            </div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="mt-3 grid grid-cols-3 gap-2.5">
                      {[
                        { label: 'DEF', value: defenseStatValue },
                        { label: 'MULTI', value: `${effectiveness.toFixed(2)}x` },
                        { label: 'KO', value: koDisplay.includes('OHKO') ? 'OHKO' : 'CHECK' },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl border border-slate-800 bg-black/35 p-2.5"
                        >
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                            {item.label}
                          </div>
                          <div className="mt-1.5 font-mono text-lg font-black text-white">
                            {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-3">
                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-300">
                        <ShieldAlert className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                          Tactical_Readout
                        </div>
                        <div className="mt-1.5 text-xs leading-5 text-slate-300">
                          {result?.desc || 'Awaiting synchronized parameters. Select attack vector or deploy a manual custom profile, then refine move package and target dossier.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
                    <div className="mb-2.5 flex items-center justify-between">
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                        Matchup_Status
                      </div>
                      <Crosshair className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          Type Matrix
                        </div>
                        <div className="mt-1 font-mono text-lg font-black text-white">
                          {getEffectivenessLabel(effectiveness)}
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          Offense / Defense
                        </div>
                        <div className="mt-1 flex items-center gap-2 font-mono text-lg font-black text-white">
                          <span>{offenseStatValue}</span>
                          <Swords className="h-4 w-4 text-emerald-300" />
                          <span>{defenseStatValue}</span>
                        </div>
                      </div>
                      <div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                          Move Type
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <TypeIcon type={mappedMoveIntel?.type || currentMove?.type || 'Normal'} />
                          <span className="font-mono text-xs uppercase tracking-[0.14em] text-slate-300">
                            {currentMove?.category || 'physical'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <RngMatrix rolls={damageRolls} />
              </motion.div>
            </AnimatePresence>
          </section>

          <aside className="flex min-h-0 flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-[#0a0f16] p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
            <div className="rounded-2xl border border-emerald-500/20 bg-black/30 p-3">
              <div className="mb-1 flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  Squad_Deployment
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">
                  {activeTrainer.name}
                </div>
              </div>
              <div className="text-xs leading-5 text-slate-400">
                {activeTrainer.recommendation}
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-3">
              <div className="min-h-0 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2.5">
                  {activeTrainer.pokemon.map((pokemon) => {
                    const selected = pokemon.id === activeRosterPokemon.id;
                    const types = POKEMON_TYPE_MAP[pokemon.enName] || ['Normal'];

                    return (
                      <button
                        key={pokemon.id}
                        type="button"
                        onClick={() => applyDefenderPreset(pokemon.id)}
                        className={`rounded-xl border p-2.5 text-left transition-all ${
                          selected
                            ? 'border-emerald-400/40 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                            : 'border-slate-800 bg-black/35 hover:border-emerald-500/25'
                        }`}
                      >
                        <div className="relative mb-2.5 h-16 w-full overflow-hidden rounded-lg border border-slate-800 bg-slate-950/70">
                          <Image
                            src={POKEMON_ART_ASSETS[pokemon.enName]}
                            alt={pokemon.name}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                              {pokemon.level}
                            </div>
                            <div className="mt-1 text-xs font-black text-white">
                              {pokemon.name}
                            </div>
                          </div>
                          <Radar className="h-4 w-4 text-emerald-300/70" />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {types.map((type) => (
                            <TypeIcon key={type} type={type} />
                          ))}
                        </div>
                        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-300/70">
                          {pokemon.note}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-black/35 p-3 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
                <div className="mb-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
                      Unit_Stat_Profile
                    </div>
                    <div className="mt-1 text-base font-black text-white">
                      {activeRosterPokemon.name}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">
                    {activeRosterPokemon.item}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {statLabels.map((stat) => (
                    <StatBar
                      key={stat.key}
                      label={stat.short}
                      value={activeRosterPokemon.stats[stat.key]}
                    />
                  ))}
                </div>

                <div className="mt-3 border-t border-emerald-500/10 pt-2.5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Tactical_Note
                  </div>
                  <div className="mt-1.5 text-[11px] leading-5 text-slate-400">
                    {activeRosterPokemon.tactic}
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="shrink-0 rounded-2xl border border-emerald-500/20 bg-[#0a0f16] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500 shadow-[inset_0_1px_3px_rgba(16,185,129,0.12)]">
          <div className="flex items-center justify-between">
            <span>[SYSTEM_STATUS: NOMINAL]</span>
            <span className="text-emerald-400/80">[ENCRYPTION: ACTIVE]</span>
            <span>[NODE: COMMAND_GRID_04]</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
