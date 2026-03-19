import Link from 'next/link';

export default function CalcPage(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-4xl">
        <section className="glass-card p-8">
          <h1 className="title-strong mb-3 text-4xl text-emerald-300">PRECISION BALLISTIC CONSOLE</h1>
          <p className="mb-6 font-mono text-sm uppercase tracking-[0.14em] text-slate-300">
            SIMULATE DAMAGE WINDOWS, VERIFY KO LINES, AND TEST TACTICAL DECISION PATHS IN A RAPID PREVIEW MODE.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/calculator" className="tech-button">OPEN FULL CONSOLE</Link>
            <Link href="/trainers" className="tech-button">OPEN LEADER DOSSIER</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
