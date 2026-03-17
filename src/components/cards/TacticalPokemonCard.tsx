'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { PokemonInstance } from '@/types';
import { getPokemonStats } from '@/lib/pokeUtils';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import styles from './TacticalPokemonCard.module.css';

export interface KaizoModification {
  stat: 'hp' | 'atk' | 'def' | 'spA' | 'spD' | 'spe';
  change: number;
  description: string;
}

interface TacticalPokemonCardProps {
  pokemon: PokemonInstance;
  modifications?: KaizoModification[];
  showDetails?: boolean;
  onClick?: () => void;
}

const SPECIES_NAME_MAP: Record<number, string> = {
  59: '风速狗',
  78: '烈焰马',
  244: '炎帝',
  257: '火焰鸡',
  445: '烈咬陆鲨',
  485: '席多蓝恩',
};

const TYPE_LABEL_MAP: Record<string, string> = {
  normal: '一般',
  fire: '火',
  water: '水',
  electric: '电',
  grass: '草',
  ice: '冰',
  fighting: '格斗',
  poison: '毒',
  ground: '地面',
  flying: '飞行',
  psychic: '超能力',
  bug: '虫',
  rock: '岩石',
  ghost: '幽灵',
  dragon: '龙',
  dark: '恶',
  steel: '钢',
  fairy: '妖精',
};

const ABILITY_LABEL_MAP: Record<string, string> = {
  'ability-045': '沙隐之力',
  'ability-024': '粗糙皮肤',
  'ability-065': '湿润皮肤',
  'ability-flash-fire': '引火',
  'ability-flame-body': '火焰之躯',
  'ability-pressure': '压迫感',
  'ability-run-away': '逃跑',
  'ability-blaze': '猛火',
};

const NATURE_LABEL_MAP: Record<string, string> = {
  adamant: '固执',
  careful: '慎重',
  jolly: '开朗',
  modest: '内敛',
  timid: '胆小',
};

const ITEM_LABEL_MAP: Record<string, string> = {
  'item-270': '生命宝珠',
  'item-540': '突击背心',
  'item-999': '沙暴石',
};

const STAT_META: ReadonlyArray<{ key: KaizoModification['stat']; label: string }> = [
  { key: 'hp', label: 'HP' },
  { key: 'atk', label: '攻击' },
  { key: 'def', label: '防御' },
  { key: 'spA', label: '特攻' },
  { key: 'spD', label: '特防' },
  { key: 'spe', label: '速度' },
];

const STAT_KEY_LABEL_MAP: Record<KaizoModification['stat'], string> = {
  hp: 'HP',
  atk: '攻击',
  def: '防御',
  spA: '特攻',
  spD: '特防',
  spe: '速度',
};

function clampRatio(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }
  return Math.min(Math.max((value - min) / (max - min), 0), 1);
}

function getStatHue(value: number, min: number, max: number): number {
  return Math.round(clampRatio(value, min, max) * 120);
}

function getStatColor(value: number, min: number = 0, max: number = 300): string {
  const hue = getStatHue(value, min, max);
  return `hsl(${hue} 90% 56%)`;
}

function getStatGradient(value: number, min: number = 0, max: number = 300): string {
  const baseHue = getStatHue(value, min, max);
  const startHue = Math.max(0, baseHue - 24);
  const endHue = Math.min(120, baseHue + 12);

  return `linear-gradient(90deg, hsl(${startHue} 80% 46%) 0%, hsl(${baseHue} 90% 54%) 55%, hsl(${endHue} 96% 62%) 100%)`;
}

function getDisplayName(instance: PokemonInstance): string {
  return (
    SPECIES_NAME_MAP[instance.pokemon.id] ||
    instance.nickname ||
    instance.pokemon.name ||
    instance.pokemon.enName
  );
}

function getDisplayAbility(instance: PokemonInstance): string {
  const ability = instance.pokemon.abilities.ability1;
  return ABILITY_LABEL_MAP[ability.id] || ability.name;
}

function getDisplayNature(nature: string): string {
  return NATURE_LABEL_MAP[nature] || '未知性格';
}

function getDisplayItem(instance: PokemonInstance): string {
  if (!instance.heldItem) {
    return '无';
  }
  return ITEM_LABEL_MAP[instance.heldItem.id] || instance.heldItem.name;
}

