import type { Pokemon } from "./pokemon";

export const MOCK_PIKACHU: Pokemon = {
  id: 25,
  nameKo: "피카츄",
  nameEn: "Pikachu",
  types: ["electric"],
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
};

export const MOCK_CHARMANDER: Pokemon = {
  id: 4,
  nameKo: "파이리",
  nameEn: "Charmander",
  types: ["fire"],
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
};

export const MOCK_SQUIRTLE: Pokemon = {
  id: 7,
  nameKo: "꼬부기",
  nameEn: "Squirtle",
  types: ["water"],
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
};

export const MOCK_BULBASAUR: Pokemon = {
  id: 1,
  nameKo: "이상해씨",
  nameEn: "Bulbasaur",
  types: ["grass", "poison"],
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
};

export const MOCK_JIGGLYPUFF: Pokemon = {
  id: 39,
  nameKo: "푸린",
  nameEn: "Jigglypuff",
  types: ["normal", "fairy"],
  imageUrl: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
};

export const MOCK_QUIZ_POKEMON: Pokemon[] = [
  MOCK_PIKACHU,
  MOCK_CHARMANDER,
  MOCK_SQUIRTLE,
  MOCK_BULBASAUR,
  MOCK_JIGGLYPUFF,
];

export const MOCK_CHOICE_POOL: Pokemon[] = [
  ...MOCK_QUIZ_POKEMON,
  { id: 6, nameKo: "리자몽", nameEn: "Charizard", types: ["fire", "flying"], imageUrl: "https://example.com/6.png" },
  { id: 9, nameKo: "거북왕", nameEn: "Blastoise", types: ["water"], imageUrl: "https://example.com/9.png" },
  { id: 26, nameKo: "라이츄", nameEn: "Raichu", types: ["electric"], imageUrl: "https://example.com/26.png" },
  { id: 94, nameKo: "팬텀", nameEn: "Gengar", types: ["ghost", "poison"], imageUrl: "https://example.com/94.png" },
  { id: 143, nameKo: "잠만보", nameEn: "Snorlax", types: ["normal"], imageUrl: "https://example.com/143.png" },
];
