import { describe, it, expect, vi, beforeEach } from "vitest";
import { getRandomPokemon, getPokemonChoices, getTypeNameKo } from "./pokeapi";
import type { Pokemon } from "./pokemon";

const mockPokemonData = (id: number) => ({
  name: "pikachu",
  types: [{ type: { name: "electric" } }],
  sprites: {
    front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
    other: {
      "official-artwork": {
        front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      },
    },
  },
});

const mockSpeciesData = (id: number) => ({
  names: [
    { language: { name: "ko" }, name: "피카츄" },
    { language: { name: "en" }, name: "Pikachu" },
  ],
});

describe("getRandomPokemon", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return the requested number of pokemon", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      const id = parseInt(url.split("/").pop()!);
      if (url.includes("pokemon-species")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSpeciesData(id)),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonData(id)),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getRandomPokemon(5);

    expect(result).toHaveLength(5);
  });

  it("should return pokemon with all required fields", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes("pokemon-species")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSpeciesData(25)),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonData(25)),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getRandomPokemon(1);
    const pokemon = result[0];

    expect(pokemon).toHaveProperty("id");
    expect(pokemon).toHaveProperty("nameKo");
    expect(pokemon).toHaveProperty("nameEn");
    expect(pokemon).toHaveProperty("types");
    expect(pokemon).toHaveProperty("imageUrl");
    expect(pokemon.nameKo).toBe("피카츄");
    expect(pokemon.types).toContain("electric");
    expect(pokemon.imageUrl).toContain("official-artwork");
  });

  it("should return unique pokemon (no duplicates)", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      const id = parseInt(url.split("/").pop()!);
      if (url.includes("pokemon-species")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSpeciesData(id)),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemonData(id)),
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await getRandomPokemon(5);
    const ids = result.map((p) => p.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(5);
  });

  it("should throw on fetch failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 })
    );

    await expect(getRandomPokemon(1)).rejects.toThrow();
  });
});

describe("getPokemonChoices", () => {
  const pool: Pokemon[] = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    nameKo: `포켓몬${i + 1}`,
    nameEn: `Pokemon${i + 1}`,
    types: ["normal"],
    imageUrl: `https://example.com/${i + 1}.png`,
  }));

  it("should return the correct total number of choices", () => {
    const correct = pool[0];
    const choices = getPokemonChoices(correct, 4, pool);

    expect(choices).toHaveLength(4);
  });

  it("should include the correct pokemon in choices", () => {
    const correct = pool[0];
    const choices = getPokemonChoices(correct, 4, pool);

    expect(choices.some((c) => c.id === correct.id)).toBe(true);
  });

  it("should not include duplicate pokemon", () => {
    const correct = pool[0];
    const choices = getPokemonChoices(correct, 4, pool);
    const ids = choices.map((c) => c.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(4);
  });
});

describe("getTypeNameKo", () => {
  it("should return Korean type name for known types", () => {
    expect(getTypeNameKo("electric")).toBe("전기");
    expect(getTypeNameKo("fire")).toBe("불꽃");
    expect(getTypeNameKo("water")).toBe("물");
  });

  it("should return the English name as fallback for unknown types", () => {
    expect(getTypeNameKo("unknown")).toBe("unknown");
  });
});