function StatBar({
  label,
  value,
  maxValue = 300,
  hasModification = false,
}: {
  label: string;
  value: number;
  maxValue?: number;
  hasModification?: boolean;
}): React.ReactElement {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const barColor = getStatColor(value, 0, maxValue);

  return (
    <div className="mb-3 last:mb-0">
      <div className="mb-1 flex items-center justify-between">
        <span
          className={cn('text-xs tracking-widest text-slate-200 title-strong', hasModification && 'text-emerald-300')}
        >
          {label}
          {hasModification && <Zap size={12} className="ml-1 inline" />}
        </span>
        <span className="data-number text-xs text-emerald-100">{value}</span>
      </div>

      <div className="relative h-2.5 overflow-hidden rounded border border-emerald-500/25 bg-slate-800/70">
        <div className={styles.scanlines} />

        <motion.div
          className="h-full rounded"
          style={{
            backgroundImage: getStatGradient(value, 0, maxValue),
            boxShadow: `0 0 14px ${barColor}`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />

        <motion.div
          className="absolute inset-0 opacity-0"
          style={{ backgroundColor: barColor }}
          animate={{ opacity: [0, 0.15, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

export function TacticalPokemonCard({
  pokemon,
  modifications = [],
  showDetails = false,
  onClick,
}: TacticalPokemonCardProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const stats = getPokemonStats(pokemon);
  const statValues: Record<KaizoModification['stat'], number> = {
    hp: stats.hp,
    atk: stats.atk,
    def: stats.def,
    spA: stats.spA,
    spD: stats.spD,
    spe: stats.spe,
  };

  const modificationMap = new Map(modifications.map((mod) => [mod.stat, mod]));

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'glass-card relative w-full max-w-sm cursor-pointer overflow-hidden border-emerald-500/35',
        'transition-all duration-300'
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className={styles.scanlines} />

      {isHovered && (
        <>
          <motion.div
            className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            animate={{ opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            animate={{ opacity: [0.3, 0.85, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.3 }}
          />
        </>
      )}

      <div className="relative z-10 p-6">
        <div className="mb-6 border-b border-emerald-500/25 pb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="title-strong mb-1 text-lg text-emerald-300">{getDisplayName(pokemon)}</h3>
            <p className="text-xs tracking-wide text-slate-300">
              图鉴编号
              <span className="data-number"> #{pokemon.pokemon.id}</span>
              {' · '}等级
              <span className="data-number"> {pokemon.level}</span>
            </p>
          </motion.div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {pokemon.pokemon.types.map(
            (type) =>
              type && (
                <span
                  key={type}
                  className={cn(
                    'title-strong rounded border border-emerald-500/50 bg-emerald-500/10 px-3 py-1 text-xs',
                    'text-emerald-200'
                  )}
                >
                  {TYPE_LABEL_MAP[type] || type}
                </span>
              )
          )}
        </div>

        <div className={cn('mb-6 rounded border border-emerald-500/25 bg-slate-900/60 p-4', 'text-xs')}>
          <h4 className="title-strong mb-4 text-sm tracking-wider text-emerald-300">种族值</h4>

          <div className="space-y-3">
            {STAT_META.map((meta) => (
              <StatBar
                key={meta.key}
                label={meta.label}
                value={statValues[meta.key]}
                maxValue={300}
                hasModification={modificationMap.has(meta.key)}
              />
            ))}
          </div>
        </div>

        {modifications.length > 0 && isHovered && (
          <motion.div
            className="glass-card mb-6 border-emerald-500/35 bg-emerald-500/10 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <Zap size={16} className="text-emerald-300" />
              <h4 className="title-strong text-xs tracking-wider text-emerald-300">改版修正项</h4>
            </div>

            <div className="space-y-2">
              {modifications.map((mod) => (
                <div key={mod.stat} className="text-xs text-slate-200">
                  <span className="title-strong text-emerald-300">{STAT_KEY_LABEL_MAP[mod.stat]}</span>
                  {' '}
                  <span
                    className={cn('data-number', mod.change > 0 ? 'text-green-300' : 'text-rose-300')}
                  >
                    {mod.change > 0 ? '+' : ''}
                    {mod.change}
                  </span>
                  {' '}
                  <span className="text-slate-300">{mod.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="space-y-2">
          <div className="title-strong mb-2 text-xs tracking-wider text-slate-300">特性</div>
          <div className={cn('rounded border border-emerald-500/25 bg-slate-800/60 px-3 py-2', 'text-sm text-slate-100')}>
            {getDisplayAbility(pokemon)}
          </div>
        </div>

        {showDetails && (
          <motion.div
            className="mt-6 space-y-3 border-t border-emerald-500/20 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="mb-1 text-slate-400">性格</p>
                <p className="title-strong text-emerald-300">{getDisplayNature(pokemon.nature)}</p>
              </div>
              <div>
                <p className="mb-1 text-slate-400">携带道具</p>
                <p className="title-strong text-emerald-300">{getDisplayItem(pokemon)}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </motion.div>
  );
}

interface TacticalPokemonCardGridProps {
  pokemon: PokemonInstance[];
  modifications?: Record<number, KaizoModification[]>;
  onCardClick?: (index: number) => void;
}

export function TacticalPokemonCardGrid({
  pokemon,
  modifications = {},
  onCardClick,
}: TacticalPokemonCardGridProps): React.ReactElement {
  return (
    <motion.div
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {pokemon.map((poke, index) => (
        <TacticalPokemonCard
          key={`${poke.pokemon.id}-${index}`}
          pokemon={poke}
          modifications={modifications[index] || []}
          showDetails={false}
          onClick={() => onCardClick?.(index)}
        />
      ))}
    </motion.div>
  );
}
