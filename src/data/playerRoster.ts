import type { BaseStats } from '@/types';

export type PlayerMoveProfile = {
  name: string;
  label: string;
  power: number;
  type: string;
  category: 'physical' | 'special' | 'status';
};

export type PlayerRosterEntry = {
  id: string;
  name: string;
  enName: string;
  zhName: string;
  initials: string;
  level: number;
  role: string;
  item: string;
  ability: string;
  nature: string;
  note: string;
  tactic: string;
  types: string[];
  stats: BaseStats;
  evs: { hp?: number; atk?: number; def?: number; spA?: number; spD?: number; spe?: number };
  ivs: { hp?: number; atk?: number; def?: number; spA?: number; spD?: number; spe?: number };
  moves: PlayerMoveProfile[];
};

export const playerRosterData: PlayerRosterEntry[] = [
  {
    id: 'player-turtwig',
    name: 'Turtwig',
    enName: 'Turtwig',
    zhName: '草苗龟',
    initials: 'cmg',
    level: 13,
    role: 'Frontline Anchor',
    item: 'None',
    ability: 'Overgrow',
    nature: 'Hardy',
    note: 'Roark-safe grass anchor',
    tactic:
      'Provides stable anti-Rock pressure with sustained physical bulk and clean Grass STAB, making it a low-risk lead into Oreburgh lines.',
    types: ['Grass'],
    stats: { hp: 55, atk: 68, def: 64, spA: 45, spD: 55, spe: 31 },
    evs: { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31 },
    moves: [
      { name: 'Razor Leaf', label: 'Razor Leaf', power: 55, type: 'Grass', category: 'physical' },
      { name: 'Absorb', label: 'Absorb', power: 20, type: 'Grass', category: 'special' },
      { name: 'Withdraw', label: 'Withdraw', power: 0, type: 'Water', category: 'status' },
      { name: 'Tackle', label: 'Tackle', power: 35, type: 'Normal', category: 'physical' },
    ],
  },
  {
    id: 'player-chimchar',
    name: 'Chimchar',
    enName: 'Chimchar',
    zhName: '小火焰猴',
    initials: 'xhyh',
    level: 14,
    role: 'Tempo Breaker',
    item: 'None',
    ability: 'Blaze',
    nature: 'Hardy',
    note: 'Fast mixed opener',
    tactic:
      'Breaks low-bulk targets early and forces awkward sequencing with priority plus Fire coverage, useful when tempo matters more than raw bulk.',
    types: ['Fire'],
    stats: { hp: 44, atk: 58, def: 44, spA: 58, spD: 44, spe: 61 },
    evs: { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31 },
    moves: [
      { name: 'Scratch', label: 'Scratch', power: 40, type: 'Normal', category: 'physical' },
      { name: 'Leer', label: 'Leer', power: 0, type: 'Normal', category: 'status' },
      { name: 'Ember', label: 'Ember', power: 40, type: 'Fire', category: 'special' },
      { name: 'Taunt', label: 'Taunt', power: 0, type: 'Dark', category: 'status' },
    ],
  },
  {
    id: 'player-piplup',
    name: 'Piplup',
    enName: 'Piplup',
    zhName: '波加曼',
    initials: 'bjm',
    level: 14,
    role: 'Ballistic Counterline',
    item: 'None',
    ability: 'Torrent',
    nature: 'Hardy',
    note: 'Primary Roark counterpick',
    tactic:
      'Directly pressures Oreburgh cores with Water STAB while still carrying backup coverage for neutral trades and cleanup turns.',
    types: ['Water'],
    stats: { hp: 53, atk: 51, def: 53, spA: 61, spD: 56, spe: 40 },
    evs: { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31 },
    moves: [
      { name: 'Pound', label: 'Pound', power: 40, type: 'Normal', category: 'physical' },
      { name: 'Growl', label: 'Growl', power: 0, type: 'Normal', category: 'status' },
      { name: 'Bubble', label: 'Bubble', power: 20, type: 'Water', category: 'special' },
      { name: 'Water Sport', label: 'Water Sport', power: 0, type: 'Water', category: 'status' },
    ],
  },
  {
    id: 'player-starly',
    name: 'Starly',
    enName: 'Starly',
    zhName: '姆克儿',
    initials: 'mke',
    level: 12,
    role: 'Fast Pivot Scout',
    item: 'None',
    ability: 'Keen Eye',
    nature: 'Hardy',
    note: 'Speed control scout',
    tactic:
      'Generates early reconnaissance value through fast Flying pressure and pivot-safe chip, then cleans weakened targets with priority.',
    types: ['Normal', 'Flying'],
    stats: { hp: 40, atk: 55, def: 30, spA: 30, spD: 30, spe: 60 },
    evs: { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31 },
    moves: [
      { name: 'Tackle', label: 'Tackle', power: 35, type: 'Normal', category: 'physical' },
      { name: 'Quick Attack', label: 'Quick Attack', power: 40, type: 'Normal', category: 'physical' },
      { name: 'Wing Attack', label: 'Wing Attack', power: 60, type: 'Flying', category: 'physical' },
      { name: 'Double Team', label: 'Double Team', power: 0, type: 'Normal', category: 'status' },
    ],
  },
  {
    id: 'player-shinx',
    name: 'Shinx',
    enName: 'Shinx',
    zhName: '小猫怪',
    initials: 'xmg',
    level: 13,
    role: 'Electric Checkpoint',
    item: 'None',
    ability: 'Intimidate',
    nature: 'Hardy',
    note: 'Utility intimidate pressure',
    tactic:
      'Softens physical attackers on entry and threatens early Water or Flying lines with clean Electric coverage and disruptive bite pressure.',
    types: ['Electric'],
    stats: { hp: 45, atk: 65, def: 34, spA: 40, spD: 34, spe: 45 },
    evs: { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31 },
    moves: [
      { name: 'Tackle', label: 'Tackle', power: 35, type: 'Normal', category: 'physical' },
      { name: 'Leer', label: 'Leer', power: 0, type: 'Normal', category: 'status' },
      { name: 'Charge', label: 'Charge', power: 0, type: 'Electric', category: 'status' },
      { name: 'Spark', label: 'Spark', power: 65, type: 'Electric', category: 'physical' },
    ],
  },
  {
    id: 'player-budew',
    name: 'Budew',
    enName: 'Budew',
    zhName: '含羞苞',
    initials: 'hxb',
    level: 12,
    role: 'Status Support Seed',
    item: 'None',
    ability: 'Natural Cure',
    nature: 'Hardy',
    note: 'Status spread support',
    tactic:
      'Supports safer route progression with status pressure and gradual chip, giving slower squads room to stabilize before heavier threats arrive.',
    types: ['Grass', 'Poison'],
    stats: { hp: 40, atk: 30, def: 35, spA: 50, spD: 70, spe: 55 },
    evs: { hp: 0, atk: 0, def: 0, spA: 0, spD: 0, spe: 0 },
    ivs: { hp: 31, atk: 31, def: 31, spA: 31, spD: 31, spe: 31 },
    moves: [
      { name: 'Absorb', label: 'Absorb', power: 20, type: 'Grass', category: 'special' },
      { name: 'Growth', label: 'Growth', power: 0, type: 'Normal', category: 'status' },
      { name: 'Stun Spore', label: 'Stun Spore', power: 0, type: 'Grass', category: 'status' },
      { name: 'Water Sport', label: 'Water Sport', power: 0, type: 'Water', category: 'status' },
    ],
  },
];

export const defaultPlayerPresetId = 'player-piplup';
