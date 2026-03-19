'use client';

import React from 'react';

type SelectorOption = {
  id: string;
  name: string;
  subtitle: string;
  meta: string;
};

type IntelSelectorProps = {
  side: 'attacker' | 'defender';
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  options: SelectorOption[];
  selectedId: string;
  onSelect: (value: string) => void;
  levelValue: number;
  effortValue: number;
  children?: React.ReactNode;
};

const themeMap = {
  attacker: {
    accentText: 'text-cyan-300',
    accentFocus: 'focus:border-cyan-300',
    accentGlow: 'shadow-[0_0_18px_rgba(34,211,238,0.12)]',
    accentStrip: 'bg-cyan-400/60',
    accentDot: 'bg-cyan-400',
    activeClass:
      'bg-cyan-400/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]',
  },
  defender: {
    accentText: 'text-red-300',
    accentFocus: 'focus:border-red-300',
    accentGlow: 'shadow-[0_0_18px_rgba(248,113,113,0.12)]',
    accentStrip: 'bg-red-500/60',
    accentDot: 'bg-red-500',
    activeClass:
      'bg-red-500/10 text-red-100 shadow-[inset_0_0_0_1px_rgba(248,113,113,0.25)]',
  },
} as const;

export default function IntelSelector({
  side,
  title,
  searchValue,
  onSearchChange,
  placeholder = 'SMART UNIT SEARCH // NAME, ENGLISH, INITIALS...',
  options,
  selectedId,
  onSelect,
  levelValue,
  effortValue,
  children,
}: IntelSelectorProps): React.ReactElement {
  const theme = themeMap[side];

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40 p-5 backdrop-blur-md ${theme.accentGlow}`}
    >
      <div className="absolute right-0 top-0 p-2 font-mono text-[10px] uppercase opacity-20">
        {side}_intel
      </div>
      <div className={`absolute left-0 top-0 h-full w-1 ${theme.accentStrip}`} />

      <h3 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-tighter text-white">
        <div className={`h-2 w-2 animate-pulse rounded-full ${theme.accentDot}`} />
        {title}
      </h3>

      <div className="space-y-4">
        <div className="relative">
          <input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            className={`w-full rounded-md border border-slate-800 bg-black/40 p-2 pr-16 text-sm font-mono text-slate-100 outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] ${theme.accentFocus}`}
            placeholder={placeholder}
          />
          <span className="absolute right-2 top-2 font-mono text-[10px] text-slate-700">
            ID_SCAN
          </span>
        </div>

        <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/40 p-1.5">
          {options.map((option) => {
            const active = option.id === selectedId;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelect(option.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-all ${
                  active ? theme.activeClass : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{option.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {option.subtitle}
                  </p>
                </div>
                <span className={`font-mono text-[10px] ${theme.accentText}`}>{option.meta}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'LEVEL', value: levelValue },
            { label: 'EFFORT LOAD', value: effortValue },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded border border-slate-800 bg-slate-950/50 p-2"
            >
              <span className="font-mono text-[10px] text-slate-500">{item.label}</span>
              <span className="font-mono text-sm font-bold text-white">{item.value}</span>
            </div>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
