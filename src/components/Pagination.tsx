"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface PaginationProps {
  totalPages: number;
  paramKey?: string;
}

export default function Pagination({ totalPages, paramKey = "page" }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get(paramKey)) || 1;

  // Cette fonction génère l'URL complète en gardant les autres filtres (q, filter, etc.)
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set(paramKey, pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // On ne l'affiche pas s'il n'y a qu'une seule page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-5 py-10">
      {/* Bouton Précédent */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={`p-4 rounded-2xl border transition-all duration-300 ${
          currentPage <= 1 
            ? "opacity-10 pointer-events-none border-slate-100" 
            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-xl hover:shadow-slate-200"
        }`}
      >
        <ChevronLeftIcon className="h-5 w-5 stroke-[2.5]" />
      </Link>

      {/* Indicateur de page au style Premium */}
      <div className="bg-white px-8 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
        <span className="text-xs font-black text-slate-900 leading-none">
          {currentPage}
        </span>
        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] leading-none">
          sur
        </span>
        <span className="text-xs font-black text-slate-400 leading-none">
          {totalPages}
        </span>
      </div>

      {/* Bouton Suivant */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={`p-4 rounded-2xl border transition-all duration-300 ${
          currentPage >= totalPages 
            ? "opacity-10 pointer-events-none border-slate-100" 
            : "bg-white border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white shadow-sm hover:shadow-xl hover:shadow-slate-200"
        }`}
      >
        <ChevronRightIcon className="h-5 w-5 stroke-[2.5]" />
      </Link>
    </div>
  );
}