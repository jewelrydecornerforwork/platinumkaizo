export const LEADER_ART_ASSETS: Record<string, string> = {
  roark: '/assets/leaders/roark.png',
  gardenia: '/assets/leaders/gardenia.png',
  maylene: '/assets/leaders/maylene.png',
  wake: '/assets/leaders/wake.png',
};

export const POKEMON_ART_ASSETS: Record<string, string> = {
  Turtwig: '/assets/pokemon/turtwig.png',
  Chimchar: '/assets/pokemon/chimchar.png',
  Piplup: '/assets/pokemon/piplup.png',
  Starly: '/assets/pokemon/starly.png',
  Shinx: '/assets/pokemon/shinx.png',
  Budew: '/assets/pokemon/budew.png',
  Cranidos: '/assets/pokemon/cranidos.png',
  Onix: '/assets/pokemon/onix.png',
  Geodude: '/assets/pokemon/geodude.png',
  Shieldon: '/assets/pokemon/shieldon.png',
  Nosepass: '/assets/pokemon/nosepass.png',
  Aron: '/assets/pokemon/aron.png',
  Roserade: '/assets/pokemon/roserade.png',
  Breloom: '/assets/pokemon/breloom.png',
  Tangela: '/assets/pokemon/tangela.png',
  Cherrim: '/assets/pokemon/cherrim.png',
  Grovyle: '/assets/pokemon/grovyle.png',
  Grotle: '/assets/pokemon/grotle.png',
  Lucario: '/assets/pokemon/lucario.png',
  Medicham: '/assets/pokemon/medicham.png',
  Machoke: '/assets/pokemon/machoke.png',
  Hariyama: '/assets/pokemon/hariyama.png',
  Toxicroak: '/assets/pokemon/toxicroak.png',
  Heracross: '/assets/pokemon/heracross.png',
  Gyarados: '/assets/pokemon/gyarados.png',
  Floatzel: '/assets/pokemon/floatzel.png',
  Quagsire: '/assets/pokemon/quagsire.png',
  Azumarill: '/assets/pokemon/azumarill.png',
  Pelipper: '/assets/pokemon/pelipper.png',
  Poliwrath: '/assets/pokemon/poliwrath.png',
  Garchomp: '/assets/pokemon/garchomp.png',
};

function toSpriteId(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/♀/g, 'f')
    .replace(/♂/g, 'm')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

export function getPokemonArtAsset(name: string): string {
  return POKEMON_ART_ASSETS[name] || `https://play.pokemonshowdown.com/sprites/gen5/${toSpriteId(name)}.png`;
}
