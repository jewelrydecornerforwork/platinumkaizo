"use client";
import React from 'react';
import { ShieldAlert, Zap, Crosshair, Info } from 'lucide-react';

export default function BossIntelPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 lg:p-12">
      {/* 头部：情报等级标识 */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-between items-end border-b border-emerald-500/30 pb-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white">馆主战术情报中心</h1>
          <p className="text-emerald-500 font-mono text-sm mt-2">CLASSIFIED // PLATINUM KAIZO TACTICAL DATA</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-xs text-slate-500 font-mono">ENCRYPTION: AES-256</p>
          <p className="text-xs text-slate-500 font-mono">STATUS: LIVE_INTEL</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 左侧：馆主概况 */}
        <div className="lg:col-span-1 space-y-6">
          <div className="aspect-square bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-slate-700 font-bold">馆主头像占位</span>
          </div>
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> 瓢太 (Roark)
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              白金改版第一道关卡。瓢太的队伍在 Kaizo 版中获得了大幅度补强，首发单位具有极强的破盾能力。
            </p>
            <div className="mt-6 space-y-2">
              <div className="text-[10px] text-slate-500 uppercase font-mono">核心威胁度</div>
              <div className="h-1 w-full bg-slate-800 rounded-full">
                <div className="h-full w-[40%] bg-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：对阵详情 */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 宝可梦卡片空壳示例 */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 bg-slate-800 rounded-lg animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-500">LV. 14+</span>
                </div>
                <h3 className="text-lg font-bold text-white">战术单位 0{i}</h3>
                <p className="text-xs text-slate-500 mt-1">点击解析详细改动数据...</p>
              </div>
            ))}
          </div>

          {/* 战术分析区 */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Crosshair className="w-24 h-24" />
            </div>
            <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" /> 战场决策建议
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex gap-2">
                <span className="text-emerald-500">▶</span> 注意其首发单位的“生命玉”修正，非抵抗属性请勿硬接。
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500">▶</span> 场地默认存在“沙暴”效果，气带单位需谨慎首发。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
