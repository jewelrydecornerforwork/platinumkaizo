import Link from 'next/link';

export default function BossesPage(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <section className="glass-card p-8">
          <h1 className="title-strong mb-3 text-4xl text-emerald-300">馆主对战</h1>
          <p className="mb-6 text-slate-300">
            本页用于展示馆主阵容、战术核心与破解思路，帮助你提前准备队伍节奏与对局策略。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo/cards" className="tech-button">查看战术卡片示例</Link>
            <Link href="/calculator" className="tech-button">前往伤害计算器</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
