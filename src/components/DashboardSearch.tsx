"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export default function DashboardSearch() {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset à la page 1 lors d'une recherche
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    startTransition(() => {
      replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="relative group">
      <MagnifyingGlassIcon className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors ${isPending ? "text-indigo-500 animate-pulse" : "text-slate-400 group-focus-within:text-slate-900"}`} />
      <input
        type="text"
        placeholder="Rechercher un nom..."
        defaultValue={searchParams.get("q")?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 py-4 pl-12 pr-4 rounded-2xl text-xs font-bold focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 outline-none transition-all"
      />
    </div>
  );
}