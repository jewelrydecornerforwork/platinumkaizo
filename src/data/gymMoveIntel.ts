type GymMoveIntel = {
  name: string;
  power: number;
  type: string;
  note?: string;
  category?: 'Physical' | 'Special' | 'Status';
  aliases?: string[];
  label?: string;
};

type GymLeaderMovePack = {
  specialty: string;
  core_moves: GymMoveIntel[];
};

export const GYM_MOVE_INTEL: {
  project: string;
  version: string;
  gym_leaders: Record<string, GymLeaderMovePack>;
} = {
  project: 'Platinum_Kaizo_Intel',
  version: 'v1.0_Static_Map',
  gym_leaders: {
    Roark: {
      specialty: 'Rock',
      core_moves: [
        {
          name: 'Head Smash',
          label: '双刃头锤',
          power: 150,
          type: 'Rock',
          category: 'Physical',
          note: 'High_Recoil',
          aliases: ['头锤', '双刃头锤'],
        },
        {
          name: 'Rock Slide',
          label: '岩崩',
          power: 75,
          type: 'Rock',
          category: 'Physical',
          note: 'Flinch_10%',
          aliases: ['岩崩'],
        },
        {
          name: 'Stealth Rock',
          label: '隐形岩',
          power: 0,
          type: 'Rock',
          category: 'Status',
          aliases: ['隐形岩'],
        },
      ],
    },
    Gardenia: {
      specialty: 'Grass',
      core_moves: [
        {
          name: 'Leaf Storm',
          label: '飞叶风暴',
          power: 130,
          type: 'Grass',
          category: 'Special',
          note: 'SpA_Drop_2',
          aliases: ['飞叶风暴'],
        },
        {
          name: 'Sludge Bomb',
          label: '污泥炸弹',
          power: 90,
          type: 'Poison',
          category: 'Special',
          note: 'Technician_Check',
          aliases: ['污泥炸弹'],
        },
        {
          name: 'Giga Drain',
          label: '亿万吸取',
          power: 75,
          type: 'Grass',
          category: 'Special',
          note: 'Heal_50%',
          aliases: ['亿万吸取'],
        },
      ],
    },
    Maylene: {
      specialty: 'Fighting',
      core_moves: [
        {
          name: 'Close Combat',
          label: '近身战',
          power: 120,
          type: 'Fighting',
          category: 'Physical',
          note: 'Def_SpD_Drop',
          aliases: ['近身战'],
        },
        {
          name: 'Aura Sphere',
          label: '波导弹',
          power: 80,
          type: 'Fighting',
          category: 'Special',
          note: 'Never_Miss',
          aliases: ['波导弹'],
        },
        {
          name: 'Drain Punch',
          label: '吸取拳',
          power: 75,
          type: 'Fighting',
          category: 'Physical',
          note: 'Heal_50%',
          aliases: ['吸取拳'],
        },
      ],
    },
    Wake: {
      specialty: 'Water',
      core_moves: [
        {
          name: 'Waterfall',
          label: '攀瀑',
          power: 80,
          type: 'Water',
          category: 'Physical',
          note: 'Flinch_20%',
          aliases: ['攀瀑'],
        },
        {
          name: 'Ice Fang',
          label: '冰冻牙',
          power: 65,
          type: 'Ice',
          category: 'Physical',
          note: 'Freeze_10%',
          aliases: ['冰冻牙'],
        },
        {
          name: 'Dragon Dance',
          label: '龙之舞',
          power: 0,
          type: 'Dragon',
          category: 'Status',
          aliases: ['龙之舞'],
        },
      ],
    },
  },
};

const moveLookup = new Map<string, GymMoveIntel>();

Object.values(GYM_MOVE_INTEL.gym_leaders).forEach((leader) => {
  leader.core_moves.forEach((move) => {
    moveLookup.set(move.name.toLowerCase(), move);
    moveLookup.set((move.label || move.name).toLowerCase(), move);
    move.aliases?.forEach((alias) => moveLookup.set(alias.toLowerCase(), move));
  });
});

export function getGymMoveIntelByName(name: string): GymMoveIntel | null {
  return moveLookup.get(name.trim().toLowerCase()) || null;
}
