import Link from 'next/link';

export default function TeambuilderPage(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <section className="glass-card p-8">
          <h1 className="title-strong mb-3 text-4xl text-emerald-300">队伍构建</h1>
          <p className="mb-6 text-slate-300">
            通过角色分工、属性补盲与招式联动，构建更稳的通关阵容与对战策略。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/pokedex" className="tech-button">开始扫描</Link>
            <Link href="/calculator" className="tech-button">伤害验证</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
