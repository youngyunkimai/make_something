import type { Pokemon } from "./pokemon";

const POKEAPI_BASE = "https://pokeapi.co/api/v2";

export const GENERATIONS = {
  1: { label: "1세대", min: 1, max: 151, count: 151 },
  2: { label: "2세대", min: 152, max: 251, count: 100 },
  3: { label: "3세대", min: 252, max: 386, count: 135 },
  4: { label: "4세대", min: 387, max: 493, count: 107 },
  5: { label: "5세대", min: 494, max: 649, count: 156 },
} as const;

export type GenerationKey = keyof typeof GENERATIONS;

function getRandomIds(count: number, min: number, max: number): number[] {
  const ids = new Set<number>();
  while (ids.size < count) {
    ids.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return Array.from(ids);
}

const TYPE_NAME_KO: Record<string, string> = {
  normal: "노말",
  fire: "불꽃",
  water: "물",
  electric: "전기",
  grass: "풀",
  ice: "얼음",
  fighting: "격투",
  poison: "독",
  ground: "땅",
  flying: "비행",
  psychic: "에스퍼",
  bug: "벌레",
  rock: "바위",
  ghost: "고스트",
  dragon: "드래곤",
  dark: "악",
  steel: "강철",
  fairy: "페어리",
};

export function getTypeNameKo(typeEn: string): string {
  return TYPE_NAME_KO[typeEn] ?? typeEn;
}

async function fetchPokemonById(id: number): Promise<Pokemon> {
  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(`${POKEAPI_BASE}/pokemon/${id}`),
    fetch(`${POKEAPI_BASE}/pokemon-species/${id}`),
  ]);

  if (!pokemonRes.ok || !speciesRes.ok) {
    throw new Error(`Failed to fetch pokemon ${id}`);
  }

  const pokemonData = await pokemonRes.json();
  const speciesData = await speciesRes.json();

  const nameKo =
    speciesData.names.find(
      (n: { language: { name: string }; name: string }) =>
        n.language.name === "ko"
    )?.name ?? pokemonData.name;

  const nameEn =
    pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

  const types = pokemonData.types.map(
    (t: { type: { name: string } }) => t.type.name
  );

  const imageUrl =
    pokemonData.sprites.other?.["official-artwork"]?.front_default ??
    pokemonData.sprites.front_default;

  return { id, nameKo, nameEn, types, imageUrl };
}

export async function getRandomPokemon(count: number, generation: GenerationKey = 1): Promise<Pokemon[]> {
  const { min, max } = GENERATIONS[generation];
  const ids = getRandomIds(count, min, max);
  return Promise.all(ids.map(fetchPokemonById));
}

export function getPokemonChoices(
  correct: Pokemon,
  totalCount: number,
  pool: Pokemon[]
): Pokemon[] {
  const others = pool
    .filter((p) => p.id !== correct.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, totalCount - 1);

  const choices = [correct, ...others];
  return choices.sort(() => Math.random() - 0.5);
}
