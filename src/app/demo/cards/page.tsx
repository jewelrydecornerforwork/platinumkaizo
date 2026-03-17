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

export default function CardDemoPage(): React.ReactElement {
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const handleCardClick = useCallback((index: number) => {
    setSelectedCardIndex(index);
  }, []);

  const modificationsMap = {
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
              战术卡片演示
            </span>
          </h1>
          <p className="text-lg text-slate-300">统一中文界面、玻璃容器风格与动态数值高亮效果</p>
        </motion.header>

        <motion.section
          className="mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="mb-6">
            <h2 className="title-strong mb-2 text-2xl text-emerald-300">单卡展示</h2>
            <p className="text-slate-300">悬停可查看改版修正信息与动态视觉效果。</p>
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
            <p className="mb-4 text-slate-300">以火系高压阵容为例，展示卡片网格排布与交互信息区。</p>
            <div className="glass-card p-4">
              <p className="text-slate-200">
                该示例强调先手压制与属性覆盖，适合演示改版环境下的核心战术节奏。
              </p>
            </div>
          </div>

          <TacticalPokemonCardGrid
            pokemon={firefannyKaizo.team}
            modifications={modificationsMap}
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
          <h2 className="title-strong mb-6 text-2xl text-emerald-300">使用示例</h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="glass-card overflow-x-auto p-6 font-mono text-xs">
              <p className="title-strong mb-4 text-emerald-300">基础用法</p>
              <pre className="whitespace-pre-wrap break-words text-slate-200">
{`import { TacticalPokemonCard } from '@/components/cards/TacticalPokemonCard';

<TacticalPokemonCard
  pokemon={garchompInstance}
  modifications={garchompKaizoModifications}
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
  modifications={modificationsMap}
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
          <h2 className="title-strong mb-6 text-2xl text-emerald-300">组件特性</h2>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">玻璃容器样式</h3>
              <p className="text-slate-300">统一使用半透明深灰面板，叠加微弱蓝光外发光。</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">红黄绿数据高亮</h3>
              <p className="text-slate-300">种族值条会根据数值自动生成从红到绿的渐变。</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">标题与数值字体规范</h3>
              <p className="text-slate-300">标题统一粗壮无衬线，数值统一等宽字体。</p>
            </div>
            <div className="glass-card p-4">
              <h3 className="title-strong mb-2 text-emerald-300">扁平科技按钮</h3>
              <p className="text-slate-300">按钮样式统一为扁平科技感，交互反馈更清晰。</p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
