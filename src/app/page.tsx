import Link from 'next/link';

const features = [
  {
    title: '全图鉴',
    description: '快速查询宝可梦基础信息、属性与战术定位。',
    href: '/pokedex',
  },
  {
    title: '馆主对战',
    description: '查看关键馆主阵容思路与针对策略。',
    href: '/bosses',
  },
  {
    title: '伤害计算',
    description: '模拟对战伤害区间，辅助队伍与配招决策。',
    href: '/calculator',
  },
  {
    title: '队伍构建',
    description: '规划队伍核心、补盲点并构建对战节奏。',
    href: '/teambuilder',
  },
];

export default function Home(): React.ReactElement {
  return (
    <div className="px-6 py-12 md:px-12">
      <div className="mx-auto max-w-5xl">
        <section className="mb-12 pt-6">
          <h1 className="title-strong mb-4 text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Platinum Kaizo 数字化作战指挥系统
            </span>
          </h1>
          <p className="max-w-3xl text-lg text-slate-300">
            为顶尖训练家定制的硬核数据支持
          </p>
        </section>

        <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="glass-card group p-6 transition-colors duration-200 hover:border-emerald-500/45"
            >
              <h2 className="title-strong mb-2 text-xl text-emerald-300 group-hover:text-emerald-200">
                {feature.title}
              </h2>
              <p className="text-slate-300">{feature.description}</p>
              <span className="mt-4 inline-flex text-sm text-emerald-300">进入模块</span>
            </Link>
          ))}
        </section>

        <section className="glass-card p-6">
          <h2 className="title-strong mb-2 text-2xl text-emerald-300">开始探索</h2>
          <p className="mb-4 text-slate-300">
            你可以从左侧导航进入任意模块，或直接打开伤害计算器进行战术验证。
          </p>
          <Link href="/calculator" className="tech-button">
            打开伤害计算器
          </Link>
        </section>
      </div>
    </div>
  );
}
