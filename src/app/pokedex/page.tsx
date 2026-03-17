import Link from 'next/link';

export default function PokedexPage(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <section className="glass-card p-8">
          <h1 className="title-strong mb-3 text-4xl text-emerald-300">全图鉴</h1>
          <p className="mb-6 text-slate-300">
            这里将收录全部宝可梦条目、属性、种族值、特性、招式与稀有度信息，方便你在推图与对战前快速检索。
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="tech-button">返回首页</Link>
            <Link href="/teambuilder" className="tech-button">前往队伍构建</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
