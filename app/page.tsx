"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface Pokemon {
  dex_num: number;
  name: string;
  type_1: string;
  type_2: string | null;
  hp: number;
  atk: number;
  def: number;
  sp_atk: number;
  sp_def: number;
  spe: number;
  bst: number;
  ability_i: string | null;
  ability_ii: string | null;
  ability_iii: string | null;
  evolves_into: string | null;
  evolves_details: string | null;
  png_url: string | null;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PokedexPage() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      console.log("Fetching from Supabase...");
      const { data, error } = await supabase
        .from('pokedex_view')
        .select('*')
        .range(0, 1100)
        .returns<Pokemon[]>();

      if (error) {
        console.error("Supabase Error:", error.message);
      } else if (data) {
        console.log("Data received:", data.length, "pokemon found.");
        setPokemon(data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPokemon = pokemon.filter((mon) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const nameMatch = mon.name.toLowerCase().includes(query);
    const idMatch = String(mon.dex_num).includes(query);
    return nameMatch || idMatch;
  });

  return (
    <main className="min-h-screen bg-gray-100 text-slate-800 p-8">
      <header className="mb-12 border-b border-slate-800 pb-6">
        <h1 className="text-4xl font-black tracking-tight text-red-800">
          PROJECT: POKÉMON REDUX
        </h1>
        <p className="text-slate-600 mt-2">Relational Database Engine v1.0</p>
      </header>

      {/* Search Bar */}
      <div className="mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search by name or #id..."
          className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 focus:border-red-500 outline-none transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-8 justify-items-center">
        {filteredPokemon.map((mon) => (
          <div 
            key={`${mon.dex_num}-${mon.name}`}
            className="group relative bg-yellow-50 border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center gap-4 mb-6">
              <div>
                {mon.png_url ? (
                  <img 
                    src={mon.png_url} 
                    alt={mon.name}
                    className="h-32 w-32 object-contain drop-shadow-md group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="h-32 w-32 bg-slate-700 rounded flex items-center justify-center text-[10px] text-white">NO_IMG</div>
                )}
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-slate-800 block">#{String(mon.dex_num).padStart(4, '0')}</span>
              <h2 className="text-2xl font-bold mb-4 group-hover:text-slate-800 transition-colors">
                {mon.name}
              </h2>
              {/* LATCH POINT: Passing types to your TypeBadge component */}
              <div className="flex gap-2">
                    <TypeBadge type={mon.type_1} />
                    {mon.type_2 && <TypeBadge type={mon.type_2} />}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// Your exact TypeBadge component with your chosen color palette
function TypeBadge({ type }: { type: string }) {
  if (!type) return null;

  const typeColors: {[ key: string]:string } = {
    Normal: "bg-[#A8A77A] text-white",
    Grass: "bg-[#7AC74C] text-white",
    Fire: "bg-[#EE8130] text-white",
    Water: "bg-[#6390F0] text-white",
    Electric: "bg-[#F7D02C] text-white",
    Ice: "bg-[#96D9D6] text-white",
    Fighting: "bg-[#C22E28] text-white",
    Poison: "bg-[#A33EA1] text-white",
    Ground: "bg-[#E2BF65] text-white",
    Flying: "bg-[#A98FF3] text-white",
    Psychic: "bg-[#F95587] text-white",
    Bug: "bg-[#A6B91A] text-white",
    Rock: "bg-[#B6A136] text-white",
    Ghost: "bg-[#735797] text-white",
    Dragon: "bg-[#6F35FC] text-white",
    Dark: "bg-[#705746] text-white",
    Steel: "bg-[#B7B7CE] text-white",
    Fairy: "bg-[#D685AD] text-white",
  }

  const typeColor = typeColors[type] || "bg-white";

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${typeColor}`}>
      {type}
    </span>
  );

}

function AbilityRow({ label, ability }: { label: string, ability: string | null }) {
  if (!ability) return null;
  return (
    <div className="flex justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-300 font-medium">{ability}</span>
    </div>
  );
}