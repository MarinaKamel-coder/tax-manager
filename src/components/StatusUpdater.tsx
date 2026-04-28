"use client";

import { updateSubmissionStatus } from "../actions/taxActions";
import { useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function StatusUpdater({ id, currentStatus }: { id: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "En attente", value: "En attente" },
    { label: "Acceptée", value: "Acceptée" },
    { label: "En progression", value: "En cours" }, 
    { label: "Terminée", value: "Terminé" },
    { label: "Annulée", value: "Annulé" },
  ];

  const handleChange = async (newStatus: string) => {
    setLoading(true);
    try {
      const result = await updateSubmissionStatus(id, newStatus);
      if (result.success) {
        setStatus(newStatus);
      } else {
        alert("Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full group">
      <label className="text-[9px] font-black uppercase text-slate-400 ml-1 mb-1 block tracking-widest">
        État du dossier
      </label>
      
      <div className="relative">
        <select 
          value={status}
          disabled={loading}
          aria-label="Changer le statut"
          onChange={(e) => handleChange(e.target.value)}
          className={`
            w-full appearance-none cursor-pointer
            bg-slate-50 border-2 border-transparent
            text-[10px] font-black uppercase tracking-widest
            p-4 rounded-2xl outline-none
            transition-all duration-300
            ${loading ? 'opacity-50 grayscale' : 'hover:bg-white hover:border-slate-100 hover:shadow-sm'}
            focus:ring-2 focus:ring-indigo-500 focus:bg-white
            text-slate-900
          `}
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value} className="font-sans font-semibold">
              {s.label}
            </option>
          ))}
        </select>

        {/* Indicateur visuel (flèche ou spinner) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          {loading ? (
            <ArrowPathIcon className="h-4 w-4 animate-spin text-indigo-600" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}