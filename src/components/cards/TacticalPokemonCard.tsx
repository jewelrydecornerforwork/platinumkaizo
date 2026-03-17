'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { PokemonInstance } from '@/types';
import { getPokemonStats } from '@/lib/pokeUtils';
import { cn } from '@/lib/utils';
import { Zap } from 'lucide-react';
import styles from './TacticalPokemonCard.module.css';

/**
 * Kaizo 版本中特定宝可梦的改动信息
 */
export interface KaizoModification {
  stat: 'hp' | 'atk' | 'def' | 'spA' | 'spD' | 'spe';
  change: number;
  description: string;
}

/**
 * TacticalPokemonCard 组件 Props
 */
interface TacticalPokemonCardProps {
  pokemon: PokemonInstance;
  /** Kaizo 版本中的改动点（可选） */
  modifications?: KaizoModification[];
  /** 是否显示详细信息 */
  showDetails?: boolean;
  /** 卡片点击回调 */
  onClick?: () => void;
}

/**
 * 根据数值获取对应的颜色
 * 使用红绿渐变表示低到高的属性值
 */
function getStatColor(
  value: number,
  min: number = 0,
  max: number = 300,
): string {
  const ratio = Math.min(Math.max(value - min, 0) / (max - min), 1);

  if (ratio < 0.33) {
    // 红色 -> 橙色
    return `rgb(${255}, ${Math.floor(165 * ratio * 3)}, 0)`;
  } else if (ratio < 0.67) {
    // 橙色 -> 黄绿色
    const yellowRatio = (ratio - 0.33) / 0.34;
    return `rgb(${255 - Math.floor(255 * yellowRatio)}, ${165 + Math.floor(90 * yellowRatio)}, 0)`;
  } else {
    // 黄绿色 -> 绿色
    const greenRatio = (ratio - 0.67) / 0.33;
    return `rgb(${Math.floor(255 * (1 - greenRatio))}, ${255}, 0)`;
  }
}

