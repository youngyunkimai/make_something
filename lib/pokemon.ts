export interface Pokemon {
  id: number;
  nameKo: string;
  nameEn: string;
  types: string[];
  imageUrl: string;
}

export function formatPokemonName(pokemon: Pokemon): string {
  return `${pokemon.nameKo} (${pokemon.nameEn})`;
}

export function formatDexNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}
