import Link from 'next/link';

export default function NotFound(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="glass-card w-full max-w-xl p-8 text-center">
        <h1 className="title-strong mb-3 text-4xl text-emerald-300">TARGET PAGE NOT FOUND</h1>
        <p className="mb-6 font-mono text-sm uppercase tracking-[0.14em] text-slate-300">
          THE REQUESTED ROUTE IS OFFLINE, RELOCATED, OR NO LONGER CLEARED FOR ACCESS.
        </p>
        <Link href="/" className="tech-button">
          RETURN TO COMMAND HUB
        </Link>
      </section>
    </div>
  );
}
