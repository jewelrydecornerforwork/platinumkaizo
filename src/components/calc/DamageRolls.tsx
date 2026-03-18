type DamageRollEntry = {
  factor: number;
  value: number;
};

export const DamageRolls = ({ rolls }: { rolls: DamageRollEntry[] }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-mono text-xl font-bold text-white">伤害分布 (DAMAGE ROLLS)</h3>
        <span className="font-mono text-[10px] uppercase text-slate-600">Seed: 0xDEADBEEF</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {rolls.map((roll, i) => (
          <div
            key={i}
            className="group rounded border border-slate-800 bg-slate-950 p-2"
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
