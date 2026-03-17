import Link from 'next/link';

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="glass-card w-full max-w-xl p-8 text-center">
        <h1 className="title-strong mb-3 text-4xl text-emerald-300">页面未找到</h1>
        <p className="mb-6 text-slate-300">你访问的页面不存在，可能已被移动或删除。</p>
        <Link href="/" className="tech-button">
          返回首页
        </Link>
      </section>
    </div>
  );
}
