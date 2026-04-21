"use client"; // Obligatoire pour utiliser onClick et confirm

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteTaxRequest } from "../actions/taxActions";

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment annuler cette demande ?");
    
    if (confirmed) {
      try {
        await deleteTaxRequest(id);
      } catch (error) {
        alert("Une erreur est survenue lors de la suppression.");
        console.error(error);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
      title="Annuler la demande"
    >
      <TrashIcon className="h-5 w-5" />
    </button>
  );
}