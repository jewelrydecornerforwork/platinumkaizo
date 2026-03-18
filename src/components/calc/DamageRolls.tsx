type DamageRollEntry = {
  factor: number;
  value: number;
};

export const DamageRolls = ({ rolls }: { rolls: DamageRollEntry[] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
          伤害分布 / Damage Rolls
        </h3>
        <span className="font-mono text-[10px] uppercase text-slate-600">Seed: 0xDEADBEEF</span>
      </div>

      <div className="grid grid-cols-4 gap-2 md:grid-cols-8">
        {rolls.map((roll, i) => (
          <div
            key={i}
            className="group rounded-lg border border-slate-800 bg-slate-950 px-2 py-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase text-slate-600 transition-colors group-hover:text-cyan-400">
                R{roll.factor}
              </span>
              <span className="font-mono text-[10px] text-slate-500 transition-colors group-hover:text-emerald-500">
                {roll.value.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
