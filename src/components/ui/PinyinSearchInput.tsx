"use client";

import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

interface SearchProps {
  onSearch: (query: string) => void;
}

export const PinyinSearchInput = ({ onSearch }: SearchProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="group relative mx-auto mb-0 w-full max-w-none">
      <div
        className={`absolute -inset-0.5 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur opacity-30 transition duration-1000 group-hover:opacity-100 ${isFocused ? 'opacity-100' : ''}`}
      />

      <div className="relative flex items-center overflow-hidden rounded-lg border border-slate-800 bg-[#020617] transition-all duration-300 focus-within:border-emerald-500/50 shadow-[inset_0_1px_3px_rgba(0,0,0,0.6)]">
        <div className="flex min-w-[118px] items-center gap-2 border-r border-slate-800 bg-slate-900/30 px-2.5 py-2.5">
          <Terminal size={13} className={isFocused ? 'text-emerald-500' : 'text-slate-600'} />
          <span className="hidden font-mono text-[10px] uppercase tracking-widest text-slate-500 md:block">
            {isFocused ? 'SEARCHING...' : 'INPUT_READY'}
          </span>
        </div>

        <input
          type="text"
          aria-label="Pokedex Search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Search Name English Initials"
          className="w-full bg-transparent px-4 py-2.5 text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none"
        />
      </div>

      {isFocused && (
        <div className="absolute bottom-0 left-0 h-[1px] w-full animate-pulse bg-emerald-500/50 shadow-[0_0_10px_#10b981]" />
      )}
    </div>
  );
};
