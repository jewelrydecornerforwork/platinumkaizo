'use client';

import { useMemo, useState } from 'react';
import { calculate, Move, Pokemon } from '@smogon/calc';
import { getGymMoveIntelByName } from '@/data/gymMoveIntel';

type StatSpread = {
  hp?: number;
  atk?: number;
  def?: number;
  spA?: number;
  spD?: number;
  spe?: number;
};

type CombatantState = {
  name: string;
  level: number;
  evs: StatSpread;
  ivs: StatSpread;
  item: string;
  nature: string;
  ability?: string;
};

type PokemonCalcResult = {
  range: [number, number];
  desc: string;
  ko: string;
};

export const usePokemonCalc = () => {
  const [gen] = useState<4>(4);
  const [attacker, setAttacker] = useState<CombatantState>({
    name: 'Garchomp',
    level: 100,
    evs: { atk: 252, spA: 252, spe: 252 },
    ivs: { atk: 31, spA: 31, spe: 31 },
    item: '',
    nature: 'Adamant',
    ability: '',
  });
  const [defender, setDefender] = useState<CombatantState>({
    name: 'Blissey',
    level: 100,
    evs: { hp: 252, def: 252, spD: 252 },
    ivs: { hp: 31, def: 31, spD: 31 },
    item: '',
    nature: 'Bold',
    ability: '',
  });
  const [move, setMove] = useState('Earthquake');

  const result = useMemo<PokemonCalcResult | null>(() => {
    try {
      const mappedMove = getGymMoveIntelByName(move);
      const { name: attackerName, ...attackerOptions } = attacker;
      const { name: defenderName, ...defenderOptions } = defender;

      if (mappedMove?.power === 0) {
        return {
          range: [0, 0],
          desc: `${mappedMove.name} is a status-class move and does not deal direct damage.`,
          ko: 'STATUS_MOVE',
        };
      }

      const A = new Pokemon(gen, attackerName as never, attackerOptions as never);
      const D = new Pokemon(gen, defenderName as never, defenderOptions as never);
      const M = new Move(
        gen,
        (mappedMove?.name || move) as never,
        mappedMove?.power ? ({ bp: mappedMove.power } as never) : undefined
      );
      const res = calculate(gen, A, D, M);
      const range = res.range() as [number, number];
      const koChance = res.kochance() as { text?: string };

      return {
        range,
        desc: res.fullDesc(),
        ko: koChance.text || 'NO RELIABLE KO FLAG',
      };
    } catch {
      return null;
    }
  }, [attacker, defender, gen, move]);

  return { attacker, setAttacker, defender, setDefender, move, setMove, result };
};
