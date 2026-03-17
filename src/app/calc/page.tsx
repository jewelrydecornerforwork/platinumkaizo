import Link from 'next/link';

export default function CalcPage(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <section className="glass-card p-8">
          <h1 className="title-strong mb-3 text-4xl text-emerald-300">伤害计算</h1>
          <p className="mb-6 text-slate-300">
            你可以在这里模拟伤害区间、观察击杀线并快速验证战术思路。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calculator" className="tech-button">进入高级计算器</Link>
            <Link href="/bosses" className="tech-button">查看馆主对战</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
