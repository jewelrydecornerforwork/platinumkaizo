import Link from 'next/link';
import { BookOpenText, Calculator, Shield, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { TacticalCard } from '@/components/TacticalCard';

const modules = [
  {
    title: '全图鉴',
    desc: '检索属性、种族值、特性、招式与稀有度信息，快速建立战术认知。',
    href: '/pokedex',
    icon: <BookOpenText size={24} strokeWidth={2.2} />,
    actionLabel: '图鉴数据库已就绪',
  },
  {
    title: '伤害计算',
    desc: '执行核心对战演算，评估击杀阈值、回合交换效率与风险窗口。',
    href: '/calculator',
    icon: <Calculator size={24} strokeWidth={2.2} />,
    actionLabel: '演算引擎持续运行',
  },
  {
    title: '馆主对战',
    desc: '汇总关键馆主阵容、技能覆盖与压制节奏，制定针对 Platinum Kaizo 的突破方案。',
    href: '/trainers',
    icon: <Shield size={24} strokeWidth={2.2} />,
    actionLabel: '敌方情报持续更新',
  },
  {
    title: '队伍构建',
    desc: '构建核心阵容与联动体系，统筹输出曲线、抗性链路与作战稳定性。',
    href: '/teambuilder',
    icon: <Users size={24} strokeWidth={2.2} />,
    actionLabel: '编队矩阵同步完成',
  },
] as const;

export default function Home(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden px-6 pb-16 pt-24 md:px-12">
      <Navbar />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-44 z-0 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl animate-pulse"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <section className="mb-12 text-center">
          <h1 className="title-strong mb-3 text-5xl text-white md:text-7xl">
            白金改版战术情报中心
          </h1>
          <p className="mx-auto max-w-3xl text-sm text-emerald-300 md:text-base">
            多源战斗数据融合、实时态势分析与策略级推演平台
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {modules.map((module) => (
            <Link key={module.title} href={module.href} aria-label={`进入${module.title}`}>
              <TacticalCard
                title={module.title}
                desc={module.desc}
                icon={module.icon}
                actionLabel={module.actionLabel}
              />
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
