"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StatusFilterItem({ label, isActive }: { label: string; isActive: boolean }) {
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("status", label);
    replace(`?${params.toString()}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
        isActive 
          ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200" 
          : "bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600"
      }`}
    >
      {label}
    </button>
  );
}