/**
 * 单个能力值条组件
 */
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
      {/* Label */}
      <div className="flex items-center justify-between mb-1">
        <span className={cn(
          'text-xs font-bold tracking-widest',
          'text-slate-300 uppercase',
          hasModification && 'text-emerald-400'
        )}>
          {label}
          {hasModification && <Zap size={12} className="ml-1 inline" />}
        </span>
        <span className="text-xs text-slate-400 font-mono">{value}</span>
      </div>

      {/* Bar Container */}
      <div className="relative h-2 bg-slate-800/50 rounded-sm border border-emerald-500/30 overflow-hidden">
        {/* Scan lines effect */}
        <div className={styles.scanlines} />

        {/* Progress Bar */}
        <motion.div
          className="h-full rounded-sm"
          style={{
            backgroundColor: barColor,
            boxShadow: `0 0 8px ${barColor}80`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        />

        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 opacity-0"
          style={{ backgroundColor: barColor }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

/**
 * TacticalPokemonCard - 赛博朋克风格的宝可梦战术卡片
 *
 * @component
 * @example
 * <TacticalPokemonCard pokemon={garchompInstance} />
 */
export function TacticalPokemonCard({
  pokemon,
  modifications = [],
  showDetails = false,
  onClick,
}: TacticalPokemonCardProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // 计算宝可梦的能力值
  const stats = getPokemonStats(pokemon);
  const statLabels = ['HP', 'Atk', 'Def', 'SpA', 'SpD', 'Spe'] as const;
  const statValues = [
    stats.hp,
    stats.atk,
    stats.def,
    stats.spA,
    stats.spD,
    stats.spe,
  ] as const;

  // 创建改动点映射，便于快速查询
  const modificationMap = new Map(modifications.map((m) => [m.stat, m]));

  // 进入动画
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'relative w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-950',
        'border border-emerald-500/40 rounded-lg overflow-hidden',
        'transition-all duration-300',
        'cursor-pointer'
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      variants={hoverVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* 背景扫描线纹理 */}
      <div className={styles.scanlines} />

      {/* 呼吸灯边框效果 */}
      {isHovered && (
        <>
          {/* 上边框呼吸灯 */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                '0 0 10px rgba(16, 185, 129, 0.3)',
                '0 0 20px rgba(16, 185, 129, 0.8)',
                '0 0 10px rgba(16, 185, 129, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* 右边框呼吸灯 */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              boxShadow: [
                '0 0 10px rgba(16, 185, 129, 0.3)',
                '0 0 20px rgba(16, 185, 129, 0.8)',
                '0 0 10px rgba(16, 185, 129, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          />

          {/* 下边框呼吸灯 */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            animate={{
              opacity: [0.3, 0.8, 0.3],
              boxShadow: [
                '0 0 10px rgba(16, 185, 129, 0.3)',
                '0 0 20px rgba(16, 185, 129, 0.8)',
                '0 0 10px rgba(16, 185, 129, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
          />

          {/* 左边框呼吸灯 */}
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-400 to-transparent"
            animate={{
              opacity: [0.5, 1, 0.5],
              boxShadow: [
                '0 0 10px rgba(16, 185, 129, 0.3)',
                '0 0 20px rgba(16, 185, 129, 0.8)',
                '0 0 10px rgba(16, 185, 129, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
          />
        </>
      )}

      {/* 内容区域 */}
      <div className="relative z-10 p-6">
        {/* 头部 - 宝可梦名称和等级 */}
        <div className="mb-6 border-b border-emerald-500/20 pb-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-bold text-emerald-400 mb-1">
              {pokemon.nickname || pokemon.pokemon.name}
            </h3>
            <p className="text-xs text-slate-400 tracking-widest">
              {pokemon.pokemon.enName} • Lv.{pokemon.level}
            </p>
          </motion.div>
        </div>

        {/* 宝可梦类型标签 */}
        <div className="flex gap-2 mb-6">
          {pokemon.pokemon.types.map((type) => type && (
            <span
              key={type}
              className={cn(
                'px-3 py-1 text-xs rounded font-bold uppercase',
                'border border-emerald-400/50 text-emerald-400',
                'bg-emerald-500/10'
              )}
            >
              {type}
            </span>
          ))}
        </div>

        {/* 能力值显示区域 */}
        <div className={cn(
          'bg-slate-900/50 border border-emerald-500/20 rounded p-4 mb-6',
          'font-mono text-xs'
        )}>
          <h4 className="text-emerald-400 font-bold mb-4 uppercase tracking-wider">
            ━━ Base Stats ━━
          </h4>

          <div className="space-y-3">
            {statLabels.map((label, index) => {
              const hasModification = modificationMap.has(label.toLowerCase() as any);
              return (
                <StatBar
                  key={label}
                  label={label}
                  value={statValues[index]}
                  maxValue={300}
                  hasModification={hasModification}
                />
              );
            })}
          </div>
        </div>

        {/* Kaizo 改动点标签 */}
        {modifications.length > 0 && isHovered && (
          <motion.div
            className="mb-6 border border-emerald-500/40 bg-emerald-500/10 rounded p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Kaizo Modifications
              </h4>
            </div>

            <div className="space-y-2">
              {modifications.map((mod) => (
                <div key={mod.stat} className="text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold">
                    {mod.stat.toUpperCase()}
                  </span>
                  {' '}
                  <span className={mod.change > 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {mod.change > 0 ? '+' : ''}{mod.change}
                  </span>
                  {' '}
                  <span className="text-slate-400">─ {mod.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 特性信息 */}
        <div className="space-y-2">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-2">
            Ability
          </div>
          <div className={cn(
            'px-3 py-2 rounded bg-slate-800/50 border border-emerald-500/20',
            'text-sm text-slate-300 font-medium'
          )}>
            {pokemon.pokemon.abilities.ability1.name}
          </div>
        </div>

        {/* 性质和道具 */}
        {showDetails && (
          <motion.div
            className="mt-6 space-y-3 border-t border-emerald-500/20 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-slate-400 mb-1">Nature</p>
                <p className="text-emerald-400 font-bold">{pokemon.nature}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Held Item</p>
                <p className="text-emerald-400 font-bold">
                  {pokemon.heldItem?.name || 'None'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 底部装饰条 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
    </motion.div>
  );
}

/**
 * TacticalPokemonCard 网格布局包装组件
 * 用于显示多张卡片
 */
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
