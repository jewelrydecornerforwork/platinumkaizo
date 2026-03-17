export default function Home(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 pt-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
              Platinum Kaizo
            </span>
            <br />
            <span className="text-slate-300">Wiki</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mb-8">
            欢迎来到 Platinum Kaizo Wiki！这是一个全面的游戏指南，包含图鉴、馆主战术、伤害计算器和队伍配置工具。
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            {
              title: '全图鉴',
              description: '浏览所有 Pokémon 的详细信息',
              href: '/pokedex',
            },
            {
              title: '馆主战术',
              description: '查看馆主战斗的详细攻略',
              href: '/bosses',
            },
            {
              title: '伤害计算器',
              description: '计算伤害和战斗数据',
              href: '/calc',
            },
            {
              title: '队伍配置',
              description: '构建和优化你的队伍',
              href: '/teambuilder',
            },
          ].map((feature) => (
            <a
              key={feature.title}
              href={feature.href}
              className="group p-6 rounded-lg bg-slate-800/50 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300">
                {feature.title}
              </h3>
              <p className="text-slate-400 group-hover:text-slate-300">
                {feature.description}
              </p>
            </a>
          ))}
        </div>

        {/* Info Section */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-500/20">
          <h2 className="text-2xl font-bold text-emerald-400 mb-2">
            🎮 开始游戏
          </h2>
          <p className="text-slate-300">
            使用左侧导航菜单探索 Wiki 的各个部分，或选择上方的功能开始游戏指南之旅。
          </p>
        </div>
      </div>
    </div>
  );
}
