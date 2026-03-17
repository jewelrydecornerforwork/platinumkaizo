'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { TacticalPokemonCard, TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';
import {
  garchompInstance,
  firefannyKaizo,
  sampleTrainerData,
} from '@/data/sampleData';
import {
  garchompKaizoModifications,
  heatranKaizoModifications,
  enteiKaizoModifications,
} from '@/data/kaizoModifications';

export default function CardDemoPage(): React.ReactElement {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const handleCardClick = useCallback((index: number) => {
    setSelectedCardIndex(index);
  }, []);

  // Kaizo 改动映射表
  const modificationsMap = {
    0: garchompKaizoModifications,
    1: heatranKaizoModifications,
    2: enteiKaizoModifications,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      {/* 页面容器 */}
      <div className="max-w-7xl mx-auto px-6">
        {/* 标题部分 */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Tactical Pokémon Cards
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            赛博朋克风格的宝可梦战术卡片演示
          </p>
        </motion.div>

        {/* 单卡片演示 */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              单卡片展示
            </h2>
            <p className="text-slate-400">
              鼠标悬浮查看呼吸灯特效和 Kaizo 改动信息
            </p>
          </div>

          <div className="flex justify-center">
            <TacticalPokemonCard
              pokemon={garchompInstance}
              modifications={garchompKaizoModifications}
              showDetails={true}
            />
          </div>
        </motion.section>

        {/* 分隔线 */}
        <div className="my-16 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

        {/* 多卡片网格演示 */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              {firefannyKaizo.name} 的队伍
            </h2>
            <p className="text-slate-400 mb-4">
              {firefannyKaizo.title} - {firefannyKaizo.location}
            </p>
            <div className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-slate-300">{firefannyKaizo.tactic.description}</p>
            </div>
          </div>

          <TacticalPokemonCardGrid
            pokemon={firefannyKaizo.team}
            modifications={modificationsMap}
            onCardClick={handleCardClick}
          />
        </motion.section>

        {/* 选中卡片的详细信息 */}
        {selectedCardIndex !== null && (
          <motion.section
            className="mt-12 p-8 rounded-lg bg-slate-900/50 border border-emerald-500/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xl font-bold text-emerald-400 mb-4">
              选中宝可梦详情
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400 mb-1">名称</p>
                <p className="text-emerald-400 font-bold">
                  {firefannyKaizo.team[selectedCardIndex].pokemon.name}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">等级</p>
                <p className="text-emerald-400 font-bold">
                  {firefannyKaizo.team[selectedCardIndex].level}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">特性</p>
                <p className="text-emerald-400 font-bold">
                  {firefannyKaizo.team[selectedCardIndex].pokemon.abilities.ability1.name}
                </p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">道具</p>
                <p className="text-emerald-400 font-bold">
                  {firefannyKaizo.team[selectedCardIndex].heldItem?.name || '无'}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* 代码示例部分 */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              使用示例
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 基础用法 */}
            <div className="p-6 rounded-lg bg-slate-900/50 border border-emerald-500/20 font-mono text-xs overflow-x-auto">
              <p className="text-emerald-400 mb-4 font-bold">基础用法</p>
              <pre className="text-slate-300 whitespace-pre-wrap break-words">
{`import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';

<TacticalPokemonCard
  pokemon={garchompInstance}
  modifications={garchompKaizoModifications}
  showDetails={true}
/>`}
              </pre>
            </div>

            {/* 网格用法 */}
            <div className="p-6 rounded-lg bg-slate-900/50 border border-emerald-500/20 font-mono text-xs overflow-x-auto">
              <p className="text-emerald-400 mb-4 font-bold">网格布局</p>
              <pre className="text-slate-300 whitespace-pre-wrap break-words">
{`import { TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';

<TacticalPokemonCardGrid
  pokemon={firefannyKaizo.team}
  modifications={modificationsMap}
  onCardClick={handleCardClick}
/>`}
              </pre>
            </div>
          </div>
        </motion.section>

        {/* 特性说明 */}
        <motion.section
          className="mt-16 p-8 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-500/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">
            ✨ 组件特性
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 rounded bg-slate-900/30 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-2">赛博朋克视觉</h3>
              <p className="text-slate-400">
                CRT 屏幕扫描线纹理效果，完整的赛博朋克风格设计
              </p>
            </div>

            <div className="p-4 rounded bg-slate-900/30 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-2">动态能力值条</h3>
              <p className="text-slate-400">
                根据数值高低自动变色（红→绿），带有渐进动画
              </p>
            </div>

            <div className="p-4 rounded bg-slate-900/30 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-2">呼吸灯特效</h3>
              <p className="text-slate-400">
                鼠标悬浮时四边框亮起电光绿色呼吸灯特效
              </p>
            </div>

            <div className="p-4 rounded bg-slate-900/30 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-2">Kaizo 标签</h3>
              <p className="text-slate-400">
                悬浮显示版本改动信息，标记具体的数值调整
              </p>
            </div>

            <div className="p-4 rounded bg-slate-900/30 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-2">Framer Motion</h3>
              <p className="text-slate-400">
                流畅的进入动画和悬浮交互效果
              </p>
            </div>

            <div className="p-4 rounded bg-slate-900/30 border border-emerald-500/10">
              <h3 className="font-bold text-emerald-400 mb-2">完全响应式</h3>
              <p className="text-slate-400">
                网格布局自动适应移动端、平板和桌面
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
