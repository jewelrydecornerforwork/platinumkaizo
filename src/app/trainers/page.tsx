'use client';

import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { TacticalPokemonCard, TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';
import { garchompInstance, firefannyKaizo } from '@/data/sampleData';
import {
  garchompKaizoModifications,
  heatranKaizoModifications,
  enteiKaizoModifications,
} from '@/data/kaizoModifications';

const SPECIES_NAME_MAP: Record<number, string> = {
  59: '风速狗',
  78: '烈焰马',
  244: '炎帝',
  257: '火焰鸡',
  445: '烈咬陆鲨',
  485: '席多蓝恩',
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

const ITEM_LABEL_MAP: Record<string, string> = {
  'item-270': '生命宝珠',
  'item-540': '突击背心',
  'item-999': '沙暴石',
};

function getDisplayName(id: number, fallback: string): string {
  return SPECIES_NAME_MAP[id] || fallback;
}

function getAbilityName(id: string, fallback: string): string {
  return ABILITY_LABEL_MAP[id] || fallback;
}

function getItemName(itemId: string | undefined, fallback: string | undefined): string {
  if (!itemId) {
    return '无';
  }
  return ITEM_LABEL_MAP[itemId] || fallback || '无';
}

export default function TrainersPage(): React.ReactElement {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const handleCardClick = useCallback((index: number) => {
    setSelectedCardIndex(index);
  }, []);

  const kaizoRevisionData = {
    0: garchompKaizoModifications,
    1: heatranKaizoModifications,
    2: enteiKaizoModifications,
  };

  const selectedPokemon =
    selectedCardIndex !== null ? firefannyKaizo.team[selectedCardIndex] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.header
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="title-strong mb-4 text-5xl">
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              馆主战术情报分析 (INTELLIGENCE CENTER)
            </span>
          </h1>
          <p className="text-lg text-slate-300">
            实时同步 Platinum Kaizo 官方改动数据，包含强化种族值、隐藏特性及 AI 逻辑预判。
          </p>
        </motion.header>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6">
            <h2 className="title-strong mb-2 text-2xl text-emerald-300">
              作战单位详情 (UNIT DATA)
            </h2>
            <p className="text-slate-300">
              深度解析馆主主力成员。悬浮或点击可查看该宝可梦在 Kaizo
              版本中的特定修正、携带道具以及致命招式组合。
            </p>
          </div>

          <div className="flex justify-center">
            <TacticalPokemonCard
              pokemon={garchompInstance}
              modifications={garchompKaizoModifications}
              showDetails
            />
          </div>
        </motion.section>

        <div className="my-16 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="mb-8">
            <h2 className="title-strong mb-2 text-2xl text-emerald-300">馆主对战队示例</h2>
            <p className="mb-4 text-slate-300">
              以火系高压阵容为例，展示 Kaizo 环境下馆主攻势编成、属性覆盖与交互情报区。
            </p>
            <div className="glass-card p-4">
              <p className="text-slate-200">
                该示例用于推演高难度改版环境中的先手压制链路，帮助训练家快速识别换挡节点与破局窗口。
              </p>
            </div>
          </div>

          <TacticalPokemonCardGrid
            pokemon={firefannyKaizo.team}
            modifications={kaizoRevisionData}
            onCardClick={handleCardClick}
          />
        </motion.section>

        {selectedPokemon && (
          <motion.section
            className="glass-card mt-12 p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="title-strong mb-4 text-xl text-emerald-300">当前选中宝可梦</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="mb-1 text-slate-400">名称</p>
                <p className="title-strong text-emerald-300">
                  {getDisplayName(selectedPokemon.pokemon.id, selectedPokemon.pokemon.name)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-slate-400">等级</p>
                <p className="data-number title-strong text-emerald-300">{selectedPokemon.level}</p>
              </div>
              <div>
                <p className="mb-1 text-slate-400">特性</p>
                <p className="title-strong text-emerald-300">
                  {getAbilityName(
                    selectedPokemon.pokemon.abilities.ability1.id,
                    selectedPokemon.pokemon.abilities.ability1.name
                  )}
                </p>
              </div>
              <div>
                <p className="mb-1 text-slate-400">携带道具</p>
                <p className="title-strong text-emerald-300">
                  {getItemName(selectedPokemon.heldItem?.id, selectedPokemon.heldItem?.name)}
                </p>
              </div>
            </div>
          </motion.section>
        )}

        <motion.section
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="title-strong mb-6 text-2xl text-emerald-300">
            战术数据调用示例 (Standard API v1.0)
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass-card overflow-x-auto p-6 font-mono text-xs">
              <p className="title-strong mb-4 text-emerald-300">基础用法</p>
              <pre className="whitespace-pre-wrap break-words text-slate-200">
{`import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';

<TacticalPokemonCard
  pokemon={garchompInstance}
  kaizoRevisionData={garchompKaizoModifications}
  showDetails={true}
/>`}
              </pre>
            </div>

            <div className="glass-card overflow-x-auto p-6 font-mono text-xs">
              <p className="title-strong mb-4 text-emerald-300">网格布局</p>
              <pre className="whitespace-pre-wrap break-words text-slate-200">
{`import { TacticalPokemonCardGrid } from '@/components/cards/TacticalPokemonCard';

<TacticalPokemonCardGrid
  pokemon={firefannyKaizo.team}
  kaizoRevisionData={kaizoRevisionData}
  onCardClick={handleCardClick}
/>`}
              </pre>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="glass-card mt-16 p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="title-strong mb-6 text-2xl text-emerald-300">作战系统核心能力</h2>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">战术面板架构</h3>
              <p className="text-slate-300">
                采用高对比度深色滤镜，确保复杂战场环境下数据读数清晰无误。
              </p>
            </div>
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">动态威胁预警</h3>
              <p className="text-slate-300">
                数值条颜色根据 Kaizo 危险阈值实时变换，红色预警代表极高 OHKO 风险。
              </p>
            </div>
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">专业级字体规范</h3>
              <p className="text-slate-300">
                采用等宽战术字体排版，确保伤害演算数据对齐，误差率降至最低。
              </p>
            </div>
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">快速决策终端</h3>
              <p className="text-slate-300">
                全扁平化科技交互，助您在 1 秒内完成换人决策。
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
